import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Call,
      Chatroom,
      Message,
      UserChatrooms,
      Game,
      GameData,
      GameResult,
      Task,
      TaskList,
      User,
      UserWorkspaces,
      Workspace,
    ]),
  ],
})
export class SeederModule {}
