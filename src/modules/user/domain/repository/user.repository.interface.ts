import { Option } from 'effect/Option';
import { Collection } from '../../../../libs/api/rest/collection.interface';
import { PaginatedQueryParams } from '../../../../libs/api/rest/paginated-query-params.dto';
import { User, UserProps } from '../entity/user.entity';

export interface UserRepository {
  createUser(data: UserProps): Promise<Option<User>>;

  getUserByEmail(email: string): Promise<Option<User>>;

  getUserById(id: string): Promise<Option<User>>;

  checkActiveUserById(id: string): Promise<boolean>;

  getAllUsers<T extends PaginatedQueryParams>(
    params?: T,
  ): Promise<Collection<User>>;
}
