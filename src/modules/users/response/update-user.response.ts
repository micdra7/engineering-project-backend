import { UserWorkspacesResponse } from '../../workspaces/responses/userWorkspaces.response';

export class UpdateUserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  workspaces: UserWorkspacesResponse[];
}
