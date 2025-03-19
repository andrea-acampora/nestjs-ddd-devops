import { Option } from 'effect/Option';
import { AuthUser } from '../../api/rest/presentation/dto/auth-user.dto';
import { JwtUser } from '../../api/rest/presentation/dto/jwt-user.dto';

export interface JwtAuthService {
  verifyToken(token: string): Promise<Option<AuthUser>>;

  verifyRefreshToken(refreshToken: string): Promise<Option<AuthUser>>;

  generateToken(user: AuthUser): Promise<string>;

  generateRefreshToken(user: AuthUser): Promise<string>;

  generateJwtUser(user: AuthUser): Promise<JwtUser>;

  generateJwtUserFromRefresh(token: string): Promise<JwtUser>;
}
