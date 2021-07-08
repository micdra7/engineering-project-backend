import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { AuthenticateUserResponse } from './response/authenticate-user.response';
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

  it('register - should create and assign user to workspace', async () => {
    const dto: RegisterUserDto = {
      email: 'test@test.net',
      firstName: 'John',
      lastName: 'Doe',
      password: 'MyVerySecretPassword123$',
      workspaceName: 'Test workspace',
    };

    const expectedResult: RegisterUserResponse = {
      id: 1,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      isActive: true,
      workspace: {
        id: 1,
        name: dto.workspaceName,
      },
    };

    const actualResult: RegisterUserResponse = await controller.register(dto);

    expect(usersService.register).toBeCalled();
    expect(actualResult).toEqual(expectedResult);
  });

  it('register - should throw for empty (null | undefined) body', async () => {
    let dto: RegisterUserDto = null;

    expect(async () => {
      await controller.register(dto);
    }).rejects.toThrow(HttpException);

    dto = undefined;

    expect(async () => {
      await controller.register(dto);
    }).rejects.toThrow(HttpException);
  });

  it('register - should throw if email is in use', async () => {
    const dto: RegisterUserDto = {
      email: 'alreadyInUse@test.net',
      firstName: 'John',
      lastName: 'Doe',
      password: 'MyVerySecretPassword123$',
      workspaceName: 'Test workspace',
    };

    expect(async () => {
      await controller.register(dto);
    }).rejects.toThrow(HttpException);
  });

  it('register - should throw if workspace name is in use', async () => {
    const dto: RegisterUserDto = {
      email: 'test@test.net',
      firstName: 'John',
      lastName: 'Doe',
      password: 'MyVerySecretPassword123$',
      workspaceName: 'Already in use',
    };

    expect(async () => {
      await controller.register(dto);
    }).rejects.toThrow(HttpException);
  });

  it('authenticate - should throw for empty (null | undefined) body', async () => {
    let dto: AuthenticateUserDto = null;

    expect(async () => {
      await controller.authenticate(dto);
    }).rejects.toThrow(HttpException);

    dto = undefined;

    expect(async () => {
      await controller.authenticate(dto);
    }).rejects.toThrow(HttpException);
  });

  it('authenticate - should throw for invalid credentials', async () => {
    const dto: AuthenticateUserDto = {
      email: 'test@test.net',
      password: 'QWE12345rty$a',
    };

    expect(async () => {
      await controller.authenticate(dto);
    }).rejects.toThrow(HttpException);
  });

  it('authenticate - should return access and refresh tokens for valid credentials', async () => {
    const dto: AuthenticateUserDto = {
      email: 'test@test.net',
      password: 'QWE12345rty$',
    };

    const result: AuthenticateUserResponse = await controller.authenticate(dto);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });
});
