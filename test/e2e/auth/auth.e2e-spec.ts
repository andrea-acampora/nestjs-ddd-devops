import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { MikroORM } from '@mikro-orm/core';

describe('Auth (E2E)', () => {
  let app: INestApplication;
  const credentials = {
    email: 'test@example.com',
    password: 'Test1234!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    // Reset database before running tests
    const orm = app.get<MikroORM>(MikroORM);
    await orm.getSchemaGenerator().refreshDatabase();
    await orm.getSchemaGenerator().updateSchema();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fail to create a user with a wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'wrong-credentials@example.com',
        password: '1234',
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should sign up a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        ...credentials,
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should not allow duplicate signups', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        ...credentials,
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(HttpStatus.CONFLICT);
  });

  it('should return 400 Bad Request  for invalid email', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'wrong-email',
        password: 'Test1234!',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return 400 Bad Request  for invalid password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'correct-email@example.com',
        password: 'wrong',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return 401 Unauthorized for invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'email@example.com',
        password: 'Test1234!',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should login an existing user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(HttpStatus.CREATED);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refreshToken');
  });
});
