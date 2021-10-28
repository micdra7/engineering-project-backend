import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameResultService } from '../games/gameResult.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class CallsGateway {
  constructor(private readonly gameResultService: GameResultService) {}

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

  @SubscribeMessage('startGame')
  async handleStart(
    @MessageBody('gameId') gameId: number,
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(room).emit('gameStart', { gameId });
  }

  @SubscribeMessage('sendGameData')
  async handleSend(
    @MessageBody('data') data: string,
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(room).emit('gameData', { data });
  }

  @SubscribeMessage('sendGameFinish')
  async handleFinish(
    @MessageBody('room') room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(room).emit('gameFinish');
  }

  @SubscribeMessage('sendGameScore')
  async handleScoreSave(
    @MessageBody('id') id: string,
    @MessageBody('gameId') gameId: string,
    @MessageBody('room') room: string,
    @MessageBody('score') score: number,
  ) {
    const existingUser = this.activeUsers?.find(
      user => user.room === room && user.id === id,
    );

    if (!!existingUser) {
      this.gameResultService.create({
        gameId: +gameId,
        userId: +existingUser.id,
        result: score,
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
}
