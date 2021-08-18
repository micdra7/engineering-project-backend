import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/taskList.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {},
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

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create - should create task', async () => {});

  it('findAll - should return a list of all tasks (with pagination)', async () => {});

  it('findOne - should return a task for given id', async () => {});

  it('findOne - should return null if task with given id is not found', async () => {});

  it('update - should update task', async () => {});

  it('remove - should remove if task with given id exists', async () => {});

  it('remove - should fail if task with given id does not exist', async () => {});

  it('changeList - should change list if target one exists', async () => {});

  it('changeList - should fail if target one does not exist', async () => {});

  it('updateStatus - should update status of subtask', async () => {});

  it('updateStatus - should fail if task is not a subtask', async () => {});
});
