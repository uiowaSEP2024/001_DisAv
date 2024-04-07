import express from 'express';
import dotenv from 'dotenv';
import { BooksModel } from '../models/BooksModel.js';
import { UserModel } from '../models/UsersModel.js';
import path from 'path';
import OpenAI from 'openai';
const router = express.Router();
// Load environment variables from .env
const cwd = process.cwd();
const parent = path.dirname(cwd);
dotenv.config({ path: parent + '/.env' });
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
  console.log(
    'Creating book',
    title,
    googleId,
    imageLink,
    description,
    author,
    categories,
    username
  );
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  const chapterSummaries = Array(100).fill('');
  const newBook = new BooksModel({
    title,
    googleId,
    imageLink,
    description,
    authors: author,
    categories,
    associatedUser: user._id,
    chapterSummaries,
  });
  await newBook.save().then(r => {});
  return res.status(200).json({ message: 'Book successfully created', book: newBook });
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
router.put('/update-summary', async (req, res) => {
  const { title, chapter, summary, username } = req.body;
  const r = await checkValidBookSummary(summary, chapter, title);
  if (r.includes('False')) {
    return res
      .status(201)
      .json({ message: 'Invalid summary, failed to update summary', validSummary: false });
  }
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid user, failed to update summary' });
  }
  const book = await BooksModel.findOne({ title, associatedUser: user._id });
  if (!book) {
    return res.status(401).json({ message: 'Invalid book, failed to update summary' });
  }
  // update the array summaries in the book model at index chapter
  book.chapterSummaries[chapter - 1] = summary;
  await BooksModel.findOneAndUpdate(
    { title, associatedUser: user._id },
    { chapterSummaries: book.chapterSummaries }
  );
  res.status(200).json({ message: 'Summary added successfully', book: book, validSummary: true });
});

function searchBooksByTitle(title) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}&key=${apiKey}&langRestrict=en`;
  // Making a GET request to the Google Books API
  console.log(url, cwd);
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        console.log('Error');
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data.items.map(item => {
        return item.volumeInfo;
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
async function checkValidBookSummary(summary, chapter, book) {
  const cwd = process.cwd();
  const envDirectory = path.resolve(cwd, '..') + '/.env';
  console.log('asdksjklafksajfsal', envDirectory, process.env.GPT_KEY);
  dotenv.config({ path: envDirectory });
  const openai = new OpenAI({
    apiKey: process.env.GPT_KEY, // This is also the default, can be omitted
  });
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Your task is to evaluate the plausibility of the following book summary for Chapter ' +
            chapter +
            'of the book' +
            book +
            '. Consider the coherence, relevance, and accuracy of the summary in relation to the provided book chapter. Provide your assessment along with a brief explanation for your decision.',
        },
        {
          role: 'user',
          content:
            'Evaluate the plausibility of the following book summary for Chapter ' +
            chapter +
            'of the book' +
            book +
            " don't be excessively picky, if it seems like it could be valid say that it is. Summary: " +
            summary +
            ' Tell me if its accurate in very concise terms i want you to respond only with True or False.',
        },
      ],
    });

    console.log(chatCompletion.choices[0].message);
    return chatCompletion.choices[0].message.content;
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.data);
    } else {
      console.log(err.message);
    }
  }
}
export { router as bookRouter };
