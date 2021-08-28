import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from '../../utils/pagination.response';
import { In, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/taskList.entity';
import { TaskItemResponse } from './response/task-item.response';
import { ChangeListDto } from './dto/change-list.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskList)
    private readonly taskListsRepository: Repository<TaskList>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    dto: CreateTaskDto,
    workspaceName: string,
  ): Promise<TaskItemResponse> {
    let task = await this.taskRepository.create(dto);

    if (dto.parentTaskId) {
      task.parentTask = await this.taskRepository.findOne({
        where: {
          id: dto.parentTaskId,
          taskList: { workspace: { name: workspaceName } },
        },
        join: {
          alias: 'task',
          leftJoinAndSelect: {
            taskList: 'task.taskList',
            workspace: 'taskList.workspace',
          },
        },
      });
    }

    task.taskList = await this.taskListsRepository.findOne({
      where: { id: dto.taskListId },
    });

    if (dto.assignedUserIds) {
      task.users = await this.userRepository.find({
        where: { id: In(dto.assignedUserIds) },
      });
    }

    task = await this.taskRepository.save(task);

    return {
      id: task.id,
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      finishDate: task.finishDate,
      taskListId: task.taskList.id,
      parentTaskId: dto.parentTaskId ?? 0,
      isDone: task.isDone ?? false,
      assignedUserIds: dto.assignedUserIds,
    };
  }

  async findAll(
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
      .orderBy('task.id', 'ASC')
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
      })),
      meta,
    };
  }

  async findOne(id: number): Promise<TaskItemResponse> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['users', 'parentTask', 'taskList', 'childrenTasks'],
    });

    return (
      task && {
        id: task.id,
        name: task.name,
        description: task.description,
        startDate: task.startDate,
        finishDate: task.finishDate,
        taskListId: task.taskList.id,
        parentTaskId: task.parentTask?.id ?? 0,
        isDone: task.isDone ?? false,
        assignedUserIds: task.users.map(u => u.id),
        childrenTasks: task.childrenTasks?.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          startDate: t.startDate,
          finishDate: t.finishDate,
          taskListId: task.taskList.id,
          parentTaskId: t.parentTask?.id ?? 0,
          isDone: t.isDone ?? false,
          assignedUserIds: t.users?.map(u => u.id),
        })),
      }
    );
  }

  async update(dto: UpdateTaskDto): Promise<TaskItemResponse> {
    let task = await this.taskRepository.findOne({
      where: { id: dto.id },
      relations: ['users', 'parentTask', 'taskList'],
    });
    if (!task) {
      throw new BadRequestException('Task for given id does not exist');
    }

    task = { ...task, ...dto };

    if (dto.assignedUserIds) {
      task.users = await this.userRepository.find({
        where: { id: In(dto.assignedUserIds) },
      });
    }

    await this.taskRepository.save(task);

    return {
      id: task.id,
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      finishDate: task.finishDate,
      taskListId: task.taskList.id,
      parentTaskId: task.parentTask?.id ?? 0,
      isDone: task.isDone ?? false,
      assignedUserIds: task.users.map(u => u.id),
    };
  }

  async remove(id: number): Promise<void> {
    const tasksToRemove: Task[] = [];

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['users', 'parentTask', 'taskList', 'childrenTasks'],
    });
    if (!task) {
      throw new BadRequestException('Task for given id does not exist');
    }

    tasksToRemove.push(task);

    if (task.childrenTasks?.length > 0) {
      if (task.childrenTasks.some(t => !t.isDone)) {
        throw new BadRequestException(
          'All subtasks have to be finished before deleting this task',
        );
      } else {
        task.childrenTasks.forEach(t => {
          tasksToRemove.push(t);
        });
      }
    }

    await this.taskRepository.remove(tasksToRemove);
  }

  async changeList(dto: ChangeListDto): Promise<TaskItemResponse> {
    const task = await this.taskRepository.findOne({
      where: { id: dto.taskId },
      relations: ['users', 'parentTask', 'taskList'],
    });
    if (!task) {
      throw new BadRequestException('Task for given id does not exist');
    }

    const taskList = await this.taskListsRepository.findOne(dto.listId);
    if (!taskList) {
      throw new BadRequestException('Task List for given id does not exist');
    }

    task.taskList = taskList;

    await this.taskRepository.save(task);

    return {
      id: task.id,
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      finishDate: task.finishDate,
      taskListId: task.taskList.id,
      parentTaskId: task.parentTask?.id ?? 0,
      isDone: task.isDone ?? false,
      assignedUserIds: task.users.map(u => u.id),
    };
  }

  async updateStatus(dto: UpdateStatusDto): Promise<TaskItemResponse> {
    const task = await this.taskRepository.findOne({
      where: { id: dto.id },
      relations: ['users', 'parentTask', 'taskList'],
    });
    if (!task) {
      throw new BadRequestException('Task for given id does not exist');
    }

    if (!task.parentTask) {
      throw new BadRequestException('Task is not a subtask');
    }

    task.isDone = dto.isDone;

    await this.taskRepository.save(task);

    return {
      id: task.id,
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      finishDate: task.finishDate,
      taskListId: task.taskList.id,
      parentTaskId: task.parentTask?.id ?? 0,
      isDone: task.isDone ?? false,
      assignedUserIds: task.users.map(u => u.id),
    };
  }
}
