import { IsEnum, IsOptional } from 'class-validator';
import { SortingType } from '../../../../libs/api/sorting-type.enum';
import { Type } from 'class-transformer';

export class UserSortParams {
  @IsOptional()
  @IsEnum(SortingType)
  @Type(() => String)
  createdAt?: SortingType = SortingType.DESC;
}
