import request from 'supertest';
import app from '../index.js';
import { TaskModel } from '../models/TaskModel.js';

afterAll(async () => {
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
let testTask;
beforeAll(async () => {
  await createTestUser('test');
  await createTestUser('test2');
  testTask = await createTestTask('test', 'Work');
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
    await request(app)
      .get('/task/get-all')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.tasks);
        expect(response.body.tasks.length).toBe(4);
      });
  });
  // Test create task with invalid user
  it('POST /create - should fail to create task with invalid user', async () => {
    await request(app)
      .post('/task/create')
      .send({
        username: 'invalid',
        taskType: 'Reading',
        date: new Date(),
        startTime: '10:00',
        endTime: '11:00',
        duration: 60,
        points: 20,
      })
      .then(response => {
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid user');
      });
  });
});

// test update task
it('updates a task successfully', async () => {
  const response = await request(app).put('/task/update').send({
    id: testTask._id,
    username: 'test',
    taskType: 'Updated Reading',
    date: new Date(),
    startTime: '10:00',
    endTime: '11:00',
    duration: 60,
    points: 20,
  });
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe('Task successfully updated');
});
// test update task with invalid user
it('fails to update task with invalid user', async () => {
  await request(app)
    .put('/task/update')
    .send({
      id: testTask._id,
      username: 'invalid',
      taskType: 'Reading',
      date: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      duration: 60,
      points: 20,
    })
    .then(async response => {
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid user');
    });
});
// test updated task with invalid task
it('fails to update invalid task', async () => {
  const response = await request(app).put('/task/update').send({
    id: '65ed3ca69a4adfdfaadfc079',
    username: 'test',
    taskType: 'Reading',
    date: new Date(),
    startTime: '10:00',
    endTime: '11:00',
    duration: 60,
    points: 20,
  });

  expect(response.statusCode).toBe(401);
  expect(response.body.message).toBe('Invalid task');
});

// test get by id route
it('gets task by id', async () => {
  await request(app)
    .get('/task/get-by-id')
    .query({ id: testTask._id })
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.task).toBeDefined();
      expect(response.body.task._id).toBe(testTask._id);
    });
});
// test get by invalid id route
it('fails to get task by invalid id', async () => {
  const response = await request(app)
    .get('/task/get-by-id')
    .query({ id: '65ed3ee69a2adfdfaadfc074' });
  expect(response.statusCode).toBe(401);
  expect(response.body.message).toBe('Invalid task');
});

// test get by task type route
it('gets task by type', async () => {
  await request(app)
    .get('/task/get-by-type')
    .query({ taskType: 'Reading' })
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.task).toBeDefined();
      expect(response.body.task.length).toBe(3);
    });
});

// test get by user id route
it('gets task by user name', async () => {
  await request(app)
    .get('/task/get-by-username')
    .query({ username: 'test' })
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.tasks).toBeDefined();
      expect(response.body.tasks.length).toBe(2);
    });
});

// test get by invalid user id route
it('fails to get task by invalid user id', async () => {
  await request(app)
    .get('/task/get-by-username')
    .query({ username: 'invalid' })
    .then(response => {
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Invalid user');
    });
});
