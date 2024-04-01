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
    associatedUser: user._id,
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
  const { id, username, taskType, date, startTime, endTime, duration, isCompleted, points } =
    req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    console.log('Invalid user');
    return res.status(401).json({ message: 'Invalid user' });
  }

  const task = await TaskModel.findOneAndUpdate(
    { _id: id },
    { associatedUser: user._id, taskType, date, startTime, endTime, isCompleted, duration, points }
  );
  if (!task) {
    console.log('Invalid task');
    return res.status(401).json({ message: 'Invalid task' });
  }
  return res.status(200).json({ message: 'Task successfully updated' });
});

router.put('/update-completed', async (req, res) => {
  const { id, isCompleted, endTime } = req.body;
  console.log('Updating task:', id);
  const task = await TaskModel.findOneAndUpdate({ _id: id }, { isCompleted, endTime });
  if (!task) {
    console.log('Invalid task');
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
  const { id } = req.query;
  const task = await TaskModel.findOne({ _id: id });
  if (!task) {
    return res.status(401).json({ message: 'Invalid task' });
  }
  return res.status(200).json({ task });
});

// Get task by type route
router.get('/get-by-type', async (req, res) => {
  const { taskType } = req.query;
  const task = await TaskModel.find({ taskType });
  return res.status(200).json({ task });
});

// Get by user id route
router.get('/get-by-username', async (req, res) => {
  const { username } = req.query;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  const tasks = await TaskModel.find({ associatedUser: user._id });
  return res.status(200).json({ tasks });
});

export { router as taskRouter };
