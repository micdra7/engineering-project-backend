import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const dto: AuthLoginDto = {
      email,
      password,
    };

    const user = await this.authService.validateUser(dto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
