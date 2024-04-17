import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import '../styles/bookdetail.css';
import axios from 'axios';
import { toast } from 'react-toastify'; // Make sure to create a corresponding CSS file if you have additional styling

function BookDetail({ book, onClose }) {
  // const numberOfChapters = 10; // This is hardcoded for now
  console.log(book.chapterSummaries);
  const [summaries, setSummaries] = useState(book.chapterSummaries); // Initialize state for summaries
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const handleSummaryChange = (text, index) => {
    // Update the summary for the specific chapter index
    setSummaries(summaries.map((summary, i) => (i === index ? text : summary)));
  };
  const endFrozenBrowsing = async () => {
    const currentDate = new Date();
    await axios
      .put('http://localhost:3002/user/update-frozen-browsing', {
        username: localStorage.getItem('username'),
        frozenBrowsing: false,
        nextFrozen: new Date(currentDate.getTime() + localStorage.getItem('taskFrequency')),
      })
      .then(response => {
        sessionStorage.setItem('user', JSON.stringify(response.data.user)); // Update current stored user
        console.log('Success', response.data.user);
        window.postMessage(
          {
            type: 'LOGIN_SUCCESS',
            token: localStorage.getItem('token'),
            user: sessionStorage.getItem('user'),
          },
          '*'
        );
        // user.frozenBrowsing = false
        console.log('Success', user);
      })
      .catch(error => {
        // console.log('Unexpected error', error);
        toast.error('Unexpected error: ', error);
      });
  };
  const submitSummary = index => {
    console.log(`Summary for Chapter ${index + 1}:`, summaries[index]);
    // Api call to verify sumamry and save it to the database
    axios
      .put('http://localhost:3002/book/update-summary', {
        title: book.title,
        chapter: index + 1,
        summary: summaries[index],
        username: user.username, // This should be the actual username
      })
      .then(response => {
        if (!response.data.validSummary) {
          console.log(book.title, index + 1, summaries[index], user.username, user.username);
          toast.error('Book summary is invalid');
        } else {
          toast.success('Summary accepted successfully');
          setUser({ ...user, frozenBrowsing: false });
          sessionStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user));
          endFrozenBrowsing().then(r => console.log('Browsing updated'));
        }
      });
  };

  return (
    <div className="book-detail-overlay">
      <div className="book-detail-modal">
        <div className="book-info">
          <img src={book.imageLink} alt={book.title} className="book-detail-cover" />
          <h2>{book.title}</h2>
          <p>Author: {book.author}</p>
          <p>ISBN: {book.isbn}</p>
          <Button variant="contained" color="primary" onClick={onClose} data-testid="book-detail-close">
            Close
          </Button>
        </div>
        <div className="chapters-container">
          {summaries.map((summary, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h3>Chapter {index + 1}</h3>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label={`Summary for Chapter ${index + 1}`}
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={summary}
                  onChange={(e) => handleSummaryChange(e.target.value, index)}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => submitSummary(index)}
                  data-testid={`submit-summary-${index}`}
                >
                  Submit Summary
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}

BookDetail.propTypes = {
  book: PropTypes.shape({
    imageLink: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    isbn: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookDetail;
