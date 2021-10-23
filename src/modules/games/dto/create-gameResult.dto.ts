import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateGameResultDto {
  @ApiProperty()
  @IsNotEmpty()
  result: number;

  @ApiProperty()
  @IsNotEmpty()
  gameId: number;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
