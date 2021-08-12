import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateTaskListDto } from './dto/create-taskList.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskList } from './entities/taskList.entity';
import { CreateTaskListResponse } from './response/create-taskList.response';

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
  ): Promise<CreateTaskListResponse> {
    const taskListExists = !!(await this.taskListsRepository.findOne({
      where: { name: dto.name },
    }));

    if (taskListExists) {
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

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
