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
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    await request(app.getHttpServer()).post('/seeder');
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

  it('/auth/refresh fails for empty refresh token (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ accessToken: '', refreshToken: '', email: 'test@test.net' })
      .expect(400);
  });

  it('/auth/refresh fails for invalid refresh token (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        accessToken: '',
        refreshToken: 'fadsfgwefgasd',
        email: 'test@test.net',
      })
      .expect(400);
  });

  it('/auth/refresh succeeds for valid refresh token (POST)', async () => {
    const result = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.net', password: 'QWE12345rty$' });

    const body = result.body;

    return request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        email: 'test@test.net',
      })
      .expect(200);
  });

  it('/auth/switch fails for empty body (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.net', password: 'QWE12345rty$' });
    const token = response.body.accessToken;

    return request(app.getHttpServer())
      .post('/auth/switch')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/auth/switch fails dto validation (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.net', password: 'QWE12345rty$' });
    const token = response.body.accessToken;

    return request(app.getHttpServer())
      .post('/auth/switch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        accessToken: '',
        refreshToken: '',
        workspaceName: '',
        workspaceId: 0,
      })
      .expect(400);
  });

  it('/auth/switch fails if user does not belong to workspace (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.net', password: 'QWE12345rty$' });
    const extraUserResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test2@test.net', password: 'QWE12345rty$' });
    const token = response.body.accessToken;

    return request(app.getHttpServer())
      .post('/auth/switch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        accessToken: token,
        refreshToken: response.body.refreshToken,
        workspaceName: extraUserResponse.body.workspaces[0].workspaceName,
        workspaceId: extraUserResponse.body.workspaces[0].id,
      })
      .expect(400);
  });

  it('/auth/switch succeeds for valid DTO (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.net', password: 'QWE12345rty$' });
    const token = response.body.accessToken;

    return request(app.getHttpServer())
      .post('/auth/switch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        accessToken: token,
        refreshToken: response.body.refreshToken,
        workspaceName: response.body.workspaces[1].workspaceName,
        workspaceId: response.body.workspaces[1].id,
      })
      .expect(200);
  });
});
