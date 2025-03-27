import { UseCase } from '../../../../libs/ddd/use-case.interface';
import { isSome, map, Option } from 'effect/Option';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { AuthUser } from '../../api/rest/presentation/dto/auth-user.dto';
import { SignupBody } from '../../api/rest/presentation/body/signup.body';
import { RegisterUserCommand } from '../command/register-user.command';
import { GetAuthUserByEmailQuery } from '../query/get-auth-user-by-email.query';
import { CustomConflictException } from '../../../../libs/exceptions/custom-conflict.exception';
import { User } from '../../../user/domain/entity/user.entity';

@Injectable()
export class SignupUseCase implements UseCase<SignupBody, Option<AuthUser>> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(body: SignupBody): Promise<Option<AuthUser>> {
    const found: Option<User> = await this.queryBus.execute(
      new GetAuthUserByEmailQuery(body.email),
    );
    if (isSome(found))
      throw new CustomConflictException(found.value.props.email);
    return map(
      await this.commandBus.execute(
        new RegisterUserCommand(
          body.email,
          body.password,
          body.firstName,
          body.lastName,
        ),
      ),
      (user: User) => ({
        id: user.id,
        email: user.props.email,
        role: user.props.role,
      }),
    );
  }
}
