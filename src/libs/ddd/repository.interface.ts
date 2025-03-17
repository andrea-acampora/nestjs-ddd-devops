import { Option } from 'effect/Option';
import { Collection } from '../api/rest/collection.interface';

export interface Repository<T> {
  findById(id: number): Promise<Option<T>>;

  findAll(): Promise<Collection<T>>;

  save(entity: T): Promise<T>;

  update(data: Partial<T>): Promise<T>;

  delete(id: number): Promise<boolean>;
}
