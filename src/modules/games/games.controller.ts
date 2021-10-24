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
  Delete,
  Header,
  Res,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../utils/multerOptions';
import { GameResponse } from './response/game.response';
import { ApiPaginatedResponse } from '../../utils/pagination.decorator';
import { PaginationResponse } from '../../utils/pagination.response';
import { GameDataResponse } from './response/gameData.response';
import { CreateGameDataDto } from './dto/create-gameData.dto';
import { GameDataService } from './gameData.service';
import { GameResultService } from './gameResult.service';
import { CreateGameResultDto } from './dto/create-gameResult.dto';
import { GameResultResponse } from './response/gameResult.response';
import { ReadStream } from 'fs';
import { Public } from '../auth/decorator/public.decorator';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly gameDataService: GameDataService,
    private readonly gameResultService: GameResultService,
  ) {}

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

  @Get('/file/:id')
  @ApiOkResponse({
    description: 'Returns selected file',
    type: GameResponse,
  })
  @Header('Content-Type', 'application/javascript')
  findOneFile(@Param('id') id: string, @Res() res) {
    const stream = this.gamesService.findFile(id);

    stream.pipe(res);
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

  @Post('data')
  @ApiCreatedResponse({
    description: 'GameData entry successfully created',
    type: GameDataResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
  })
  async createData(@Body() dto: CreateGameDataDto): Promise<GameDataResponse> {
    return this.gameDataService.create(dto);
  }

  @Get('data')
  @ApiPaginatedResponse(GameDataResponse, 'List is successfully fetched')
  async findAllData(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<GameDataResponse>> {
    return this.gameDataService.findAll(req.user.workspaceName, page, limit);
  }

  @Get('data/:id')
  @ApiOkResponse({
    description: 'Returns selected game data entry',
    type: GameDataResponse,
  })
  async findOneData(@Param('id') id: string): Promise<GameDataResponse> {
    return this.gameDataService.findOne(+id);
  }

  @Delete('data/:id')
  @ApiNoContentResponse({
    description: 'Game data entry with given id successfully deleted',
  })
  async deleteData(@Param('id') id: string): Promise<void> {
    await this.gameDataService.remove(+id);
  }

  @Post('result')
  @ApiCreatedResponse({
    description: 'GameResult entry successfully created',
    type: GameResultResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
  })
  async createResult(
    @Body() dto: CreateGameResultDto,
  ): Promise<GameResultResponse> {
    return this.gameResultService.create(dto);
  }

  @Get('result')
  @ApiPaginatedResponse(GameDataResponse, 'List is successfully fetched')
  async findAllResults(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req,
  ): Promise<PaginationResponse<GameResultResponse>> {
    return this.gameResultService.findAll(req.user.workspaceName, page, limit);
  }

  @Get('result/:id')
  @ApiOkResponse({
    description: 'Returns selected game result entry',
    type: GameResultResponse,
  })
  async findOneResult(@Param('id') id: string): Promise<GameResultResponse> {
    return this.gameResultService.findOne(+id);
  }
}
