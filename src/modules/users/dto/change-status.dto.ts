import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangeStatusDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  status: boolean;

  @IsNotEmpty()
  role: number;
}
