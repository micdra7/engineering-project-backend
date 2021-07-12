import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';
import { User } from './entities/user.entity';
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
        { provide: getRepositoryToken(User), useClass: Repository },
        {
          provide: getRepositoryToken(UserWorkspaces),
          useClass: Repository,
        },
        { provide: Connection, useFactory: mockConnection },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    connection = module.get<Connection>(Connection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
