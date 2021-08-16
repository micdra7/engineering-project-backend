import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateTaskListDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
