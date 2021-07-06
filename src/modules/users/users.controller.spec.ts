import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserDto } from './dto/register-user.dto';
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
                  if (!dto) {
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

  it('register - should throw for empty body', async () => {
    const dto: RegisterUserDto = null;

    expect(async () => {
      await controller.register(dto);
    }).rejects.toThrow(HttpException);
  });
});
