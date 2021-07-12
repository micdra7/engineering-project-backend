import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthenticateResponse } from './response/authenticate.response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
    const user: User = await this.usersService.findByEmail(authLoginDto.email);

    if (
      user &&
      (await bcrypt.compare(authLoginDto.password, user.passwordHash))
    ) {
      return user;
    }

    return null;
  }

  async login(user: User): Promise<AuthenticateResponse> {
    const workspaces = await this.usersService.getUserWorkspaces(user.id);
    const payload = {
      email: user.email,
      sub: user.id,
      role: workspaces.filter(w => w.isDefault === true)[0].role,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.validFor'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.refreshValidFor'),
      }),
      workspaces,
    };
  }
}
