import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { authRouter } from './routes/AuthRoute.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);

const dbUri =
  process.env.MONGO_URI ||
  'mongodb+srv://' +
    process.env.MONGO_UNAME +
    ':' +
    process.env.MONGO_PWD +
    '@infinitefocus.gluou11.mongodb.net/?retryWrites=true&w=majority';
console.log('DBURI:' + dbUri, 'Mongouri' + process.env.MONGO_URI);
mongoose
  .connect(dbUri)
  .then(r => console.log('db connected'))
  .catch(e => console.log('DB not connected check IP'));
app.listen(3002, () => console.log('SERVER STARTED'));
export default app;
