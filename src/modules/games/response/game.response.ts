import { ApiProperty } from '@nestjs/swagger';

export class GameResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  filepath: string;
}
