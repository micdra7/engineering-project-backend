import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from '../../utils/pagination.response';
import { Repository } from 'typeorm';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateGameDataDto } from './dto/create-gameData.dto';
import { Game } from './entities/game.entity';
import { GameData } from './entities/gameData.entity';
import { GameDataResponse } from './response/gameData.response';

@Injectable()
export class GameDataService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(GameData)
    private readonly gameDataRepository: Repository<GameData>,
  ) {}

  async create(dto: CreateGameDataDto): Promise<GameDataResponse> {
    const game = await this.gameRepository.findOne(dto.gameId);
    const gameData = await this.gameDataRepository.save({
      data: dto.data,
      game,
    });

    return {
      id: gameData.id,
      data: gameData.data,
      gameId: game.id,
    };
  }

  async findAll(
    workspaceName: string,
    page: number,
    limit: number,
    gameId: number,
  ): Promise<PaginationResponse<GameDataResponse>> {
    const [items, count] = await this.gameDataRepository
      .createQueryBuilder('gameData')
      .innerJoinAndSelect('gameData.game', 'game')
      .innerJoinAndSelect('game.workspace', 'workspace')
      .where('workspace.name = :workspaceName', { workspaceName })
      .andWhere('game.id = :gameId', { gameId })
      .orderBy('gameData.id', 'ASC')
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
        data: val.data,
        gameId: val.game.id,
      })),
      meta,
    };
  }

  async findOne(id: number): Promise<GameDataResponse> {
    const gameData = await this.gameDataRepository.findOne({
      where: { id },
      relations: ['game'],
    });

    return {
      id: gameData.id,
      data: gameData.data,
      gameId: gameData.game.id,
    };
  }

  async remove(id: number): Promise<void> {
    const gameData = await this.gameDataRepository.findOne(id);
    await this.gameDataRepository.remove(gameData);
  }
}
