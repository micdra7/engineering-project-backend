import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const connection = app.get(Connection);
    await connection.close();
  });

  it('/users/register fails with empty body (POST)', () => {
    return request(app.getHttpServer()).post('/users/register').expect(400);
  });

  it('/users/register fails dto validation with empty field (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'test123@test.net',
        firstName: '',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: 'Test123 Workspace',
      })
      .expect(400);
  });

  it('/users/register fails dto validation with invalid email (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'test',
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: 'Test123 Workspace',
      })
      .expect(400);
  });

  it('/users/register successfully registers (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: `test${Math.random() * 10}@test.net`,
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: `Test${Math.random() * 10} Workspace`,
      })
      .expect(201);
  });

  it('/users/authenticate fails with empty body (POST)', () => {
    return request(app.getHttpServer()).post('/users/authenticate').expect(400);
  });

  it('/users/authenticate fails dto validation (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/authenticate')
      .send({ email: '', password: '' })
      .expect(400);
  });

  it('/users/authenticate fails for invalid credentials (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/authenticate')
      .send({ email: 'test1@test.net', password: 'QWE12345rty$' })
      .expect(400);
  });

  it('/users/authenticate succeeds for valid credentials (POST)', () => {
    return request(app.getHttpServer())
      .post('/users/authenticate')
      .send({ email: 'test1@test.net', password: 'QWE12345rty$' })
      .expect(200);
  });
});
