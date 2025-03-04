import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './domain/entity/user.entity';
import { UserRepositoryImpl } from './infrastructure/database/user.repository';
import { CREATE_USER_USE_CASE, USER_REPOSITORY } from './user.tokens';
import { GetAuthUserByEmailHandler } from './application/handler/query/get-auth-user-by-email.handler';
import { CheckAuthUserByIdHandler } from './application/handler/query/check-auth-user-by-id.handler';
import { RegisterUserHandler } from './application/handler/command/register-user.handler';
import { UserController } from './api/controller/user.controller';
import { CreateUserUseCase } from './application/use-case/create-user.use-case';
import { CreateUserHandler } from './application/handler/command/create-user.handler';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    RegisterUserHandler,
    CreateUserHandler,
    GetAuthUserByEmailHandler,
    CheckAuthUserByIdHandler,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    {
      provide: CREATE_USER_USE_CASE,
      useClass: CreateUserUseCase,
    },
  ],
  exports: [],
})
export class UserModule {}
