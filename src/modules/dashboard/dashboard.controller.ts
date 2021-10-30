import {
  Controller,
  Get,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/utils/pagination.decorator';
import { PaginationResponse } from 'src/utils/pagination.response';
import { CallResponse } from '../calls/response/call.response';
import { TaskItemResponse } from '../tasks/response/task-item.response';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/tasks')
  @ApiPaginatedResponse(TaskItemResponse, 'List is successfully fetched')
  async findTasks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<TaskItemResponse>> {
    return this.dashboardService.findTasks(
      req.user.id,
      req.user.workspaceName,
      page,
      limit,
    );
  }

  @Get('/calls')
  @ApiPaginatedResponse(CallResponse, 'List is successfully fetched')
  async findCalls(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<CallResponse>> {
    return this.dashboardService.findCalls(req.user.id, page, limit);
  }
}
