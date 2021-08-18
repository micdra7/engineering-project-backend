import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from '../../utils/pagination.response';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/taskList.entity';
import { TaskItemResponse } from './response/task-item.reponse';
import { ChangeListDto } from './dto/change-list.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskList)
    private readonly taskListsRepository: Repository<TaskList>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async create(
    dto: CreateTaskDto,
    workspaceName: string,
  ): Promise<TaskItemResponse> {
    return null;
  }

  async findAll(
    workspaceName: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<TaskItemResponse>> {
    return null;
  }

  async findOne(id: number): Promise<TaskItemResponse> {
    return null;
  }

  async update(dto: UpdateTaskDto): Promise<TaskItemResponse> {
    return null;
  }

  async remove(id: number): Promise<void> {
    return null;
  }

  async changeList(dto: ChangeListDto): Promise<TaskItemResponse> {
    return null;
  }

  async updateStatus(dto: UpdateStatusDto): Promise<TaskItemResponse> {
    return null;
  }
}
