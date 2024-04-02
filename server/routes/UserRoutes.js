import express from 'express';
import { UserModel } from '../models/UsersModel.js';
import bcrypt from 'bcrypt';
const router = express.Router();
// import OpenAI from 'openai';
// import dotenv from 'dotenv';
// import path from 'path';

// Get all users api
router.get('/get-all', async (req, res) => {
  const users = await UserModel.find({});
  return res.status(200).json({ users });
});
// Get user by username api
router.get('/get-by-username', async (req, res) => {
  const { username } = req.query;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  return res.status(200).json({ user });
});

// Get user by email api
router.get('/get-by-email', async (req, res) => {
  const { email } = req.query;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  return res.status(200).json({ user });
});

// Update user apis
router.put('/update', async (req, res) => {
  const { user } = req.body;
  let {
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
    return res.status(401).json({ message: 'Invalid user' });
  }
  // Check if password is being updated and encrypt it if so

  if (password && !(await bcrypt.compare(password, foundUser.password))) {
    password = await bcrypt.hash(password, 10);
  } else {
    password = foundUser.password;
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
  return res.status(200).json({ message: 'User updated' });
});

// Delete user api
router.delete('/delete', async (req, res) => {
  const { username } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  await UserModel.findOneAndDelete({ username });
  return res.status(200).json({ message: 'User deleted' });
});

// update preferred tasks
router.put('/update-preferred-tasks', async (req, res) => {
  const { username, preferredTasks } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user, failed to update preferred tasks' });
  }
  await UserModel.findOneAndUpdate({ username }, { preferredTasks });
  return res.status(200).json({ message: 'User updated with preferred tasks' });
});
// update task frequency
router.put('/update-task-frequency', async (req, res) => {
  const { username, taskFrequency } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user, failed to update task frequency' });
  }
  await UserModel.findOneAndUpdate({ username }, { taskFrequency });
  return res.status(200).json({ message: 'User updated with task frequency' });
});

// update work preferences
router.put('/update-work-preferences', async (req, res) => {
  const { username, workPreferences } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user, failed to update work preferences' });
  }
  await UserModel.findOneAndUpdate({ username }, { workPreferences });
  return res.status(200).json({ message: 'User updated with work preferences' });
});

// update reading preferences
router.put('/update-reading-preferences', async (req, res) => {
  const { username, readingPreferences } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user, failed to update reading preferences' });
  }
  await UserModel.findOneAndUpdate({ username }, { readingPreferences });
  return res.status(200).json({ message: 'User updated with reading preferences' });
});

// update all preferences
router.put('/update-all-preferences', async (req, res) => {
  const { username, preferredTasks, taskFrequency, workPreferences, readingPreferences } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user, failed to update all preferences' });
  }
  await UserModel.findOneAndUpdate(
    { username },
    { preferredTasks, taskFrequency, workPreferences, readingPreferences }
  );
  return res.status(200).json({ message: 'User updated with all preferences' });
});

// update frozen browsing
router.put('/update-frozen-browsing', async (req, res) => {
  const { username, frozenBrowsing, lastFrozen, frozenUntil, nextFrozen } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user, failed to update frozen browsing' });
  }
  await UserModel.findOneAndUpdate(
    { username },
    { frozenBrowsing, lastFrozen, frozenUntil, nextFrozen }
  );
  console.log(user);
  return res.status(200).json({ message: 'User updated with frozen browsing', user });
});

// Get url Type
// router.get("/get-browsing-type", async (req, res) => {
//   const { url } = req.query;
//   const browsingType = await GPTcall(url);
//   if (browsingType === "entertainment" || browsingType === "work"){
//     return res.status(200).json({ browsingType });
//   }
//   return res.status(400).json({ message: 'Invalid browsing type' });
// });
// async function GPTcall (url) {
//   const cwd = process.cwd();
//   const envDirectory = path.resolve(cwd, '..') + "/.env";
//   dotenv.config({path: envDirectory});
//   const openai = new OpenAI({
//     apiKey: process.env.GPT_KEY // This is also the default, can be omitted
//   });
//   try {
//     const chatCompletion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "Your task is to classify a given URL as either primarily for entertainment or work-related purposes. Consider the context in which a user might visit this URL, such as their profession or personal interests. Provide your classification along with a brief explanation for your decision.return the answer as a single word being entertainment or work"
//         },
//         {
//           role: "user",
//           content: "Classify the following URL:"+url
//         }
//       ]
//     });
//
//     console.log(chatCompletion.choices[0].message);
//     return chatCompletion.choices[0].message.content;
//
//   } catch (err) {
//     if (err.response) {
//       console.log(err.response.status);
//       console.log(err.response.data);
//     } else {
//       console.log(err.message);
//     }
//   }
// }
console.log('asdsadsaasfgrde');
// GPTcall().then(r=>null)
export { router as UserRouter };
