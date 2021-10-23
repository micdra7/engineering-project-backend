import { ApiProperty } from '@nestjs/swagger';

export class GameResultResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  result: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  gameId: number;

  @ApiProperty()
  userId: number;
}
