import { Injectable, Logger, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProjectsService } from '../projects/projects.service';
import { HashUtil } from '../../common/utils/hash.util';
import { UssdRequestDto, UssdResponseDto } from './dto';

export interface UssdSessionData {
  step: string;
  data: {
    [key: string]: any;
    selectedProvince?: string;
    selectedSector?: string;
    filteredProjects?: any[];
    currentPage?: number;
    projectDetails?: any;
    reportData?: {
      type?: string;
      description?: string;
      projectId?: string;
    };
  };
}

/**
 * USSD Service - Handles USSD interactions for basic phone users
 */
@Injectable()
export class UssdService {
  private readonly logger = new Logger(UssdService.name);
  private readonly sessions = new Map<string, UssdSessionData>();

  // In-memory session store (in production, this would be Redis/Database)
  private readonly sessionStore = new Map<string, {
    sessionId: string;
    data: UssdSessionData;
    timestamp: number;
    expiresAt: number;
  }>();

  constructor(
    private readonly configService: ConfigService,
    private readonly projectsService: ProjectsService,
  ) {
    this.logger.log('USSD Service initialized');
  }

  /**
   * Clean up expired sessions
   */
  private async cleanupExpiredSessions(): Promise<void> {
    const now = Date.now();

    for (const [sessionId, sessionData] of this.sessionStore.entries()) {
      if (sessionData.expiresAt < now) {
        this.sessionStore.delete(sessionId);
        this.logger.log(`Cleaned up expired session: ${sessionId}`);
      }
    }
  }

  /**
   * Create or get USSD session
   */
  private async createOrGetSession(phoneHash: string, sessionId?: string): Promise<{
    sessionId: string;
    data: UssdSessionData;
  }> {
    // Clean up expired sessions first
    await this.cleanupExpiredSessions();

    // Check if session exists and is still valid
    const existingSession = this.sessionStore.get(phoneHash);

    if (existingSession && existingSession.expiresAt > Date.now()) {
      // Session expired, create new one
      this.sessionStore.delete(phoneHash);
    } else if (existingSession) {
      // Session valid, return it
      return {
        sessionId: existingSession.sessionId,
        data: existingSession.data,
      };
    }

    // Create new session
    const newSessionId = sessionId || this.generateSessionId();

    const sessionData: UssdSessionData = {
      step: 'main',
      data: {},
    };

    this.sessionStore.set(phoneHash, {
      sessionId: newSessionId,
      data: sessionData,
      timestamp: Date.now(),
      expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes
    });

    this.logger.log(`Created USSD session ${newSessionId} for phone hash ${phoneHash}`);

    return {
      sessionId: newSessionId,
      data: sessionData,
    };
  }

  /**
   * Update session data
   */
  private updateSessionData(phoneHash: string, data: Partial<UssdSessionData>): void {
    const session = this.sessionStore.get(phoneHash);

    if (session) {
      session.data = { ...session.data, ...data };
      session.timestamp = Date.now();
      this.logger.log(`Updated USSD session ${session.sessionId}`);
    }
  }

  /**
   * Generate session ID
   */
  generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Format project data for USSD display
   */
  private formatProjectForUssd(project: any): string {
    if (!project) return 'Projeto não encontrado';

    // Format for USSD display (160 char limit)
    const name = this.truncateText(project.nome, 40);
    const status = this.formatStatusForUssd(project.estado);
    const progress = this.formatProgressForUssd(project.progresso);

    return `${name}\n${status} (${progress}%)\n[1] Ver detalhes`;
  }

  /**
   * Format status for USSD
   */
  private formatStatusForUssd(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Em Andamento': 'Em curso',
      'Concluído': 'Concluido',
      'Com Atraso': 'Com atraso',
      'Pendente': 'Pendente',
      'Em Licitação': 'Em licitacão',
      'Contratado': 'Contratado',
      'Em Implementação': 'Em impl.',
    };

