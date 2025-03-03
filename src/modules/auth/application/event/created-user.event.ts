import { DomainEvent } from '../../../../libs/ddd/domain-event.abstract';
import { AuthUser } from '../../api/presentation/dto/auth-user.dto';

export class CreatedUserEvent extends DomainEvent<AuthUser> {
  constructor(
    payload: AuthUser,
    options: { correlationId?: string; version?: number } = {},
  ) {
    super('CreatedUserEvent', payload, options);
  }
}
