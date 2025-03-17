import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../domain/repository/user.repository.interface';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../user.tokens';
import { Option } from 'effect/Option';
import { User } from '../../../domain/entity/user.entity';
import { GetUserByIdQuery } from '../../query/get-user-by-id.query';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<Option<User>> {
    return await this.userRepository.getUserById(query.id);
  }
}