    return statusMap[status] || status;
  }

  /**
   * Format progress for USSD
   */
  private formatProgressForUssd(progress: number): string {
    return `${progress}%`;
  }

  /**
   * Truncate text for USSD
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Get USSD code from environment
   */
  getUssdCode(): string {
    return this.configService.get('USSD_CODE', '*555#');
  }

  /**
   * Format menu options with numbers
   */
  private formatMenuOptions(options: string[]): string {
    return options.map((option: string, index: number) => {
      const number = index + 1;
      const prefix = number < 10 ? '0' + (number - 9) : number.toString();
      return `${prefix}. ${option}`;
    }).join('\n');
  }

  /**
   * Main menu handler
   */
  async handleMainMenu(sessionId: string, phoneHash: string): Promise<UssdResponseDto> {
    const sessionEntry = this.sessionStore.get(phoneHash);
    if (!sessionEntry) {
      throw new BadRequestException('Sessão USSD não encontrada');
    }
    const sessionData = sessionEntry.data;

    try {
      // Get projects for user's region (mock data)
      const projectsResponse = await this.projectsService.getProjects({
        limit: 10 // Limit for USSD display
      });

      const options = ['Selecionar Província', 'Selecionar Setor', 'Sair'];
      const menuText = this.formatMenuOptions(options);

      // Save session data
      this.updateSessionData(phoneHash, {
        step: 'main',
        data: {
          ...sessionData.data,
          filteredProjects: projectsResponse.projetos, // Extract the actual projects array
        currentPage: 1,
        totalPages: Math.ceil(projectsResponse.projetos.length / 10),
        options,
        phoneHash,
        ussdCode: this.getUssdCode(),
        },
      });

      return {
        text: `${this.getUssdCode()}\n${menuText}`,
        continue: true,
        sessionId,
      };
    } catch (error) {
      this.logger.error('Error in USSD main menu:', error);
      throw new BadRequestException('Erro no menu USSD');
    }
  }

  /**
   * Province selection handler
   */
  async handleProvinceSelection(sessionId: string, phoneHash: string, optionIndex: number): Promise<UssdResponseDto> {
    const sessionEntry = this.sessionStore.get(phoneHash);
    if (!sessionEntry) {
      throw new BadRequestException('Sessão USSD não encontrada');
    }
    const sessionData = sessionEntry.data;

    try {
      // Extract provinces from projects
      const projects = sessionData.data.filteredProjects || [];
      const provinces = [...new Set(projects.map((p: any) => p.provincia))];

      const options = provinces.map((province: string, index: number) => {
        const number = index + 1;
        const prefix = number < 10 ? '0' + (number - 9) : number.toString();
        return `${prefix}. ${province}`;
      });

      const menuText = this.formatMenuOptions(options);

      // Update session data
      this.updateSessionData(phoneHash, {
        step: 'province',
        data: {
          ...sessionData.data,
          selectedProvince: optionIndex < provinces.length ? provinces[optionIndex] : null,
          currentPage: 1,
          phoneHash,
          ussdCode: this.getUssdCode(),
        },
      });

      return {
        text: `${this.getUssdCode()}\n${menuText}`,
        continue: true,
        sessionId,
      };
    } catch (error) {
      this.logger.error('Error in USSD province selection:', error);
      throw new BadRequestException('Erro na seleção de província');
    }
  }

  /**
   * Sector selection handler
   */
  async handleSectorSelection(sessionId: string, phoneHash: string, optionIndex: number): Promise<UssdResponseDto> {
    const sessionEntry = this.sessionStore.get(phoneHash);
    if (!sessionEntry) {
      throw new BadRequestException('Sessão USSD não encontrada');
    }
    const sessionData = sessionEntry.data;

    try {
      const projects = sessionData.data.filteredProjects || [];
      const selectedProvince = sessionData.data.selectedProvince;

      if (!selectedProvince) {
        throw new BadRequestException('Província não selecionada');
      }

      // Filter projects by selected province
      const provinceProjects = projects.filter((p: any) => p.provincia === selectedProvince);
      const sectors = [...new Set(provinceProjects.map((p: any) => p.setor))];

      const options = sectors.map((sector: string, index: number) => {
        const number = index + 1;
        const prefix = number < 10 ? '0' + (number - 9) : number.toString();
        return `${prefix}. ${sector}`;
      });

      const menuText = this.formatMenuOptions(options);

      // Update session data
      this.updateSessionData(phoneHash, {
        step: 'sector',
        data: {
          ...sessionData.data,
          selectedProvince,
          filteredProjects: provinceProjects,
          currentPage: 1,
          sectors,
          phoneHash,
          ussdCode: this.getUssdCode(),
        },
      });

      return {
        text: `${this.getUssdCode()}\n${menuText}`,
        continue: true,
        sessionId,
      };
    } catch (error) {
      this.logger.error('Error in USSD sector selection:', error);
      throw new BadRequestException('Erro na seleção de setor');
    }
  }

  /**
   * Project listing handler
   */
  async handleProjectListing(sessionId: string, phoneHash: string, optionIndex: number): Promise<UssdResponseDto> {
    const sessionEntry = this.sessionStore.get(phoneHash);
    if (!sessionEntry) {
      throw new BadRequestException('Sessão USSD não encontrada');
    }
    const sessionData = sessionEntry.data;

    try {
      const projects = sessionData.data.filteredProjects || [];
      const selectedSector = sessionData.data.selectedSector;

      if (!selectedSector) {
        throw new BadRequestException('Setor não selecionado');
      }

      // Filter projects by selected sector and province
      const sectorProjects = projects.filter((p: any) =>
        p.setor === selectedSector && p.provincia === sessionData.data.selectedProvince
      );

      // Paginate results (10 per page)
      const startIndex = ((sessionData.data.currentPage || 1) - 1) * 10;
      const endIndex = startIndex + 10;
      const paginatedProjects = sectorProjects.slice(startIndex, endIndex);

      const options = paginatedProjects.map((project: any, index: number) => {
        const number = index + 1;
        const prefix = number < 10 ? '0' + (number - 9) : number.toString();
        const projectName = this.truncateText(project.nome, 30);
        return `${prefix}. ${projectName}`;
      });

      // Add back option if not first page
      if ((sessionData.data.currentPage || 1) > 1) {
        options.unshift('0. Voltar');
      }

      const menuText = this.formatMenuOptions(options);

      // Update session data
      this.updateSessionData(phoneHash, {
        step: 'projects',
        data: {
          ...sessionData.data,
          selectedSector,
          paginatedProjects,
          currentPage: sessionData.data.currentPage || 1,
          totalPages: Math.ceil(sectorProjects.length / 10),
          phoneHash,
          ussdCode: this.getUssdCode(),
        },
      });

      return {
        text: `${this.getUssdCode()}\n${menuText}`,
        continue: true,
        sessionId,
      };
    } catch (error) {
      this.logger.error('Error in USSD project listing:', error);
      throw new BadRequestException('Erro na lista de projetos');
    }
  }

  /**
   * Project details handler
   */
  async handleProjectDetails(sessionId: string, phoneHash: string, optionIndex: number): Promise<UssdResponseDto> {
    const sessionEntry = this.sessionStore.get(phoneHash);
    if (!sessionEntry) {
      throw new BadRequestException('Sessão USSD não encontrada');
    }
    const sessionData = sessionEntry.data;

    try {
      const projects = sessionData.data.filteredProjects || [];
      const selectedProvince = sessionData.data.selectedProvince;
      const selectedSector = sessionData.data.selectedSector;

      if (!selectedProvince || !selectedSector) {
        throw new BadRequestException('Província ou setor não selecionado');
      }

      // Filter projects
      const filteredProjects = projects.filter((p: any) =>
        p.provincia === selectedProvince && p.setor === selectedSector
      );

      const projectIndex = optionIndex - 1; // Convert back to 0-based index

      if (projectIndex < 0 || projectIndex >= filteredProjects.length) {
        throw new BadRequestException('Projeto não encontrado');
      }

      const project = filteredProjects[projectIndex];

      // Format project details for USSD
      const details = [
        `${project.nome}`,
        `Status: ${this.formatStatusForUssd(project.estado)}`,
        `Progresso: ${project.progresso}%`,
        `Valor: ${project.valor}`,
        `Contratante: ${project.contratante}`,
        `${this.getUssdCode()} ${this.getUssdCode()}`,
        '',
      ];

      const menuText = details.join('\n');

      // Update session data
      this.updateSessionData(phoneHash, {
        step: 'details',
        data: {
          ...sessionData.data,
          selectedProvince,
          selectedSector,
          projectDetails: project,
          phoneHash,
          ussdCode: this.getUssdCode(),
        },
      });

      return {
        text: `${this.getUssdCode()}\n${menuText}`,
        continue: true,
        sessionId,
      };
    } catch (error) {
      this.logger.error('Error in USSD project details:', error);
      throw new BadRequestException('Erro nos detalhes do projeto');
    }
  }

  /**
   * Report creation handler
   */
  async handleReportCreation(sessionId: string, phoneHash: string, reportData: any): Promise<UssdResponseDto> {
    const sessionEntry = this.sessionStore.get(phoneHash);
    if (!sessionEntry) {
      throw new BadRequestException('Sessão USSD não encontrada');
    }
    const sessionData = sessionEntry.data;

    try {
      // In a real implementation, this would create a report in the database
      // For now, just confirm and show success message
      const projectId = reportData.projectId || sessionData.data.projectDetails?.id;

      const confirmationText = `Relato registrado com sucesso! ID: ${projectId?.substring(0, 8)}...`;

      // Update session data
      this.updateSessionData(phoneHash, {
        step: 'confirmation',
        data: {
          ...sessionData.data,
          reportData: {
            type: reportData.type,
            description: reportData.description,
            projectId,
          },
          phoneHash,
          ussdCode: this.getUssdCode(),
        },
      });

      return {
        text: `${this.getUssdCode()}\n${confirmationText}\n[1] Menu principal`,
        continue: true,
        sessionId,
      };
    } catch (error) {
      this.logger.error('Error in USSD report creation:', error);
      throw new BadRequestException('Erro ao criar relato');
    }
  }

  /**
   * Process USSD request
   */
  async processUssdRequest(request: UssdRequestDto, ipHash: string): Promise<UssdResponseDto> {
    const { sessionId, phoneNumber, text } = request;

    try {
      // Hash phone number for privacy
      const phoneHash = HashUtil.hashPhone(phoneNumber || '');

      // Create or get session
      const sessionData = await this.createOrGetSession(phoneHash, sessionId);

      // Parse USSD text
      const cleanText = (text || '').trim();

      // Main menu
      if (cleanText === '' || cleanText.toLowerCase().includes('1')) {
        return this.handleMainMenu(sessionData.sessionId, phoneHash);
      }

      // Province selection (handle "2", "3", etc.)
      const provinceMatch = cleanText.toLowerCase().match(/^\d+\s*(.*)/);
      if (provinceMatch) {
        const optionIndex = parseInt(provinceMatch[1]) - 1;
        return this.handleProvinceSelection(sessionData.sessionId, phoneHash, optionIndex);
      }

      // Sector selection (handle keywords)
      const sectorKeywords = ['estrada', 'escola', 'hospital', 'agua', 'energia', 'saneamento'];
      const sectorIndex = sectorKeywords.findIndex(keyword =>
        cleanText.toLowerCase().includes(keyword)
      );

      if (sectorIndex >= 0) {
        return this.handleSectorSelection(sessionData.sessionId, phoneHash, sectorIndex);
      }

      // Project listing (handle keywords like "ver", "projetos")
      if (cleanText.toLowerCase().includes('projetos') || cleanText.toLowerCase().includes('ver')) {
        return this.handleProjectListing(sessionData.sessionId, phoneHash, 1);
      }

      // Project details (handle number selection)
      const projectMatch = cleanText.toLowerCase().match(/^\d+\s*(.*)/);
      if (projectMatch) {
        const optionIndex = parseInt(projectMatch[1]) - 1;
        return this.handleProjectDetails(sessionData.sessionId, phoneHash, optionIndex);
      }

      // Report creation (handle keywords like "relato", "reportar")
      if (cleanText.toLowerCase().includes('relato') || cleanText.toLowerCase().includes('reportar')) {
        return this.handleReportCreation(sessionData.sessionId, phoneHash, {
          type: 'outro',
          description: cleanText,
        });
      }

      // Help
      if (cleanText.toLowerCase().includes('ajuda') || cleanText.toLowerCase().includes('help')) {
        const helpText = [
          `${this.getUssdCode()} Menu USSD Costant`,
          '',
          'Para usar: discar *555#',
          '',
          '1. Selecionar província',
          '2. Selecionar setor',
          '3. Ver projetos',
          '4. Fazer relato',
          '0. Sair',
        ].join('\n');

        return {
          text: helpText,
          continue: true,
          sessionId: sessionData.sessionId,
        };
      }

      // Exit/Sair
      if (cleanText.toLowerCase().includes('sair') || cleanText.toLowerCase() === '0' || cleanText.toLowerCase() === '00') {
        return {
          text: 'Obrigado por usar USSD Costant!',
          continue: false,
          sessionId: sessionData.sessionId,
        };
      }

      // Default response
      return {
        text: `${this.getUssdCode()}\nOpção não reconhecida.\n[1] Menu principal\n[2] Digite 1 para província`,
        continue: true,
        sessionId: sessionData.sessionId,
      };
    } catch (error) {
      this.logger.error('Error processing USSD request:', error);
      throw new BadRequestException('Erro ao processar requisição USSD');
    }
  }

  /**
   * Send USSD message (for web simulator)
   */
  async sendUssdMessage(sessionId: string, text: string, phoneNumber?: string): Promise<void> {
    try {
      // In production, this would send via SMS gateway
      // For web simulator, we just log it
      this.logger.log(`USSD Message to ${phoneNumber || 'simulator'}: ${text}`);

      // In real implementation, this would be:
      /*
      await this.smsGateway.send({
        to: phoneNumber,
        message: text,
      });
      */
    } catch (error) {
      this.logger.error('Error sending USSD message:', error);
    }
  }

  /**
   * Get session data (for debugging)
   */
  getSessionData(sessionId: string): UssdSessionData | null {
    const session = Array.from(this.sessionStore.values()).find(s => s.sessionId === sessionId);
    return session?.data || null;
  }
}