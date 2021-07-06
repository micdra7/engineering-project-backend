export class RegisterUserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  workspace: {
    id: number;
    name: string;
  };
}
