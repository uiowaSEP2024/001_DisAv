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
const createTestBook = async (title, username) => {
  const response = await request(app)
    .post('/book/create')
    .send({
      title: title,
      googleId: 'exampleGoogleId',
      imageLink: 'exampleImageLink',
      description: 'Example book description',
      author: ['Example Author'],
      categories: ['Fiction', 'Sci-Fi'],
      username: username,
    });
  return response;
};

describe('Book API Routes', () => {
  // Test creating a book
  it('POST /create - should create a book', async () => {
    await createTestUser('testbookuser');
    const response = await createTestBook('Example Book Title', 'testbookuser');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book successfully created');
    // Add more assertions if needed
  });

  // create with invalid user
  it('POST /create - should fail to create a book with invalid user', async () => {
    const response = await createTestBook('Example Book Title', 'invalidUser');
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
  it('GET /get-by-title - should get user book by valid username and valid title', async () => {
    await createTestUser('testbookuser');
    await createTestBook('Example Book Title', 'testbookuser');
    const response = await request(app)
      .get('/book/get-by-title')
      .query({ title: 'Example Book Title', username: 'testbookuser' });
    expect(response.status).toBe(200);
    expect(response.body.book).toBeDefined();
    expect(response.body.book.title).toBe('Example Book Title');
    expect(response.body.book.authors).toEqual(['Example Author']);
    expect(response.body.book.categories).toEqual(['Fiction', 'Sci-Fi']);
  });
  // // Test updating book summary
  it('PUT /update-summary - should update book summary', async () => {
    await createTestUser('testbookuser');
    await createTestBook('Example Book Title', 'testbookuser');

    // test adding summaries
    let response = await request(app).put('/book/update-summary').send({
      title: 'Example Book Title',
      chapter: 1,
      summary: 'This is an Example summary of chapter one',
      username: 'testbookuser',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Summary added successfully');
    expect(response.body.book.chapterSummaries[0]).toBe(
      'This is an Example summary of chapter one'
    );
    response = await request(app).put('/book/update-summary').send({
      title: 'Example Book Title',
      chapter: 30,
      summary: 'This is an Example summary of chapter 30',
      username: 'testbookuser',
    });
    expect(response.status).toBe(200);
    expect(response.body.book.chapterSummaries[29]).toBe(
      'This is an Example summary of chapter 30'
    );
    expect(response.body.message).toBe('Summary added successfully');
    expect(response.body.book.chapterSummaries[8]).toBe('');
  });

  // // Test failing to update book summary with invalid user
  it('PUT /update-summary - should fail to update book summary with invalid user', async () => {
    await createTestUser('testbookuser');
    await createTestBook('Example Book Title', 'testbookuser');
    const response = await request(app).put('/book/update-summary').send({
      title: 'Example Book Title',
      chapter: 1,
      summary: 'This is an Example summary of chapter one',
      username: 'invalidUser',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid user, failed to update summary');
  });

  // Test failing to update book summary with invalid book
  it('PUT /update-summary - should fail to update book summary with invalid book', async () => {
    await createTestUser('testbookuser');
    await createTestBook('Example Book Title', 'testbookuser');
    const response = await request(app).put('/book/update-summary').send({
      title: 'Invalid Book Title',
      chapter: 1,
      summary: 'This is an Example summary of chapter one',
      username: 'testbookuser',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid book, failed to update summary');
  });

  // Test get badges
  it('GET /get-badges - should get badges', async () => {
    const response = await request(app).get('/badge/get-badges');
    expect(response.status).toBe(200);
    expect(response.body.badges).toBeDefined();
    expect(response.body.badges.length).toBe(11);
  });
});
