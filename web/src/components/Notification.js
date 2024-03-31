import React from 'react';

const container = {
  width: '80vw',
  height: '5vh',
  backgroundColor: '#242a5d',
  borderRadius: '20px',
  display: 'flex', // Enable flex container
  justifyContent: 'center', // Center horizontally
  alignItems: 'center', // Center vertically
  border: '1px solid #ceb2ee',
  color: '#fff',
  borderWidth: '5px',
  padding: '0 20px',
  minHeight: '5vh', // Changed to minHeight to accommodate larger text
  position: 'fixed', // Use fixed positioning
  bottom: '20px', // Distance from the bottom of the viewport
  left: '50%', // Center horizontally relative to the viewport
  transform: 'translateX(-50%)', // Offset by half of its width to center
  zIndex: 1000,
};

function Notification({ visible, message }) {
  if (!visible) return null;
  return (
    <div style={container}>
      <h4>{message}</h4>
    </div>
  );
}

export default Notification;
