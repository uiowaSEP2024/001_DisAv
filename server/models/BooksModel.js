import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  googleId: { type: String },
  associatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  chapterSummaries: [{ type: String, required: false }],
  imageLink: { type: String },
  description: { type: String },
  authors: { type: Array },
  categories: { type: Array },
});

export const BooksModel = mongoose.model('books', BookSchema);
