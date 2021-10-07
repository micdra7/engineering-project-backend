import { ApiProperty } from '@nestjs/swagger';

export class CallResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  finishDate: Date;

  @ApiProperty()
  assignedUserIds: number[];
}
