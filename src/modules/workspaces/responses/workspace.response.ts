import { IsNotEmpty } from 'class-validator';

export class WorkspaceDto {
  id?: number;

  @IsNotEmpty()
  name: string;
}
