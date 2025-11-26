import { ApiProperty } from '@nestjs/swagger';

export class UssdResponseDto {
  @ApiProperty({
    description: 'USSD response text message',
    example: 'Por favor selecione uma opção:'
  })
  @ApiProperty()
  @Type(() => String)
  readonly text: string;

  @ApiProperty({
    description: 'Whether to continue USSD session',
    example: true
  })
  @ApiProperty()
  @Type(() => Boolean)
  readonly continue: boolean = false;

  @ApiProperty({
    description: 'New session ID for next interaction',
    example: 'abc123'
  })
  @ApiProperty()
  @Type(() => String)
  readonly sessionId?: string;

  @ApiProperty({
    description: 'Current step in USSD menu',
    example: 'main'
  })
  @ApiProperty()
  @Type(() => String)
  readonly currentStep?: string = 'main';
}