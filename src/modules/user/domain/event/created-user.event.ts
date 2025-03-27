import { DomainEvent } from '../../../../libs/ddd/domain-event.abstract';
import { IEvent } from '@nestjs/cqrs';
import { User } from '../entity/user.entity';

export class CreatedUserEvent extends DomainEvent<User> implements IEvent {
  constructor(
    user: User,
    options: { correlationId?: string; version?: number } = {},
  ) {
    super('CreatedUserEvent', user, options);
  }
}
