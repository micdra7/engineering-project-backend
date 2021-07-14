import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { Role } from '../workspaces/entities/role.enum';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthenticateResponse } from './response/authenticate.response';
import { RefreshResponse } from './response/refresh.response';
import { RegisterResponse } from './response/register.response';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockImplementation(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              (user: User): Promise<AuthenticateResponse> => {
                return Promise.resolve({
                  accessToken: 'accessToken',
                  refreshToken: 'refreshToken',
                  workspaces: [
                    {
                      id: 1,
                      isDefault: true,
                      workspaceName: 'Test Workspace',
                      role: Role.Admin,
                    },
                  ],
                });
              },
            ),
            register: jest
              .fn()
              .mockImplementation(
                (registerDto: RegisterDto): Promise<RegisterResponse> => {
                  return Promise.resolve({
                    id: 1,
                    email: registerDto.email,
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                    isActive: true,
                    workspace: {
                      id: 1,
                      name: registerDto.workspaceName,
                    },
                  });
                },
              ),
            refresh: jest
              .fn()
              .mockImplementation(
                (dto: RefreshDto): Promise<RefreshResponse> => {
                  if (dto.refreshToken === 'validToken') {
                    return Promise.resolve({
                      accessToken: 'newAccessToken',
                      refreshToken: 'newRefreshToken',
                    });
                  }

                  throw new HttpException(
                    'Invalid token',
                    HttpStatus.BAD_REQUEST,
                  );
                },
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    const result: AuthenticateResponse = await controller.login(dto);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result).toHaveProperty('workspaces');

    expect(result.workspaces.length).toBeGreaterThanOrEqual(1);
  });

  it('register - should create and assign user to workspace', async () => {
    const dto: RegisterDto = {
      email: 'test@test.net',
      firstName: 'John',
      lastName: 'Doe',
      password: 'MyVerySecretPassword123$',
      workspaceName: 'Test workspace',
    };

    const expectedResult: RegisterResponse = {
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

    const actualResult: RegisterResponse = await controller.register(dto);

    expect(authService.register).toBeCalled();
    expect(actualResult).toEqual(expectedResult);
  });

  it('refresh - should return new access and refresh tokens', async () => {
    const dto: RefreshDto = {
      email: 'test@test.net',
      accessToken: '',
      refreshToken: 'validToken',
    };

    const expectedResult: RefreshResponse = {
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
    };

    const actualResult: RefreshResponse = await controller.refresh(dto);

    expect(authService.refresh).toBeCalled();
    expect(actualResult).toEqual(expectedResult);
  });
});
