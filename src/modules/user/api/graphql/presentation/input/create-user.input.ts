import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @IsStrongPassword(
    {
      minLength: 8,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one symbol',
    },
  )
  password!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName!: string;
}
