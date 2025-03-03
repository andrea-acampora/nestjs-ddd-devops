import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from './infrastructure/jwt/jwt.service';
import { AuthGuard } from './api/guard/auth.guard';
import { AuthController } from './api/controller/auth.controller';
import { JWT_AUTHENTICATION, LOGIN_USE_CASE } from './auth.tokens';
import { LoginUseCase } from './application/use-case/login.use-case';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: JWT_AUTHENTICATION,
      useClass: JwtService,
    },
    {
      provide: LOGIN_USE_CASE,
      useClass: LoginUseCase,
    },
  ],
  exports: [],
})
export class AuthModule {}
