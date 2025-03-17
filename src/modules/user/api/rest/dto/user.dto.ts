import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field()
  readonly id!: string;

  @Field()
  readonly firstName?: string;

  @Field()
  readonly lastName?: string;

  @Field()
  readonly email!: string;

  @Field()
  readonly createdAt?: Date;
}
