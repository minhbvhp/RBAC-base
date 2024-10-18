import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RequestWithUser } from '../../../utils/types/request.type';
import { IS_PUBLIC_KEY } from '../../../decorators/auth.decorator';
import { ROLES } from '../../../decorators/roles.decorator';
import { NOT_AUTHORIZED } from '../../../utils/constants/messageConstants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // if (isPublic) {
    //   return true;
    // }

    const requiredRoles: string[] = this.reflector.getAllAndOverride(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const { user } = request;

    const isRoleIncluded = requiredRoles.some(
      (role) => role === user?.role?.name,
    );

    if (isRoleIncluded) return true;

    throw new ForbiddenException(NOT_AUTHORIZED);
  }
}
