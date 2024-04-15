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
  frozenBrowsing: { type: Boolean, default: false },
  lastFrozen: { type: Date },
  nextFrozen: { type: Date },
  frozenUntil: { type: Date },
  preferredTasks: {
    type: Map,
    of: Boolean,
    default: {
      Work: false,
      Reading: false,
      Exercise: false,
      Break: false,
    },
  },
  taskFrequency: { type: Number, required: false, default: 0 },
  workPreferences: { type: String, required: false },
  readingPreferences: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  xpPoints: { type: Number, default: 0 },
  whitelistedWebsites: [{ type: String, required: false }],
  blacklistedWebsites: [{ type: String, required: false }],
});

export const UserModel = mongoose.model('users', UserSchema);
