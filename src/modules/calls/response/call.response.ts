import { ApiProperty } from '@nestjs/swagger';
import { UsersListResponse } from '../../users/response/users-list.response';

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
  users: Partial<UsersListResponse>[];
}
