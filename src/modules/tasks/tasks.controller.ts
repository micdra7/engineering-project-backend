import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskItemResponse } from './response/task-item.response';
import { ApiPaginatedResponse } from '../../utils/pagination.decorator';
import { PaginationResponse } from '../../utils/pagination.response';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ChangeListDto } from './dto/change-list.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Task successfully created',
    type: TaskItemResponse,
  })
  @ApiBadRequestResponse({ description: 'Failed validation' })
  async create(
    @Body() dto: CreateTaskDto,
    @Req() req,
  ): Promise<TaskItemResponse> {
    return this.tasksService.create(dto, req.user.workspaceName);
  }

  @Get()
  @ApiPaginatedResponse(TaskItemResponse, 'List is successfully fetched')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<TaskItemResponse>> {
    return this.tasksService.findAll(req.user.workspaceName, page, limit);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Returns selected task',
    type: TaskItemResponse,
  })
  @ApiBadRequestResponse()
  async getOne(@Param('id') id: string): Promise<TaskItemResponse> {
    return this.tasksService.findOne(+id);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Updates task for given id',
    type: TaskItemResponse,
  })
  @ApiBadRequestResponse({ description: 'Failed validation' })
  async update(@Body() dto: UpdateTaskDto): Promise<TaskItemResponse> {
    return this.tasksService.update(dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Task was removed' })
  @ApiBadRequestResponse()
  async delete(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(+id);
  }

  @Patch('/:id/update-status')
  @ApiOkResponse({ description: 'Status was updated' })
  @ApiBadRequestResponse({ description: 'Task is not a subtask' })
  async updateStatus(@Body() dto: UpdateStatusDto): Promise<TaskItemResponse> {
    return this.tasksService.updateStatus(dto);
  }

  @Patch('/:id/change-list')
  @ApiOkResponse({ description: 'List was changed' })
  @ApiBadRequestResponse()
  async changeList(@Body() dto: ChangeListDto): Promise<TaskItemResponse> {
    return this.tasksService.changeList(dto);
  }
}
