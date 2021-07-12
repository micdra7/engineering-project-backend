import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticateUserDto } from '../users/dto/authenticate-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const dto: AuthenticateUserDto = {
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
