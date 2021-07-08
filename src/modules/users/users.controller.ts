import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { isEmptyObject } from '../../utils/helper';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { AuthenticateUserResponse } from './response/authenticate-user.response';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly workspacesService: WorkspacesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    if (!registerUserDto || isEmptyObject(registerUserDto)) {
      throw new HttpException(
        'Request body cannot be empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userWithGivenEmailExists = !!(await this.usersService.findByEmail(
      registerUserDto.email,
    ));
    if (userWithGivenEmailExists) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const workspaceWithGivenNameExists =
      !!(await this.workspacesService.findByName(
        registerUserDto.workspaceName,
      ));
    if (workspaceWithGivenNameExists) {
      throw new HttpException(
        'Workspace name is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersService.register(registerUserDto);
  }

  @Post('/authenticate')
  async authenticate(
    @Body() authenticateUserDto: AuthenticateUserDto,
  ): Promise<AuthenticateUserResponse> {
    return null;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
