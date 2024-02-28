import request from 'supertest';
import app from '../index.js';
import { UserModel } from '../models/UsersModel.js';

afterAll(async () => {
  await UserModel.deleteMany({});
});

const createTestUser = async () => {
  const userData = {
    username: 'test2',
    email: 'test@example.com',
    password: 'password123',
    firstname: 'john',
    lastname: 'doe',
  };
  await request(app).post('/auth/register').send(userData);
};

describe('User API Routes', () => {
  // Test get all users
  it('GET /get-all - should return all users', async () => {
    await createTestUser(); // Create a user to ensure the database isn't empty
    const response = await request(app).get('/user/get-all');
    expect(response.statusCode).toBe(200);
    expect(response.body.users); // Adjust expectations based on your seeding logic
  });
  // test get user by username
  it('GET /get-by-username - should return user by username', async () => {
    await createTestUser();
    const response = await request(app).get('/user/get-by-username').send({ username: 'test2' });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toBeTruthy();
    expect(response.body.user.username).toBe('test2');
  });
  // test get by invalid username
  it('GET /get-by-username - should fail to return invalid user', async () => {
    const response = await request(app).get('/user/get-by-username').send({ username: 'invalid' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // test get user by email
  it('GET /get-by-email - should return user by email', async () => {
    await createTestUser();
    const response = await request(app)
      .get('/user/get-by-email')
      .send({ email: 'test@example.com' });
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toBeTruthy();
    expect(response.body.user.email).toBe('test@example.com');
  });
  // test get by invalid email
  it('GET /get-by-email - should fail to return invalid user', async () => {
    const response = await request(app)
      .get('/user/get-by-email')
      .send({ email: 'invalidEmail123@wrong.com' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // test update user
  it('PUT /update - should update a user with password', () => {
    createTestUser().then(async () => {
      const updatedUser = {
        username: 'test2',
        email: 'updated@example.com',
        password: 'testPassword',
      }; // Adjust with your model
      const response = await request(app).put('/user/update').send({ user: updatedUser });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('User updated');
    });
  });
  it('PUT /update - should update a user without password', async () => {
    await createTestUser();
    const updatedUser = { username: 'test2', email: 'updated@example.com' }; // Adjust with your model
    const response = await request(app).put('/user/update').send({ user: updatedUser });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated');
  });
  // test update invalid user
  it('PUT /update - should fail to update invalid user', async () => {
    await createTestUser();
    const preferences = { preferredTasks: ['task1', 'task2'] };
    const response = await request(app)
      .put('/user/update')
      .send({ user: 'invalid', preferredTasks: preferences });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // Test update preferred tasks
  it("PUT /update-preferred-tasks - should update user's preferred tasks", async () => {
    await createTestUser();
    const preferredTasks = { work: true, reading: true };
    const response = await request(app)
      .put('/user/update-preferred-tasks')
      .send({ username: 'test2', preferredTasks });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated with preferred tasks');
  });
  // test update invalid user preferred tasks
  it("PUT /update-preferred-tasks - should fail to update invalid user's preferred tasks", async () => {
    const preferredTasks = { work: true, reading: true };
    const response = await request(app)
      .put('/user/update-preferred-tasks')
      .send({ username: 'invalid user', preferredTasks });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // Test update task frequency
  it("PUT /update-task-frequency - should update a user's task frequency", async () => {
    await createTestUser();
    const taskFrequency = 1000;
    const response = await request(app)
      .put('/user/update-task-frequency')
      .send({ username: 'test2', taskFrequency });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated with task frequency');
  });

  // test update invalid user task frequency
  it("PUT /update-task-frequency - should fail to update invalid user's task frequency", async () => {
    const taskFrequency = 1000;
    const response = await request(app)
      .put('/user/update-task-frequency')
      .send({ username: 'invalid user', taskFrequency });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // Test update work preferences
  it("PUT /update-work-preferences - should update a user's work preferences", async () => {
    await createTestUser();
    const workPreferences = 'I work on things related to software development';
    const response = await request(app)
      .put('/user/update-work-preferences')
      .send({ username: 'test2', workPreferences });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated with work preferences');
  });
  // test update invalid user work preferences
  it("PUT /update-work-preferences - should fail to update invalid user's work preferences", async () => {
    const workPreferences = 'I work on things related to software development';
    const response = await request(app)
      .put('/user/update-work-preferences')
      .send({ username: 'invalid user', workPreferences });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // Test update reading preferences
  it("PUT /update-reading-preferences - should update a user's reading preferences", async () => {
    await createTestUser();
    const readingPreferences = 'I read books related to software development';
    const response = await request(app)
      .put('/user/update-reading-preferences')
      .send({ username: 'test2', readingPreferences });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated with reading preferences');
  });
  // test update invalid user reading preferences
  it("PUT /update-reading-preferences - should fail to update invalid user's reading preferences", async () => {
    const readingPreferences = 'I read books related to software development';
    const response = await request(app)
      .put('/user/update-reading-preferences')
      .send({ username: 'invalid user', readingPreferences });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // Test update all preferences
  it('PUT /update-all-preferences - should update all user preferences', async () => {
    await createTestUser();
    const preferences = {
      preferredTasks: { work: false, reading: true },
      taskFrequency: '3000',
      workPreferences: 'I work on things related to software development',
      readingPreferences: 'I read books related to software development',
    };
    const response = await request(app)
      .put('/user/update-all-preferences')
      .send({ username: 'test2', ...preferences });
    expect(response.statusCode).toBe(200);
    // expect(response.body.message).toBe('User updated with all preferences');
  });
  // test update invalid user all preferences
  it('PUT /update-all-preferences - should fail to update invalid user all preferences', async () => {
    const preferences = {
      preferredTasks: { work: false, reading: true },
      taskFrequency: '3000',
      workPreferences: 'I work on things related to software development',
      readingPreferences: 'I read books related to software development',
    };
    const response = await request(app)
      .put('/user/update-all-preferences')
      .send({ username: 'invalid user', ...preferences });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // test update frozen browsing
  it('PUT /update-frozen-browsing - should update frozen browsing', async () => {
    await createTestUser();
    const response = await request(app).put('/user/update-frozen-browsing').send({
      username: 'test2',
      frozenBrowsing: true,
      lastFrozen: new Date(),
      frozenUntil: new Date(),
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated with frozen browsing');
  });
  // test update invalid user frozen browsing
  it('PUT /update-frozen-browsing - should fail to update invalid user frozen browsing', async () => {
    const response = await request(app).put('/user/update-frozen-browsing').send({
      username: 'invalid user',
      frozenBrowsing: true,
      lastFrozen: new Date(),
      frozenUntil: new Date(),
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  // test delete user
  it('DELETE /delete - should delete a user', async () => {
    await createTestUser();
    const response = await request(app).delete('/user/delete').send({ username: 'test2' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User deleted');
  });
  // test delete invalid user
  it('DELETE /delete - should fail to delete invalid user', async () => {
    const response = await request(app).delete('/user/delete').send({ username: 'invalid user' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
});
