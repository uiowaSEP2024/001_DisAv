import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import '../styles/bookdetail.css';
import axios from 'axios'; // Make sure to create a corresponding CSS file if you have additional styling

function BookDetail({ book, onClose }) {
  const numberOfChapters = 10; // This is hardcoded for now
  const [summaries, setSummaries] = useState(Array(numberOfChapters).fill('')); // Initialize state for summaries
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const handleSummaryChange = (text, index) => {
    // Update the summary for the specific chapter index
    setSummaries(summaries.map((summary, i) => (i === index ? text : summary)));
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
        console.log(response.data);
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
          <Button variant="contained" color="primary" onClick={onClose}>
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
                  onChange={e => handleSummaryChange(e.target.value, index)}
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
