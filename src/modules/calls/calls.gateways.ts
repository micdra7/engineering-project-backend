import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { JwtWsAuthGuard } from '../auth/guard/jwt-ws-auth.guard';
import { Socket } from 'socket.io';

@UseGuards(JwtWsAuthGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export class CallsGateway {
  @SubscribeMessage('call')
  async handleCall(
    @MessageBody('to') to: string,
    @MessageBody('offer') offer: unknown,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
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
}
