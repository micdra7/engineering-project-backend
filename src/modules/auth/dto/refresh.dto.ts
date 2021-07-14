import { IsEmail, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;
}
