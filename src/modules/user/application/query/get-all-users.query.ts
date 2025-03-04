import { UserParams } from '../../api/params/user.params';

export class GetAllUsersQuery {
  constructor(readonly params: UserParams) {}
}
