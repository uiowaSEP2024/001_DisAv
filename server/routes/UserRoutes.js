import express from 'express';
import { UserModel } from '../models/UsersModel.js';
const router = express.Router();
// Get all users api
router.get('/get-all', async (req, res) => {
  const users = await UserModel.find({});
  return res.json({ users });
});
// Get user by username api
router.get('/get-by-username', async (req, res) => {
  const { username } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: 'Invalid user' });
  }
  return res.json({ user });
});

// Get user by email api
router.get('/get-by-email', async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.json({ message: 'Invalid user' });
  }
  return res.json({ user });
});

// Update user api
router.put('/update', async (req, res) => {
  const { user } = req.body;
  const {
    username,
    password,
    email,
    firstname,
    lastname,
    completionRate,
    accountabilityPartners,
    phoneNumber,
    preferredTasks,
  } = user;
  const foundUser = await UserModel.findOne({ username });
  if (!foundUser) {
    return res.json({ message: 'Invalid user' });
  }
  await UserModel.findOneAndUpdate(
    { username },
    {
      username,
      password,
      email,
      firstname,
      lastname,
      completionRate,
      accountabilityPartners,
      phoneNumber,
      preferredTasks,
    }
  );
  return res.json({ message: 'User updated' });
});

// Delete user api
router.delete('/delete', async (req, res) => {
  const { username } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: 'Invalid user' });
  }
  await UserModel.findOneAndDelete({ username });
  return res.json({ message: 'User deleted' });
});

// update preferred tasks
router.put('/update-preferred-tasks', async (req, res) => {
  const { username, preferredTasks } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: 'Invalid user' });
  }
  await UserModel.findOneAndUpdate({ username }, { preferredTasks });
  return res.json({ message: 'User updated with preferred tasks' });
});

export { router as UserRouter };
