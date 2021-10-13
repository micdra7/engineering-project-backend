import { ApiProperty } from '@nestjs/swagger';
import { UserWorkspacesResponse } from '../../workspaces/responses/userWorkspaces.response';

export class AuthenticateResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  workspaces: UserWorkspacesResponse[];
}
