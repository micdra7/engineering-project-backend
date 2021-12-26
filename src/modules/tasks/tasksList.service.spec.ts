import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginationResponse } from 'src/utils/pagination.response';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateTaskListDto } from './dto/create-taskList.dto';
import { UpdateTaskListDto } from './dto/update-taskList.dto';
import { TaskList } from './entities/taskList.entity';
import { TaskListItemResponse } from './response/taskList-item.response';
import { TaskListsService } from './tasksList.service';

describe('TaskListsService', () => {
  let service: TaskListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskListsService,
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
                leftJoinAndSelect: () => ({
                  leftJoinAndSelect: () => ({
                    leftJoinAndSelect: () => ({
                      leftJoinAndSelect: () => ({
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
      ],
    }).compile();

    service = module.get<TaskListsService>(TaskListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create - should create list for unique name', async () => {
    const dto: CreateTaskListDto = {
      name: 'Test List 123',
    };

    const expected: TaskListItemResponse = {
      id: 1,
      name: 'Test List 123',
    };

    const actual: TaskListItemResponse = await service.create(
      dto,
      'Test Workspace',
    );

    expect(actual).toStrictEqual(expected);
  });

  it('create - should fail if list with given name already exists', async () => {
    const dto: CreateTaskListDto = {
      name: 'Test List',
    };

    await expect(async () => {
      await service.create(dto, 'Test Workspace').catch(err => {
        throw err;
      });
    }).rejects.toThrow(BadRequestException);
  });

  it('findAll - should return a list of all task lists  (with pagination)', async () => {
    const expected: PaginationResponse<TaskListItemResponse> = {
      data: [{ id: 1, name: 'Test List', tasks: [] }],
      meta: {
        currentPage: 1,
        itemCount: 10,
        totalPages: 1,
        totalItems: 1,
      },
    };

    const actual = await service.findAll('Test Workspace', 1, 10);

    expect(actual).toStrictEqual(expected);
  });

  it('findOne - should return a list for given id', async () => {
    const expected: TaskListItemResponse = {
      id: 1,
      name: 'Test List',
    };

    const actual: TaskListItemResponse = await service.findOne(
      1,
      'Test Workspace',
    );

    expect(actual).toStrictEqual(expected);
  });

  it('findOne - should return null if list with given id is not found', async () => {
    const actual: TaskListItemResponse = await service.findOne(
      0,
      'Test Workspace',
    );

    expect(actual).toBeNull;
  });

  it('update - should update if list exists and new name is unique', async () => {
    const dto: UpdateTaskListDto = {
      id: 1,
      name: 'Test List 123123',
    };

    const expected: TaskListItemResponse = {
      id: 1,
      name: 'Test List 123123',
    };

    const actual: TaskListItemResponse = await service.update(dto);

    expect(actual).toStrictEqual(expected);
  });

  it('update - should fail if list with given id does not exist', async () => {
    const dto: UpdateTaskListDto = {
      id: 0,
      name: 'Test List 123123',
    };

    await expect(async () => {
      await service.update(dto).catch(err => {
        throw err;
      });
    }).rejects.toThrow(BadRequestException);
  });

  it('update - should fail if new name is not unique', async () => {
    const dto: UpdateTaskListDto = {
      id: 1,
      name: 'Test List',
    };

    await expect(async () => {
      await service.update(dto).catch(err => {
        throw err;
      });
    }).rejects.toThrow(BadRequestException);
  });

  it('remove - should fail if taskList with given id does not exist', async () => {
    await expect(async () => {
      await service.remove(0);
    }).rejects.toThrow(BadRequestException);
  });

  it('remove - should remove if taskList with given id exists', async () => {
    await expect(service.remove(1)).resolves.not.toThrow();
  });
});
