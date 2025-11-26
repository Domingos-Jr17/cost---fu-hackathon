import { IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional, ApiOperation } from '@nestjs/swagger';

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
  @Type(() => Date)
  readonly startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter by date range (end)',
    example: '2023-12-31'
  })
  @IsOptional()
  @IsString()
  @Type(() => Date)
  readonly endDate?: Date;

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
  @ApiProperty({
    description: 'Total number of reports matching filters',
    example: 150
  })
  @Type(() => Number)
  @ApiProperty()
  readonly total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  @Type(() => Number)
  @ApiProperty()
  readonly page: number = 1;

  @ApiProperty({
    description: 'Number of reports per page',
    example: 20
  })
  @Type(() => Number)
  @ApiProperty()
  readonly limit: number = 20;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8
  })
  @Type(() => Number)
  @ApiProperty()
  readonly totalPages: number = 8;
}