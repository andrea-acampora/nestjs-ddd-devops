import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../domain/repository/user.repository.interface';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../user.tokens';
import { GetAllUsersQuery } from '../../query/get-all-users.query';
import { Collection } from '../../../../../libs/api/rest/collection.interface';
import { UserDto } from '../../../api/rest/dto/user.dto';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query?: GetAllUsersQuery): Promise<Collection<UserDto>> {
    const users = await this.userRepository.getAllUsers(query?.params);
    return {
      items: users.items.map(
        (user): UserDto => ({
          email: user.props.email,
          id: user.id,
          firstName: user.props.firstName,
          lastName: user.props.lastName,
          createdAt: user.props.createdAt,
        }),
      ),
      total: users.total,
    };
  }
}
