import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateUserResponse } from '../users/response/update-user.response';
import { UsersService } from '../users/users.service';
import { AddToWorkspaceDto } from './dto/add-to-workspace.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Role } from './entities/role.enum';
import { UserWorkspaces } from './entities/userWorkspaces.entity';
import { Workspace } from './entities/workspace.entity';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserWorkspaces)
    private userWorkspacesRepository: Repository<UserWorkspaces>,
    private usersService: UsersService,
  ) {}

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return 'This action adds a new workspace';
  }

  findAll() {
    return `This action returns all workspaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  async addUserToWorkspace(
    workspaceName: string,
    dto: AddToWorkspaceDto,
  ): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    const workspace = await this.workspaceRepository.findOne({
      where: { name: workspaceName },
      relations: ['userWorkspaces'],
    });

    const userWorkspaceEntity = this.userWorkspacesRepository.create({
      role: dto.role,
      userId: user.id,
      workspaceId: workspace.id,
    });

    this.userWorkspacesRepository.save(userWorkspaceEntity);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      workspaces: await this.usersService.getUserWorkspaces(user.id),
    };
  }

  async findByName(name: string): Promise<Workspace> {
    return this.workspaceRepository.findOne({ where: { name } });
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
