import { ApiProperty } from '@nestjs/swagger';
import { UsersListResponse } from '../../users/response/users-list.response';

export class ChatroomResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  users: Partial<UsersListResponse>[];
}
