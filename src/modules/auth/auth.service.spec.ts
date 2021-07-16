import { Test, TestingModule } from '@nestjs/testing';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthService } from './auth.service';
import { AuthenticateResponse } from './response/authenticate.response';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserWorkspacesResponse } from '../workspaces/responses/userWorkspaces.response';
import { Role } from '../workspaces/entities/role.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { HttpException } from '@nestjs/common';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { Connection } from 'typeorm';
import { RefreshDto } from './dto/refresh.dto';
import { RefreshResponse } from './response/refresh.response';
import { SwitchWorkspaceDto } from './dto/switch-workspace.dto';

describe('AuthService', () => {
  let service: AuthService;
  let connection: Connection;
  const mockConfigService = () => ({
    get(key: string) {
      switch (key) {
        case 'jwt.secret':
          return 'fabjisdbfiujqhifsdf';
        case 'jwt.validFor':
          return '2h';
        case 'jwt.refreshValidFor':
          return '7d';
        case 'saltOrRounds':
          return 10;
      }
    },
  });
  const mockManager = {
    create: jest.fn().mockReturnValue({}),
    save: jest.fn().mockReturnValue({}),
  };
  const mockConnection = () => ({
    transaction: jest.fn().mockImplementation(async callback => {
      await callback(mockManager);
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest
              .fn()
              .mockImplementation((email: string): Promise<User> => {
                if (email === 'test@test.net') {
                  return Promise.resolve({
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'test@test.net',
                    passwordHash:
                      '$2b$10$5pH0h0KHCSE5Yt0dx6mXRO5l1PgTLNdaxjPwPriRQeMjACdRKq47e',
                    isActive: true,
                    calls: null,
                    gameResults: null,
                    messages: null,
                    tasks: null,
                    userChatrooms: null,
                    userWorkspaces: null,
                  });
                }

                return Promise.resolve(null);
              }),
            getUserWorkspaces: jest
              .fn()
              .mockImplementation(
                (userId: number): Promise<UserWorkspacesResponse[]> => {
                  if (userId === 1) {
                    return Promise.resolve([
                      {
                        id: 1,
                        role: Role.Admin,
                        workspaceName: 'Test Workspace',
                        isDefault: true,
                      },
                      {
                        id: 2,
                        role: Role.User,
                        workspaceName: 'Test Workspace 2',
                        isDefault: false,
                      },
                    ]);
                  }

                  return Promise.resolve([]);
                },
              ),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockImplementation((): Promise<string> => {
              return Promise.resolve('jwt');
            }),
            verify: jest.fn().mockImplementation(
              (
                token: string,
              ): {
                email: string;
                id: number;
                role: number;
                wsp: string;
              } => {
                if (token === '') {
                  throw new Error('Invalid token');
                }

                return {
                  email: 'test@test.net',
                  id: 1,
                  role: 1,
                  wsp: 'Test Workspace',
                };
              },
            ),
          },
        },
        { provide: ConfigService, useFactory: mockConfigService },
        {
          provide: WorkspacesService,
          useValue: {
            findByName: jest
              .fn()
              .mockImplementation((name: string): Promise<Workspace> => {
                if (name === 'Test Workspace') {
                  return Promise.resolve({
                    id: 1,
                    name: 'Test Workspace',
                    isDefault: true,
                    games: null,
                    taskLists: null,
                    userWorkspaces: null,
                  });
                }
              }),
          },
        },
        { provide: Connection, useFactory: mockConnection },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    connection = module.get<Connection>(Connection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validateUser - should return user if one is found', async () => {
    const dto: AuthLoginDto = {
      email: 'test@test.net',
      password: 'QWE12345rty$',
    };

    const user = await service.validateUser(dto);

    expect(user).not.toBeNull();
  });

  it('validateUser - should return null if user is not found', async () => {
    const dto: AuthLoginDto = {
      email: 'test12554632315@test.net',
      password: 'QWE12345rty$',
    };

    const user = await service.validateUser(dto);

    expect(user).toBeNull();
  });

  it('login - should return access & refresh tokens with users workspaces', async () => {
    const dto: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      passwordHash: 'QWE12345rty$',
      isActive: true,
      calls: null,
      gameResults: null,
      messages: null,
      tasks: null,
      userChatrooms: null,
      userWorkspaces: null,
    };

    const result: AuthenticateResponse = await service.login(dto);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result).toHaveProperty('workspaces');

    expect(result.workspaces.length).toBeGreaterThanOrEqual(1);
  });

  it('register - should create and assign user to workspace', async () => {
    const dto: RegisterDto = {
      email: 'test1@test.net',
      firstName: 'John',
      lastName: 'Doe',
      password: 'MyVerySecretPassword123$',
      workspaceName: 'Test1 workspace',
    };

    await service.register(dto);

    expect(connection.transaction).toHaveBeenCalled();
    expect(mockManager.create).toBeCalledTimes(3);
    expect(mockManager.save).toBeCalledTimes(3);
  });

  it('register - should throw if workspace name is in use', async () => {
    const dto: RegisterDto = {
      email: 'test@test.net',
      firstName: 'John',
      lastName: 'Doe',
      password: 'MyVerySecretPassword123$',
      workspaceName: 'Already in use',
    };

    expect(async () => {
      await service.register(dto);
    }).rejects.toThrow(HttpException);
  });

  it('refresh - should throw if token is invalid', async () => {
    const loginDto: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      passwordHash: 'QWE12345rty$',
      isActive: true,
      calls: null,
      gameResults: null,
      messages: null,
      tasks: null,
      userChatrooms: null,
      userWorkspaces: null,
    };

    const loginResult = await service.login(loginDto);

    const dto: RefreshDto = {
      email: loginDto.email,
      accessToken: loginResult.accessToken,
      refreshToken: ``,
    };

    expect(async () => {
      await service.refresh(dto);
    }).rejects.toThrow(HttpException);
  });

  it('refresh - should throw if user is not found', async () => {
    const loginDto: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      passwordHash: 'QWE12345rty$',
      isActive: true,
      calls: null,
      gameResults: null,
      messages: null,
      tasks: null,
      userChatrooms: null,
      userWorkspaces: null,
    };

    const loginResult = await service.login(loginDto);

    const dto: RefreshDto = {
      email: `abc123${loginDto.email}`,
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
    };

    expect(async () => {
      await service.refresh(dto);
    }).rejects.toThrow(HttpException);
  });

  it('refresh - should return new access & refresh tokens on success', async () => {
    const loginDto: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      passwordHash: 'QWE12345rty$',
      isActive: true,
      calls: null,
      gameResults: null,
      messages: null,
      tasks: null,
      userChatrooms: null,
      userWorkspaces: null,
    };

    const loginResult = await service.login(loginDto);

    const dto: RefreshDto = {
      email: loginDto.email,
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
    };

    const result: RefreshResponse = await service.refresh(dto);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('switch - should throw if tokens are invalid', async () => {
    const loginDto: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      passwordHash: 'QWE12345rty$',
      isActive: true,
      calls: null,
      gameResults: null,
      messages: null,
      tasks: null,
      userChatrooms: null,
      userWorkspaces: null,
    };

    const loginResult = await service.login(loginDto);
    const defaultWorkspace = loginResult.workspaces.filter(w => w.isDefault)[0];

    const dto: SwitchWorkspaceDto = {
      accessToken: '',
      refreshToken: '',
      workspaceName: defaultWorkspace.workspaceName,
      workspaceId: defaultWorkspace.id,
    };

    expect(async () => {
      await service.switchWorkspace(1, dto);
    }).rejects.toThrow(HttpException);
  });

  it('switch - should throw if workspace is not found', async () => {
    const loginDto: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      passwordHash: 'QWE12345rty$',
      isActive: true,
      calls: null,
      gameResults: null,
      messages: null,
      tasks: null,
      userChatrooms: null,
      userWorkspaces: null,
    };

    const loginResult = await service.login(loginDto);
    const defaultWorkspace = loginResult.workspaces.filter(w => w.isDefault)[0];

    const dto: SwitchWorkspaceDto = {
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
      workspaceName: defaultWorkspace.workspaceName,
      workspaceId: 0,
    };

    expect(async () => {
      await service.switchWorkspace(1, dto);
    }).rejects.toThrow(HttpException);
  });

  it('switch - should throw if user does not belong to workspace', async () => {
    const loginDto: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      passwordHash: 'QWE12345rty$',
      isActive: true,
      calls: null,
      gameResults: null,
      messages: null,
      tasks: null,
      userChatrooms: null,
      userWorkspaces: null,
    };

    const loginResult = await service.login(loginDto);
    const defaultWorkspace = loginResult.workspaces.filter(w => w.isDefault)[0];

    const dto: SwitchWorkspaceDto = {
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
      workspaceName: defaultWorkspace.workspaceName,
      workspaceId: 2,
    };

    expect(async () => {
      await service.switchWorkspace(1, dto);
    }).rejects.toThrow(HttpException);
  });

  it('switch - should throw if user tries to switch to workspace if already in it', async () => {
    const loginDto: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      passwordHash: 'QWE12345rty$',
      isActive: true,
      calls: null,
      gameResults: null,
      messages: null,
      tasks: null,
      userChatrooms: null,
      userWorkspaces: null,
    };

    const loginResult = await service.login(loginDto);
    const defaultWorkspace = loginResult.workspaces.filter(w => w.isDefault)[0];

    const dto: SwitchWorkspaceDto = {
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
      workspaceName: defaultWorkspace.workspaceName,
      workspaceId: defaultWorkspace.id,
    };

    expect(async () => {
      await service.switchWorkspace(1, dto);
    }).rejects.toThrow(HttpException);
  });

  it('switch - should succeed for valid dto', async () => {
    const loginDto: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.net',
      passwordHash: 'QWE12345rty$',
      isActive: true,
      calls: null,
      gameResults: null,
      messages: null,
      tasks: null,
      userChatrooms: null,
      userWorkspaces: null,
    };

    const loginResult = await service.login(loginDto);

    const dto: SwitchWorkspaceDto = {
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
      workspaceName: loginResult.workspaces.filter(w => !w.isDefault)[0]
        .workspaceName,
      workspaceId: loginResult.workspaces.filter(w => !w.isDefault)[0].id,
    };

    expect(async () => {
      await service.switchWorkspace(1, dto);
    }).rejects.toThrow(HttpException);
  });
});
