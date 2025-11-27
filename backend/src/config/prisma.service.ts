import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit {
  private prisma: PrismaClient;

  constructor(private configService: ConfigService) {
    const databaseUrl = this.configService.get<string>('DATABASE_URL') || 'postgresql://localhost:5432/postgres';

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    this.prisma = new PrismaClient({
      adapter,
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    // Test connection
    try {
      await this.prisma.$connect();
      console.log('✅ Prisma connected to Supabase successfully');
    } catch (error) {
      console.error('❌ Failed to connect to Supabase:', error);
      throw error;
    }
  }

  get client(): PrismaClient {
    return this.prisma;
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // Convenience methods
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'connected', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'error', message: error.message, timestamp: new Date().toISOString() };
    }
  }
}
