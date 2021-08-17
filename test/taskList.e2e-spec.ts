import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';

describe('TaskListsController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

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

  it('/tasklist fails for empty body (POST)', async () => {
    return request(app.getHttpServer())
      .post(`/tasklists`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/tasklists fails dto validation (POST)', async () => {
    return request(app.getHttpServer())
      .post(`/tasklists`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })
      .expect(400);
  });

  it('/tasklists succeeds for valid body (POST)', async () => {
    const random = Math.random() * 100 + 10;

    return request(app.getHttpServer())
      .post(`/tasklists`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test List ${random}` })
      .expect(201);
  });

  it('/tasklists/:id succeeds for valid id (GET)', async () => {
    const random = Math.random() * 100 + 10;
    const result = await request(app.getHttpServer())
      .post('/tasklists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test List ${random}` });

    return request(app.getHttpServer())
      .get(`/tasklists/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/tasklists/:id returns null for invalid id (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/tasklists/0`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(response => response.body === null);
  });

  it('/tasklists returns a list of tasklists (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/tasklists/:id fails for empty body (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const result = await request(app.getHttpServer())
      .post('/tasklists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test List ${random}` });

    return request(app.getHttpServer())
      .patch(`/tasklists/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/tasklists/:id fails dto validaton (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const result = await request(app.getHttpServer())
      .post('/tasklists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test List ${random}` });

    return request(app.getHttpServer())
      .patch(`/tasklists/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })
      .expect(400);
  });

  it('/tasklists/:id succeeds for valid dto (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const result = await request(app.getHttpServer())
      .post('/tasklists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test List ${random}` });

    return request(app.getHttpServer())
      .patch(`/tasklists/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: result.body.id, name: `Test ${random} List` })
      .expect(200);
  });

  it('/tasklists/:id fails for invalid id (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/tasklists/0`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/tasklists/:id succeeds for valid id (DELETE)', async () => {
    const random = Math.random() * 100 + 10;
    const result = await request(app.getHttpServer())
      .post('/tasklists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: `Test List ${random}` });

    return request(app.getHttpServer())
      .delete(`/tasklists/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
