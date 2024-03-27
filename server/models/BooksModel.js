import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  googleId: { type: String, required: true },
  associatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  imageLink: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  categories: { type: Array, required: true },
});

export const BooksModel = mongoose.model('books', BookSchema);
