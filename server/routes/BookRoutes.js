import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Import fetch module
import path from 'path';
import { BooksModel } from '../models/BooksModel.js';
import { UserModel } from '../models/UsersModel.js';
const router = express.Router();

// Load environment variables from .env
const cwd = process.cwd();
const parentDir = path.resolve(cwd, '..');
dotenv.config({ path: parentDir + '/.env' });

// Access environment variables
const apiKey = process.env.BOOKS_API_KEY;
router.get('/get-by-google-title', (req, res) => {
  const { title } = req.query;
  searchBooksByTitle(title)
    .then(books => res.status(200).json({ books }))
    .catch(error => res.status(500).json({ error: error.message }));
});

router.get('/get-by-google-id', (req, res) => {
  const { bookId } = req.query;
  searchBooksById(bookId)
    .then(book => res.status(200).json({ book }))
    .catch(error => res.status(500).json({ error: error.message }));
});

router.post('/create', async (req, res) => {
  const { title, googleId, imageLink, description, author, categories, username } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  const newBook = new BooksModel({
    title,
    googleId,
    imageLink,
    description,
    author,
    categories,
    associatedUser: user._id,
  });
  await newBook.save().then(r => {});
  return res.status(200).json({ message: 'Book successfully created', task: newBook });
});

// get user books
router.get('/get-by-username', async (req, res) => {
  const { username } = req.query;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  const books = await BooksModel.find({ associatedUser: user._id });
  return res.status(200).json({ books });
});

// get user book by title
router.get('/get-by-title', async (req, res) => {
  const { title, username } = req.query;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  const book = await BooksModel.findOne({ title, associatedUser: user._id });
  if (!book) {
    return res.status(401).json({ message: 'Invalid book' });
  }
  return res.status(200).json({ book });
});

function searchBooksByTitle(title) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}&key=${apiKey}`;

  // Making a GET request to the Google Books API
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data.items.map(item => {
        return item;
      });
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
}
function searchBooksById(bookId) {
  const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;

  // Making a GET request to the Google Books API
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(volumeInfo => {
      return volumeInfo;
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
}

export { router as bookRouter };
