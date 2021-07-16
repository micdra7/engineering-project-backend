import { IsNotEmpty } from 'class-validator';

export class SwitchWorkspaceDto {
  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;

  @IsNotEmpty()
  workspaceName: string;

  @IsNotEmpty()
  workspaceId: number;
}
