import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksListsController } from './tasksList.controller';
import { TaskListsService } from './tasksList.service';

@Module({
  controllers: [TasksController, TasksListsController],
  providers: [TasksService, TaskListsService],
})
export class TasksModule {}
