import { Args, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { User } from '../../../domain/entity/user.entity';
import { getOrThrowWith, map } from 'effect/Option';
import { AuthRoles } from '../../../../../libs/decorator/auth.decorator';
import { ApiRole } from '../../../../../libs/api/api-role.enum';
import { GetUserByIdQuery } from '../../../application/query/get-user-by-id.query';
import { GraphQLError } from 'graphql/error';
import { UserModel } from '../model/user.model';
import { GetAllUsersQuery } from '../../../application/query/get-all-users.query';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRoles(ApiRole.ADMIN)
  @Query(() => [UserModel], {})
  async getUsers(): Promise<UserModel[]> {
    const users: User[] = await this.queryBus.execute(new GetAllUsersQuery());
    console.log(users);
    return users.map((it) => ({
      id: it.id,
      email: it.props.email,
      firstName: it.props.firstName,
      lastName: it.props.lastName,
      createdAt: it.props.createdAt,
    }));
  }

  @AuthRoles(ApiRole.ADMIN)
  @Query(() => UserModel, {})
  async getUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserModel> {
    return getOrThrowWith(
      map(
        await this.queryBus.execute(new GetUserByIdQuery(id)),
        (user: User) => ({
          id: user.id,
          email: user.props.email,
          firstName: user.props.firstName,
          lastName: user.props.lastName,
          createdAt: user.props.createdAt,
        }),
      ),
      () => new GraphQLError('User not found'),
    );
  }
}
