import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../utils/multerOptions';
import { GameResponse } from './response/game.response';
import { ApiPaginatedResponse } from '../../utils/pagination.decorator';
import { PaginationResponse } from '../../utils/pagination.response';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Game successfully created',
    type: GameResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation or file upload failed',
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(
    @Body() dto: CreateGameDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<GameResponse> {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    return this.gamesService.create(dto, file, req.user.workspaceName);
  }

  @Get()
  @ApiPaginatedResponse(GameResponse, 'List is successfully fetched')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<GameResponse>> {
    return this.gamesService.findAll(req.user.workspaceName, page, limit);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns selected game',
    type: GameResponse,
  })
  findOne(@Param('id') id: string): Promise<GameResponse> {
    return this.gamesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Game with given id successfully updated',
    type: GameResponse,
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGameDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GameResponse> {
    return this.gamesService.update(+id, dto, file);
  }
}
