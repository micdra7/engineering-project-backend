import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateTaskListDto } from './dto/create-taskList.dto';
import { TaskList } from './entities/taskList.entity';
import { CreateTaskListResponse } from './response/create-taskList.response';
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
            findOne: jest.fn().mockImplementation((args: any) => {
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

    const expected: CreateTaskListResponse = {
      id: 1,
      name: 'Test List 123',
    };

    const actual: CreateTaskListResponse = await service.create(
      dto,
      'Test Workspace',
    );

    expect(actual).toStrictEqual(expected);
  });

  // it('create - should fail if list with given name already exists', () => {});

  // it('findAll - should return a list of all tasks (with pagination)', () => {});

  // it('findOne - should return a list for given id', () => {});

  // it('findOne - should return null if list with given id is not found', () => {});

  // it('update - should update if list exists and new name is unique', () => {});

  // it('update - should fail if list with given id does not exist', () => {});

  // it('update - should fail if new name is not unique', () => {});
});
