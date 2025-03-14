import { UserRole } from '../value-object/user-role.enum';
import { UserState } from '../value-object/user-state.enum';

export interface UserProps {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  state: UserState;
  createdAt?: Date;
  updatedAt?: Date;
}
