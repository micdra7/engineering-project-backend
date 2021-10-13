import { ApiProperty } from '@nestjs/swagger';
import { TaskItemResponse } from './task-item.response';

export class TaskListItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tasks?: TaskItemResponse[];
}
