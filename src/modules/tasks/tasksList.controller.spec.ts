import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginationResponse } from '../../utils/pagination.response';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateTaskListDto } from './dto/create-taskList.dto';
import { UpdateTaskListDto } from './dto/update-taskList.dto';
import { TaskList } from './entities/taskList.entity';
import { TaskListItemResponse } from './response/taskList-item.response';
import { TasksListsController } from './tasksList.controller';
import { TaskListsService } from './tasksList.service';

describe('TasksListsController', () => {
  let controller: TasksListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksListsController],
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

    controller = module.get<TasksListsController>(TasksListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create - should create a new task list', async () => {
    const dto: CreateTaskListDto = {
      name: 'Test List 123',
    };

    const expected: TaskListItemResponse = {
      id: 1,
      name: 'Test List 123',
    };

    const actual = await controller.create(dto, {
      user: { workspaceName: 'Test Workspace' },
    });

    expect(actual).toStrictEqual(expected);
  });

  it('getAll - returns a list of all task lists', async () => {
    const expected: PaginationResponse<TaskListItemResponse> = {
      data: [{ id: 1, name: 'Test List' }],
      meta: {
        currentPage: 1,
        itemCount: 10,
        totalPages: 1,
        totalItems: 1,
      },
    };

    const actual = await controller.getAll(1, 10, {
      user: { workspaceName: 'Test List' },
    });

    expect(actual).toStrictEqual(expected);
  });

  it('getOne - returns one taskList', async () => {
    const expected: TaskListItemResponse = {
      id: 1,
      name: 'Test List',
    };

    const actual = await controller.getOne('1', {
      user: { workspaceName: 'Test List' },
    });

    expect(actual).toStrictEqual(expected);
  });

  it('update - updates one task', async () => {
    const dto: UpdateTaskListDto = {
      id: 1,
      name: 'Test List 123123',
    };

    const expected: TaskListItemResponse = {
      id: 1,
      name: 'Test List 123123',
    };

    const actual = await controller.update(dto);

    expect(actual).toStrictEqual(expected);
  });

  it('delete - should delete if taskList with given id exists', async () => {
    await expect(controller.delete('1')).resolves.not.toThrow();
  });
});
