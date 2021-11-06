import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from 'src/utils/pagination.response';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateTaskListDto } from './dto/create-taskList.dto';
import { UpdateTaskListDto } from './dto/update-taskList.dto';
import { TaskList } from './entities/taskList.entity';
import { TaskListItemResponse } from './response/taskList-item.response';

@Injectable()
export class TaskListsService {
  constructor(
    @InjectRepository(TaskList)
    private readonly taskListsRepository: Repository<TaskList>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async create(
    dto: CreateTaskListDto,
    workspaceName: string,
  ): Promise<TaskListItemResponse> {
    const foundTaskList = await this.taskListsRepository.findOne({
      where: { name: dto.name, workspace: { name: workspaceName } },
      relations: ['workspace'],
    });

    if (!!foundTaskList) {
      throw new BadRequestException('Task list with given name already exists');
    }

    let taskList = await this.taskListsRepository.create(dto);
    taskList = await this.taskListsRepository.save(taskList);

    const workspace = await this.workspaceRepository.findOne({
      where: { name: workspaceName },
      relations: ['taskLists'],
    });
    workspace.taskLists ??= [];
    workspace.taskLists.push(taskList);

    await this.workspaceRepository.save(workspace);

    return {
      id: taskList.id,
      name: taskList.name,
    };
  }

  async findAll(
    workspaceName: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<TaskListItemResponse>> {
    const [items, count] = await this.taskListsRepository
      .createQueryBuilder('taskList')
      .innerJoinAndSelect('taskList.workspace', 'workspace')
      .leftJoinAndSelect('taskList.tasks', 'tasks')
      .leftJoinAndSelect('tasks.parentTask', 'parentTask')
      .leftJoinAndSelect('tasks.users', 'users')
      .leftJoinAndSelect('tasks.childrenTasks', 'childrenTasks')
      .where('workspace.name = :workspaceName', { workspaceName })
      .orderBy('taskList.id', 'ASC')
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
        tasks: val.tasks
          .filter(task => !task.isDeleted)
          .map(task => ({
            id: task.id,
            name: task.name,
            description: task.description,
            startDate: task.startDate,
            finishDate: task.finishDate,
            taskListId: val.id,
            parentTaskId: task.parentTask?.id ?? 0,
            isDone: task.isDone ?? false,
            assignedUserIds: task.users.map(u => u.id),
            isDeleted: task.isDeleted ?? false,
            childrenTasks: task.childrenTasks
              ?.filter(t => !t.isDeleted)
              ?.map(t => ({
                id: t.id,
                name: t.name,
                description: t.description,
                startDate: t.startDate,
                finishDate: t.finishDate,
                taskListId: val.id,
                parentTaskId: t.parentTask?.id ?? 0,
                isDone: t.isDone ?? false,
                assignedUserIds: t.users?.map(u => u.id),
                isDeleted: t.isDeleted ?? false,
              })),
          })),
      })),
      meta,
    };
  }

  async findAllDeleted(
    workspaceName: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<TaskListItemResponse>> {
    const [items, count] = await this.taskListsRepository
      .createQueryBuilder('taskList')
      .innerJoinAndSelect('taskList.workspace', 'workspace')
      .leftJoinAndSelect('taskList.tasks', 'tasks')
      .leftJoinAndSelect('tasks.parentTask', 'parentTask')
      .leftJoinAndSelect('tasks.users', 'users')
      .leftJoinAndSelect('tasks.childrenTasks', 'childrenTasks')
      .where('workspace.name = :workspaceName', { workspaceName })
      .orderBy('taskList.id', 'ASC')
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
        tasks: val.tasks
          .filter(task => !!task.isDeleted)
          .map(task => ({
            id: task.id,
            name: task.name,
            description: task.description,
            startDate: task.startDate,
            finishDate: task.finishDate,
            taskListId: val.id,
            parentTaskId: task.parentTask?.id ?? 0,
            isDone: task.isDone ?? false,
            assignedUserIds: task.users.map(u => u.id),
            isDeleted: task.isDeleted ?? false,
            childrenTasks: task.childrenTasks
              ?.filter(t => !!t.isDeleted)
              ?.map(t => ({
                id: t.id,
                name: t.name,
                description: t.description,
                startDate: t.startDate,
                finishDate: t.finishDate,
                taskListId: val.id,
                parentTaskId: t.parentTask?.id ?? 0,
                isDone: t.isDone ?? false,
                assignedUserIds: t.users?.map(u => u.id),
                isDeleted: t.isDeleted ?? false,
              })),
          })),
      })),
      meta,
    };
  }

  async findOne(
    id: number,
    workspaceName: string,
  ): Promise<TaskListItemResponse> {
    const taskList = await this.taskListsRepository.findOne({
      where: { workspace: { name: workspaceName }, id },
      relations: ['workspace'],
    });

    return (
      taskList && {
        id: taskList.id,
        name: taskList.name,
      }
    );
  }

  async update(dto: UpdateTaskListDto): Promise<TaskListItemResponse> {
    const taskList = await this.taskListsRepository.findOne(dto.id);
    if (!taskList) {
      throw new BadRequestException('Task list for given id does not exist');
    }

    const taskListForName = await this.taskListsRepository.findOne({
      where: { name: dto.name },
    });
    if (!!taskListForName) {
      throw new BadRequestException('New name is already in use');
    }

    taskList.name = dto.name;

    await this.taskListsRepository.save(taskList);

    return {
      id: dto.id,
      name: dto.name,
    };
  }

  async remove(id: number): Promise<void> {
    const taskList = await this.taskListsRepository.findOne(id);
    if (!taskList) {
      throw new BadRequestException('Task list for given id does not exist');
    }

    await this.taskListsRepository.remove(taskList);
  }
}
