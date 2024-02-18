import request from 'supertest';
import app from '../index.js'; // Adjust the import path to where your Express app is exported
import { UserModel } from '../models/UsersModel.js'; // Adjust the import path

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
  it('PUT /update - should update a user', async () => {
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
      .send({ user: 'test2', preferredTasks: preferences });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Invalid user');
  });
  it("PUT /update-preferred-tasks - should update user's preferred tasks", async () => {
    await request(app).put('/user/update-preferred-tasks').send({ user: 'invalid User' });
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
