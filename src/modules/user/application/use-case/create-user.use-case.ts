import { UseCase } from '../../../../libs/ddd/use-case.interface';
import { isSome, Option } from 'effect/Option';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/user.repository.interface';
import { genSalt, hash } from 'bcryptjs';
import { USER_REPOSITORY } from '../../user.tokens';
import { CustomConflictException } from '../../../../libs/exceptions/custom-conflict.exception';
import { UserProps } from '../../domain/data/user.props';
import { User } from '../../domain/entity/user.entity';

@Injectable()
export class CreateUserUseCase implements UseCase<UserProps, Option<User>> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: UserProps): Promise<Option<User>> {
    const hashedPassword = await hash(data.password, await genSalt());
    const found = await this.userRepository.getUserByEmail(data.email);
    if (isSome(found))
      throw new CustomConflictException(found.value.props.email);
    return await this.userRepository.createUser({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      state: data.state,
    });
  }
}
