import { UserWorkspacesResponse } from '../../workspaces/responses/userWorkspaces.response';

export class AuthenticateUserResponse {
  accessToken: string;
  refreshToken: string;
  workspaces: UserWorkspacesResponse[];
}
