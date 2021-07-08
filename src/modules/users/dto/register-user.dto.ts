import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// register-user dto is used during standard registration flow
export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  workspaceName: string;
}
