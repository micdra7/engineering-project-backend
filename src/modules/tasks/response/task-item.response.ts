import { ApiProperty } from '@nestjs/swagger';

export class TaskItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
