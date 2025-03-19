import { ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';
import { Paginated } from '../../../../../../libs/api/graphql/paginated.type';

@ObjectType()
export class PaginatedUser extends Paginated(UserModel) {}
