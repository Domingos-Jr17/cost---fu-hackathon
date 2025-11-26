import { IsString, IsOptional, Max, IsIn, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiPropertyOptional({
    description: 'Project ID being reported',
    example: 'ocds-h7g4j3'
  })
  @IsString()
  @IsOptional()
  @Max(255)
  readonly projectId: string;

  @ApiPropertyOptional({
    description: 'Type of report: delay, quality, corruption, other',
    example: 'qualidade'
  })
  @IsString()
  @IsIn(['atraso', 'qualidade', 'corrupcao', 'outro'])
  @IsOptional()
  @Max(50)
  readonly type: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the issue',
    example: 'A qualidade do asfalto está abaixo do esperado, já apresenta buracos após 2 meses.'
  })
  @IsString()
  @IsOptional()
  @Max(1000)
  readonly description: string;

  @ApiPropertyOptional({
    description: 'Photo evidence (base64 or file URL)',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAA...'
  })
  @IsString()
  @IsOptional()
  readonly photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Location coordinates (lat, lng, and address)',
    type: Object,
    example: '{"lat": -25.9685, "lng": 32.5865, "address": "Estrada Nacional EN1, Maputo"}'
  })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  readonly location?: LocationDto;

  @ApiPropertyOptional({
    description: 'Phone number of reporter (for followup)',
    example: '841234567'
  })
  @IsString()
  @IsOptional()
  @Max(20)
  readonly phone?: string;

  @ApiPropertyOptional({
    description: 'Report source (PWA or USSD)',
    example: 'pwa'
  })
  @IsString()
  @IsIn(['pwa', 'ussd'])
  @IsOptional()
  @Max(10)
  readonly source: string = 'pwa';
}

export class LocationDto {
  @ApiProperty({ example: -25.9685 })
  @IsNumber()
  readonly lat: number;

  @ApiProperty({ example: 32.5865 })
  @IsNumber()
  readonly lng: number;

  @ApiProperty({ example: 'Estrada Nacional EN1, Maputo' })
  @IsString()
  readonly address: string;
}