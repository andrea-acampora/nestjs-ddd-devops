import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  entities: ['dist/**/*.schema.js'],
  entitiesTs: ['src/**/*.schema.ts'],
  dbName: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  extensions: [Migrator],
  migrations: {
    tableName: 'migrations',
    path: 'src/config/database/migrations',
  },
});
