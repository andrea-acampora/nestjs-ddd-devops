import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { AppModule } from '../../../src/app.module';

export async function initializeApp(): Promise<{
  app: INestApplication;
  orm: MikroORM;
}> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.init();
  const orm = app.get<MikroORM>(MikroORM);
  return { app, orm };
}

export async function resetDatabase(orm: MikroORM): Promise<void> {
  await clearDatabase(orm);
  await orm.getMigrator().up();
}

export async function clearDatabase(orm: MikroORM): Promise<void> {
  await orm.getSchemaGenerator().refreshDatabase();
  await orm.getSchemaGenerator().updateSchema();
  await orm.getMigrator().down();
  await orm.getSchemaGenerator().updateSchema();
}
