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
import { TaskListsService } from './tasksList.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationResponse } from '../../utils/pagination.response';
import { TaskListItemResponse } from './response/taskList-item.response';
import { CreateTaskListDto } from './dto/create-taskList.dto';
import { ApiPaginatedResponse } from '../../utils/pagination.decorator';
import { UpdateTaskListDto } from './dto/update-taskList.dto';

@ApiTags('TaskLists')
@ApiExtraModels(PaginationResponse)
@Controller('tasklists')
export class TasksListsController {
  constructor(private readonly tasksListService: TaskListsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'TaskList successfully created',
    type: TaskListItemResponse,
  })
  @ApiBadRequestResponse({
    description: 'Task list with given id already exists',
  })
  async create(
    @Body() dto: CreateTaskListDto,
    @Req() req,
  ): Promise<TaskListItemResponse> {
    return this.tasksListService.create(dto, req.user.workspaceName);
  }

  @Get()
  @ApiPaginatedResponse(TaskListItemResponse, 'List is successfully fetched')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<TaskListItemResponse>> {
    return this.tasksListService.findAll(req.user.workspaceName, page, limit);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Returns selected taskList',
    type: TaskListItemResponse,
  })
  async getOne(
    @Param('id') id: string,
    @Req() req,
  ): Promise<TaskListItemResponse> {
    return this.tasksListService.findOne(+id, req.user.workspaceName);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Updates taskList for given id',
    type: TaskListItemResponse,
  })
  @ApiBadRequestResponse({
    description: 'TaskList does not exists or new name is already in use',
  })
  async update(@Body() dto: UpdateTaskListDto): Promise<TaskListItemResponse> {
    return this.tasksListService.update(dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'TaskList was removed' })
  async delete(@Param('id') id: string) {
    return this.tasksListService.remove(+id);
  }
}
