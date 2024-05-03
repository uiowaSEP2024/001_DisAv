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
  console.log('Task created with id:', newTask._id);
  return res.status(200).json({ message: 'Task successfully created', task: newTask });
});

// Update task route
router.put('/update', async (req, res) => {
  console.log('Updating task');
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
  const { id, isCompleted, frozenBrowsing, endTime } = req.body;
  const task = await TaskModel.findOneAndUpdate(
    { _id: id },
    { frozenBrowsing, isCompleted, endTime }
  );
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
  try {
    const { id } = req.query;
    const task = await TaskModel.findOne({ _id: id });
    if (!task) {
      return res.status(401).json({ message: 'Invalid task' });
    }
    return res.status(200).json({ task });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
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

router.get('/get-most-recent-task', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const tasks = await TaskModel.find({ associatedUser: user._id }).sort({ date: -1 }).limit(1);
    // If no tasks found, return error
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }
    // Return the most recent task
    return res.status(200).json({ task: tasks[0] });
  } catch (error) {
    // Handle errors
    console.error('Error fetching most recent task:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
export { router as taskRouter };
