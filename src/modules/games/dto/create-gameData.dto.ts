import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateGameDataDto {
  @ApiProperty()
  @IsNotEmpty()
  gameId: number;

  @ApiProperty()
  @IsNotEmpty()
  data: Record<string, unknown>;
}
