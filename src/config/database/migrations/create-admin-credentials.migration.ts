import { Migration } from '@mikro-orm/migrations';
import { genSalt, hash } from 'bcryptjs';
import { v4 } from 'uuid';

export class CreateAdminCredentialsMigration extends Migration {
  async up(): Promise<void> {
    await this.getEntityManager()
      .getConnection()
      .execute(
        `INSERT INTO users (id, email, password, first_name, last_name, role, state, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING`,
        [
          v4(),
          'admin@email.com',
          await hash('Test1234!', await genSalt()),
          'Admin',
          'Admin',
          0,
          'ACTIVE',
        ],
      );
  }

  async down(): Promise<void> {
    await this.getEntityManager()
      .getConnection()
      .execute(`DELETE FROM users WHERE role = 0`);
  }
}
