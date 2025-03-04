import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { ApiRole } from '../api/api-role.enum';

export const AUTH_ROLES_KEY = 'AUTH_ROLES_KEY';
export const IS_PUBLIC_API = 'IS_PUBLIC_API';

export const AuthRoles = (...roles: ApiRole[]) =>
  SetMetadata(AUTH_ROLES_KEY, roles);

export const PublicApi = () => SetMetadata(IS_PUBLIC_API, true);

export const InjectAuthUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  },
);
