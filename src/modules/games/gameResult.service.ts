import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponse } from '../../utils/pagination.response';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { CreateGameResultDto } from './dto/create-gameResult.dto';
import { Game } from './entities/game.entity';
import { GameResult } from './entities/gameResult.entity';
import { GameResultResponse } from './response/gameResult.response';

@Injectable()
export class GameResultService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(GameResult)
    private readonly gameResultRepository: Repository<GameResult>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateGameResultDto): Promise<GameResultResponse> {
    const user = await this.userRepository.findOne(dto.userId);
    const game = await this.gameRepository.findOne(dto.gameId);

    const gameResult = await this.gameResultRepository.save({
      result: dto.result,
      createdAt: new Date(),
      game,
      user,
    });

    return {
      id: gameResult.id,
      result: gameResult.result,
      createdAt: gameResult.createdAt,
      gameId: game.id,
      userId: user.id,
    };
  }

  async findAll(
    workspaceName: string,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<GameResultResponse>> {
    const [items, count] = await this.gameResultRepository
      .createQueryBuilder('gameResult')
      .innerJoinAndSelect('gameResult.game', 'game')
      .innerJoinAndSelect('gameResult.user', 'user')
      .innerJoinAndSelect('game.workspace', 'workspace')
      .where('workspace.name := workspaceName', { workspaceName })
      .orderBy('gameResult.id', 'ASC')
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
        result: val.result,
        createdAt: val.createdAt,
        gameId: val.game.id,
        userId: val.user.id,
      })),
      meta,
    };
  }

  async findOne(id: number): Promise<GameResultResponse> {
    const gameResult = await this.gameResultRepository.findOne({
      where: { id },
      relations: ['game', 'user'],
    });

    return {
      id: gameResult.id,
      result: gameResult.result,
      createdAt: gameResult.createdAt,
      gameId: gameResult.game.id,
      userId: gameResult.user.id,
    };
  }
}
