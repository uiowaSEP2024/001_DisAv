import React, { useState, useEffect } from 'react';
import SubNavbar from './SubNavbar';
import '../styles/ReadTask.css';
import DialogBox from './DialogBox';
import Notification from './Notification';
import axios from 'axios';
import BookCard from './BookCard';
import BookDetail from './BookDetail';

function ReadTask(props) {
  const [openDialog, setOpenDialog] = useState(true);
  const [visibleNotification, setVisibleNotification] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [books, setBooks] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);

  function handleBookClick(book) {
    setSelectedBook(book); // Set the clicked book as the selected book
  }

  function handleClose() {
    setSelectedBook(null); // Clear the selected book
  }
  function handleDialogOpen() {
    setOpenDialog(true);
  }

  useEffect(() => {
    axios
      .get('http://localhost:3002/book/get-by-username', {
        params: { username: user.username },
      })
      .then(response => {
        setBooks(response.data.books);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, [user.username]);

  async function showNotificationFor3Seconds() {
    setTimeout(() => {
      setVisibleNotification(true); // Close the notification after 3 seconds
    }, 300);
    setTimeout(() => {
      setVisibleNotification(false); // Close the notification after 3 seconds
    }, 2000); // 3000 milliseconds = 3 seconds
  }
  function AddBook({ title, googleId, imageLink, description, author, categories }) {
    setOpenDialog(false);
    showNotificationFor3Seconds().then(r => console.log('Notification shown'));
    console.log(
      'Adding book',
      title,
      googleId,
      imageLink,
      description,
      author,
      categories,
      user.username
    );
    axios
      .post('http://localhost:3002/book/create', {
        title,
        imageLink,
        description,
        author,
        categories,
        username: user.username,
      })
      .then(response => {
        console.log('Book added successfully', response.data);
      });
  }
  return (
    <div className={'reading'}>
      <SubNavbar />
      <h1>Reading Task</h1>
      <p>Read a book for 30 minutes</p>
      <div className="book-cards-container">
        {books.map(book => (
          <BookCard
            key={book.id}
            title={book.title}
            imageLink={book.imageLink}
            completionPercentage={book.completionPercentage}
            onClick={() => handleBookClick(book)}
          />
        ))}
      </div>
      {selectedBook && <BookDetail book={selectedBook} onClose={handleClose} />}
      <DialogBox isOpen={openDialog} onClose={() => setOpenDialog(false)} addBook={AddBook} />
      <Notification message={'Book was added successfully!'} visible={visibleNotification} />
    </div>
  );
}

export default ReadTask;
