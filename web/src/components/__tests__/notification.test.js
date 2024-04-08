import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from '../Notification'; // Adjust the import path according to your project structure

describe('Notification', () => {
  test('does not render when visible is false', () => {
    render(<Notification visible={false} message="Test Message" />);
    // The notification should not be present in the document
    expect(screen.queryByText("Test Message")).not.toBeInTheDocument();
  });

  test('renders correctly when visible is true', () => {
    render(<Notification visible={true} message="Visible Message" />);
    // The notification should be present in the document
    expect(screen.getByText("Visible Message")).toBeInTheDocument();
  });

  test('displays the correct message', () => {
    const testMessage = "This is a test message";
    render(<Notification visible={true} message={testMessage} />);
    // Check if the message passed via props is displayed
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
});
