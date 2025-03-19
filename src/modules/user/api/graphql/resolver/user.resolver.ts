import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../../domain/entity/user.entity';
import { getOrThrowWith, map } from 'effect/Option';
import { AuthRoles } from '../../../../../libs/decorator/auth.decorator';
import { ApiRole } from '../../../../../libs/api/api-role.enum';
import { GetUserByIdQuery } from '../../../application/query/get-user-by-id.query';
import { toUserModel, UserModel } from '../presentation/model/user.model';
import { GetAllUsersQuery } from '../../../application/query/get-all-users.query';
import { CreateUserInput } from '../presentation/input/create-user.input';
import { CreateUserCommand } from '../../../application/command/create-user.command';
import { UserRole } from '../../../domain/value-object/user-role.enum';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';
import { Collection } from '../../../../../libs/api/rest/collection.interface';
import { HttpStatus } from '@nestjs/common';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @AuthRoles(ApiRole.ADMIN)
  @Mutation(() => String)
  async createUser(@Args('input') input: CreateUserInput) {
    return getOrThrowWith(
      map(
        await this.commandBus.execute(
          new CreateUserCommand(
            input.email,
            input.password,
            input.firstName,
            input.lastName,
            UserRole.USER,
          ),
        ),
        (user: User) => user.id,
      ),
      () =>
        new GraphQLException('Error in User Creation', {
          extensions: {
            http: {
              status: HttpStatus.BAD_REQUEST,
            },
          },
        }),
    );
  }

  @AuthRoles(ApiRole.ADMIN)
  @Query(() => [UserModel])
  async getUsers(): Promise<UserModel[]> {
    const users: Collection<User> = await this.queryBus.execute(
      new GetAllUsersQuery(),
    );
    return users.items.map(toUserModel);
  }

  @AuthRoles(ApiRole.ADMIN)
  @Query(() => UserModel, {})
  async getUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserModel> {
    return getOrThrowWith(
      map(await this.queryBus.execute(new GetUserByIdQuery(id)), toUserModel),
      () =>
        new GraphQLException('User Not Found', {
          extensions: {
            http: {
              status: HttpStatus.NOT_FOUND,
            },
          },
        }),
    );
  }
}
