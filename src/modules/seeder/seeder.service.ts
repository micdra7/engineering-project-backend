import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Call } from '../calls/entities/call.entity';
import { Chatroom } from '../chatrooms/entities/chatroom.entity';
import { Message } from '../chatrooms/entities/message.entity';
import { UserChatrooms } from '../chatrooms/entities/userChatrooms.entity';
import { Game } from '../games/entities/game.entity';
import { GameData } from '../games/entities/gameData.entity';
import { GameResult } from '../games/entities/gameResult.entity';
import { Task } from '../tasks/entities/task.entity';
import { TaskList } from '../tasks/entities/taskList.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../workspaces/entities/role.enum';
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Call) private callRepository: Repository<Call>,
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(UserChatrooms)
    private userChatroomsRepository: Repository<UserChatrooms>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @InjectRepository(GameData)
    private gameDataRepository: Repository<GameData>,
    @InjectRepository(GameResult)
    private gameResultRepository: Repository<GameResult>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(TaskList)
    private taskListRepository: Repository<TaskList>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserWorkspaces)
    private userWorkspaceRepository: Repository<UserWorkspaces>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async seed() {
    await this.createUsersWithWorkspaces();
  }

  async removeAll() {
    await this.gameDataRepository.delete({});
    await this.gameResultRepository.delete({});
    await this.gameRepository.delete({});
    await this.callRepository.delete({});
    await this.messageRepository.delete({});
    await this.chatroomRepository.delete({});
    await this.userChatroomsRepository.delete({});
    await this.userWorkspaceRepository.delete({});
    await this.userRepository.delete({});
    await this.taskRepository.delete({});
    await this.taskListRepository.delete({});
    await this.workspaceRepository.delete({});
  }

  private async createUsersWithWorkspaces() {
    const workspaces: Partial<Workspace>[] = [
      {
        name: 'Test Workspace 1',
        isDefault: true,
      },
      {
        name: 'Test Workspace 2',
      },

      {
        name: 'Test Workspace 3',
        isDefault: true,
      },
    ];

    const users: Partial<User>[] = [
      {
        email: 'test@test.net',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        passwordHash:
          '$2b$10$GRudr7.PxVgaADUihDvShOsYQoB.sV1uoUXFZpEqrrFHYBzz0/ebm', // Qwerty123
      },
      {
        email: 'test1@test.net',
        firstName: 'Andrew',
        lastName: 'Smith',
        isActive: true,
        passwordHash:
          '$2b$10$GRudr7.PxVgaADUihDvShOsYQoB.sV1uoUXFZpEqrrFHYBzz0/ebm', // Qwerty123
      },

      {
        email: 'test2@test.net',
        firstName: 'Janet',
        lastName: 'Jackson',
        isActive: true,
        passwordHash:
          '$2b$10$GRudr7.PxVgaADUihDvShOsYQoB.sV1uoUXFZpEqrrFHYBzz0/ebm', // Qwerty123
      },
    ];

    const dbWorkspaces = await this.workspaceRepository.save(workspaces);
    const dbUsers = await this.userRepository.save(users);

    const userWorkspaces: Partial<UserWorkspaces>[] = [
      {
        role: Role.Admin,
        userId: dbUsers[0].id,
        user: dbUsers[0],
        workspaceId: dbWorkspaces[0].id,
        workspace: dbWorkspaces[0],
      },
      {
        role: Role.Admin,
        userId: dbUsers[0].id,
        user: dbUsers[0],
        workspaceId: dbWorkspaces[1].id,
        workspace: dbWorkspaces[1],
      },
      {
        role: Role.User,
        userId: dbUsers[1].id,
        user: dbUsers[1],
        workspaceId: dbWorkspaces[0].id,
        workspace: dbWorkspaces[0],
      },
      {
        role: Role.Admin,
        userId: dbUsers[2].id,
        user: dbUsers[2],
        workspaceId: dbWorkspaces[2].id,
        workspace: dbWorkspaces[2],
      },
    ];

    await this.userWorkspaceRepository.save(userWorkspaces);
  }
}
