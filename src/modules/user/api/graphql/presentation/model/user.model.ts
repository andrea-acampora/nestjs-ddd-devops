import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../../domain/entity/user.entity';

@ObjectType()
export class UserModel {
  @Field(() => String)
  readonly id!: string;

  @Field({ nullable: true })
  readonly firstName?: string;

  @Field({ nullable: true })
  readonly lastName?: string;

  @Field(() => String)
  readonly email!: string;

  @Field(() => Date, { nullable: true })
  readonly createdAt?: Date;
}

export const toUserModel = (user: User): UserModel => ({
  id: user.id,
  firstName: user.props.firstName,
  lastName: user.props.lastName,
  email: user.props.email,
  createdAt: user.props.createdAt,
});
