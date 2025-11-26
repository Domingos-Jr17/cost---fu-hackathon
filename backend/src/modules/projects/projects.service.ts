import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CostApiConfig } from '../../config/cost-api.config';
import { DataTransformUtil, CostProject, SimplifiedProject } from '../../common/utils/data-transform.util';
import { getMockProjects, getMockProjectById } from '../../common/utils/mock-data';
import { GetProjectsDto } from './dto/get-projects.dto';
import { ProjectDto, ProjectsResponseDto, HealthResponseDto } from './dto/project.dto';

/**
 * Projects Service - Handles project data transformation and caching
 */
@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  private readonly costApiConfig: CostApiConfig;
  private projectCache = new Map<string, { data: SimplifiedProject[]; timestamp: number }>();
  private readonly CACHE_TTL = 3600000; // 1 hour

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.costApiConfig = new CostApiConfig(this.configService);
  }

  /**
   * Get all projects with optional filters
   */
  async getProjects(filters: GetProjectsDto): Promise<ProjectsResponseDto> {
    try {
      // Try to get from cache first
      let projects = await this.getCachedProjects();
      let fromCache = true;
      let dataSource = 'Cache Local';

      // If cache is empty or expired, fetch fresh data
      if (!projects || projects.length === 0) {
        projects = await this.fetchProjectsFromAPI();
        fromCache = false;
        dataSource = 'API CoST Moçambique';

        // Update cache
        this.updateCache(projects);
      }

      // Apply filters
      let filteredProjects = this.applyFilters(projects, filters);

      // Update report counts (would query from reports database)
      filteredProjects = await this.updateReportCounts(filteredProjects);

      // Apply pagination
      const startIndex = (filters.page - 1) * filters.limit;
      const endIndex = startIndex + filters.limit;
      const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

      // Sort results
      const sortedProjects = this.sortProjects(paginatedProjects, filters.sortBy, filters.sortOrder);

      return {
        projetos: sortedProjects,
        total: filteredProjects.length,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(filteredProjects.length / filters.limit),
        fromCache,
        dataSource,
      };
    } catch (error) {
      this.logger.error('Error getting projects:', error);

      // Fallback to mock data on any error
      const mockProjects = await this.getMockProjectsWithReportCounts(filters);

      this.logger.warn('Using mock data due to API error');

      return {
        projetos: mockProjects.projetos,
        total: mockProjects.total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(mockProjects.total / filters.limit),
        fromCache: false,
        dataSource: 'Dados Mock (Fallback)',
      };
    }
  }

  /**
   * Get single project by ID
   */
  async getProjectById(id: string): Promise<ProjectDto> {
    try {
      // Try cache first
      const cachedProjects = await this.getCachedProjects();
      let project = cachedProjects?.find(p => p.id === id);

      if (!project) {
        // Try to fetch from API
        project = await this.fetchProjectByIdFromAPI(id);

        if (!project) {
          // Try mock data
          const mockProject = getMockProjectById(id);
          if (mockProject) {
            project = DataTransformUtil.transformProject(mockProject);
            project = await this.updateSingleProjectReportCount(project);
          }
        }

        if (!project) {
          throw new HttpException('Projeto não encontrado', HttpStatus.NOT_FOUND);
        }
      } else {
        // Update report count for cached project
        project = await this.updateSingleProjectReportCount(project);
      }

      return project;
    } catch (error) {
      this.logger.error(`Error getting project ${id}:`, error);

      // Final fallback to mock data
      const mockProject = getMockProjectById(id);
      if (mockProject) {
        return DataTransformUtil.transformProject(mockProject);
      }

      throw new HttpException('Projeto não encontrado', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Health check for the projects service
   */
  async healthCheck(): Promise<HealthResponseDto> {
    try {
      const cachedProjects = this.getCachedProjectsSync();
      let costApiStatus = 'disconnected';

      // Test CoST API connection
      try {
        await firstValueFrom(
          this.httpService.get(this.costApiConfig.endpoints.getProjects, {
            timeout: 5000,
          })
        );
        costApiStatus = 'connected';
      } catch (error) {
        costApiStatus = 'error';
      }

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        costApiStatus,
        cachedProjects: cachedProjects?.length || 0,
        cacheLastUpdated: this.getCacheLastUpdated(),
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);

      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        costApiStatus: 'error',
        cachedProjects: 0,
        cacheLastUpdated: null,
      };
    }
  }

  /**
   * Fetch projects from CoST API
   */
  private async fetchProjectsFromAPI(): Promise<SimplifiedProject[]> {
    try {
      this.logger.log('Fetching projects from CoST API...');

      const response = await firstValueFrom(
        this.httpService.get(this.costApiConfig.endpoints.getProjects, {
          timeout: this.costApiConfig.timeout,
        })
      );

      const costProjects: CostProject[] = response.data || [];

      // Transform and validate projects
      const validProjects = costProjects
        .filter(project => DataTransformUtil.validateProject(project))
        .map(project => DataTransformUtil.transformProject(project));

      this.logger.log(`Successfully fetched and transformed ${validProjects.length} projects`);

      return validProjects;
    } catch (error) {
      this.logger.error('Failed to fetch from CoST API:', error.message);
      throw error;
    }
  }

  /**
   * Fetch single project by ID from CoST API
   */
  private async fetchProjectByIdFromAPI(id: string): Promise<SimplifiedProject | null> {
    try {
      this.logger.log(`Fetching project ${id} from CoST API...`);

      const response = await firstValueFrom(
        this.httpService.get(`${this.costApiConfig.endpoints.getProjectDetails}?id=${id}`, {
          timeout: this.costApiConfig.timeout,
        })
      );

      const costProject: CostProject = response.data;

      if (!DataTransformUtil.validateProject(costProject)) {
        return null;
      }

      return DataTransformUtil.transformProject(costProject);
    } catch (error) {
      this.logger.error(`Failed to fetch project ${id} from CoST API:`, error.message);
      return null;
    }
  }

  /**
   * Get projects from cache if still valid
   */
  private async getCachedProjects(): Promise<SimplifiedProject[] | null> {
    const cacheEntry = this.projectCache.get('all_projects');

    if (!cacheEntry) {
      return null;
    }

    const now = Date.now();
    const age = now - cacheEntry.timestamp;

    if (age > this.CACHE_TTL) {
      this.projectCache.delete('all_projects');
      return null;
    }

    return cacheEntry.data;
  }

  /**
   * Synchronous version for health check
   */
  private getCachedProjectsSync(): SimplifiedProject[] | null {
    const cacheEntry = this.projectCache.get('all_projects');

    if (!cacheEntry) {
      return null;
    }

    const now = Date.now();
    const age = now - cacheEntry.timestamp;

    if (age > this.CACHE_TTL) {
      this.projectCache.delete('all_projects');
      return null;
    }

    return cacheEntry.data;
  }

  /**
   * Update cache with fresh data
   */
  private updateCache(projects: SimplifiedProject[]): void {
    this.projectCache.set('all_projects', {
      data: projects,
      timestamp: Date.now(),
    });

    this.logger.log(`Cache updated with ${projects.length} projects`);
  }

  /**
   * Get cache last updated timestamp
   */
  private getCacheLastUpdated(): string | null {
    const cacheEntry = this.projectCache.get('all_projects');

    if (!cacheEntry) {
      return null;
    }

    return new Date(cacheEntry.timestamp).toISOString();
  }

  /**
   * Apply filters to projects array
   */
  private applyFilters(projects: SimplifiedProject[], filters: GetProjectsDto): SimplifiedProject[] {
    let filtered = [...projects];

    // Province filter
    if (filters.provincia) {
      filtered = filtered.filter(project =>
        project.provincia.toLowerCase().includes(filters.provincia.toLowerCase())
      );
    }

    // Sector filter
    if (filters.setor) {
      filtered = filtered.filter(project =>
        project.setor.toLowerCase().includes(filters.setor.toLowerCase())
      );
    }

    // Status filter
    if (filters.estado) {
      filtered = filtered.filter(project =>
        project.estado.toLowerCase().includes(filters.estado.toLowerCase())
      );
    }

    return filtered;
  }

  /**
   * Sort projects array
   */
  private sortProjects(projects: SimplifiedProject[], sortBy: string, sortOrder: 'asc' | 'desc'): SimplifiedProject[] {
    return projects.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'nome':
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case 'valor':
          // Extract numeric value from formatted string
          aValue = this.extractNumericValue(a.valor);
          bValue = this.extractNumericValue(b.valor);
          break;
        case 'progresso':
          aValue = a.progresso;
          bValue = b.progresso;
          break;
        case 'created_at':
        default:
          // Since we don't have created_at in simplified project, use contract date
          aValue = new Date(a.dataContrato).getTime() || 0;
          bValue = new Date(b.dataContrato).getTime() || 0;
          break;
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });
  }

  /**
   * Extract numeric value from formatted currency string
   */
  private extractNumericValue(formattedValue: string): number {
    const match = formattedValue.match(/[\d.]+/);
    if (!match) return 0;

    const number = parseFloat(match[0]);

    // Handle multipliers
    if (formattedValue.includes('K')) return number * 1000;
    if (formattedValue.includes('M')) return number * 1000000;
    if (formattedValue.includes('B')) return number * 1000000000;

    return number;
  }

  /**
   * Update report counts for projects (mock implementation)
   * In real implementation, this would query the reports database
   */
  private async updateReportCounts(projects: SimplifiedProject[]): Promise<SimplifiedProject[]> {
    // Mock: randomly assign report counts
    return projects.map(project => ({
      ...project,
      relatos: Math.floor(Math.random() * 10),
    }));
  }

  /**
   * Update report count for single project
   */
  private async updateSingleProjectReportCount(project: SimplifiedProject): Promise<SimplifiedProject> {
    // Mock: randomly assign report count
    return {
      ...project,
      relatos: Math.floor(Math.random() * 10),
    };
  }

  /**
   * Get mock projects with report counts (for fallback scenarios)
   */
  private async getMockProjectsWithReportCounts(filters: GetProjectsDto): Promise<ProjectsResponseDto> {
    const mockProjects = getMockProjects(filters);
    const transformedProjects = mockProjects.map(project => DataTransformUtil.transformProject(project));
    const projectsWithReports = await this.updateReportCounts(transformedProjects);

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const endIndex = startIndex + filters.limit;
    const paginatedProjects = projectsWithReports.slice(startIndex, endIndex);

    // Sort results
    const sortedProjects = this.sortProjects(paginatedProjects, filters.sortBy, filters.sortOrder);

    return {
      projetos: sortedProjects,
      total: projectsWithReports.length,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(projectsWithReports.length / filters.limit),
      fromCache: false,
      dataSource: 'Dados Mock (Fallback)',
    };
  }
}