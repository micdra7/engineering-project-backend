import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { RegisterUserResponse } from './response/register-user.response';
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
            register: jest
              .fn()
              .mockImplementation(
                (dto: RegisterUserDto): Promise<RegisterUserResponse> => {
                  if (!dto || dto.email === 'alreadyInUse@test.net') {
                    throw new HttpException(
                      'Bad request',
                      HttpStatus.BAD_REQUEST,
                    );
                  }

                  return Promise.resolve({
                    id: 1,
                    email: dto.email,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    isActive: true,
                    workspace: {
                      id: 1,
                      name: dto.workspaceName,
                    },
                  });
                },
              ),
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
});
