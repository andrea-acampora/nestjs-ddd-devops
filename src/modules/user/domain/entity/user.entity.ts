import { AggregateRoot } from '@nestjs/cqrs';
import { UserRole } from '../value-object/user-role.enum';
import { UserState } from '../value-object/user-state.enum';
import { CreatedUserEvent } from '../event/created-user.event';

export interface UserProps {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  state: UserState;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot {
  id: string;
  props: UserProps;

  constructor(id: string, props: UserProps) {
    super();
    this.id = id;
    this.props = props;
  }

  create() {
    this.apply(new CreatedUserEvent(this));
  }
}
