import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Workspace])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
