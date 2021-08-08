import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindByEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
