import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { THIS_FEATURE_NEED_LOGIN } from '../../../utils/constants/messageConstants';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException(THIS_FEATURE_NEED_LOGIN);
    }

    return user;
  }
}
