import React from 'react';
import PropTypes from 'prop-types';
import '../styles/progressbar.css'; // You'll need to create this CSS file

function ProgressBar({ completionPercentage }) {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        data-testid="progress-bar"
        style={{ width: `${completionPercentage}%` }}
      ></div>
    </div>
  );
}

ProgressBar.propTypes = {
  completionPercentage: PropTypes.number.isRequired,
};

export default ProgressBar;
