import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Response DTO for report creation
 */
export class ReportResponseDto {
  @ApiProperty({
    description: 'Success message for report creation',
    example: 'Relato criado com sucesso'
  })
  readonly message: string;

  @ApiProperty({
    description: 'Report ID for tracking',
    example: 'report_abc123'
  })
  @Type(() => String)
  readonly reportId: string;
}