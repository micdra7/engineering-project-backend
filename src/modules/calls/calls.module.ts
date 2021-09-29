import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { CallsGateway } from './calls.gateways';

@Module({
  controllers: [CallsController],
  providers: [CallsService, CallsGateway],
})
export class CallsModule {}
