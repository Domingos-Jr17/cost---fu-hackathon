import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from './modules/projects/projects.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UssdModule } from './modules/ussd/ussd.module';

@Module({
  imports: [
    // Configuração global de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuração do TypeORM para Supabase
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,  // URL completa do Supabase
      autoLoadEntities: true,         // Carrega automaticamente todas as entities
      synchronize: process.env.NODE_ENV === 'development', // Apenas em dev
      logging: process.env.NODE_ENV === 'development',
      ssl: {
        rejectUnauthorized: false,    // Supabase requer SSL
      },
    }),

    // Módulos da aplicação
    ProjectsModule,
    ReportsModule,
    UssdModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
