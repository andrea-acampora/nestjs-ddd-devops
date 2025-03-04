import { Option } from 'effect/Option';
import { User } from '../entity/user.entity';
import { CreateUserData } from '../data/create-user.data';
import { Collection } from '../../../../libs/api/collection.interface';
import { PaginatedQueryParams } from '../../../../libs/api/paginated-query-params.dto';

export interface UserRepository {
  createUser(data: CreateUserData): Promise<Option<User>>;
  getUserByEmail(email: string): Promise<Option<User>>;
  checkActiveUserById(id: string): Promise<boolean>;
  getAllUsers<T extends PaginatedQueryParams>(
    params: T,
  ): Promise<Collection<User>>;
}
