import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from './infrastructure/jwt/jwt.service';
import { AuthGuard } from './api/guard/auth.guard';
import { AuthController } from './api/rest/controller/auth.controller';
import {
  JWT_AUTH_SERVICE,
  LOGIN_USE_CASE,
  SIGNUP_USE_CASE,
} from './auth.tokens';
import { LoginUseCase } from './application/use-case/login.use-case';
import { SignupUseCase } from './application/use-case/signup.use-case';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: JWT_AUTH_SERVICE,
      useClass: JwtService,
    },
    {
      provide: LOGIN_USE_CASE,
      useClass: LoginUseCase,
    },
    {
      provide: SIGNUP_USE_CASE,
      useClass: SignupUseCase,
    },
  ],
  exports: [],
})
export class AuthModule {}
