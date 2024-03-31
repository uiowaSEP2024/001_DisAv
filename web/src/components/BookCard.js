import React from 'react';
import PropTypes from 'prop-types';
import '../styles/bookcard.css'; // You'll need to create this CSS file
import ProgressBar from './ProgressBar';

function BookCard({ title, imageLink, completionPercentage }) {
    // completionPercentage = completionPercentage || Math.floor(Math.random() * 100);
  return (
    <div className="book-card">
      <div className="book-image-container">
        <img src={imageLink} alt={title} className="book-cover" />
      </div>
      <div className="book-info">
        <h3 className="book-title">{title}</h3>
        <div className="completion-bar-container">
        <ProgressBar completionPercentage={completionPercentage} />
        </div>
      </div>
    </div>
  );
}

BookCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageLink: PropTypes.string.isRequired,
//   completionPercentage: PropTypes.number.isRequired,
};

export default BookCard;
