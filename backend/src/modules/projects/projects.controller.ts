import { Controller, Get, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import { GetProjectsDto } from './dto/get-projects.dto';
import { ProjectDto, ProjectsResponseDto, HealthResponseDto } from './dto/project.dto';

/**
 * Projects Controller - REST API endpoints for project data
 */
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar projetos',
    description: 'Lista todos os projetos de infraestrutura com filtros opcionais de província, setor e status. Os dados são transformados do formato OC4IDS complexo para um formato amigável ao cidadão.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de projetos retornada com sucesso',
    type: ProjectsResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  @ApiQuery({
    name: 'provincia',
    description: 'Filtrar por província',
    required: false,
    example: 'Maputo',
  })
  @ApiQuery({
    name: 'setor',
    description: 'Filtrar por setor',
    required: false,
    example: 'Estradas',
  })
  @ApiQuery({
    name: 'estado',
    description: 'Filtrar por estado',
    required: false,
    example: 'Em Andamento',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Número de resultados por página',
    required: false,
    example: 20,
  })
  @ApiQuery({
    name: 'page',
    description: 'Número da página',
    required: false,
    example: 1,
  })
  async getProjects(@Query() filters: GetProjectsDto): Promise<ProjectsResponseDto> {
    return this.projectsService.getProjects(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obter detalhes do projeto',
    description: 'Retorna informações detalhadas de um projeto específico pelo ID. Inclui dados do contrato, progresso, relatos e informações de contato.',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do projeto retornados com sucesso',
    type: ProjectDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do projeto',
    example: 'ocds-h7g4j3',
  })
  async getProjectById(@Param('id') id: string): Promise<ProjectDto> {
    return this.projectsService.getProjectById(id);
  }

  @Get('health/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check do serviço',
    description: 'Verifica o status do serviço de projetos, incluindo conexão com a API CoST e estado do cache',
  })
  @ApiResponse({
    status: 200,
    description: 'Status do serviço',
    type: HealthResponseDto,
  })
  async healthCheck(): Promise<HealthResponseDto> {
    return this.projectsService.healthCheck();
  }
}