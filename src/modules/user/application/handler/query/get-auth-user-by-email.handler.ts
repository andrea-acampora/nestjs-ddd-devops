import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAuthUserByEmailQuery } from '../../../../auth/application/query/get-auth-user-by-email.query';
import { UserRepository } from '../../../domain/repository/user.repository.interface';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../user.tokens';
import { Option } from 'effect/Option';
import { User } from '../../../domain/entity/user.entity';

@QueryHandler(GetAuthUserByEmailQuery)
export class GetAuthUserByEmailHandler
  implements IQueryHandler<GetAuthUserByEmailQuery>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetAuthUserByEmailQuery): Promise<Option<User>> {
    return await this.userRepository.getUserByEmail(query.email);
  }
}
