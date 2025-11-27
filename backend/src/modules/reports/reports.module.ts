import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service.prisma';
import { ReportsController } from './reports.controller';
import { PrismaService } from '../../config/prisma.service';

@Module({
  imports: [],
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService],
})
export class ReportsModule {}
