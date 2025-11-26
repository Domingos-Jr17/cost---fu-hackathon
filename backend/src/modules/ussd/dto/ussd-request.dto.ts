import { IsString, IsOptional, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UssdRequestDto {
  @ApiProperty({
    description: 'Current step in USSD menu',
    example: 'main'
  })
  @IsString()
  @IsOptional()
  @Max(20)
  readonly currentStep?: string = 'main';

  @ApiProperty({
    description: 'Phone number in hash format (for privacy)',
    example: 'hashed_phone_value'
  })
  @IsString()
  @IsOptional()
  @Max(64)
  readonly phoneNumber?: string;

  @ApiProperty({
    description: 'Text input from user',
    example: '1'
  })
  @IsString()
  @IsOptional()
  @Max(160)
  readonly text?: string;
}