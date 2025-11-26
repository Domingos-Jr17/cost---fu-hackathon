import { IsOptional, IsString, IsIn, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO for getting projects with filters
 */
export class GetProjectsDto {
  @ApiPropertyOptional({
    description: 'Filter by province',
    example: 'Maputo',
    enum: ['Maputo', 'Maputo Cidade', 'Gaza', 'Inhambane', 'Manica', 'Sofala', 'Tete', 'Zambézia', 'Nampula', 'Niassa', 'Cabo Delgado']
  })
  @IsOptional()
  @IsString()
  readonly provincia?: string;

  @ApiPropertyOptional({
    description: 'Filter by sector',
    example: 'Estradas',
    enum: ['Estradas', 'Escolas', 'Hospitais', 'Água', 'Eletricidade', 'Habitação', 'Pontes', 'Edifícios Públicos', 'Irrigação', 'Saneamento', 'Transporte', 'Telecomunicações']
  })
  @IsOptional()
  @IsString()
  readonly setor?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    example: 'Em Andamento',
    enum: ['Em Andamento', 'Concluído', 'Cancelado', 'Pendente', 'Com Atraso', 'Em Licitação', 'Em Avaliação', 'Contratado', 'Em Implementação', 'Em Finalização', 'Encerrado']
  })
  @IsOptional()
  @IsString()
  readonly estado?: string;

  @ApiPropertyOptional({
    description: 'Number of results to return',
    example: 20,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  readonly limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'created_at',
    enum: ['created_at', 'progresso', 'valor', 'nome']
  })
  @IsOptional()
  @IsString()
  readonly sortBy?: string = 'created_at';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  readonly sortOrder?: 'asc' | 'desc' = 'desc';
}