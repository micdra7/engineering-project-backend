import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { TaskListsService } from './tasksList.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('TaskLists')
@Controller('tasklists')
export class TasksListsController {
  constructor(private readonly tasksListService: TaskListsService) {}

  @Post()
  async create() {
    // creates a new task list
  }

  @Get()
  async getAll() {
    // returns all task lists
  }

  @Get()
  async getOne() {
    // returns one task list
  }

  @Patch('/:id')
  async update() {
    // updates task list
  }

  @Delete('/:id')
  async delete() {
    // deletes task list
  }
}
