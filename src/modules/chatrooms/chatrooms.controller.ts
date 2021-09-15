import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatroomsService } from './chatrooms.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@ApiTags('Chatrooms')
@Controller('chatrooms')
export class ChatroomsController {
  constructor(private readonly chatroomsService: ChatroomsService) {}

  @Post()
  create(@Body() createChatroomDto: CreateChatroomDto) {
    return this.chatroomsService.create(createChatroomDto);
  }

  // @Get()
  // findAll() {
  //   return this.chatroomsService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatroomsService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateChatroomDto: UpdateChatroomDto,
  // ) {
  //   return this.chatroomsService.update(+id, updateChatroomDto);
  // }
}
