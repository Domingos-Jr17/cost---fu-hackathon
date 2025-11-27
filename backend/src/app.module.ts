import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProjectsModule } from './modules/projects/projects.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UssdModule } from './modules/ussd/ussd.module';
import { PrismaService } from './config/prisma.service';

@Module({
  imports: [
    // Configuração global de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Serviço Prisma global
    PrismaService,

    // Módulos da aplicação
    ProjectsModule,
    ReportsModule,
    UssdModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
