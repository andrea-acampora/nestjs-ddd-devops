import {
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginBody } from '../presentation/body/login.body';
import { SignupBody } from '../presentation/body/signup.body';
import { PublicApi } from '../../../../../libs/decorator/auth.decorator';
import { getOrThrowWith, Option } from 'effect/Option';
import { JwtUser } from '../presentation/dto/jwt-user.dto';
import { JwtAuthService } from '../../../application/service/jwt-auth-service.interface';
import {
  JWT_AUTH_SERVICE,
  LOGIN_USE_CASE,
  SIGNUP_USE_CASE,
} from '../../../auth.tokens';
import { UseCase } from '../../../../../libs/ddd/use-case.interface';
import { AuthUser } from '../presentation/dto/auth-user.dto';
import { RefreshTokenBody } from '../presentation/body/refresh-token.body';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(JWT_AUTH_SERVICE)
    private readonly jwtAuth: JwtAuthService,
    @Inject(LOGIN_USE_CASE)
    private readonly loginUseCase: UseCase<LoginBody, Option<AuthUser>>,
    @Inject(SIGNUP_USE_CASE)
    private readonly signupUseCase: UseCase<SignupBody, Option<AuthUser>>,
  ) {}

  @PublicApi()
  @Post('/login')
  async login(@Body() body: LoginBody): Promise<JwtUser> {
    return this.jwtAuth.generateJwtUser(
      getOrThrowWith(
        await this.loginUseCase.execute(body),
        () => new UnauthorizedException('Login Error!'),
      ),
    );
  }

  @PublicApi()
  @Post('/signup')
  async signup(@Body() body: SignupBody) {
    return this.jwtAuth.generateJwtUser(
      getOrThrowWith(
        await this.signupUseCase.execute(body),
        () => new UnauthorizedException('Signup Error!'),
      ),
    );
  }

  @PublicApi()
  @Post('/token/refresh')
  async refreshToken(@Body() body: RefreshTokenBody) {
    return this.jwtAuth.generateJwtUserFromRefresh(body.token);
  }
}
