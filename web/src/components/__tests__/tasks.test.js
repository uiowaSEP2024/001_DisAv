import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import Tasks from '../Tasks';
import TaskBreak from '../TaskBreak'; // If you're planning to mock this, remember to update the import path
import confetti from 'canvas-confetti';
import axios from 'axios';

jest.mock('canvas-confetti', () => jest.fn());
jest.mock('axios');

describe('Tasks component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    confetti.mockClear();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers(); // Make sure this runs inside act()
    });
    jest.useRealTimers();
  });

  test('Displays no task when none is found', () => {
    render(<Tasks />);
    expect(screen.getByText(/No tasks at this time/i)).toBeInTheDocument();
  });

  test('renders and counts down correctly', async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [{ id: '123', name: 'Test Task' }], // Simulate a task being found
      },
    });
    render(<Tasks />);
    await waitFor(() => {
      expect(screen.getByText(/Time remaining: 10 seconds/i)).toBeInTheDocument();
    });
    act(() => {
      jest.advanceTimersByTime(3000); // Fast-forward 3 seconds.
    });
    await waitFor(() => {
      expect(screen.getByText(/Time remaining: 7 seconds/i)).toBeInTheDocument();
    });
  });
  //TODO Fix this test later

  // test('confetti triggers on timer end', async () => {
  //   axios.get.mockResolvedValue({
  //     data: {
  //       tasks: [{ id: '123', name: 'Test Task' }], // Simulate a task being found
  //     },
  //   });
  //   render(<Tasks />);
  //   act(() => {
  //     jest.advanceTimersByTime(10000); // Fast-forward past the timer duration.
  //   });
  //   await waitFor(() => expect(confetti).toHaveBeenCalled());
  //   await waitFor(()=>expect(screen.getByText(/Task completed!/i)).toBeInTheDocument());
  // });

  test('skip button works and triggers confetti', async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [{ id: '123', name: 'Test Task' }], // Simulate a task being found
      },
    });
    render(<Tasks />);
    await waitFor(() => {
        fireEvent.click(screen.getByText(/skip/i));
        expect(confetti).toHaveBeenCalled();
        expect(screen.getByText(/Task completed!/i)).toBeInTheDocument();
      }
    )
  });

  test('rendering exercise task', async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [{ id: '123', name: 'Test Task' }], // Simulate a task being found
      },
    });
    render(<Tasks assignedTask="exercise" />);
    await waitFor(()=> expect(screen.getByText('Exercise task')).toBeInTheDocument());

  });

  test('rendering work task', async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [{ id: '123', name: 'Test Task' }], // Simulate a task being found
      },
    });
    render(<Tasks assignedTask="work" />);
    await waitFor(()=> expect(screen.getByText('Work task')).toBeInTheDocument());

  });

  test('rendering reading task', async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [{ id: '123', name: 'Test Task' }], // Simulate a task being found
      },
    });
    render(<Tasks assignedTask="reading" />);
    await waitFor(()=> expect(screen.getByText('Reading task')).toBeInTheDocument());

  });

  test('rendering break task', async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [{ id: '123', name: 'Test Task' }], // Simulate a task being found
      },
    });
    render(<Tasks assignedTask="break" />);
    await waitFor(()=> expect(screen.getByText('Break Time')).toBeInTheDocument());
  });
});
