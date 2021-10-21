import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { GameResponse } from './response/game.response';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async create(
    dto: CreateGameDto,
    file: Express.Multer.File,
    workspaceName: string,
  ): Promise<GameResponse> {
    const workspace = await this.workspaceRepository.findOne({
      where: { name: workspaceName },
    });

    const game = await this.gameRepository.save({
      ...dto,
      filepath: file.filename,
      workspace,
    });

    return {
      id: game.id,
      name: game.name,
      filepath: game.filepath,
    };
  }

  findAll() {
    return `This action returns all games`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
