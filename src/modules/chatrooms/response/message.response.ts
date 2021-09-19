import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  sendTime: Date;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  userEmail: string;

  @ApiProperty()
  chatroomId: number;

  @ApiProperty()
  chatroomName: string;
}
