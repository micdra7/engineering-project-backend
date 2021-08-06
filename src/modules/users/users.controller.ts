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
import { PaginationResponse } from '../../utils/pagination.response';
import { UsersListResponse } from './response/users-list.response';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { User } from './entities/user.entity';
import { ChangeStatusDto } from './dto/change-status.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/utils/pagination.decorator';
import { UpdateUserResponse } from './response/update-user.response';

@ApiTags('Users')
@ApiExtraModels(PaginationResponse)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'User successfully created and added to current workspace',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Email is already in use',
  })
  create(@Body() createUserDto: CreateUserDto, @Req() req) {
    return this.usersService.create(req.user.workspaceName, createUserDto);
  }

  @Get()
  @ApiPaginatedResponse(UsersListResponse, 'List is successfully fetched')
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
  @ApiOkResponse({
    description: 'Returns currently logged in user',
    type: User,
  })
  findCurrent(@Req() req) {
    return this.usersService.findOne(+req.user.id);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Returns user for given id',
    type: User,
  })
  findOne(@Param('id') id: string, @Req() req) {
    return this.usersService.findOneInWorkspace(+id, req.user.workspaceName);
  }

  @Post('/find-by-email')
  @ApiOkResponse({
    description: 'Returns user for given email',
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  checkIfUsersExists(@Body() dto: FindByEmailDto): Promise<User> {
    return this.usersService.findByEmail(dto.email);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Updates user for given id',
    type: UpdateUserResponse,
  })
  @ApiBadRequestResponse({
    description: 'User not found or email is already in use (if being changed)',
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.usersService.update(+id, updateUserDto, req.user.workspaceName);
  }

  @Patch('/current/profile')
  @ApiOkResponse({
    description: 'Updates current user',
    type: UpdateUserResponse,
  })
  @ApiBadRequestResponse({
    description: 'User not found or email is already in use (if being changed)',
  })
  updateCurrent(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(+req.user.id, updateUserDto);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'User was removed' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch('/:id/change-status')
  @ApiOkResponse({
    description: 'User activated / deactivated',
    type: UsersListResponse,
  })
  async changeStatus(@Body() dto: ChangeStatusDto) {
    return this.usersService.changeStatus(dto);
  }
}
