import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { Task } from './entities/task.entity';
import { TaskList } from './entities/taskList.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
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

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
