import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  associatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  taskType: { type: String, default: null },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: Number, required: true },
  points: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
});

export const TaskModel = mongoose.model('tasks', UserSchema);
