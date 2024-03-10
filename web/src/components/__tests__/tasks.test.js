import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Tasks from '../Tasks';
import TaskBreak from '../TaskBreak'; // If you're planning to mock this, remember to update the import path
import confetti from 'canvas-confetti';

jest.mock('canvas-confetti', () => jest.fn());

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

    test('renders and counts down correctly', () => {
        render(<Tasks />);
        expect(screen.getByText(/Time remaining: 10 seconds/i)).toBeInTheDocument();
        act(() => {
            jest.advanceTimersByTime(3000); // Fast-forward 3 seconds.
        });
        expect(screen.getByText(/Time remaining: 7 seconds/i)).toBeInTheDocument();
    });

    test('confetti triggers on timer end', () => {
        render(<Tasks />);
        act(() => {
            jest.advanceTimersByTime(10000); // Fast-forward past the timer duration.
        });
        expect(confetti).toHaveBeenCalled();
        expect(screen.getByText(/Task completed!/i)).toBeInTheDocument();
    });

    test('skip button works and triggers confetti', () => {
        render(<Tasks />);
        fireEvent.click(screen.getByText(/skip/i));
        expect(confetti).toHaveBeenCalled();
        expect(screen.getByText(/Task completed!/i)).toBeInTheDocument();
    });


    test('rendering exercise task', () => {
        render(<Tasks assignedTask="exercise" />);
        expect(screen.getByText(/Exercise task/i)).toBeInTheDocument();
    });

    test('rendering work task', () => {
        render(<Tasks assignedTask="work" />);
        expect(screen.getByText(/Work task/i)).toBeInTheDocument();
    });

    test('rendering reading task', () => {
        render(<Tasks assignedTask="reading" />);
        expect(screen.getByText(/Reading task/i)).toBeInTheDocument();
    });

    test('rendering break task', () => {
        render(<Tasks assignedTask="break" />);
        expect(screen.getByText("Break Time")).toBeInTheDocument();
    });


});
