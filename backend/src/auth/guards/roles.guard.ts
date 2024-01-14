import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { User } from '../../users/entities';
import { ROLES_KEY } from '../../roles/decorators';
import { UserRole } from '../../roles/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = GqlExecutionContext.create(context).getContext().req;
    const user = request.user as User;

    return requiredRoles.every((role) =>
      user.roles.find(({ name }) => name === role),
    );
  }
}
