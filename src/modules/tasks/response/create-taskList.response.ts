import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskListResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
