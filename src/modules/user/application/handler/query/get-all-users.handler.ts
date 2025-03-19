import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../domain/repository/user.repository.interface';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../user.tokens';
import { GetAllUsersQuery } from '../../query/get-all-users.query';
import { Collection } from '../../../../../libs/api/rest/collection.interface';
import { User } from '../../../domain/entity/user.entity';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query?: GetAllUsersQuery): Promise<Collection<User>> {
    return await this.userRepository.getAllUsers(query?.params);
  }
}
