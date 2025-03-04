import { User } from '../../domain/entity/user.entity';
import { fromNullable, isSome, Option } from 'effect/Option';
import { UserRepository } from '../../domain/repository/user.repository.interface';
import { UserState } from '../../domain/value-object/user-state.enum';
import { CreateUserData } from '../../domain/data/create-user.data';
import { EntityRepository, QueryBuilder } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Collection } from '../../../../libs/api/collection.interface';
import { UserParams } from '../../api/params/user.params';
import { endOfDay, startOfDay } from 'date-fns';
import { SortingType } from '../../../../libs/api/sorting-type.enum';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly mikroOrmRepository: EntityRepository<User>,
  ) {}
  async getUserByEmail(email: string): Promise<Option<User>> {
    return fromNullable(await this.mikroOrmRepository.findOne({ email }));
  }

  async checkActiveUserById(id: string): Promise<boolean> {
    return isSome(
      fromNullable(
        await this.mikroOrmRepository.findOne({ id, state: UserState.ACTIVE }),
      ),
    );
  }

  async createUser(data: CreateUserData): Promise<Option<User>> {
    const entity = this.mikroOrmRepository.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      state: data.state,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.mikroOrmRepository.insert(entity);
    return fromNullable(entity);
  }

  async getAllUsers(params?: UserParams): Promise<Collection<User>> {
    const queryBuilder = this.mikroOrmRepository.createQueryBuilder('user');
    if (params) this.applyFilters(queryBuilder, params);
    const [items, total] = await queryBuilder.getResultAndCount();
    return {
      items,
      total,
    };
  }

  private applyFilters(queryBuilder: QueryBuilder<User>, params: UserParams) {
    const filters = [
      params.filter?.id && {
        id: params.filter.id,
      },
      params.filter?.firstName && {
        firstName: {
          $ilike: `%${params.filter.firstName}%`,
        },
      },
      params.filter?.lastName && {
        lastName: {
          $ilike: `%${params.filter.lastName}%`,
        },
      },
      params.filter?.email && {
        email: {
          $ilike: `%${params.filter.email}%`,
        },
      },
      params.filter?.createdAt && {
        createdAt: {
          $gte: startOfDay(params.filter.createdAt),
          $lte: endOfDay(params.filter.createdAt),
        },
      },
    ];
    filters.filter(Boolean).forEach((filter) => {
      if (filter) queryBuilder.andWhere(filter);
    });
    if (params.sort?.createdAt)
      queryBuilder.orderBy({ createdAt: params?.sort?.createdAt });
    else queryBuilder.orderBy({ createdAt: SortingType.DESC });
    queryBuilder.offset(params.offset);
    queryBuilder.limit(params.limit);
  }
}
