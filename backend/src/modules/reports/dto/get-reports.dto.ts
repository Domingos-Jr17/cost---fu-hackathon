import { IsOptional, IsString, Max, Min, IsIn, IsNumber } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

/**
 * DTO for getting reports with filters
 */
export class GetReportsDto {
  @ApiPropertyOptional({
    description: 'Filter by project ID',
    example: 'ocds-h7g4j3'
  })
  @IsOptional()
  @IsString()
  @Max(255)
  readonly projectId?: string;

  @ApiPropertyOptional({
    description: 'Filter by report status',
    example: 'pendente'
  })
  @IsOptional()
  @IsString()
  @IsIn(['pendente', 'verificado', 'resolvido', 'spam'])
  readonly status?: string;

  @ApiPropertyOptional({
    description: 'Filter by report type',
    example: 'qualidade'
  })
  @IsOptional()
  @IsString()
  @IsIn(['atraso', 'qualidade', 'corrupcao', 'outro'])
  readonly type?: string;

  @ApiPropertyOptional({
    description: 'Filter by date range (start)',
    example: '2023-01-01'
  })
  @IsOptional()
  @IsString()
  readonly startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by date range (end)',
    example: '2023-12-31'
  })
  @IsOptional()
  @IsString()
  readonly endDate?: string;

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
  @IsIn(['created_at', 'progresso', 'valor', 'nome'])
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

/**
 * Response DTO for reports list
 */
export class ReportsResponseDto {
  @ApiProperty({
    description: 'Array of citizen reports',
    type: [Object]
  })
  reports: any[];

  @ApiProperty({
    description: 'Total number of reports matching filters',
    example: 150
  })
  @Type(() => Number)
  readonly total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  @Type(() => Number)
  readonly page: number;

  @ApiProperty({
    description: 'Number of reports per page',
    example: 20
  })
  @Type(() => Number)
  readonly limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8
  })
  @Type(() => Number)
  readonly totalPages: number;
}