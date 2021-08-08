import { Test, TestingModule } from '@nestjs/testing';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserResponse } from './response/update-user.response';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest
              .fn()
              .mockImplementation((email: string): Promise<User> => {
                if (email === 'alreadyInUse@test.net') {
                  return Promise.resolve({
                    id: 1,
                    email: 'alreadyInUse@test.net',
                    firstName: 'John',
                    lastName: 'Doe',
                    passwordHash:
                      '$2b$10$yXM9THp08pY2bJv1XpFkkuFB5ekMS4NDSUPQqZlh3ZiIT6CmhYpwe',
                    isActive: true,
                    userWorkspaces: null,
                    userChatrooms: null,
                    gameResults: null,
                    tasks: null,
                    messages: null,
                    calls: null,
                  });
                }

                return Promise.resolve(undefined);
              }),
            update: jest.fn().mockImplementation(
              (
                id: number,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                dto: UpdateUserDto,
              ): Promise<UpdateUserResponse> => {
                if (id === 1) {
                  return Promise.resolve({
                    id: 1,
                    email: 'test@test.net',
                    firstName: 'Mike',
                    lastName: 'Smith',
                    workspaces: null,
                  });
                }

                throw new Error();
              },
            ),
          },
        },
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

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('update - successfully updates', async () => {
    const dto: UpdateUserDto = {
      email: 'test@test.net',
      firstName: 'Mike',
      lastName: 'Smith',
    };

    const expected: UpdateUserResponse = {
      id: 1,
      email: 'test@test.net',
      firstName: 'Mike',
      lastName: 'Smith',
      workspaces: null,
    };

    const result: UpdateUserResponse = await controller.update('1', dto, {
      user: { workspaceName: '' },
    });

    expect(usersService.update).toBeCalled();
    expect(result).toStrictEqual(expected);
  });
});
