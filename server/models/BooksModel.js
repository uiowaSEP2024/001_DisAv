import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  googleId: { type: String },
  associatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  chapterSummaries: [{ type: String, required: false }],
  imageLink: { type: String, required: true },
  description: { type: String, required: true },
  authors: { type: Array, required: true },
  categories: { type: Array, required: true },
});

export const BooksModel = mongoose.model('books', BookSchema);
