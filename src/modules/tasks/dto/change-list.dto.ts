import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeListDto {
  @ApiProperty()
  @IsNotEmpty()
  taskId: number;

  @ApiProperty()
  @IsNotEmpty()
  listId: number;
}
