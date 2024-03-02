import { TaskModel } from '../models/TaskModel.js';
import express from 'express';
import { UserModel } from '../models/UsersModel.js';
const router = express.Router();

// Create task route
router.post('/create', async (req, res) => {
  const { username, taskType, date, startTime, endTime, duration, points } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
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
  return res.status(200).json({ message: 'Task successfully created', task: newTask });
});

// Update task route
router.put('/update', async (req, res) => {
  const { id, username, taskType, date, startTime, endTime, duration, points } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  const task = await TaskModel.findOneAndUpdate(
    { id },
    { associatedUser: user.id_, taskType, date, startTime, endTime, duration, points }
  );
  if (!task) {
    return res.status(401).json({ message: 'Invalid task' });
  }
  return res.status(200).json({ message: 'Task successfully updated' });
});

// Get all tasks route
router.get('/get-all', async (req, res) => {
  const tasks = await TaskModel.find({});
  return res.status(200).json({ tasks });
});

// Get task by id route
router.get('/get-by-id', async (req, res) => {
  const { id } = req.body;
  const task = await TaskModel.findOne({ id });
  if (!task) {
    return res.status(401).json({ message: 'Invalid task' });
  }
  return res.status(200).json({ task });
});

// Get task by type route
router.get('/get-by-type', async (req, res) => {
  const { taskType } = req.body;
  const task = await TaskModel.find({ taskType });
  return res.status(200).json({ task });
});

// Get by user id route
router.get('/get-by-username', async (req, res) => {
  const { username } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  const tasks = await TaskModel.find({ associatedUser: user.id_ });
  return res.status(200).json({ tasks });
});

export { router as taskRouter };
