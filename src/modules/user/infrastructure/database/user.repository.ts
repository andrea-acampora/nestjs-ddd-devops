import { User } from '../../domain/entity/user.entity';
import { fromNullable, isSome, Option } from 'effect/Option';
import { UserRepository } from '../../domain/repository/user.repository.interface';
import { UserState } from '../../domain/value-object/user-state.enum';
import { CreateUserData } from '../../domain/data/create-user.data';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

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
}
