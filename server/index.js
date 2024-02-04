import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    'mongodb+srv://' +
      process.env.MONGO_UNAME +
      ':' +
      process.env.MONGO_PWD +
      '@infinitefocus.gluou11.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(r => console.log('db connected'))
  .catch(e => console.log('DB not connected check IP'));
app.listen(3002, () => console.log('SERVER STARTED'));
