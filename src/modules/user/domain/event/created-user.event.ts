import { DomainEvent } from '../../../../libs/ddd/domain-event.abstract';
import { IEvent } from '@nestjs/cqrs';
import { User } from '../entity/user.entity';
import { v4 } from 'uuid';

export class CreatedUserEvent extends DomainEvent<User> implements IEvent {
  constructor(
    user: User,
    options: { correlationId?: string; version?: number } = {},
  ) {
    super(v4(), 'CreatedUserEvent', user, options);
  }
}
