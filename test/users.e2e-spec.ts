import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    await request(app.getHttpServer()).post('/seeder');
    token = await (
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.net', password: 'QWE12345rty$' })
    ).body.accessToken;
  });

  afterEach(async () => {
    const connection = app.get(Connection);
    await connection.close();
  });

  it('/users/:id fails for wrong id (PATCH)', async () => {
    const random = Math.random() * 100 + 10;

    const result = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test${random}@test.net`,
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: `Test${random} Workspace`,
      });

    const body = result.body;

    return request(app.getHttpServer())
      .patch(`/users/${-1}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...body })
      .expect(400);
  });

  it('/users/:id fails dto validation (PATCH)', async () => {
    const random = Math.random() * 100 + 10;

    const result = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test${random}@test.net`,
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: `Test${random} Workspace`,
      });

    const body = result.body;

    return request(app.getHttpServer())
      .patch(`/users/${body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...body, email: '' })
      .expect(400);
  });

  it('/users/:id fails for empty body (PATCH)', async () => {
    const random = Math.random() * 100 + 10;

    const result = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test${random}@test.net`,
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: `Test${random} Workspace`,
      });

    const body = result.body;

    return request(app.getHttpServer())
      .patch(`/users/${body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/users/:id fails if email is taken (PATCH)', async () => {
    const random = Math.random() * 100 + 10;

    const result = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test${random}@test.net`,
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: `Test${random} Workspace`,
      });

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test${random + 1}@test.net`,
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: `Test${random + 1} Workspace`,
      });

    const body = result.body;

    return request(app.getHttpServer())
      .patch(`/users/${body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: `test${random + 1}@test.net`,
        firstName: 'John',
        lastName: 'Doe',
      })
      .expect(400);
  });

  it('/users/:id succeeds for valid body (PATCH)', async () => {
    const random = Math.random() * 100 + 10;

    const result = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test${random}@test.net`,
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: `Test${random} Workspace`,
      });

    const body = result.body;

    return request(app.getHttpServer())
      .patch(`/users/${body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...body, firstName: 'Mike' })
      .expect(200);
  });

  it('/users successfully returns first 10 (or max) records if no pagination params are specified', async () => {
    return request(app.getHttpServer())
      .get(`/users`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(
        response =>
          (response.body.data.length === 10 ||
            response.body.data.length === response.body.meta.totalItems) &&
          response.body.meta.currentPage === 1,
      );
  });

  it('/users successfully returns randomly selected number of (or max) records if only limit is specified', async () => {
    const limit = Math.ceil(Math.random() * 100 + 10);

    return request(app.getHttpServer())
      .get(`/users?limit=${limit}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(
        response =>
          (response.body.data.length === limit ||
            response.body.data.length === response.body.meta.totalItems) &&
          response.body.meta.currentPage === 1,
      );
  });

  it('/users successfully returns 1 item from 2nd page', async () => {
    return request(app.getHttpServer())
      .get('/users?page=2&limit=1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(
        response =>
          (response.body.data.length === 1 ||
            response.body.data.length === response.body.meta.totalItems) &&
          response.body.meta.currentPage === 2,
      );
  });
});
