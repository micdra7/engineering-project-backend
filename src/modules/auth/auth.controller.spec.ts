import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { Role } from '../workspaces/entities/role.enum';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticateResponse } from './response/authenticate.response';

describe('AuthController', () => {
  let controller: AuthController;

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
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
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
});
