import { ApiProperty } from '@nestjs/swagger';

export class TaskListItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
