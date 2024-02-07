import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from '../models/UsersModel.js'; // Update this path

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clears the database and adds some testing data.
  // Jest will wait for this promise to resolve before running tests.
  await UserModel.deleteMany({});
});

// Clear all database collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Test cases
describe('UserModel', () => {
  it('should create and save a user successfully', async () => {
    const userData = {
      username: 'test',
      email: 'test@example.com',
      password: 'password',
      firstname: 'Test',
      lastname: 'User',
      completionRate: 75,
    };

    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();

    // Verify the saved user
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.firstname).toBe(userData.firstname);
    expect(savedUser.lastname).toBe(userData.lastname);
    expect(savedUser.completionRate).toBe(userData.completionRate);
    expect(savedUser.accountabilityPartners).toEqual(expect.any(Array));
    expect(savedUser.preferredTasks).toEqual(expect.any(Array));
  });

  it('should fail if required fields are missing', async () => {
    const userData = {
      // missing username, email, and password which are required
      firstname: 'Test',
      lastname: 'User',
    };
    const userWithoutRequiredField = new UserModel(userData);

    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.username).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });
});
