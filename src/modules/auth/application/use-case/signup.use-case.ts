import { UseCase } from '../../../../libs/ddd/use-case.interface';
import { isSome, map, Option } from 'effect/Option';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { AuthUser } from '../../api/presentation/dto/auth-user.dto';
import { SignupBody } from '../../api/presentation/body/signup.body';
import { CreateUserCommand } from '../command/create-user.command';
import { GetAuthUserByEmailQuery } from '../query/get-auth-user-by-email.query';
import { User } from '../../../user/domain/entity/user.entity';
import { CustomConflictException } from '../../../../libs/exceptions/custom-conflict.exception';
import { genSalt, hash } from 'bcryptjs';
import { CreatedUserEvent } from '../event/created-user.event';

@Injectable()
export class SignupUseCase implements UseCase<SignupBody, Option<AuthUser>> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(body: SignupBody): Promise<Option<AuthUser>> {
    const found: Option<User> = await this.queryBus.execute(
      new GetAuthUserByEmailQuery(body.email),
    );
    if (isSome(found)) throw new CustomConflictException(found.value.email);
    const hashedPassword = await hash(body.password, await genSalt());
    const createdUser: Option<User> = await this.commandBus.execute(
      new CreateUserCommand(
        body.email,
        hashedPassword,
        body.firstName,
        body.lastName,
      ),
    );
    return map(createdUser, (user: User) => ({
      id: user.id,
      email: user.email,
      role: user.role,
    })).pipe((authUser: Option<AuthUser>) => {
      if (isSome(authUser))
        this.eventBus.publish(new CreatedUserEvent(authUser.value));
      return authUser;
    });
  }
}
