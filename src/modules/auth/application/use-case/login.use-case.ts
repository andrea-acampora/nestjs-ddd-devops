import { UseCase } from '../../../../libs/ddd/use-case.interface';
import { LoginBody } from '../../api/rest/presentation/body/login.body';
import { fromNullable, isNone, none, Option } from 'effect/Option';
import { QueryBus } from '@nestjs/cqrs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserState } from '../../../user/domain/value-object/user-state.enum';
import { compare } from 'bcryptjs';
import { AuthUser } from '../../api/rest/presentation/dto/auth-user.dto';
import { GetAuthUserByEmailQuery } from '../query/get-auth-user-by-email.query';
import { User } from '../../../user/domain/entity/user.entity';

@Injectable()
export class LoginUseCase implements UseCase<LoginBody, Option<AuthUser>> {
  constructor(private readonly queryBus: QueryBus) {}

  async execute(body: LoginBody): Promise<Option<AuthUser>> {
    const user: Option<User> = await this.queryBus.execute(
      new GetAuthUserByEmailQuery(body.email),
    );
    if (isNone(user) || user.value.props.state !== UserState.ACTIVE)
      return none();
    const match = await compare(body.password, user.value.props.password);
    if (!match) throw new UnauthorizedException('Invalid Credentials!');
    return fromNullable({
      id: user.value.id,
      email: user.value.props.email,
      role: user.value.props.role,
    });
  }
}
