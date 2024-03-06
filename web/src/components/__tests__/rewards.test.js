import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import RewardHistory from '../RewardHistory';

jest.mock('axios');

describe('RewardHistory', () => {
    const setTotalPoints = jest.fn();
    const mockTasks = [
        { taskType: 'Task 1', date: new Date(), points: 10 },
        { taskType: 'Task 2', date: new Date(), points: 20 },
    ];

    beforeEach(() => {
        sessionStorage.setItem('user', JSON.stringify({ username: 'testUser' }));
        axios.get.mockResolvedValue({ data: { tasks: mockTasks } });
    });

    afterEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    it('renders without crashing', async () => {
        await act(async () => {
            render(<RewardHistory setTotalPoints={setTotalPoints} />);
        });
    });

    it('fetches user tasks and sets total points on mount', async () => {
      render(<RewardHistory setTotalPoints={setTotalPoints} />);
      await act(async () => {
      // Wait for the axios call to resolve and the state to update
      await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(setTotalPoints).toHaveBeenCalledWith(30));
      });
  });

    it('renders tasks correctly', async () => {
        let findAllByText;
        // render(<RewardHistory setTotalPoints={setTotalPoints} />);
        await act(async () => {
            ({ findAllByText } = render(<RewardHistory setTotalPoints={setTotalPoints} />));
        });
        const items = await findAllByText(/Completed: Task \d on/);
        expect(items).toHaveLength(2);
    });
});
