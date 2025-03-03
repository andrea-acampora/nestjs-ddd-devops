import { Option } from 'effect/Option';
import { User } from '../entity/user.entity';
import { CreateUserData } from '../data/create-user.data';

export interface UserRepository {
  createUser(data: CreateUserData): Promise<Option<User>>;
  getUserByEmail(email: string): Promise<Option<User>>;
  checkActiveUserById(id: string): Promise<boolean>;
}
