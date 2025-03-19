import { UserParams } from '../../api/rest/presentation/params/user.params';

export class GetAllUsersQuery {
  constructor(readonly params?: UserParams) {}
}
