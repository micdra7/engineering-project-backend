import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import { GameData } from './entities/gameData.entity';
import { GameResult } from './entities/gameResult.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Workspace, GameData, GameResult])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
