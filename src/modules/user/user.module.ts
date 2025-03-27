import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRepositoryImpl } from './infrastructure/database/repository/user.repository';
import { CREATE_USER_USE_CASE, USER_REPOSITORY } from './user.tokens';
import { GetAuthUserByEmailHandler } from './application/handler/query/get-auth-user-by-email.handler';
import { CheckAuthUserByIdHandler } from './application/handler/query/check-auth-user-by-id.handler';
import { RegisterUserHandler } from './application/handler/command/register-user.handler';
import { UserController } from './api/rest/controller/user.controller';
import { CreateUserUseCase } from './application/use-case/create-user.use-case';
import { CreateUserHandler } from './application/handler/command/create-user.handler';
import { GetAllUsersHandler } from './application/handler/query/get-all-users.handler';
import { UserMapper } from './infrastructure/database/mapper/user.mapper';
import { UserResolver } from './api/graphql/resolver/user.resolver';
import { GetUserByIdHandler } from './application/handler/query/get-user-by-id.handler';
import { UserEntity } from './infrastructure/database/entity/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    RegisterUserHandler,
    CreateUserHandler,
    GetAllUsersHandler,
    GetAuthUserByEmailHandler,
    GetUserByIdHandler,
    CheckAuthUserByIdHandler,
    UserMapper,
    UserResolver,
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
