import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service.prisma';
import { ReportsController } from './reports.controller';

@Module({
  imports: [],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
