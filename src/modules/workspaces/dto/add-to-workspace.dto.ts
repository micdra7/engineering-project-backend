import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddToWorkspaceDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: number;
}
