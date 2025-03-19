import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
} from '../../../../config/env/configuration.constant';
import { isNone, liftThrowable, Option } from 'effect/Option';
import { JwtAuthService } from '../../application/service/jwt-auth-service.interface';
import * as jwt from 'jsonwebtoken';
import { getConfigValue } from '../../../../libs/util/config.util';
import { AuthUser } from '../../api/rest/presentation/dto/auth-user.dto';
import { JwtUser } from '../../api/rest/presentation/dto/jwt-user.dto';

@Injectable()
export class JwtService implements JwtAuthService {
  private readonly tokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly tokenExpiration: number;
  private readonly refreshTokenExpiration: number;

  constructor(private readonly configService: ConfigService) {
    this.tokenSecret = getConfigValue(this.configService, JWT_SECRET);
    this.refreshTokenSecret = getConfigValue<string>(
      this.configService,
      JWT_REFRESH_SECRET,
    );
    this.tokenExpiration = getConfigValue<number>(
      this.configService,
      JWT_EXPIRES_IN,
    );
    this.refreshTokenExpiration = getConfigValue<number>(
      this.configService,
      JWT_REFRESH_EXPIRES_IN,
    );
  }

  async generateToken(user: AuthUser): Promise<string> {
    return jwt.sign(user, this.tokenSecret, {
      expiresIn: this.tokenExpiration,
    });
  }

  async generateRefreshToken(user: AuthUser): Promise<string> {
    return jwt.sign(user, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiration,
    });
  }

  async generateJwtUser(authUser: AuthUser): Promise<JwtUser> {
    const token = await this.generateToken(authUser);
    const refreshToken = await this.generateRefreshToken(authUser);
    return {
      token,
      expiresIn: this.tokenExpiration,
      refreshToken,
      refreshExpiresIn: this.refreshTokenExpiration,
      user: authUser,
    };
  }

  async generateJwtUserFromRefresh(refreshToken: string): Promise<JwtUser> {
    const authUser = this.verifyJwt<AuthUser>(
      refreshToken,
      this.refreshTokenSecret,
    );
    if (isNone(authUser)) throw new UnauthorizedException('Invalid Token!');
    return this.generateJwtUser(this.convertToAuthUser(authUser.value));
  }

  async verifyToken(token: string): Promise<Option<AuthUser>> {
    return this.verifyJwt<AuthUser>(token, this.tokenSecret);
  }

  async verifyRefreshToken(refreshToken: string): Promise<Option<AuthUser>> {
    return this.verifyJwt<AuthUser>(refreshToken, this.refreshTokenSecret);
  }

  /**
   * Generic JWT verification method.
   */
  private verifyJwt<T>(token: string, secret: string): Option<T> {
    return liftThrowable(() => jwt.verify(token, secret) as T)();
  }

  /**
   * Helper method to clean the AuthUser object.
   */
  convertToAuthUser = (authUser: AuthUser): AuthUser => ({
    id: authUser.id,
    email: authUser.email,
    role: authUser.role,
  });
}
