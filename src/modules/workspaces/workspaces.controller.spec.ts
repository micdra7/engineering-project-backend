import { Test, TestingModule } from '@nestjs/testing';
import { Workspace } from './entities/workspace.entity';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';

describe('WorkspacesController', () => {
  let controller: WorkspacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspacesController],
      providers: [
        {
          provide: WorkspacesService,
          useValue: {
            findByName: jest
              .fn()
              .mockImplementation((name: string): Promise<Workspace> => {
                if (name === 'Already in use') {
                  return Promise.resolve({
                    id: 1,
                    name: 'Already in use',
                    userWorkspaces: null,
                    taskLists: null,
                    games: null,
                    isDefault: false,
                  });
                }

                return Promise.resolve(undefined);
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkspacesController>(WorkspacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
