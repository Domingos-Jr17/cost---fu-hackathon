import { Module } from '@nestjs/common';
import { UssdController } from './ussd.controller';
import { UssdService } from './ussd.service';
import { UssdFormatterService } from './ussd-formatter.service';

@Module({
  controllers: [UssdController],
  providers: [UssdService, UssdFormatterService],
  exports: [UssdService],
})
export class UssdModule {}