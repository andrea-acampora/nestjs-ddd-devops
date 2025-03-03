import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UserRole } from '../value-object/user-role.enum';
import { UserState } from '../value-object/user-state.enum';

@Entity({
  tableName: 'users',
})
export class User {
  @PrimaryKey()
  id: string = v4();

  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  @Enum({ items: () => UserRole })
  role!: UserRole;

  @Enum({ items: () => UserState })
  state!: UserState;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
