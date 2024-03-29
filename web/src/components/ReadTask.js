import React from 'react';
import SubNavbar from './SubNavbar';
import "../styles/ReadTask.css"

function ReadTask(props) {
  return (
    <div className={"reading"}>
      <SubNavbar/>
      <h1 >Reading Task</h1>
      <p>Read a book for 30 minutes</p>
    </div>
  );
}

export default ReadTask;
