import { UserParams } from '../../api/rest/params/user.params';

export class GetAllUsersQuery {
  constructor(readonly params?: UserParams) {}
}
