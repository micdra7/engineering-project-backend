import { ApiProperty } from '@nestjs/swagger';

export class RegisterWorkspaceResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class RegisterResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  workspace: RegisterWorkspaceResponse;
}
