import { IsString, IsOptional, Max, IsNotEmpty, MinLength, MaxLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UssdRequestDto {
  @ApiProperty({
    description: 'Current step in USSD menu',
    example: 'main'
  })
  @IsString()
  @IsOptional()
  @Max(64)
  readonly currentStep?: string = 'main';

  @ApiProperty({
    description: 'Phone number in hash format (for privacy)',
    example: 'hashed_phone_value'
  })
  @IsString()
  @IsOptional()
  @MinLength(0)
  @MaxLength(64)
  readonly phoneNumber?: string;

  @ApiProperty({
    description: 'Text input from user',
    example: '1'
  })
  @IsString()
  @IsOptional()
  @Length(0, 160)
  readonly text?: string;

  @ApiProperty({
    description: 'Session ID for USSD continuation',
    example: 'abc123def456'
  })
  @IsString()
  @IsOptional()
  @Length(0, 64)
  readonly sessionId?: string;
}