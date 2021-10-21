import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorator/public.decorator';
import { multerOptions } from '../../utils/multerOptions';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @Public()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  create(
    @Body() dto: CreateGameDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    return this.gamesService.create(dto, file, req.user.workspaceName);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }
}
