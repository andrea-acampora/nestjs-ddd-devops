import { ICommand } from '@nestjs/cqrs';

export class RegisterUserCommand implements ICommand {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly firstName: string,
    readonly lastName: string,
  ) {}
}
