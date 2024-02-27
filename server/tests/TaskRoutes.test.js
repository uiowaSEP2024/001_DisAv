import request from 'supertest';
import app from '../index.js';
import { TaskModel } from '../models/TaskModel.js';

afterEach(async () => {
  await TaskModel.deleteMany({});
});

const createTestUser = async uname => {
  const userData = {
    username: uname,
    email: 'test@example.com',
    password: 'password123',
    firstname: 'john',
    lastname: 'doe',
  };
  await request(app).post('/auth/register').send(userData);
};
beforeEach(async () => {
  await createTestUser('test');
  await createTestUser('test2');
  await createTestTask('test', 'Work');
  await createTestTask('test');
  await createTestTask('test2');
  await createTestTask('test2');
});
const createTestTask = async (uname, type = 'Reading') => {
  const taskData = {
    username: uname,
    taskType: type,
    points: 10,
    duration: 15,
    startTime: new Date().getTime(),
    endTime: new Date().getTime(),
    date: new Date().getDate(),
  };
  const res = await request(app).post('/task/create').send(taskData);
  return res.body.task;
};

describe('Task API Routes', () => {
  // Test get all tasks
  it('GET /get-all - should return all tasks', async () => {
    const response = await request(app).get('/task/get-all');
    expect(response.statusCode).toBe(200);
    expect(response.body.tasks);
    // expect(response.body.tasks.length).toBe(4);
  });
  // Test create task with invalid user
  it('POST /create - should fail to create task with invalid user', async () => {
    const response = await request(app).post('/task/create').send({
      username: 'invalid',
      taskType: 'Reading',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      points: 20,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });

  // test update task
  it('updates a task successfully', async () => {
    const testUser = createTestUser('test');
    const testTask = createTestTask('test', 'work');
    const response = await request(app).put('/task/update').send({
      id: testTask.id,
      username: testUser.username,
      taskType: 'Updated Reading',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      points: 20,
    });

    expect(response.statusCode).toBe(200);
    // expect(response.body.message).toBe('Task successfully updated');
  });
  // test update task with invalid user
  it('fails to update task with invalid user', async () => {
    const testTask = createTestTask('test');
    const response = await request(app).put('/task/update').send({
      id: testTask.id,
      username: 'invalid',
      taskType: 'Reading',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      points: 20,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // test updated task with invalid task
  it('fails to update invalid task', async () => {
    const response = await request(app).put('/task/update').send({
      id: 'invalid',
      username: 'test',
      taskType: 'Reading',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      points: 20,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid task');
  });

  // test get by id route
  it('gets task by id', async () => {
    const testTask = createTestTask('test');
    const response = await request(app).get(`/task/get-by-id`).send({ id: testTask.id });
    expect(response.statusCode).toBe(200);
    expect(response.body.task).toBeDefined();
    expect(response.body.task.id).toBe(testTask.id);
  });
});
// test get by invalid id route
it('fails to get task by invalid id', async () => {
  const response = await request(app).get('/task/get-by-id').send({ id: 'invalid' });
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe('Invalid task');
});

// test get by task type route
it('gets task by type', async () => {
  const response = await request(app).get('/task/get-by-type').send({ taskType: 'Reading' });
  expect(response.statusCode).toBe(200);
  expect(response.body.task).toBeDefined();
  // expect(response.body.task.length).toBe(3);
});

// test get by user id route
it('gets task by user name', async () => {
  const response = await request(app).get('/task/get-by-username').send({ username: 'test' });
  expect(response.statusCode).toBe(200);
  expect(response.body.tasks).toBeDefined();
  expect(response.body.tasks.length).toBe(4);
});

// test get by invalid user id route
it('fails to get task by invalid user id', async () => {
  const response = await request(app).get('/task/get-by-username').send({ username: 'invalid' });
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe('Invalid user');
});
