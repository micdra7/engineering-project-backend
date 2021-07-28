import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// create-user is used when user is created by admin
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @MinLength(8)
  password?: string;

  @IsNotEmpty()
  role?: number;
}
