import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    UsersModule,
    WorkspacesModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService, LocalStrategy, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
