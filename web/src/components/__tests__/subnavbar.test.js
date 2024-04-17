import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import SubNavbar from '../SubNavbar';

describe('SubNavbar', () => {
  it('renders correctly', () => {
    render(
      <Router>
        <SubNavbar />
      </Router>
    );

    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Reading')).toBeInTheDocument();
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('Placeholder')).toBeInTheDocument();
  });

  it('has correct links', () => {
    render(
      <Router>
        <SubNavbar />
      </Router>
    );

    expect(screen.getByText('Timer').closest('a')).toHaveAttribute('href', '/break-task');
    expect(screen.getByText('Reading').closest('a')).toHaveAttribute('href', '/read-task');
    expect(screen.getByText('Exercise').closest('a')).toHaveAttribute('href', '/exercise-task');
    expect(screen.getByText('Placeholder').closest('a')).toHaveAttribute('href', '/');
  });
});
