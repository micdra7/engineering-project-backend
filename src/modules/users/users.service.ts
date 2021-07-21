import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserWorkspacesResponse } from '../workspaces/responses/userWorkspaces.response';
import { UpdateUserResponse } from './response/update-user.response';
import * as bcrypt from 'bcrypt';
import { PaginationResponse } from 'src/utils/pagination.response';
import { UsersListResponse } from './response/users-list.response';
import { Role } from '../workspaces/entities/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserWorkspaces)
    private userWorkspacesRepository: Repository<UserWorkspaces>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findOneInWorkspace(
    id: number,
    workspaceName: string,
  ): Promise<UsersListResponse> {
    const user = await this.userRepository.findOne(id);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      role: (await this.getUserWorkspaces(id)).filter(
        w => w.workspaceName === workspaceName,
      )[0].role,
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    workspaceName?: string,
  ): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const emailValid =
      user.email === updateUserDto.email
        ? true
        : !(await this.findByEmail(updateUserDto.email));

    if (!emailValid) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedUser: {
      email: string;
      firstName: string;
      lastName: string;
      passwordHash?: string;
    } = {
      email: updateUserDto.email,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
    };

    if (updateUserDto.password && updateUserDto.password.trim() !== '') {
      updatedUser.passwordHash = await bcrypt.hash(
        updateUserDto.password,
        this.configService.get<number>('saltOrRounds'),
      );
    }

    this.userRepository.update({ id }, updatedUser);

    if (
      !!workspaceName &&
      (updateUserDto.role === 0 || updateUserDto.role === 1)
    ) {
      const userWorkspaces = await this.getUserWorkspaces(id);
      const currentWorkspace = userWorkspaces.filter(
        w => w.workspaceName === workspaceName,
      )[0];

      const userWorkspaceEntry = await this.userWorkspacesRepository.findOne({
        where: { workspaceId: currentWorkspace.id, userId: id },
      });

      this.userWorkspacesRepository.update(userWorkspaceEntry.id, {
        role: updateUserDto.role as Role,
      });
    }

    return {
      id,
      email: updateUserDto.email,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      workspaces: await this.getUserWorkspaces(id),
    };
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

  async getAllWithPagination(
    workspaceName: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<UsersListResponse>> {
    const [items, count] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userWorkspaces', 'userWorkspaces')
      .innerJoinAndSelect('userWorkspaces.workspace', 'workspace')
      .where('workspace.name = :workspaceName', {
        workspaceName,
      })
      .orderBy('user.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const meta = {
      currentPage: page,
      itemCount: limit,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    };

    return {
      data: items.map(val => ({
        id: val.id,
        email: val.email,
        firstName: val.firstName,
        lastName: val.lastName,
        isActive: val.isActive,
        role: val.userWorkspaces.filter(
          w => w.workspace.name === workspaceName,
        )[0].role,
      })),
      meta,
    };
  }
}
