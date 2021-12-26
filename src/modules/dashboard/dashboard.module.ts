import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from '../calls/entities/call.entity';
import { Task } from '../tasks/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Call, Task])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
