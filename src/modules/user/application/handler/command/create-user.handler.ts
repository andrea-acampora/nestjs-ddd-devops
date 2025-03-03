import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../../../auth/application/command/create-user.command';
import { USER_REPOSITORY } from '../../../user.tokens';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../domain/repository/user.repository.interface';
import { Option } from 'effect/Option';
import { User } from '../../../domain/entity/user.entity';
import { UserRole } from '../../../domain/value-object/user-role.enum';
import { UserState } from '../../../domain/value-object/user-state.enum';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}
  async execute(command: CreateUserCommand): Promise<Option<User>> {
    return await this.userRepository.createUser({
      email: command.email,
      password: command.password,
      firstName: command.firstName,
      lastName: command.lastName,
      role: UserRole.USER,
      state: UserState.ACTIVE,
    });
  }
}
