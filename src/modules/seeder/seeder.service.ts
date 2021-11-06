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
import { v4 as uuidv4 } from 'uuid';

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

  async seed(): Promise<void> {
    const { workspaces, users } = await this.createUsersWithWorkspaces();
    const { taskLists } = await this.createTaskLists(workspaces);
    await this.createTasks(taskLists, users);
    await this.createChatroom(users);
    await this.createCalls(users);
    await this.createGames(workspaces);
  }

  async removeAll() {
    await this.gameDataRepository.delete({});
    await this.gameResultRepository.delete({});
    await this.gameRepository.delete({});
    await this.messageRepository.delete({});
    await this.userChatroomsRepository.delete({});
    await this.chatroomRepository.delete({});
    await this.userWorkspaceRepository.delete({});
    await this.userRepository.delete({});
    await this.callRepository.delete({});
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
          '$2b$10$ve/XjMij6/6d12hAO030y.nv6rGtVNhV0VI4i8yD1NPnugbZ217r6', // Qwerty123!
      },
      {
        email: 'test1@test.net',
        firstName: 'Andrew',
        lastName: 'Smith',
        isActive: true,
        passwordHash:
          '$2b$10$ve/XjMij6/6d12hAO030y.nv6rGtVNhV0VI4i8yD1NPnugbZ217r6', // Qwerty123!
      },

      {
        email: 'test2@test.net',
        firstName: 'Janet',
        lastName: 'Jackson',
        isActive: true,
        passwordHash:
          '$2b$10$ve/XjMij6/6d12hAO030y.nv6rGtVNhV0VI4i8yD1NPnugbZ217r6', // Qwerty123!
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

    const dbUserWorkspaces = await this.userWorkspaceRepository.save(
      userWorkspaces,
    );

    return {
      workspaces: dbWorkspaces,
      users: dbUsers,
      userWorkspaces: dbUserWorkspaces,
    };
  }

  private async createTaskLists(workspaces: Workspace[]) {
    const taskLists: Partial<TaskList>[] = [
      {
        name: 'Task List 1',
        workspace: workspaces[0],
      },
      {
        name: 'Task List 2',
        workspace: workspaces[0],
      },
    ];

    const dbTaskLists = await this.taskListRepository.save(taskLists);

    return { taskLists: dbTaskLists };
  }

  private async createTasks(taskLists: TaskList[], users: User[]) {
    const currentDate = new Date();
    const date7DaysAfter = new Date();
    date7DaysAfter.setDate(date7DaysAfter.getDate() + 7);

    const tasks: Partial<Task>[] = [
      {
        name: 'Test task 1',
        description: 'Test task 1 description',
        startDate: currentDate,
        finishDate: date7DaysAfter,
        taskList: taskLists[0],
        users: [users[0], users[1]],
      },
      {
        name: 'Test task 2',
        description: 'Test task 2 description',
        startDate: currentDate,
        finishDate: date7DaysAfter,
        taskList: taskLists[1],
        users: [users[0]],
      },
    ];

    const dbTasks = await this.taskRepository.save(tasks);

    return { tasks: dbTasks };
  }

  private async createChatroom(users: User[]) {
    const currentDate = new Date();

    const chatrooms: Partial<Chatroom>[] = [
      {
        name: 'Test chatroom',
      },
    ];

    const dbChatrooms = await this.chatroomRepository.save(chatrooms);

    const messages: Partial<Message>[] = [
      {
        chatroom: dbChatrooms[0],
        content: 'Test message 1',
        user: users[0],
        sendTime: currentDate,
        filePath: '',
      },
      {
        chatroom: dbChatrooms[0],
        content: 'Test message 2',
        user: users[1],
        sendTime: currentDate,
        filePath: '',
      },
    ];

    const dbMessages = await this.messageRepository.save(messages);

    const userChatrooms: Partial<UserChatrooms>[] = [
      {
        chatroom: dbChatrooms[0],
        chatroomId: dbChatrooms[0].id,
        user: users[0],
        userId: users[0].id,
      },
      {
        chatroom: dbChatrooms[0],
        chatroomId: dbChatrooms[0].id,
        user: users[1],
        userId: users[1].id,
      },
    ];

    const dbUserChatrooms = await this.userChatroomsRepository.save(
      userChatrooms,
    );

    dbChatrooms[0].messages = dbMessages;
    dbChatrooms[0].userChatrooms = dbUserChatrooms;
    dbChatrooms.forEach(async dbChat => {
      await this.chatroomRepository.update(dbChat.id, dbChat);
    });

    return {
      chatrooms: dbChatrooms,
      messages: dbMessages,
      userChatrooms: dbUserChatrooms,
    };
  }

  private async createCalls(users: User[]) {
    const currentDate = new Date();
    const date2HoursAfter = new Date();
    date2HoursAfter.setHours(date2HoursAfter.getHours() + 2);

    const calls: Partial<Call>[] = [
      {
        name: 'Test call',
        generatedCode: uuidv4(),
        users: [users[0], users[1]],
        startDate: currentDate,
        finishDate: date2HoursAfter,
      },
    ];

    const dbCalls = await this.callRepository.save(calls);

    return { calls: dbCalls };
  }

  private async createGames(workspaces: Workspace[]) {
    const games: Partial<Game>[] = [
      {
        name: 'Quiz',
        workspace: workspaces[0],
        filepath: '',
      },
    ];

    const dbGames = await this.gameRepository.save(games);

    const gameDatas: Partial<GameData>[] = [
      {
        game: dbGames[0],
        data: {
          question: 'What does NPM stand for?',
          answers: [
            'New Personal Monkey',
            'Node Package Manager',
            'Neverending Pocket Money',
            'Nice Pretty Mice',
          ],
          correctAnswerIndex: 1,
        },
      },
      {
        game: dbGames[0],
        data: {
          question: 'Which band was Freddie Mercury a member of?',
          answers: ['Megadeth', 'Pantera', 'Black Sabbath', 'Queen'],
          correctAnswerIndex: 3,
        },
      },
    ];

    const dbGameDatas = await this.gameDataRepository.save(gameDatas);

    return {
      games: dbGames,
      gameDatas: dbGameDatas,
    };
  }
}
