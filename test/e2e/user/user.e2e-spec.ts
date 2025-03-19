import { HttpStatus, INestApplication } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { initializeApp, resetDatabase } from '../util/setup-e2e-test.util';
import * as request from 'supertest';
import { CreateUserBody } from '../../../src/modules/user/api/rest/presentation/body/create-user.body';

describe('User (E2E)', () => {
  let app: INestApplication;
  let orm: MikroORM;

  beforeAll(async () => {
    ({ app, orm } = await initializeApp());
    await resetDatabase(orm);
  });

  afterAll(async () => {
    await app.close();
  });

  const user: CreateUserBody = {
    email: 'user@email.com',
    password: 'Test1234!',
    firstName: 'Andrea',
    lastName: 'Acampora',
  };

  it('should not be possible to create a user without admin permissions', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('should be possible to create a user by an admin', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${await getAdminToken()}`)
      .send(user)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('should be possible to retrieve the users list by an admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${await getAdminToken()}`)
      .expect(HttpStatus.OK);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  const getAdminToken = async () => {
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@email.com', password: 'Test1234!' })
      .expect(HttpStatus.CREATED);
    return adminLoginResponse.body.token;
  };
});
