import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SwitchWorkspaceDto {
  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty()
  @IsNotEmpty()
  workspaceName: string;

  @ApiProperty()
  @IsNotEmpty()
  workspaceId: number;
}
