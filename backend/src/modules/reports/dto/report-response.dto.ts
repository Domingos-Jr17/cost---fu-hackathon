import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for report creation
 */
export class ReportResponseDto {
  @ApiProperty({
    description: 'Success message for report creation',
    example: 'Relato criado com sucesso'
  })
  @ApiProperty({
    description: 'Report ID for tracking',
    example: 'report_abc123'
  })
  @Type(() => String)
  @ApiProperty()
  readonly reportId: string;
}