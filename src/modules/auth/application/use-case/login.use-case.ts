import { UseCase } from '../../../../libs/ddd/use-case.interface';
import { LoginBody } from '../../api/presentation/body/login.body';
import { fromNullable, isNone, none, Option } from 'effect/Option';
import { QueryBus } from '@nestjs/cqrs';
import { User } from '../../../user/domain/entity/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserState } from '../../../user/domain/value-object/user-state.enum';
import { compare } from 'bcryptjs';
import { AuthUser } from '../../api/presentation/dto/auth-user.dto';
import { GetAuthUserByEmailQuery } from '../query/get-auth-user-by-email.query';

@Injectable()
export class LoginUseCase implements UseCase<LoginBody, Option<AuthUser>> {
  constructor(private readonly queryBus: QueryBus) {}

  async execute(body: LoginBody): Promise<Option<AuthUser>> {
    const user: Option<User> = await this.queryBus.execute(
      new GetAuthUserByEmailQuery(body.email),
    );
    if (isNone(user) || user.value.state !== UserState.ACTIVE) return none();
    const match = await compare(body.password, user.value.password);
    if (!match) throw new UnauthorizedException('Invalid Credentials!');
    return fromNullable({
      id: user.value.id,
      email: user.value.email,
      role: user.value.role,
    });
  }
}
