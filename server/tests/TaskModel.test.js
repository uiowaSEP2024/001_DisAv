// taskModel.test.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TaskModel } from '../models/TaskModel.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('TaskModel', () => {
  it('creates a task successfully', async () => {
    const taskData = {
      taskType: 'Coding',
      date: new Date(),
      startTime: '09:00',
      endTime: '11:00',
      duration: 120,
      points: 100,
    };
    const task = new TaskModel(taskData);
    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.taskType).toBe(taskData.taskType);
    expect(savedTask.points).toBe(taskData.points);
  });

  it('fails to create a task without required fields', async () => {
    const taskData = {}; // Empty object to trigger validation errors
    const task = new TaskModel(taskData);

    let error;
    try {
      await task.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.taskType).toBeDefined();
    expect(error.errors.date).toBeDefined();
  });
});
