import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from '../../utils/pagination.response';
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

  async findAll(
    workspaceName: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<GameResponse>> {
    const [items, count] = await this.gameRepository
      .createQueryBuilder('game')
      .innerJoinAndSelect('game.workspace', 'workspace')
      .where('workspace.name := workspaceName', { workspaceName })
      .orderBy('game.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const meta = {
      currentPage: page,
      itemCount: limit,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    };

    return {
      data: items.map(val => ({
        id: val.id,
        name: val.name,
        filepath: val.filepath,
      })),
      meta,
    };
  }

  async findOne(id: number): Promise<GameResponse> {
    const game = await this.gameRepository.findOne(id);

    return {
      id: game.id,
      name: game.name,
      filepath: game.filepath,
    };
  }

  async update(
    id: number,
    dto: UpdateGameDto,
    file: Express.Multer.File,
  ): Promise<GameResponse> {
    const game = await this.gameRepository.findOne(id);

    if (dto.name) {
      game.name = dto.name;
    }

    if (file.filename !== game.filepath) {
      game.filepath = file.filename;
    }

    await this.gameRepository.update(id, game);

    return {
      id: game.id,
      name: game.name,
      filepath: game.filepath,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
