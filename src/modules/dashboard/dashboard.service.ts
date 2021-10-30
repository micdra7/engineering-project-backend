import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Call } from '../calls/entities/call.entity';
import { CallResponse } from '../calls/response/call.response';
import { Task } from '../tasks/entities/task.entity';
import { PaginationResponse } from '../../utils/pagination.response';
import { Repository } from 'typeorm';
import { TaskItemResponse } from '../tasks/response/task-item.response';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findCalls(
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<CallResponse>> {
    const [items, count] = await this.callRepository
      .createQueryBuilder('call')
      .innerJoinAndSelect('call.users', 'users')
      .where('users.id = :userId', { userId })
      .andWhere('call.startDate >= :startDate', { startDate: new Date() })
      .orderBy('call.startDate', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const meta = {
      currentPage: page,
      itemCount: limit,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    };

    return {
      data: items.map(item => ({
        id: item.id,
        name: item.name,
        startDate: item.startDate,
        finishDate: item.finishDate,
        users: item.users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isActive: user.isActive,
        })),
        generatedCode: item.generatedCode,
      })),
      meta,
    };
  }

  async findTasks(
    userId: number,
    workspaceName: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<TaskItemResponse>> {
    const [items, count] = await this.taskRepository
      .createQueryBuilder('task')
      .innerJoinAndSelect('task.users', 'users')
      .innerJoinAndSelect('task.parentTask', 'parentTask')
      .innerJoinAndSelect('task.taskList', 'taskList')
      .innerJoinAndSelect('taskList.workspace', 'workspace')
      .where('workspace.name = :workspaceName', { workspaceName })
      .andWhere('task.isDeleted = :isDeleted', { isDeleted: null })
      .andWhere('task.finishDate >= :finishDate', { startDate: new Date() })
      .andWhere('user.id = :userId', { userId })
      .orderBy('task.finishDate', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const meta = {
      currentPage: page,
      itemCount: limit,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    };

    return {
      data: items.map(val => ({
        id: val.id,
        name: val.name,
        description: val.description,
        startDate: val.startDate,
        finishDate: val.finishDate,
        taskListId: val.taskList.id,
        parentTaskId: val.parentTask?.id ?? 0,
        isDone: val.isDone ?? false,
        assignedUserIds: val.users.map(u => u.id),
        isDeleted: val.isDeleted ?? false,
      })),
      meta,
    };
  }
}
