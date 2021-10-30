import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CallsModule } from './modules/calls/calls.module';
import { ChatroomsModule } from './modules/chatrooms/chatrooms.module';
import { GamesModule } from './modules/games/games.module';
import { SeederModule } from './modules/seeder/seeder.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import configuration from './utils/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot(),
    UsersModule,
    WorkspacesModule,
    CallsModule,
    ChatroomsModule,
    GamesModule,
    TasksModule,
    AuthModule,
    SeederModule,
    DashboardModule,
  ],
})
export class AppModule {}
