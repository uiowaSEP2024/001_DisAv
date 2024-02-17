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
  preferredTasks: { type: Map, of: String },
});

export const UserModel = mongoose.model('users', UserSchema);
