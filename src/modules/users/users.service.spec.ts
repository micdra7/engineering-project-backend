import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserResponse } from './response/update-user.response';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let connection: Connection;
  const mockManager = {
    create: jest.fn().mockReturnValue({}),
    save: jest.fn().mockReturnValue({}),
  };
  const mockConnection = () => ({
    transaction: jest.fn().mockImplementation(async callback => {
      await callback(mockManager);
    }),
  });
  const mockConfigService = () => ({
    get(key: string) {
      switch (key) {
        case 'saltOrRounds':
          return 10;
      }
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest
              .fn()
              .mockImplementationOnce((id: number): Promise<User> => {
                if (id === 1) {
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

                return Promise.resolve(undefined);
              })
              .mockImplementationOnce((...args: any) => {
                if (args?.where?.email === 'test1@test.net') {
                  return Promise.resolve({
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'test1@test.net',
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

                return Promise.resolve(undefined);
              }),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserWorkspaces),
          useValue: {
            find: jest.fn().mockImplementation(() => []),
          },
        },
        { provide: Connection, useFactory: mockConnection },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('update - fails for unknown id', () => {
    const dto: UpdateUserDto = {
      email: `test${Math.random() * 200 + 100}@test.net`,
      firstName: 'Mike',
      lastName: 'Smith',
    };

    expect(async () => {
      await service.update(-1, dto);
    }).rejects.toThrow(HttpException);
  });

  it('update - fails for taken email', () => {
    const dto: UpdateUserDto = {
      email: 'test1@test.net',
      firstName: 'Mike',
      lastName: 'Smith',
    };

    expect(async () => {
      await service.update(1, dto);
    }).rejects.toThrow(HttpException);
  });

  it('update - succeeds for valid dto', async () => {
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
      workspaces: [],
    };

    const result = await service.update(1, dto);

    expect(result).toStrictEqual(expected);
  });
});
