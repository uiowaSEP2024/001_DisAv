import request from 'supertest';
import app from '../index.js'; // Replace 'yourAppFileName.js' with the actual file name of your Express application
import { BooksModel } from '../models/BooksModel.js';

afterAll(async () => {
  await BooksModel.deleteMany({});
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

describe('Book API Routes', () => {
  // Test creating a book
  it('POST /create - should create a book', async () => {
    await createTestUser('testbookuser');
    const response = await request(app)
      .post('/book/create')
      .send({
        title: 'Example Book Title',
        googleId: 'exampleGoogleId',
        imageLink: 'exampleImageLink',
        description: 'Example book description',
        author: 'Example Author',
        categories: ['Fiction', 'Sci-Fi'],
        username: 'testbookuser',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book successfully created');
    // Add more assertions if needed
  });

  // create with invalid user
  it('POST /create - should fail to create a book with invalid user', async () => {
    const response = await request(app).post('/book/create').send({
      title: 'Example Book Title',
      googleId: 'exampleGoogleId',
      imageLink: 'exampleImageLink',
      description: 'Example book description',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid user');
  });
  // Test getting books by title

  // Test getting user books by username
  it('GET /get-by-username - should get user books by username', async () => {
    const response = await request(app)
      .get('/book/get-by-username')
      .query({ username: 'testbookuser' });

    expect(response.status).toBe(200);
    expect(response.body.books).toBeDefined();
    // Add more assertions if needed
  });

  // get by invalid username
  it('GET /get-by-username - should fail to get user books with invalid username', async () => {
    const response = await request(app)
      .get('/book/get-by-username')
      .query({ username: 'invalidUser' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid user');
  });

  // Test failing to get user books with invalid username
  it('GET /get-by-username - should fail to get user books with invalid username', async () => {
    const response = await request(app)
      .get('/book/get-by-username')
      .query({ username: 'invalidUser' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid user');
  });

  // test get by invalid title
  it('GET /get-by-title - should get user book by invalid title', async () => {
    await createTestUser('testbookuser');
    const response = await request(app)
      .get('/book/get-by-title')
      .query({ title: 'invalid Title', username: 'testbookuser' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid book');
  });

  // get by invalid username and valid title
  it('GET /get-by-title - should get user book by invalid username and valid title', async () => {
    await createTestUser('testbookuser');
    const response = await request(app)
      .get('/book/get-by-title')
      .query({ title: 'Example Book Title', username: 'invalidUser' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid user');
  });
});
