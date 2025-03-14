import { Injectable } from '@nestjs/common';
import { Mapper } from '../../../../../libs/ddd/mapper.interface';
import { User } from '../../../domain/entity/user.entity';
import { UserSchema } from '../schema/user.schema';

@Injectable()
export class UserMapper implements Mapper<User, UserSchema> {
  toDomain(record: UserSchema): User {
    return new User(record.id, {
      email: record.email,
      password: record.password,
      firstName: record.firstName,
      lastName: record.lastName,
      role: record.role,
      state: record.state,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  toPersistence(entity: User): UserSchema {
    const props = entity.props;
    return {
      id: entity.id,
      email: props.email,
      password: props.password,
      firstName: props.firstName,
      lastName: props.lastName,
      role: props.role,
      state: props.state,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    } as UserSchema;
  }
}
