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

describe('AuthService', () => {
  let service: AuthService;
  const mockConfigService = () => ({
    get(key: string) {
      switch (key) {
        case 'jwt.secret':
          return 'fabjisdbfiujqhifsdf';
        case 'jwt.validFor':
          return '2h';
        case 'jwt.refreshValidFor':
          return '7d';
      }
    },
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
          },
        },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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
});
