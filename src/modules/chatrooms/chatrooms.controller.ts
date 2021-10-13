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
import { ApiPaginatedResponse } from '../../utils/pagination.decorator';
import { ChatroomsService } from './chatrooms.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { ChatroomResponse } from './response/chatroom.response';

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
  create(@Body() createChatroomDto: CreateChatroomDto) {
    return this.chatroomsService.create(createChatroomDto);
  }

  @Get()
  @ApiPaginatedResponse(ChatroomResponse, 'List is successfully fetched')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ) {
    return this.chatroomsService.findAll(+req.user.id, page, limit);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Returns selected chatroom',
    type: ChatroomResponse,
  })
  findOne(@Param('id') id: string) {
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
  update(@Body() updateChatroomDto: UpdateChatroomDto) {
    return this.chatroomsService.update(updateChatroomDto);
  }

  @Get('/messages/:id')
  @ApiPaginatedResponse(ChatroomResponse, 'List is successfully fetched')
  findAllMessages(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.chatroomsService.findMessages(+id, page, limit);
  }
}
