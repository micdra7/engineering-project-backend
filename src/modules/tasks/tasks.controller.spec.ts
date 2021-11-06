import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginationResponse } from '../../utils/pagination.response';
import { User } from '../users/entities/user.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { ChangeListDto } from './dto/change-list.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/taskList.entity';
import { TaskItemResponse } from './response/task-item.response';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  const date = new Date();
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn().mockImplementation(args => ({ id: 1, ...args })),
            findOne: jest.fn().mockImplementation((...args): Promise<Task> => {
              if (args?.[0]?.where?.id === 1 || args?.[0] === 1) {
                return Promise.resolve({
                  id: 1,
                  name: 'Test Task',
                  description: 'Test Task description',
                  startDate: date,
                  finishDate: null,
                  isDone: false,
                  childrenTasks: [],
                  parentTask: null,
                  taskList: {
                    id: 1,
                    name: 'Test List',
                    workspace: {
                      id: 1,
                      name: 'Test Workspace',
                      isDefault: false,
                      games: null,
                      taskLists: null,
                      userWorkspaces: null,
                    },
                    tasks: null,
                  },
                  users: [],
                });
              } else if (args?.[0]?.where?.id === 2) {
                return Promise.resolve({
                  id: 2,
                  name: 'Test Task',
                  description: 'Test Task description',
                  startDate: date,
                  finishDate: null,
                  isDone: false,
                  childrenTasks: [],
                  parentTask: {
                    id: 1,
                    name: 'Test Task',
                    description: 'Test Task description',
                    startDate: date,
                    finishDate: null,
                    isDone: false,
                    childrenTasks: [],
                    parentTask: null,
                    taskList: {
                      id: 1,
                      name: 'Test List',
                      workspace: {
                        id: 1,
                        name: 'Test Workspace',
                        isDefault: false,
                        games: null,
                        taskLists: null,
                        userWorkspaces: null,
                      },
                      tasks: null,
                    },
                    users: [],
                  },
                  taskList: {
                    id: 1,
                    name: 'Test List',
                    workspace: {
                      id: 1,
                      name: 'Test Workspace',
                      isDefault: false,
                      games: null,
                      taskLists: null,
                      userWorkspaces: null,
                    },
                    tasks: null,
                  },
                  users: [],
                });
              }

              return Promise.resolve(null);
            }),
            remove: jest.fn().mockImplementation(() => Promise.resolve()),
            save: jest.fn().mockImplementation(args => ({ id: 1, ...args })),
            createQueryBuilder: jest.fn().mockReturnValue({
              innerJoinAndSelect: () => ({
                innerJoinAndSelect: () => ({
                  innerJoinAndSelect: () => ({
                    innerJoinAndSelect: () => ({
                      where: () => ({
                        orderBy: () => ({
                          skip: () => ({
                            take: () => ({
                              getManyAndCount: () => [
                                [
                                  {
                                    id: 1,
                                    name: 'Test Task',
                                    description: 'Test Task description',
                                    startDate: date,
                                    finishDate: null,
                                    isDone: false,
                                    childrenTasks: [],
                                    parentTask: null,
                                    taskList: {
                                      id: 1,
                                      name: 'Test List',
                                      workspace: {
                                        id: 1,
                                        name: 'Test Workspace',
                                        isDefault: false,
                                        games: null,
                                        taskLists: null,
                                        userWorkspaces: null,
                                      },
                                      tasks: null,
                                    },
                                    users: [],
                                  },
                                ],
                                1,
                              ],
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          },
        },
        {
          provide: getRepositoryToken(TaskList),
          useValue: {
            findOne: jest.fn().mockImplementation((...args: any) => {
              if (
                args?.[0]?.where?.name === 'Test List' ||
                args?.[0]?.where?.id === 1 ||
                args?.[0] === 1
              ) {
                return Promise.resolve({
                  id: 1,
                  name: 'Test List',
                });
              } else if (args?.[0] === 2) {
                return Promise.resolve({
                  id: 2,
                  name: 'Test List2',
                });
              }

              return Promise.resolve(null);
            }),
            create: jest.fn().mockImplementation(({ name }) => {
              return Promise.resolve({
                name,
              });
            }),
            save: jest.fn().mockImplementation(({ name }) => {
              return Promise.resolve({
                id: 1,
                name,
              });
            }),
            remove: jest.fn().mockImplementationOnce(() => Promise.resolve()),
            createQueryBuilder: jest.fn().mockReturnValue({
              innerJoinAndSelect: () => ({
                where: () => ({
                  orderBy: () => ({
                    skip: () => ({
                      take: () => ({
                        getManyAndCount: () => [
                          [{ id: 1, name: 'Test List' }],
                          1,
                        ],
                      }),
                    }),
                  }),
                }),
              }),
            }),
          },
        },
        {
          provide: getRepositoryToken(Workspace),
          useValue: {
            findOne: jest.fn().mockImplementation((args: any) => {
              if (
                args?.where?.name === 'Test Workspace' ||
                args?.[0]?.where?.name === 'Test Workspace'
              ) {
                return Promise.resolve({
                  id: 1,
                  name: 'Test Workspace',
                  userWorkspaces: null,
                  taskLists: null,
                  games: null,
                  isDefault: false,
                });
              }

              return Promise.resolve(null);
            }),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest
              .fn()
              .mockImplementationOnce((id: number): Promise<User> => {
                if (id === 1) {
                  return Promise.resolve({
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'test@test.net',
                    passwordHash:
                      '$2b$10$5pH0h0KHCSE5Yt0dx6mXRO5l1PgTLNdaxjPwPriRQeMjACdRKq47e',
                    isActive: true,
                    calls: null,
                    gameResults: null,
                    messages: null,
                    tasks: null,
                    userChatrooms: null,
                    userWorkspaces: null,
                  });
                }

                return Promise.resolve(undefined);
              })
              .mockImplementationOnce((...args: any) => {
                if (args?.[0]?.where?.email === 'test1@test.net') {
                  return Promise.resolve({
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'test1@test.net',
                    passwordHash:
                      '$2b$10$5pH0h0KHCSE5Yt0dx6mXRO5l1PgTLNdaxjPwPriRQeMjACdRKq47e',
                    isActive: true,
                    calls: null,
                    gameResults: null,
                    messages: null,
                    tasks: null,
                    userChatrooms: null,
                    userWorkspaces: null,
                  });
                }

                return Promise.resolve(undefined);
              }),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create - should create task', async () => {
    const dto: CreateTaskDto = {
      name: 'Test Task',
      description: 'Test Task description',
      startDate: date,
      taskListId: 1,
    };

    const expected: TaskItemResponse = {
      id: 1,
      name: 'Test Task',
      description: 'Test Task description',
      startDate: date,
      taskListId: 1,
      assignedUserIds: undefined,
      finishDate: undefined,
      isDone: false,
      parentTaskId: 0,
    };

    const actual = await controller.create(dto, {
      user: { workspaceName: 'Test Workspace' },
    });

    expect(actual).toStrictEqual(expected);
  });

  it('getAll - should return a list of all tasks (with pagination)', async () => {
    const expected: PaginationResponse<TaskItemResponse> = {
      data: [
        {
          id: 1,
          name: 'Test Task',
          description: 'Test Task description',
          startDate: date,
          taskListId: 1,
          assignedUserIds: [],
          finishDate: null,
          isDone: false,
          parentTaskId: 0,
        },
      ],
      meta: {
        currentPage: 1,
        itemCount: 10,
        totalPages: 1,
        totalItems: 1,
      },
    };

    const actual = await controller.findAll(1, 10, {
      user: { workspaceName: 'Test Workspace' },
    });

    expect(actual).toStrictEqual(expected);
  });

  it('getOne - should return a task for given id', async () => {
    const expected: TaskItemResponse = {
      id: 1,
      name: 'Test Task',
      description: 'Test Task description',
      startDate: date,
      taskListId: 1,
      assignedUserIds: [],
      finishDate: null,
      isDone: false,
      parentTaskId: 0,
    };

    const actual = await controller.findOne('1');

    expect(actual).toStrictEqual(expected);
  });

  it('getOne - should return null if task with given id is not found', async () => {
    const actual = await controller.findOne('0');

    expect(actual).toBeNull();
  });

  it('update - update if task exists', async () => {
    const dto: UpdateTaskDto = {
      id: 1,
      name: 'Test Task',
      description: 'Test Task description',
      startDate: date,
      taskListId: 1,
    };

    const expected: TaskItemResponse = {
      id: 1,
      name: 'Test Task',
      description: 'Test Task description',
      startDate: date,
      taskListId: 1,
      assignedUserIds: [],
      finishDate: null,
      isDone: false,
      parentTaskId: 0,
    };

    const actual = await controller.update(dto);

    expect(actual).toStrictEqual(expected);
  });

  it('delete - deletes task if it exists', async () => {
    await expect(controller.delete('1')).resolves.not.toThrow();
  });

  it('delete - fails if task does not exist', async () => {
    await expect(async () => {
      await controller.delete('0').catch(err => {
        throw err;
      });
    }).rejects.toThrow(BadRequestException);
  });

  it('updateStatus - should update status if subtask', async () => {
    const dto: UpdateStatusDto = {
      id: 2,
      isDone: true,
    };

    const expected: TaskItemResponse = {
      id: 2,
      name: 'Test Task',
      description: 'Test Task description',
      startDate: date,
      taskListId: 1,
      parentTaskId: 1,
      isDone: true,
      assignedUserIds: [],
      finishDate: null,
    };

    const actual = await controller.updateStatus(dto);

    expect(actual).toStrictEqual(expected);
  });

  it('updateStatus - should fail if task is not a subtask', async () => {
    const dto: UpdateStatusDto = {
      id: 1,
      isDone: true,
    };

    await expect(async () => {
      await controller.updateStatus(dto).catch(err => {
        throw err;
      });
    }).rejects.toThrow(BadRequestException);
  });

  it('changeList - should change list if target list exists', async () => {
    const dto: ChangeListDto = {
      taskId: 1,
      listId: 2,
    };

    const expected: TaskItemResponse = {
      id: 1,
      name: 'Test Task',
      description: 'Test Task description',
      startDate: date,
      taskListId: 2,
      assignedUserIds: [],
      finishDate: null,
      isDone: false,
      parentTaskId: 0,
    };

    const actual = await controller.changeList(dto);

    expect(actual).toStrictEqual(expected);
  });

  it('changeList - should fail if target list does not exist', async () => {
    const dto: ChangeListDto = {
      taskId: 1,
      listId: 0,
    };

    await expect(async () => {
      await controller.changeList(dto).catch(err => {
        throw err;
      });
    }).rejects.toThrow(BadRequestException);
  });
});
