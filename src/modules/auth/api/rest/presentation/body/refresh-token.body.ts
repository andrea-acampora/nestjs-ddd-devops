import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenBody {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  token!: string;
}
