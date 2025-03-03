import { UserState } from '../value-object/user-state.enum';
import { UserRole } from '../value-object/user-role.enum';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  state: UserState;
}
