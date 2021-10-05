import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { PaginationResponse } from '../../utils/pagination.response';
import { ChatroomsService } from './chatrooms.service';
import { ChatroomResponse } from './response/chatroom.response';
import { Socket } from 'socket.io';
import { MessageResponse } from './response/message.response';
import { UseGuards } from '@nestjs/common';
import { JwtWsAuthGuard } from '../auth/guard/jwt-ws-auth.guard';

@UseGuards(JwtWsAuthGuard)
@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatroomsGateway {
  constructor(private readonly chatroomsService: ChatroomsService) {}

  @SubscribeMessage('joinAll')
  async handleJoinAll(
    @MessageBody('userId') userId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<PaginationResponse<ChatroomResponse>> {
    const rooms = await this.chatroomsService.findAll(userId, 1, 9999);
    client.join(rooms.data.map(room => room.name));

    return rooms;
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody('userId') userId: number,
    @MessageBody('chatroomId') chatroomId: number,
    @MessageBody('content') content: string,
    @ConnectedSocket() client: Socket,
  ): Promise<MessageResponse> {
    const message = await this.chatroomsService.saveMessage({
      userId,
      chatroomId,
      content,
    });
    const room = await this.chatroomsService.findOne(chatroomId);

    client.to(room.name).emit('message', message);
    return message;
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    client.disconnect(true);
  }
}
