import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create() {
    // creates a new task
  }

  @Get()
  async getAll() {
    // returns all task
  }

  @Get()
  async getOne() {
    // returns one task
  }

  @Patch('/:id')
  async update() {
    // updates task
  }

  @Delete('/:id')
  async delete() {
    // deletes task
  }

  @Patch('/:id/update-status')
  async updateStatus() {
    // updates task status - only for subtasks
  }

  @Patch('/:id/change-list')
  async changeList() {
    // moves task between lists
  }
}
