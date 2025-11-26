import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UssdResponseDto {
  @ApiProperty({
    description: 'USSD response text message',
    example: 'Por favor selecione uma opção:'
  })
  @Type(() => String)
  readonly text: string;

  @ApiProperty({
    description: 'Whether to continue USSD session',
    example: true
  })
  @Type(() => Boolean)
  readonly continue: boolean;

  @ApiProperty({
    description: 'New session ID for next interaction',
    example: 'abc123'
  })
  @Type(() => String)
  readonly sessionId?: string;

  @ApiProperty({
    description: 'Current step in USSD menu',
    example: 'main'
  })
  @Type(() => String)
  readonly currentStep?: string;
}