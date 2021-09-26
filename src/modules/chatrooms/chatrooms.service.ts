import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from '../../utils/pagination.response';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { Chatroom } from './entities/chatroom.entity';
import { Message } from './entities/message.entity';
import { UserChatrooms } from './entities/userChatrooms.entity';
import { ChatroomResponse } from './response/chatroom.response';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponse } from './response/message.response';

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

  async create(dto: CreateChatroomDto): Promise<ChatroomResponse> {
    let chatroom = this.chatroomRepository.create({ name: dto.name });
    chatroom = await this.chatroomRepository.save(chatroom);

    const users = await this.userRepository.find({
      where: { id: In(dto.assignedUserIds) },
    });

    const userChatrooms: Partial<UserChatrooms>[] = users.map(user => ({
      userId: user.id,
      user,
      chatroomId: chatroom.id,
      chatroom,
    }));

    await this.userChatroomsRepository.save(userChatrooms);

    return {
      id: chatroom.id,
      name: chatroom.name,
      users: users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        email: user.email,
      })),
    };
  }

  async findAll(
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<ChatroomResponse>> {
    const [items, count] = await this.chatroomRepository
      .createQueryBuilder('chatroom')
      .innerJoinAndSelect('chatroom.userChatrooms', 'userChatrooms')
      .innerJoinAndSelect('userChatrooms.user', 'user')
      .orderBy('chatroom.id', 'ASC')
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
      data: items
        .filter(item =>
          item.userChatrooms.some(
            userChatroom => userChatroom.userId === userId,
          ),
        )
        .map(item => ({
          id: item.id,
          name: item.name,
          users: item.userChatrooms
            .map(userChatroom => userChatroom.user)
            .flat(),
        })),
      meta,
    };
  }

  async findOne(id: number): Promise<ChatroomResponse> {
    const chatroom = await this.chatroomRepository.findOne({
      where: { id },
      relations: ['userChatrooms', 'userChatrooms.user'],
    });

    return {
      id: chatroom.id,
      name: chatroom.name,
      users: chatroom.userChatrooms
        .map(userChatroom => userChatroom.user)
        .flat(),
    };
  }

  async update(dto: UpdateChatroomDto): Promise<ChatroomResponse> {
    const chatroom = await this.chatroomRepository.findOne({
      where: { id: dto.id },
      relations: ['userChatrooms', 'userChatrooms.user'],
    });
    chatroom.name = dto.name;

    const users = await this.userRepository.find({
      where: { id: In(dto.assignedUserIds) },
    });

    let userChatrooms = chatroom.userChatrooms;
    userChatrooms.forEach((userChatroom, index) => {
      if (index >= users.length) {
        userChatroom.id = 0;
      } else {
        userChatroom.userId = users[index].id;
      }
    });
    userChatrooms = userChatrooms.filter(userChatroom => userChatroom.id !== 0);

    const newUserChatrooms: Partial<UserChatrooms>[] = [];

    if (userChatrooms.length < users.length) {
      for (let i = userChatrooms.length; i < users.length; i += 1) {
        newUserChatrooms.push({
          id: 0,
          chatroom,
          chatroomId: chatroom.id,
          user: users[i],
          userId: users[i].id,
        });
      }
    }

    await this.userChatroomsRepository.save(userChatrooms);
    if (newUserChatrooms.length > 0) {
      await this.userChatroomsRepository.save(newUserChatrooms);
    }

    return {
      id: chatroom.id,
      name: chatroom.name,
      users: [
        ...userChatrooms.map(uc => uc.user).flat(),
        ...newUserChatrooms.map(uc => uc.user).flat(),
      ],
    };
  }

  async saveMessage(dto: CreateMessageDto): Promise<MessageResponse> {
    const user = await this.userRepository.findOne(dto.userId);
    const chatroom = await this.chatroomRepository.findOne(dto.chatroomId);

    const message = await this.messageRepository.save({
      content: dto.content,
      user,
      chatroom,
      filePath: '',
      sendTime: new Date(),
    });

    return {
      id: message.id,
      content: message.content,
      sendTime: message.sendTime,
      userId: dto.userId,
      userEmail: user.email,
      chatroomId: dto.chatroomId,
      chatroomName: chatroom.name,
    };
  }

  async findMessages(
    chatroomId: number,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<MessageResponse>> {
    console.log(chatroomId, page, limit);
    const [items, count] = await this.messageRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.user', 'user')
      .innerJoinAndSelect('message.chatroom', 'chatroom')
      .where('chatroom.id = :chatroomId', { chatroomId })
      .orderBy('message.sendTime', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    console.log('dupa');
    const meta = {
      currentPage: page,
      itemCount: limit,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    };

    return {
      data: items.map(item => ({
        id: item.id,
        content: item.content,
        sendTime: item.sendTime,
        userId: item.user.id,
        userEmail: item.user.email,
        chatroomId: item.chatroom.id,
        chatroomName: item.chatroom.name,
      })),
      meta,
    };
  }
}
