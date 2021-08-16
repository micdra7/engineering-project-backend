import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginationResponse } from 'src/utils/pagination.response';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateTaskListDto } from './dto/create-taskList.dto';
import { TaskList } from './entities/taskList.entity';
import { TaskItemResponse } from './response/task-item.response';
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
                args?.[0]?.where?.id === 1
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

    const expected: TaskItemResponse = {
      id: 1,
      name: 'Test List 123',
    };

    const actual: TaskItemResponse = await service.create(
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

  it('findAll - should return a list of all tasks (with pagination)', async () => {
    const expected: PaginationResponse<TaskItemResponse> = {
      data: [{ id: 1, name: 'Test List' }],
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
    const expected: TaskItemResponse = {
      id: 1,
      name: 'Test List',
    };

    const actual: TaskItemResponse = await service.findOne(1, 'Test Workspace');

    expect(actual).toStrictEqual(expected);
  });

  it('findOne - should return null if list with given id is not found', async () => {
    const actual: TaskItemResponse = await service.findOne(0, 'Test Workspace');

    expect(actual).toBeNull;
  });

  // it('update - should update if list exists and new name is unique', () => {});

  // it('update - should fail if list with given id does not exist', () => {});

  // it('update - should fail if new name is not unique', () => {});
});
