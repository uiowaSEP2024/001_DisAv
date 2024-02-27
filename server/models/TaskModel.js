import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  associatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  taskType: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: Number, required: true },
  points: { type: Number, required: true },
});

export const TaskModel = mongoose.model('tasks', UserSchema);
