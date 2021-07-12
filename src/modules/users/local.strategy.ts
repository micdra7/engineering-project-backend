import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const dto: AuthenticateUserDto = {
      email,
      password,
    };

    const user = await this.usersService.authenticate(dto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
