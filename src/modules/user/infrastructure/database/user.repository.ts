import { EntityRepository } from '@mikro-orm/core';
import { User } from '../../domain/entity/user.entity';
import { fromNullable, Option } from 'effect/Option';

export class UserRepository extends EntityRepository<User> {
  async getUserByEmail(email: string): Promise<Option<User>> {
    return fromNullable(await this.findOne({ email }));
  }
}
