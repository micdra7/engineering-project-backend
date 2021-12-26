import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    await await request(app.getHttpServer()).post('/seeder');
    token = await (
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.net', password: 'Qwerty123!' })
    ).body.accessToken;
  });

  afterAll(async () => {
    const connection = app.get(Connection);
    await connection.close();
  });

  it('/tasks fails for empty body (POST)', async () => {
    return request(app.getHttpServer())
      .post(`/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/tasks fails dto validation (POST)', async () => {
    return request(app.getHttpServer())
      .post(`/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })
      .expect(400);
  });

  it('/tasks succeeds for valid body (POST)', async () => {
    const random = Math.random() * 100 + 10;

    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);

    return request(app.getHttpServer())
      .post(`/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      })
      .expect(201);
  });

  it('/tasks returns a list of all tasks (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/tasks/:id returns null for invalid id (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/tasks/0`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(response => response.body === null);
  });

  it('/tasks/:id returns task for valid id (GET)', async () => {
    const random = Math.random() * 100 + 10;
    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);

    const result = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      });

    return request(app.getHttpServer())
      .get(`/tasks/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/tasks/:id fails for empty body (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);
    const result = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      });

    return request(app.getHttpServer())
      .patch(`/tasks/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/tasks/:id fails dto validation (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);
    const result = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      });

    return request(app.getHttpServer())
      .patch(`/tasks/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })
      .expect(400);
  });

  it('/tasks/:id succeeds for valid body (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);
    const result = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      });

    return request(app.getHttpServer())
      .patch(`/tasks/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: result.body.id,
        name: `Test Task ${random + 1}`,
        description: `Test Task ${random + 1} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      })
      .expect(200);
  });

  it('/tasks/:id fails for invalid id (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/tasks/0`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/tasks/:id removes task for valid id (DELETE)', async () => {
    const random = Math.random() * 100 + 10;
    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);
    const result = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      });

    return request(app.getHttpServer())
      .delete(`/tasks/${result.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/tasks/:id/update-status updates status if task is a subtask (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);
    const parentTask = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      });
    const task = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}123`,
        description: `Test Task ${random}123 description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
        parentTaskId: parentTask.body.id,
      });

    return request(app.getHttpServer())
      .patch(`/tasks/${task.body.id}/update-status`)
      .send({ id: task.body.id, isDone: true })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/tasks/:id/update-status fails if task is not a subtask (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);
    const result = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      });

    return request(app.getHttpServer())
      .patch(`/tasks/${result.body.id}/update-status`)
      .send({ id: result.body.id, isDone: true })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/tasks/:id/change-list fails if target list does not exist (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);
    const result = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      });

    return request(app.getHttpServer())
      .patch(`/tasks/${result.body.id}/change-list`)
      .send({ taskId: result.body.id, listId: 0 })
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/tasks/:id/change-list succeeds for valid body (PATCH)', async () => {
    const random = Math.random() * 100 + 10;
    const taskLists = await request(app.getHttpServer())
      .get(`/tasklists`)
      .set('Authorization', `Bearer ${token}`);
    const result = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Task ${random}`,
        description: `Test Task ${random} description`,
        startDate: new Date(),
        taskListId: taskLists?.body?.data?.[0]?.id,
      });

    return request(app.getHttpServer())
      .patch(`/tasks/${result.body.id}/change-list`)
      .send({ taskId: result.body.id, listId: taskLists?.body?.data?.[1]?.id })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
