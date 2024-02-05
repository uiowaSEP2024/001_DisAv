import express from 'express';
import { UserModel } from '../models/UsersModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const router = express.Router();

// Register Api
router.post('/register', async (req, res) => {
  const { username, email, password, firstname, lastname } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword, firstname, lastname, email });
  await newUser.save().then(r => {});
  return res.json({ message: 'User successfully created' });
});
// Login Api
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: 'User does not exist' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({ message: 'Username or Password incorrect' });
  }
  const token = jwt.sign({ id: user._id }, 'secret');
  res.json({ token, user });
});

export { router as authRouter };
