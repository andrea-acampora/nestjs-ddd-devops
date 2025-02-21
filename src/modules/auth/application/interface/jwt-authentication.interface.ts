import { AuthUser } from '../presentation/dto/auth-user.dto';
import { Option } from 'effect/Option';
import { JwtUser } from '../presentation/dto/jwt-user.dto';

export interface JwtAuthentication {
  verifyToken(token: string): Promise<Option<AuthUser>>;

  verifyRefreshToken(refreshToken: string): Promise<Option<AuthUser>>;

  generateToken(user: AuthUser): Promise<string>;

  generateRefreshToken(user: AuthUser): Promise<string>;

  generateJwtUser(user: AuthUser): Promise<JwtUser>;

  generateJwtUserFromRefresh(token: string): Promise<JwtUser>;
}
