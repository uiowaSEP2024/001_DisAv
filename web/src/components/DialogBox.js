import React, { useState } from 'react';
import ListItem from './ListItem';
import axios from 'axios';
import '../assets/ListItem.css';
function DialogBox({ isOpen, onClose, addBook, dashboard, addSite }) {
  const [bookTitle, setBookTitle] = useState();
  const [booksList, setBooksList] = useState([]);
  const [text, setText] = useState();
  async function onSearch(title) {
    const response = await axios
      .get('http://localhost:3002/book/get-by-google-title', { params: { title } })
      .then(response => {
        console.log(response.data);
        setBooksList(response.data.books);
      });
  }
  if (!isOpen) return null;
  if (dashboard) {
    return (
      <div style={overlayStyles}>
        <div
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            color: 'black',
            borderRadius: '5px',
            display: 'flex',
            width: '500px',
            height: '200px',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2>Enter website to track</h2>
          <input
            type="text"
            placeholder="www.example.com"
            style={textInput}
            onChange={event => setText(event.target.value)}
          />
          <div
            style={{
              flexDirection: 'row',
              display: 'flex',
              marginLeft: '-20%',
            }}
          >
            <button className="btn btn-success" onClick={() => addSite(text)}>
              Add
            </button>
            <button
              onClick={onClose}
              className="btn btn-success"
              style={{
                marginLeft: '3%',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={overlayStyles}>
      <div style={dialogStyles}>
        <h2>Enter book title</h2>
        <h3>{bookTitle}</h3>
        <input
          type="text"
          placeholder="Book Title"
          style={textInput}
          onChange={event => onSearch(event.target.value)}
        />
        <div style={scrollView}>
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
const textInput = {
  padding: '10px',
  width: '100%',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginBottom: '10px',
};

const scrollView = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  overflow: 'auto',
  width: '100%',
  border: '1px #aaa solid',
};
const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dialogStyles = {
  backgroundColor: '#fff',
  padding: '20px',
  color: 'black',
  borderRadius: '5px',
  display: 'flex',
  width: '500px',
  height: '500px',
  flexDirection: 'column',
  alignItems: 'center',
};

export default DialogBox;
