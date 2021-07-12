import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { UserWorkspaces } from '../workspaces/entities/userWorkspaces.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserWorkspaces, Workspace]),
    WorkspacesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
