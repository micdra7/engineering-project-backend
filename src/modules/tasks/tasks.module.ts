import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksListsController } from './tasksList.controller';
import { TaskListsService } from './tasksList.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/taskList.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskList, Workspace])],
  controllers: [TasksController, TasksListsController],
  providers: [TasksService, TaskListsService],
})
export class TasksModule {}
