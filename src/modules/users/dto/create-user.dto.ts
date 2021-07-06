// create-user is used when user is created by admin
export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}
