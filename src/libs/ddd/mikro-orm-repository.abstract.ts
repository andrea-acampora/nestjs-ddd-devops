import { EntityManager, EntityRepository, FilterQuery } from '@mikro-orm/core';
import { fromNullable, getOrThrowWith, Option } from 'effect/Option';
import { Repository } from './repository.interface';
import { Collection } from '../api/rest/collection.interface';
import { BaseEntity } from './base-entity.interface';

export abstract class MikroOrmRepository<T extends BaseEntity>
  implements Repository<T>
{
  constructor(
    protected readonly repository: EntityRepository<T>,
    protected readonly em: EntityManager,
  ) {}

  async findById(id: number): Promise<Option<T>> {
    return fromNullable(
      await this.repository.findOne({ id } as FilterQuery<T>),
    );
  }

  async findAll(): Promise<Collection<T>> {
    const items = await this.repository.findAll();
    return { items, total: items.length };
  }

  async save(entity: T): Promise<T> {
    await this.repository.insert(entity);
    await this.em.flush();
    return entity;
  }

  async update(data: Partial<T>): Promise<T> {
    if (!data.id) throw new Error(`ID is required for updating`);
    const entity: T = getOrThrowWith(
      await this.findById(data.id),
      () => new Error(`Entity not found`),
    );
    for (const [key, value] of Object.entries(data)) {
      entity[key] = value;
    }
    await this.em.flush();
    return entity;
  }

  async delete(id: number): Promise<boolean> {
    const entity: T = getOrThrowWith(
      await this.findById(id),
      () => new Error(`Entity not found`),
    );
    if (!entity) return false;
    await this.em.removeAndFlush(entity);
    return true;
  }
}
