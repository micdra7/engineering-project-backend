import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateWorkspaceDto } from '../workspaces/dto/create-workspace.dto';
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterUserResponse } from './response/register-user.response';
import { Role } from '../workspaces/entities/role.enum';
import { UserWorkspacesResponse } from '../workspaces/responses/userWorkspaces.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private connection: Connection,
    private readonly configService: ConfigService,
    @InjectRepository(UserWorkspaces)
    private userWorkspacesRepository: Repository<UserWorkspaces>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<RegisterUserResponse | null> {
    let result: RegisterUserResponse = null;

    const user: CreateUserDto = {
      email: registerUserDto.email,
      firstName: registerUserDto.firstName,
      lastName: registerUserDto.lastName,
      password: registerUserDto.password,
    };

    const workspace: CreateWorkspaceDto = {
      name: registerUserDto.workspaceName,
    };

    await this.connection.transaction(async manager => {
      const dbUser: User = manager.create(User, {
        ...user,
        passwordHash: await bcrypt.hash(
          user.password,
          this.configService.get<number>('saltOrRounds'),
        ),
      });
      const dbWorkspace: Workspace = manager.create(Workspace, workspace);

      await manager.save(dbUser);
      await manager.save(dbWorkspace);

      const dbUserWorkspace: UserWorkspaces = manager.create(UserWorkspaces, {
        userId: dbUser.id,
        user: dbUser,
        workspaceId: dbWorkspace.id,
        workspace: dbWorkspace,
        role: Role.Admin,
      });

      await manager.save(dbUserWorkspace);

      result = {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        isActive: true,
        workspace: {
          id: dbWorkspace.id,
          name: dbWorkspace.name,
        },
      };
    });

    return result;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserWorkspaces(userId: number): Promise<UserWorkspacesResponse[]> {
    const userWorkspaces = await this.userWorkspacesRepository.find({
      where: { userId },
      relations: ['workspace'],
    });

    return userWorkspaces.map(uw => {
      return {
        id: uw.workspaceId,
        role: uw.role,
        workspaceName: uw.workspace.name,
        isDefault: uw.workspace.isDefault,
      };
    });
  }
}
