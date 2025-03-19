import { PaginatedQueryParams } from '../../../../../../libs/api/rest/paginated-query-params.dto';
import { UserFilterParams } from './user-filter.params';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UserSortParams } from './user-sort.params';

export class UserParams extends PaginatedQueryParams {
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFilterParams)
  filter?: UserFilterParams;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserSortParams)
  sort?: UserSortParams;
}
