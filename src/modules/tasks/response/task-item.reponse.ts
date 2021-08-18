import { ApiProperty } from '@nestjs/swagger';

export class TaskItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  finishDate?: Date;

  @ApiProperty()
  taskListId: number;

  @ApiProperty()
  parentTaskId?: number;

  @ApiProperty()
  assignedUserIds?: number[];

  @ApiProperty()
  childrenTasks?: TaskItemResponse[];

  @ApiProperty()
  isDone?: boolean;
}
