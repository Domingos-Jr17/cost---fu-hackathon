import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfig {
  constructor(private configService: ConfigService) {}

  get costApiUrl(): string {
    return this.configService.get<string>('COST_API_URL', 'https://us-central1-mozportal-31b5c.cloudfunctions.net');
  }

  get costApiTimeout(): number {
    return this.configService.get<number>('COST_API_TIMEOUT', 10000);
  }

  get rateLimitMax(): number {
    return this.configService.get<number>('RATE_LIMIT_MAX', 3);
  }

  get rateLimitWindowMs(): number {
    return this.configService.get<number>('RATE_LIMIT_WINDOW_MS', 60000); // 1 minute
  }

  get uploadMaxSize(): number {
    return this.configService.get<number>('UPLOAD_MAX_SIZE', 5242880); // 5MB
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3001);
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/costant');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'default-secret-key-change-in-production');
  }

  get jwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME', '7d');
  }

  get corsOrigins(): string[] {
    const origins = this.configService.get<string>('CORS_ORIGINS', 'http://localhost:3000');
    return origins.split(',').map(origin => origin.trim());
  }
}