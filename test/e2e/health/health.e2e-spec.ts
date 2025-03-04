import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MikroORM } from '@mikro-orm/core';
import { initializeApp, resetDatabase } from '../util/setup-e2e-test.util';

describe('HealthCheck (E2E)', () => {
  let app: INestApplication;
  let orm: MikroORM;

  beforeAll(async () => {
    ({ app, orm } = await initializeApp());
    await resetDatabase(orm);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should always return 200', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });
});
