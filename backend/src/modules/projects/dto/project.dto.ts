import { ApiProperty } from '@nestjs/swagger';

/**
 * Simplified Project DTO for citizen-friendly format
 */
export class ProjectDto {
  @ApiProperty({
    description: 'Unique project identifier',
    example: 'ocds-h7g4j3'
  })
  id: string;

  @ApiProperty({
    description: 'Project name (truncated for display)',
    example: 'Reabilitação da Estrada Nacional EN1'
  })
  nome: string;

  @ApiProperty({
    description: 'Brief project description',
    example: 'Reabilitação e pavimentação de 450km da estrada principal'
  })
  descricao: string;

  @ApiProperty({
    description: 'Province where project is located',
    example: 'Maputo'
  })
  provincia: string;

  @ApiProperty({
    description: 'Sector of infrastructure',
    example: 'Estradas'
  })
  setor: string;

  @ApiProperty({
    description: 'Formatted project value',
    example: '2.5B MZN'
  })
  valor: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'MZN'
  })
  moeda: string;

  @ApiProperty({
    description: 'Current project status',
    example: 'Em Andamento'
  })
  estado: string;

  @ApiProperty({
    description: 'Progress percentage (0-100)',
    example: 65
  })
  progresso: number;

  @ApiProperty({
    description: 'Delay in days',
    example: 15
  })
  atraso: number;

  @ApiProperty({
    description: 'Number of citizen reports',
    example: 3
  })
  relatos: number;

  @ApiProperty({
    description: 'Contract signing date',
    example: '15/06/2023'
  })
  dataContrato: string;

  @ApiProperty({
    description: 'Contracting entity',
    example: 'Ministério das Obras Públicas'
  })
  contratante: string;

  @ApiProperty({
    description: 'Contracted company',
    example: 'China Road and Bridge Corporation'
  })
  contratado: string;

  @ApiProperty({
    description: 'Procurement method',
    example: 'International Competitive Bidding'
  })
  metodoProcurement: string;
}

/**
 * Response DTO for projects list
 */
export class ProjectsResponseDto {
  @ApiProperty({
    description: 'Array of projects',
    type: [ProjectDto]
  })
  projetos: ProjectDto[];

  @ApiProperty({
    description: 'Total number of projects matching filters',
    example: 150
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of projects per page',
    example: 20
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether data is from cache or live API',
    example: true
  })
  fromCache: boolean;

  @ApiProperty({
    description: 'Data source',
    example: 'API CoST Moçambique'
  })
  dataSource: string;
}

/**
 * Health check response
 */
export class HealthResponseDto {
  @ApiProperty({
    description: 'Service status',
    example: 'ok'
  })
  status: string;

  @ApiProperty({
    description: 'Current timestamp',
    example: '2024-01-15T10:30:00Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'CoST API connection status',
    example: 'connected'
  })
  costApiStatus: string;

  @ApiProperty({
    description: 'Number of projects in cache',
    example: 1250
  })
  cachedProjects: number;

  @ApiProperty({
    description: 'Cache last updated',
    example: '2024-01-15T09:15:00Z'
  })
  cacheLastUpdated: string;
}