import { IsNotEmpty } from 'class-validator';
import { Role } from '../entities/role.enum';

export class UserWorkspacesResponse {
  id?: number;

  @IsNotEmpty()
  role: Role;

  @IsNotEmpty()
  workspaceName: string;

  isDefault: boolean;
}
