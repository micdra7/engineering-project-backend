import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationResponse } from 'src/utils/pagination.response';
import { UsersListResponse } from './response/users-list.response';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { User } from './entities/user.entity';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req) {
    return this.usersService.create(req.user.workspaceName, createUserDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<UsersListResponse>> {
    return this.usersService.getAllWithPagination(
      req.user.workspaceName,
      page,
      limit,
    );
  }

  @Get('/current/profile')
  findCurrent(@Req() req) {
    return this.usersService.findOne(+req.user.id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.usersService.findOneInWorkspace(+id, req.user.workspaceName);
  }

  @Post('/find-by-email')
  @HttpCode(HttpStatus.OK)
  checkIfUsersExists(@Body() dto: FindByEmailDto): Promise<User> {
    return this.usersService.findByEmail(dto.email);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.usersService.update(+id, updateUserDto, req.user.workspaceName);
  }

  @Patch('/current/profile')
  updateCurrent(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(+req.user.id, updateUserDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch('/:id/change-status')
  async changeStatus(@Body() dto: ChangeStatusDto) {
    return this.usersService.changeStatus(dto);
  }
}
