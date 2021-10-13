import { ApiProperty } from '@nestjs/swagger';
import { UserWorkspacesResponse } from '../../workspaces/responses/userWorkspaces.response';

export class UpdateUserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ type: [UserWorkspacesResponse] })
  workspaces: UserWorkspacesResponse[];
}
