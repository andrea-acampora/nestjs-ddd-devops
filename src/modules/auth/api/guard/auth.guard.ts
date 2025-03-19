import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { JWT_AUTH_SERVICE } from '../../auth.tokens';
import { isNone, none, Option, some } from 'effect/Option';
import { QueryBus } from '@nestjs/cqrs';
import { CheckAuthUserByIdQuery } from '../../application/query/check-auth-user-by-id.query';
import {
  AUTH_ROLES_KEY,
  IS_PUBLIC_API,
} from '../../../../libs/decorator/auth.decorator';
import { ApiRole } from '../../../../libs/api/api-role.enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthService } from '../../application/service/jwt-auth-service.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  private authenticationHeaders: string[] = ['Authorization', 'authorization'];

  constructor(
    private readonly reflector: Reflector,
    @Inject(JWT_AUTH_SERVICE)
    private readonly jwtService: JwtAuthService,
    private readonly queryBus: QueryBus,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const apiRoles = this.reflector.getAllAndOverride<ApiRole[]>(
      AUTH_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_API, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic && !apiRoles) return true;
    let request: FastifyRequest;
    if (context.getType().toString() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    } else {
      request = context.switchToHttp().getRequest<FastifyRequest>();
    }
    const token = this.extractToken(request);
    if (isNone(token)) return false;
    try {
      const authUser = await this.jwtService.verifyToken(token.value);
      if (isNone(authUser)) return false;
      request['user'] = authUser.value;
      const isActiveUser = await this.isActiveUser(authUser.value.id);
      return isActiveUser && apiRoles.includes(authUser.value.role);
    } catch {
      return false;
    }
  }

  private extractToken(request: FastifyRequest): Option<string> {
    for (const header of this.authenticationHeaders) {
      const tokenHeader = request.headers[header] as string;
      if (tokenHeader) {
        const splitted = tokenHeader.split(' ');
        if (splitted[0] !== 'Bearer') {
          return none();
        } else {
          return some(splitted[1]);
        }
      }
    }
    return none();
  }

  private async isActiveUser(userId: string): Promise<boolean> {
    return await this.queryBus.execute(new CheckAuthUserByIdQuery(userId));
  }
}
