import { User } from '../../../../domain/entity/user.entity';

export interface UserDto {
  id: string;

  firstName?: string;

  lastName?: string;

  email: string;

  createdAt?: Date;
}

export const toUserDto = (user: User): UserDto => ({
  id: user.id,
  firstName: user.props.firstName,
  lastName: user.props.lastName,
  email: user.props.email,
  createdAt: user.props.createdAt,
});
