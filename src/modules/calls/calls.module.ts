import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';
import { CallsGateway } from './calls.gateways';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call } from './entities/call.entity';
import { User } from '../users/entities/user.entity';
import { GamesModule } from '../games/games.module';
import { Game } from '../games/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Call, User, Game]), GamesModule],
  controllers: [CallsController],
  providers: [CallsService, CallsGateway],
})
export class CallsModule {}
