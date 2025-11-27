import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get port(): number {
    return this.configService.get<number>('DB_PORT', 5432);
  }

  get username(): string {
    return this.configService.get<string>('DB_USERNAME', 'postgres');
  }

  get password(): string {
    return this.configService.get<string>('DB_PASSWORD', 'zpHp63JVnggD5Z1w');
  }

  get database(): string {
    return this.configService.get<string>('DB_DATABASE', 'postgres');
  }

  // For Supabase connection with pooling (recommended)
  get supabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || 'postgresql://localhost:5432/postgres' || 'postgresql://localhost:5432/postgres';
  }
}
