import request from 'supertest';
import app from '../index.js'; // Adjust the import path to where your Express app is exported
import { UserModel } from '../models/UsersModel.js'; // Adjust the import path

afterAll(async () => {
  await UserModel.deleteMany({});
});

describe('Authentication API', () => {
  // Test for registration
  it('should register a new user', async () => {
    const userData = {
      username: 'test',
      email: 'test@example.com',
      password: 'password123',
      firstname: 'john',
      lastname: 'doe',
    };

    const response = await request(app).post('/auth/register').send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User successfully created');
  });

  // Test for login
  it('should login the registered user', async () => {
    const loginData = {
      username: 'test',
      password: 'password123',
    };

    const response = await request(app).post('/auth/login').send(loginData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.username).toBe(loginData.username);
  });

  // Test for login failure with incorrect password
  it('should not login with incorrect password', async () => {
    const loginData = {
      username: 'test',
      password: 'wrongpassword',
    };

    const response = await request(app).post('/auth/login').send(loginData);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Username or Password incorrect');
  });
  it('should not register an existing user', async function () {
    const userData = {
      username: 'test',
      email: 'test@example.com',
      password: 'password123',
      firstname: 'john',
      lastname: 'doe',
    };
    const response = await request(app).post('/auth/register').send(userData);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User already exists');
  });
  it('should not login a non-existing user', async function () {
    const loginData = {
      username: 'non-existing',
      password: 'password123',
    };
    const response = await request(app).post('/auth/login').send(loginData);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User does not exist');
  });
});
