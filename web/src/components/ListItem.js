import React from 'react';
import '../assets/ListItem.css';
function ListItem(props) {
  const container = {
    width: '34vw',
    listStyle: 'none',
    padding: '10px',
    border: '1px #ccc solid',
    marginTop: '8vh',
    overflow: 'hidden', // Ensure that nothing overflows outside the container
    marginLeft: '0.7vw',
    borderRadius: '5px',
  };
  const listItem = {
    display: 'flex',
    alignItems: 'flex-start', // Align items to the start to accommodate different heights
  };
  const listText = {
    justifyContent: 'center',
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 10px',
    overflow: 'hidden', // Ensure that nothing overflows outside the container
    textOverflow: 'ellipsis', // Add ellipsis at the end if text is too long
  };
  const descText = {
    justifyContent: 'center',
    width: '100%',
    display: '-webkit-box', // Needed to enable line clamping
    WebkitBoxOrient: 'vertical', // Vertical stacking of text lines
    WebkitLineClamp: 5, // Number of lines after which to show ellipsis
    overflow: 'hidden', // Hide overflow to enable ellipsis
    padding: '0 10px',
    textOverflow: 'ellipsis', // Add ellipsis at the end if text is too long
  };

  function ListImage(props) {
    console.log(props.image);
    return (
      <img
        src={props.image}
        style={{ width: '30%', maxHeight: '100%', objectFit: 'cover' }}
        alt=""
      />
    );
  }

  return (
    <div style={container} className={'container'} onClick={props.addBook}>
      <li style={listItem}>
        <div style={{ width: '70%' }}>
          <div style={listText}>
            <h4>{props.title}</h4>
            <p>{props.authors}</p>
            <p style={descText}>{props.description}</p>
          </div>
        </div>
        <ListImage image={props.image} />
      </li>
    </div>
  );
}

export default ListItem;
