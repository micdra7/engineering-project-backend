import { UserWorkspacesResponse } from '../../workspaces/responses/userWorkspaces.response';

export class AuthenticateResponse {
  accessToken: string;
  refreshToken: string;
  workspaces: UserWorkspacesResponse[];
}
