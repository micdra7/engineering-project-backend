import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    const connection = app.get(Connection);
    await connection.close();
  });

  it('/auth/register fails with empty body (POST)', () => {
    return request(app.getHttpServer()).post('/auth/register').expect(400);
  });

  it('/auth/register fails dto validation with empty field (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test123@test.net',
        firstName: '',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: 'Test123 Workspace',
      })
      .expect(400);
  });

  it('/auth/register fails dto validation with invalid email (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test',
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: 'Test123 Workspace',
      })
      .expect(400);
  });

  it('/auth/register successfully registers (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test${Math.random() * 10}@test.net`,
        firstName: 'John',
        lastName: 'Doe',
        password: 'QWE12345rty$',
        workspaceName: `Test${Math.random() * 10} Workspace`,
      })
      .expect(201);
  });

  it('/auth/login fails with empty body (POST)', () => {
    return request(app.getHttpServer()).post('/auth/login').expect(401);
  });

  it('/auth/login fails dto validation (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: '', password: '' })
      .expect(401);
  });

  it('/auth/login fails for invalid credentials (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.net', password: 'QWE12345rty$a' })
      .expect(401);
  });

  it('/auth/login succeeds for valid credentials (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.net', password: 'QWE12345rty$' })
      .expect(200);
  });
});
