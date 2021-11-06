import { ApiProperty } from '@nestjs/swagger';

export class GameDataResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  data: Record<string, unknown>;

  @ApiProperty()
  gameId: number;
}
