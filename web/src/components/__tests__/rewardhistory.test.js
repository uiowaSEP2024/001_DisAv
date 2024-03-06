import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import RewardHistory from '../RewardHistory';

// Mock axios
jest.mock('axios');
// Mock sessionStorage
Storage.prototype.getItem = jest.fn();

// Mock sessionStorage
const mockSessionStorage = (username) => {
    const user = { username };
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(user));
};

describe('RewardHistory', () => {
    const mockResponse = {
        data: {
            tasks: [
                { taskType: 'Task 1', date: '2023-04-03T10:00:00.000Z', points: 10 },
                { taskType: 'Task 2', date: '2023-04-04T10:00:00.000Z', points: 20 },
            ],
        },
    };

    beforeEach(() => {
        // Reset mocks before each test
        axios.get.mockClear();
        Storage.prototype.getItem.mockClear();
    });

    it('fetches tasks and displays them', async () => {
        mockSessionStorage('testUser');
        axios.get.mockResolvedValue(mockResponse);

        const setTotalPoints = jest.fn();
        const { getByText } = render(<RewardHistory setTotalPoints={setTotalPoints} />);

        // Wait for axios call to resolve and component to update
        await waitFor(() => {
            expect(getByText(/Task 1/)).toBeInTheDocument();
            expect(getByText(/Task 2/)).toBeInTheDocument();
            expect(setTotalPoints).toHaveBeenCalledWith(30); // 10 + 20
        });
    });

    it('handles API error gracefully', async () => {
        mockSessionStorage('testUser');
        axios.get.mockRejectedValue(new Error('Async error'));

        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
        const setTotalPoints = jest.fn();

        render(<RewardHistory setTotalPoints={setTotalPoints} />);

        await waitFor(() => {
            expect(consoleErrorMock).toHaveBeenCalledWith('Error fetching user tasks:', expect.any(Error));
        });

        consoleErrorMock.mockRestore();
    });
});
