import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  finishDate?: Date;

  @ApiProperty()
  @IsNotEmpty()
  taskListId: number;

  @ApiProperty()
  @IsNumber()
  parentTaskId?: number;

  @ApiProperty()
  @IsArray()
  assignedUserIds?: number[];
}
