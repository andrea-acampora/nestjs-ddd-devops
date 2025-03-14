import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../../../../auth/application/command/register-user.command';
import { CREATE_USER_USE_CASE } from '../../../user.tokens';
import { Inject } from '@nestjs/common';
import { Option } from 'effect/Option';
import { UserState } from '../../../domain/value-object/user-state.enum';
import { CreateUserUseCase } from '../../use-case/create-user.use-case';
import { UserRole } from '../../../domain/value-object/user-role.enum';
import { User } from '../../../domain/entity/user.entity';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject(CREATE_USER_USE_CASE)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}
  async execute(command: RegisterUserCommand): Promise<Option<User>> {
    return await this.createUserUseCase.execute({
      firstName: command.firstName,
      lastName: command.lastName,
      password: command.password,
      email: command.email,
      role: UserRole.USER,
      state: UserState.ACTIVE,
    });
  }
}
