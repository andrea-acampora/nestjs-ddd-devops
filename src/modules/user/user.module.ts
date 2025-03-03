import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './domain/entity/user.entity';
import { UserRepositoryImpl } from './infrastructure/database/user.repository';
import { USER_REPOSITORY } from './user.tokens';
import { GetAuthUserByEmailHandler } from './application/handler/query/get-auth-user-by-email.handler';
import { CheckAuthUserByIdHandler } from './application/handler/query/check-auth-user-by-id.handler';
import { CreateUserHandler } from './application/handler/command/create-user.handler';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [],
  providers: [
    CreateUserHandler,
    GetAuthUserByEmailHandler,
    CheckAuthUserByIdHandler,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [],
})
export class UserModule {}
