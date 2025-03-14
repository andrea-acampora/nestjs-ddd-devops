import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Option } from 'effect/Option';
import { CreateUserCommand } from '../../command/create-user.command';
import { CreateUserUseCase } from '../../use-case/create-user.use-case';
import { CREATE_USER_USE_CASE } from '../../../user.tokens';
import { UserState } from '../../../domain/value-object/user-state.enum';
import { User } from '../../../domain/entity/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(CREATE_USER_USE_CASE)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}
  async execute(command: CreateUserCommand): Promise<Option<User>> {
    return await this.createUserUseCase.execute({
      firstName: command.firstName,
      lastName: command.lastName,
      password: command.password,
      email: command.email,
      role: command.role,
      state: UserState.ACTIVE,
    });
  }
}
