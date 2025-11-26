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
    return this.configService.get<string>('DB_USERNAME', 'costant_user');
  }

  get password(): string {
    return this.configService.get<string>('DB_PASSWORD', 'costant_password');
  }

  get database(): string {
    return this.configService.get<string>('DB_DATABASE', 'costant_db');
  }

  get connectionString(): string {
    return `postgresql://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
  }
}