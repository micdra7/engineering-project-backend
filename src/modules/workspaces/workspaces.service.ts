import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateUserResponse } from '../users/response/update-user.response';
import { UsersService } from '../users/users.service';
import { AddToWorkspaceDto } from './dto/add-to-workspace.dto';
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

  async addUserToWorkspace(
    workspaceName: string,
    dto: AddToWorkspaceDto,
  ): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findOne({
      relations: ['userWorkspaces'],
      where: { email: dto.email },
    });
    const workspace = await this.workspaceRepository.findOne({
      where: { name: workspaceName },
      relations: ['userWorkspaces'],
    });

    if (user.userWorkspaces.some(uw => uw.workspaceId === workspace.id)) {
      throw new BadRequestException('User already belongs to this workspace');
    }

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
      workspaces: await this.usersService.findUserWorkspaces(user.id),
    };
  }

  async findByName(name: string): Promise<Workspace> {
    return this.workspaceRepository.findOne({ where: { name } });
  }
}
