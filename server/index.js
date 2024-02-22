import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { authRouter } from './routes/AuthRoute.js';
import { UserRouter } from './routes/UserRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/user', UserRouter);
const dbUri =
  process.env.NODE_ENV === 'test'
    ? 'mongodb+srv://' +
      process.env.MONGO_UNAME +
      ':' +
      process.env.MONGO_PWD +
      '@infinitefocus.gluou11.mongodb.net/?retryWrites=true&w=majority'
    : 'mongodb+srv://' +
      process.env.MONGO_UNAME +
      ':' +
      process.env.MONGO_PWD +
      '@infinitefocus.gluou11.mongodb.net/active?retryWrites=true&w=majority';

mongoose
  .connect(dbUri)
  .then(r => console.log('db connected'))
  .catch(e => console.log('DB not connected check IP'));
app
  .listen(3002, () => console.log('SERVER STARTED'))
  .on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Error: Port 3002 is already in use.`);
    } else {
      console.log('Error starting the app:', err);
    }
  });
export default app;
