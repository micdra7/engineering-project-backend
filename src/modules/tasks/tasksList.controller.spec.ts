import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { TaskList } from './entities/taskList.entity';
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
              if (args?.where?.name === 'Test List') {
                return Promise.resolve({
                  id: 1,
                  name: 'Test List',
                });
              }

              return Promise.resolve(null);
            }),
            create: jest.fn().mockImplementation(({ name }) => {
              return Promise.resolve({
                id: 1,
                name,
              });
            }),
            save: jest.fn().mockImplementation(({ name }) => {
              return Promise.resolve({
                id: 1,
                name,
              });
            }),
          },
        },
        {
          provide: getRepositoryToken(Workspace),
          useValue: {
            findOne: jest.fn().mockImplementation((...args: any) => {
              if (args?.where?.name === 'Test Workspace') {
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
          },
        },
      ],
    }).compile();

    controller = module.get<TasksListsController>(TasksListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
