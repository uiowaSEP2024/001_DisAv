import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tasks from '../Tasks';
import TaskBreak from '../TaskBreak';

jest.useFakeTimers();

test('renders the break task', () => {
    render(<Tasks />);
    expect(screen.getByText(/break time/i)).toBeInTheDocument();
    }
);

test('renders the timer', () => {
    render(<Tasks />);
    expect(screen.getByText(/time remaining/i)).toBeInTheDocument();
    }
);

test('renders the skip button', () => {
    render(<Tasks />);
    expect(screen.getByText(/skip/i)).toBeInTheDocument();
    }
);


test('renders the skip button', () => {
    render(<Tasks />);
    expect(screen.getByText(/skip/i)).toBeInTheDocument();
    }
);

test('skip button should be disabled when timer is 0', () => {
    render(<Tasks />);
    const skipButton = screen.getByText(/skip/i);
    expect(skipButton).toBeDisabled();
    }
);

test('skip button should be enabled when timer is greater than 0', () => {
    render(<Tasks />);
    jest.advanceTimersByTime(10000);
    const skipButton = screen.getByText(/skip/i);
    expect(skipButton).toBeEnabled();
    }
);

test('skip button should skip the task', () => {
    render(<Tasks />);
    const skipButton = screen.getByText(/skip/i);
    fireEvent.click(skipButton);
    expect(screen.getByText(/task completed/i)).toBeInTheDocument();
    }
);

test('renders the break task', () => {
    render(<TaskBreak />);
    expect(screen.getByText(/break time/i)).toBeInTheDocument();
    }
);

test('renders the timer', () => {
    render(<TaskBreak />);
    expect(screen.getByText(/take a deep breath/i)).toBeInTheDocument();
    }
);

test('skip button should be disabled when timer is 0', () => {
    render(<TaskBreak />);
    const skipButton = screen.getByText(/skip/i);
    expect(skipButton).toBeDisabled();
    }
);

test('skip button should be enabled when timer is greater than 0', () => {
    render(<TaskBreak />);
    jest.advanceTimersByTime(10000);
    const skipButton = screen.getByText(/skip/i);
    expect(skipButton).toBeEnabled();
    }
);
