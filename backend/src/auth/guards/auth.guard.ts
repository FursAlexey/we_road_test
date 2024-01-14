import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../../users/services';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../decorators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = GqlExecutionContext.create(context).getContext().req;
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: {
        sub: string;
        email: string;
      } = await this.jwtService.verifyAsync(token, {
        // todo: use config
        secret: process.env.JWT_SECRET ?? 'secret',
      });

      const user = await this.usersService.getById(payload.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
