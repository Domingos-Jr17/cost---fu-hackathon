import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from './modules/projects/projects.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UssdModule } from './modules/ussd/ussd.module';
import { ReportEntity } from './modules/reports/entities/report.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'costant_user',
      password: process.env.DB_PASSWORD ?? 'costant_password',
      database: process.env.DB_DATABASE ?? 'costant_db',
      entities: [ReportEntity],
      synchronize: process.env.NODE_ENV === 'development', // Only true in development
      logging: process.env.NODE_ENV === 'development',
    }),
    ProjectsModule,
    ReportsModule,
    UssdModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}