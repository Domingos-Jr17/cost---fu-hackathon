import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from './modules/projects/projects.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UssdModule } from './modules/ussd/ussd.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      entities: [ReportEntity], // Add ReportEntity here
      database: 'your-database-connection', // This should be configured in database.config.ts
    }),
    ProjectsModule,
    ReportsModule,
    UssdModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}