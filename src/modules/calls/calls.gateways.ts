import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { JwtWsAuthGuard } from '../auth/guard/jwt-ws-auth.guard';
import { Socket } from 'socket.io';

// @UseGuards(JwtWsAuthGuard)
@WebSocketGateway(3003, { cors: { origin: '*' } })
export class CallsGateway {
  private activeUsers: { room: string; id: string }[] = [];

  @SubscribeMessage('joinRoom')
  async handleJoin(
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const existingUser = this.activeUsers?.find(
      user => user.room === room && user.id === client.id,
    );

    if (!existingUser) {
      this.activeUsers = [...this.activeUsers, { id: client.id, room }];

      client.emit(`${room}-update-user-list`, {
        users: this.activeUsers
          .filter(user => user.room === room && user.id !== client.id)
          .map(user => user.id),
      });
      client.broadcast.emit(`${room}-update-user-list`, {
        users: [client.id],
      });
    }
  }

  @SubscribeMessage('call')
  async handleCall(
    @MessageBody('to') to: string,
    @MessageBody('offer') offer: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const room = this.activeUsers.find(user => user.id === to)?.room;

    if (this.activeUsers.filter(user => user.room === room)?.length === 1)
      return;

    client.to(to).emit('call-offer', { offer, socket: client.id });
  }

  @SubscribeMessage('call-answer')
  async handleAnswer(
    @MessageBody('to') to: string,
    @MessageBody('answer') answer: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    client.to(to).emit('call-answer-made', { answer, socket: client.id });
  }

  @SubscribeMessage('call-reject')
  async handleReject(
    @MessageBody('from') from: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    client.to(from).emit('call-reject-made', { socket: client.id });
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const existingUser = this.activeUsers.find(user => user.id === client.id);

    if (!existingUser) return;

    this.activeUsers = this.activeUsers.filter(user => user.id !== client.id);

    client.broadcast.emit(`${existingUser.room}-remove-user`, {
      socketId: client.id,
    });
  }
}
