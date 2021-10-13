import { Module } from '@nestjs/common';
import { ChatroomsService } from './chatrooms.service';
import { ChatroomsController } from './chatrooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './entities/chatroom.entity';
import { Message } from './entities/message.entity';
import { UserChatrooms } from './entities/userChatrooms.entity';
import { User } from '../users/entities/user.entity';
import { ChatroomsGateway } from './chatrooms.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom, Message, UserChatrooms, User])],
  controllers: [ChatroomsController],
  providers: [ChatroomsService, ChatroomsGateway],
})
export class ChatroomsModule {}
