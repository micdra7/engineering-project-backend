import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskListDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
