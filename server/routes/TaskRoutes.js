import { TaskModel } from '../models/TaskModel.js';
import express from 'express';
import { UserModel } from '../models/UsersModel.js';
const router = express.Router();

// Create task route
router.post('/create', async (req, res) => {
  const { username, taskType, date, startTime, endTime, duration, points } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: 'Invalid user' });
  }
  const newTask = new TaskModel({
    associatedUser: user.id_,
    taskType,
    date,
    startTime,
    endTime,
    duration,
    points,
  });
  await newTask.save().then(r => {});
  return res.json({ message: 'Task successfully created' });
});

// Update task route
router.put('/update', async (req, res) => {
  const { id, username, taskType, date, startTime, endTime, duration, points } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: 'Invalid user' });
  }
  const task = await TaskModel.findOneAndUpdate(
    { id },
    { associatedUser: user.id_, taskType, date, startTime, endTime, duration, points }
  );
  if (!task) {
    return res.json({ message: 'Invalid task' });
  }
  return res.json({ message: 'Task successfully updated' });
});

// Get all tasks route
router.get('/get-all', async (req, res) => {
  const tasks = await TaskModel.find({});
  return res.json({ tasks });
});

// Get task by id route
router.get('/get-by-id', async (req, res) => {
  const { id } = req.body;
  const task = await TaskModel.find({ id });
  if (!task) {
    return res.json({ message: 'Invalid task' });
  }
  return res.json({ task });
});

// Get task by type route
router.get('/get-by-type', async (req, res) => {
  const { taskType } = req.body;
  const task = await TaskModel.findOne({ taskType });
  if (!task) {
    return res.json({ message: 'Invalid user' });
  }
  return res.json({ task });
});

// Get by user id route
router.get('/get-by-user-id', async (req, res) => {
  const { associatedUser } = req.body;
  const task = await TaskModel.findOne({ associatedUser });
  if (!task) {
    return res.json({ message: 'Invalid user' });
  }
  return res.json({ task });
});

export { router as taskRouter };
