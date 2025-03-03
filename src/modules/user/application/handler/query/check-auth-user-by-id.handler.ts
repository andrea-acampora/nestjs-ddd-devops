import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../domain/repository/user.repository.interface';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../user.tokens';
import { CheckAuthUserByIdQuery } from '../../../../auth/application/query/check-auth-user-by-id.query';

@QueryHandler(CheckAuthUserByIdQuery)
export class CheckAuthUserByIdHandler
  implements IQueryHandler<CheckAuthUserByIdQuery>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: CheckAuthUserByIdQuery): Promise<boolean> {
    return await this.userRepository.checkActiveUserById(query.id);
  }
}
