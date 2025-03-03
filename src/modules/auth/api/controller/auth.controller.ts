import {
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginBody } from '../presentation/body/login.body';
import { SignupBody } from '../presentation/body/signup.body';
import { PublicApi } from '../../../../libs/decorator/auth.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { getOrThrowWith, Option } from 'effect/Option';
import { JwtUser } from '../presentation/dto/jwt-user.dto';
import { JwtAuthService } from '../../application/service/jwt-auth-service.interface';
import { JWT_AUTHENTICATION, LOGIN_USE_CASE } from '../../auth.tokens';
import { UseCase } from '../../../../libs/ddd/use-case.interface';
import { AuthUser } from '../presentation/dto/auth-user.dto';
import { SignupCommand } from '../../application/command/signup.command';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(JWT_AUTHENTICATION)
    private readonly jwtAuth: JwtAuthService,
    @Inject(LOGIN_USE_CASE)
    private readonly loginUseCase: UseCase<LoginBody, Option<AuthUser>>,
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
    return await this.commandBus.execute(
      new SignupCommand(
        body.email,
        body.password,
        body.firstName,
        body.lastName,
      ),
    );
  }
}
