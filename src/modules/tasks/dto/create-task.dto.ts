import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  finishDate?: Date;

  @ApiProperty()
  @IsNotEmpty()
  taskListId: number;

  @ApiProperty()
  parentTaskId?: number;

  @ApiProperty()
  assignedUserIds?: number[];
}
