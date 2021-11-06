import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationResponse } from '../../utils/pagination.response';
import { ApiPaginatedResponse } from '../../utils/pagination.decorator';
import { ChatroomsService } from './chatrooms.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { ChatroomResponse } from './response/chatroom.response';
import { MessageResponse } from './response/message.response';

@ApiTags('Chatrooms')
@Controller('chatrooms')
export class ChatroomsController {
  constructor(private readonly chatroomsService: ChatroomsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Chatroom created',
    type: ChatroomResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
  })
  async create(@Body() dto: CreateChatroomDto): Promise<ChatroomResponse> {
    return this.chatroomsService.create(dto);
  }

  @Get()
  @ApiPaginatedResponse(ChatroomResponse, 'List is successfully fetched')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<ChatroomResponse>> {
    return this.chatroomsService.findAll(+req.user.id, page, limit);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Returns selected chatroom',
    type: ChatroomResponse,
  })
  async findOne(@Param('id') id: string): Promise<ChatroomResponse> {
    return this.chatroomsService.findOne(+id);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Updates chatroom for given id',
    type: ChatroomResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
  })
  async update(@Body() dto: UpdateChatroomDto): Promise<ChatroomResponse> {
    return this.chatroomsService.update(dto);
  }

  @Get('/messages/:id')
  @ApiPaginatedResponse(MessageResponse, 'List is successfully fetched')
  async findAllMessages(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<PaginationResponse<MessageResponse>> {
    return this.chatroomsService.findMessages(+id, page, limit);
  }
}
