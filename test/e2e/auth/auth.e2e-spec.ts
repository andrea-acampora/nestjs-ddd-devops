import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MikroORM } from '@mikro-orm/core';
import { AppModule } from '../../../src/app.module';

describe('Auth (E2E)', () => {
  let app: INestApplication;
  let orm: MikroORM;

  const credentials = {
    email: 'test@example.com',
    password: 'Test1234!',
    firstName: 'John',
    lastName: 'Doe',
  };

  const initializeApp = async () => {
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
    orm = app.get<MikroORM>(MikroORM);
  };

  const resetDatabase = async () => {
    await orm.getSchemaGenerator().refreshDatabase();
  };

  beforeAll(async () => {
    await initializeApp();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  const userFactory = (overrides = {}) => ({
    ...credentials,
    ...overrides,
  });

  it('should fail to create a user with a weak password', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userFactory({ password: '1234' })) // Weak password
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should sign up a user successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userFactory())
      .expect(HttpStatus.CREATED);
    expect(response.body).toMatchObject({
      token: expect.any(String),
      expiresIn: expect.any(String),
      refreshToken: expect.any(String),
      refreshExpiresIn: expect.any(String),
      user: {
        id: expect.any(String),
        email: credentials.email,
        role: expect.any(Number),
      },
    });
  });

  it('should not allow duplicate signups', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userFactory())
      .expect(HttpStatus.CREATED);
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userFactory())
      .expect(HttpStatus.CONFLICT);
  });

  it('should return 400 for invalid email format', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(userFactory({ email: 'wrong-email' }))
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return 400 for incorrect password format', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(userFactory({ password: 'wrong' }))
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should return 401 for invalid login credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should login an existing user', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userFactory())
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(HttpStatus.CREATED);
    expect(response.body).toMatchObject({
      token: expect.any(String),
      expiresIn: expect.any(String),
      refreshToken: expect.any(String),
      refreshExpiresIn: expect.any(String),
      user: {
        id: expect.any(String),
        email: credentials.email,
        role: expect.any(Number),
      },
    });
  });
});
