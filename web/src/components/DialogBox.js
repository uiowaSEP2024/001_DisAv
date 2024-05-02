import React, { useState } from 'react';
import ListItem from './ListItem';
import axios from 'axios';
import '../assets/ListItem.css';
import '../styles/dialogbox.css';

function DialogBox({ isOpen, onClose, addBook, dashboard, onSave, title }) {
  const [bookTitle, setBookTitle] = useState();
  const [booksList, setBooksList] = useState([]);
  const [text, setText] = useState();

  async function onSearch(title) {
    const response = await axios
      .get('https://distraction-avoider-bcd786e690c7.herokuapp.com/book/get-by-google-title', { params: { title } })
      .then(response => {
        console.log(response.data);
        setBooksList(response.data.books);
      });
  }

  const handleAddClick = () => {
    if (text) {
      // Check if text is not empty
      onSave(text); // Call the addSite function passed in as a prop
      setText(''); // Clear the text field after adding
    }
  };

  const handleCloseClick = () => {
    if (text) {
      // Check if text is not empty
      setText(''); // Clear the text field after adding
    }
    onClose();
  };

  if (!isOpen) return null;

  if (dashboard) {
    return (
      <div className="overlayStyles">
        <div className="dialogStyles">
          <h2>{title}</h2>
          <input
            type="text"
            placeholder="Enter website URL"
            className="textInput"
            value={text}
            onChange={event => setText(event.target.value)}
          />
          <div className="flexRow">
            <button className="btn btn-success" onClick={handleAddClick}>
              Add
            </button>
            <button onClick={handleCloseClick} className="btn btn-success marginLeft3">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlayStyles">
      <div className="dialogStyles">
        <h2>Enter book title</h2>
        <h3>{bookTitle}</h3>
        <input
          type="text"
          placeholder="Book Title"
          className="textInput"
          onChange={event => onSearch(event.target.value)}
        />
        <div className="scrollView">
          {booksList?.map((book, index) => (
            <ListItem
              key={index}
              title={book.title}
              image={book.imageLinks?.thumbnail}
              authors={book.authors}
              description={book.description}
              categories={book.categories}
              googleId={book.googleId}
              addBook={addBook}
              data-testid="list-item"
            />
          ))}
        </div>
        <button onClick={onClose} className="btn btn-success">
          Close
        </button>
      </div>
    </div>
  );
}

export default DialogBox;
