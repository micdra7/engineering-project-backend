import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), WorkspacesModule, PassportModule],
  controllers: [UsersController],
  providers: [UsersService, LocalStrategy],
})
export class UsersModule {}
