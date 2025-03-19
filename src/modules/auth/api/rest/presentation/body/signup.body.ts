import { LoginBody } from './login.body';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignupBody extends LoginBody {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;
}
