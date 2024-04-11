import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExerciseTask from '../ExerciseTask';
import SubNavbar from '../SubNavbar';

// If SubNavbar has any props or requires context, provide mock props or context as needed.
jest.mock('../SubNavbar', () => {
  return jest.fn(() => <div>SubNavbar component</div>);
});

describe('ExerciseTask', () => {
  it('renders without crashing and displays the correct content', () => {
    render(<ExerciseTask />);

    // Check if SubNavbar is rendered
    expect(SubNavbar).toHaveBeenCalled();

    // Check if the message is displayed
    expect(screen.getByText(/To unblock browsing with exercise, use mobile app/i)).toBeInTheDocument();

    // Check for styling
    const divElement = screen.getByText(/To unblock browsing with exercise, use mobile app/i).parentElement;
    expect(divElement).toHaveStyle({
      backgroundColor: '#fff',
      borderRadius: '8px',
      maxWidth: '800px',
      padding: '20px',
      color: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      height: '100vh',
    });
  });
});
