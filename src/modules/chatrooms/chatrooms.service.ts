import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { Chatroom } from './entities/chatroom.entity';
import { Message } from './entities/message.entity';
import { UserChatrooms } from './entities/userChatrooms.entity';

@Injectable()
export class ChatroomsService {
  constructor(
    @InjectRepository(Chatroom)
    private chatroomRepository: Repository<Chatroom>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(UserChatrooms)
    private userChatroomsRepository: Repository<UserChatrooms>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateChatroomDto) {
    let chatroom = this.chatroomRepository.create({ name: dto.name });
    chatroom = await this.chatroomRepository.save(chatroom);

    const users = await this.userRepository.find({
      where: { id: In(dto.assignedUserIds) },
    });

    const userChatrooms: UserChatrooms[] = [];
    users.forEach(user => {
      userChatrooms.push({
        id: 0,
        user,
        userId: user.id,
        chatroom,
        chatroomId: chatroom.id,
      });
    });
  }

  findAll() {
    return `This action returns all chatrooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatroom`;
  }

  update(id: number, updateChatroomDto: UpdateChatroomDto) {
    return `This action updates a #${id} chatroom`;
  }

  saveMessage() {
    return 'This action saves a new message';
  }

  findMessages() {
    return 'This action returns a list of messages';
  }
}
