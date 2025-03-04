import { UserRole } from '../../domain/value-object/user-role.enum';

export class CreateUserCommand {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly role: UserRole,
  ) {}
}
