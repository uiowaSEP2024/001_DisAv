import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  completionRate: { type: Number, default: 0 },
  accountabilityPartners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  phoneNumber: { type: String, required: false },
  preferredTasks: {
    work: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    exercise: { type: Boolean, default: false },
    rest: { type: Boolean, default: false },
  },
});

export const UserModel = mongoose.model('users', UserSchema);
