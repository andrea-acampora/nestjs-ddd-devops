import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserFilterParams {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;
}
