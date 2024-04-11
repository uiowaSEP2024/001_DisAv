import { Link } from 'react-router-dom';
import React from 'react';

function SubNavbar() {
  return (
    <div className="task-navbar">
      <div className="">
        <Link className="taskNames" to="/break-task">
          Timer{' '}
        </Link>
      </div>
      <div>
        <Link className="taskNames" to="/read-task">
          Reading{' '}
        </Link>
      </div>
      <div>
        <Link className="taskNames" to="/exercise-task">
          Exercise{' '}
        </Link>
      </div>
      <div>
        <Link className="taskNames" to="">
          Placeholder{' '}
        </Link>
      </div>
    </div>
  );
}

export default SubNavbar;
