import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserWorkspaces])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
