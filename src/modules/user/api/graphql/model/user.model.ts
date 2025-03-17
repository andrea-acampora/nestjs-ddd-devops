import { Field, ObjectType } from '@nestjs/graphql';

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
