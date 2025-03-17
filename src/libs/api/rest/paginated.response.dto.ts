import { Collection } from './collection.interface';

export interface PaginatedResponse<E> {
  readonly data: E[];
  readonly offset: number;
  readonly limit: number;
  readonly total: number;
}

export const toPaginatedResponse = <E>(
  data: Collection<E>,
  offset: number,
  limit: number,
): PaginatedResponse<E> => {
  return {
    data: data.items,
    offset,
    limit,
    total: data.total,
  };
};
