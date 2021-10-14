import { UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class CallsGateway {
  private activeUsers: { room: string; id: string; socketId: string }[] = [];

  @SubscribeMessage('joinRoom')
  async handleJoin(
    @MessageBody('id') id: string,
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const existingUser = this.activeUsers?.find(
      user => user.room === room && user.id === id,
    );

    if (!existingUser) {
      this.activeUsers = [
        ...this.activeUsers,
        { id, room, socketId: client.id },
      ];

      client.join(room);
      client.to(room).emit('user-connected', {
        user: id,
      });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleReject(
    @MessageBody('id') id: string,
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.activeUsers = this.activeUsers.filter(user => user.id !== id);
    client.to(room).emit('user-disconnected', { user: id });
    client.leave(room);
    client.disconnect();
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    client.disconnect(true);
    const currentUser = this.activeUsers.find(
      user => user.socketId === client.id,
    );
    this.activeUsers = this.activeUsers.filter(
      user => user.socketId !== client.id,
    );
    client.broadcast.emit('user-disconnected', { user: currentUser.id });
    client.disconnect();
  }
}
