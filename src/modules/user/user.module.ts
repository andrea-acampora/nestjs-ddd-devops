import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRepositoryImpl } from './infrastructure/database/repository/user.repository';
import { CREATE_USER_USE_CASE, USER_REPOSITORY } from './user.tokens';
import { GetAuthUserByEmailHandler } from './application/handler/query/get-auth-user-by-email.handler';
import { CheckAuthUserByIdHandler } from './application/handler/query/check-auth-user-by-id.handler';
import { RegisterUserHandler } from './application/handler/command/register-user.handler';
import { UserController } from './api/controller/user.controller';
import { CreateUserUseCase } from './application/use-case/create-user.use-case';
import { CreateUserHandler } from './application/handler/command/create-user.handler';
import { GetAllUsersHandler } from './application/handler/query/get-all-users.handler';
import { UserSchema } from './infrastructure/database/schema/user.schema';
import { UserMapper } from './infrastructure/database/mapper/user.mapper';

@Module({
  imports: [MikroOrmModule.forFeature([UserSchema])],
  controllers: [UserController],
  providers: [
    RegisterUserHandler,
    CreateUserHandler,
    GetAllUsersHandler,
    GetAuthUserByEmailHandler,
    CheckAuthUserByIdHandler,
    UserMapper,
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
