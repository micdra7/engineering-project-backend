import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtWsAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const authorizationHeader = context.switchToWs().getClient().handshake
      .headers.authorization;

    try {
      const token = authorizationHeader.split(' ')[1].trim();
      const decoded = jwt.verify(token, this.configService.get('jwt.secret'));
      const expiresAt: number = (decoded as unknown as { exp: number }).exp;
      const currentTimestamp = +new Date() / 1000;

      if (expiresAt > currentTimestamp) {
        context.switchToWs().getData().user = decoded;
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}
