import { AuthUser } from './auth-user.dto';

export interface JwtUser {
  token: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  user: AuthUser;
}
