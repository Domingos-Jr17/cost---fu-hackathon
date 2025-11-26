import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CostApiConfig {
  constructor(private configService: ConfigService) {}

  get baseUrl(): string {
    return this.configService.get<string>(
      'COST_API_BASE_URL',
      'https://us-central1-mozportal-31b5c.cloudfunctions.net'
    );
  }

  get timeout(): number {
    return this.configService.get<number>('COST_API_TIMEOUT', 10000);
  }

  get endpoints() {
    return {
      getProjects: `${this.baseUrl}/getPublicProjects`,
      getProjectDetails: `${this.baseUrl}/getSingleProjectDetails`,
    };
  }

  get cacheTtl(): number {
    return this.configService.get<number>('CACHE_TTL', 3600000); // 1 hour
  }
}