import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockConnection = () => ({
    transaction: jest.fn(),
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
        { provide: getRepositoryToken(Workspace), useClass: Repository },
        { provide: Connection, useFactory: mockConnection },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
