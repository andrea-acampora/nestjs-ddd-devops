import { Option } from 'effect/Option';
import { Collection } from '../../../../libs/api/collection.interface';
import { PaginatedQueryParams } from '../../../../libs/api/paginated-query-params.dto';
import { User } from '../entity/user.entity';
import { UserProps } from '../data/user.props';

export interface UserRepository {
  createUser(data: UserProps): Promise<Option<User>>;

  getUserByEmail(email: string): Promise<Option<User>>;

  checkActiveUserById(id: string): Promise<boolean>;

  getAllUsers<T extends PaginatedQueryParams>(
    params: T,
  ): Promise<Collection<User>>;
}
