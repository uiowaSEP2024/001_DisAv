import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ExerciseScreen from '../../screens/ExerciseScreen';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSession } from '../../context/SessionContext';
import { Pedometer } from 'expo-sensors';

// Mock axios
jest.mock('axios');

// Mock the useSession hook
jest.mock('../../context/SessionContext', () => ({
  useSession: jest.fn(),
}));

// Mock Pedometer from expo-sensors
jest.mock('expo-sensors', () => ({
  Pedometer: {
    watchStepCount: jest.fn(),
    isAvailableAsync: jest.fn().mockResolvedValue(true),
  },
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock the api variable from the config file
jest.mock('../../config/Api', () => ({
  api: 'http://localhost:3002',
}));

// Mock useIsFocused to simulate screen focus
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useIsFocused: jest.fn(() => true),
  };
});

describe('ExerciseScreen', () => {
  beforeEach(() => {
    // Reset mocks before each test
    axios.get.mockClear();
    axios.post.mockClear();
    axios.put.mockClear();
    mockNavigation.navigate.mockClear();
    Pedometer.watchStepCount.mockClear();

    // Set up the useSession mock return value
    useSession.mockReturnValue({
      user: {
        username: 'testuser',
      },
    });

    // Mock default Pedometer behavior
    Pedometer.watchStepCount.mockImplementation(callback => {
      callback({ steps: 0 });
      return { remove: jest.fn() };
    });

    // Mock setInterval to immediately execute the callback function
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval').mockImplementation(callback => {
      callback();
      return 0; // Mock ID of the interval
    });
  });

  afterEach(() => {
    jest.useRealTimers(); // Clean up and use real timers after each test
  });

  it('initializes and fetches tasks', async () => {
    // Mock API response
    axios.get.mockResolvedValue({
      data: { tasks: [{ _id: '1', isCompleted: false }] },
    });

    render(
      <PaperProvider>
        <ExerciseScreen />
      </PaperProvider>
    );

    // Use waitFor with an assertion that doesn't depend on timing
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });
  //   it('handles API error on fetching tasks', async () => {
  //     axios.get.mockResolvedValue({ status: 401, data: { tasks: [] } });

  //     const { getByText } = render(
  //       <PaperProvider>
  //         <ExerciseScreen />
  //       </PaperProvider>
  //     );

  //     await waitFor(() => {
  //       expect(getByText('Failed to fetch tasks: API Error')).toBeTruthy();
  //     });
  //   });

  it('selects an exercise and shows modal', async () => {
    // Mock API response to simulate having a current active task
    axios.get.mockResolvedValue({
      data: { tasks: [{ _id: '1', isCompleted: false }] },
    });

    const { getByText } = render(
      <PaperProvider>
        <ExerciseScreen />
      </PaperProvider>
    );

    await waitFor(() => {
      // Assuming your modal shows the selected exercise description
      expect(getByText(/Walk 100 steps|Do 15 pushups|Do 15 jumping jacks/)).toBeTruthy();
    });
  });

  it('completes an exercise and updates task', async () => {
    // Mock API response to simulate having a current active task
    axios.get.mockResolvedValue({
      data: { tasks: [{ _id: '1', isCompleted: false }] },
    });

    // Mock the selected exercise and modal visibility
    // Since we're directly testing the component's reaction to button presses,
    // we need to ensure the component's state is in the correct state.
    // This might involve directly setting state, which isn't ideal for testing.
    // Alternatively, ensure your mock responses and initial conditions
    // lead to the modal being visible and the button being present.

    const { getByTestId, getByText } = render(
      <PaperProvider>
        <ExerciseScreen />
      </PaperProvider>
    );

    // Wait for the modal to become visible. This might involve waiting for
    // certain text to appear or for a certain state to be reached.
    // For example, if your modal shows a specific exercise description, wait for that:
    await waitFor(() => {
      expect(getByText(/Walk 100 steps|Do 15 pushups|Do 15 jumping jacks/)).toBeTruthy();
    });

    // Now that the modal is confirmed to be visible, attempt to press the button.
    // Use getByTestId for more precise targeting if your button has a testID.
    fireEvent.press(getByTestId('complete-exercise-button'));

    // Continue with your assertions
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
        id: expect.any(String),
        isCompleted: true,
        endTime: expect.any(Date),
      });
    });
  });

  // TODO need to figure out a way to mock the step count

  // it('completes a non-walking exercise and updates task', async () => {
  //   // Setup initial state to simulate a non-walking exercise selected
  //   // For this example, let's assume 'pushups' is selected
  //   // You might need to adjust the setup based on how your component selects an exercise

  //   // Mock API response to simulate having a current active task
  //   axios.get.mockResolvedValue({
  //     data: { tasks: [{ _id: '1', isCompleted: false }] },
  //   });

  //   const { getByTestId, getByText } = render(
  //     <PaperProvider>
  //       <ExerciseScreen />
  //     </PaperProvider>
  //   );

  //   await waitFor(() => {
  //     expect(getByText(/Walk 100 steps|Do 15 pushups|Do 15 jumping jacks/)).toBeTruthy();
  //   });

  //   // Simulate the exercise being selected and the modal being shown
  //   // This step depends on your component's implementation

  //   // Advance timers by the duration to simulate the delay
  //   jest.advanceTimersByTime(10000); // Adjust the time based on the exercise duration

  //   // Attempt to press the "Complete Exercise" button
  //   fireEvent.press(getByTestId('complete-exercise-button'));

  //   // Wait for the axios.put call
  //   await waitFor(() => {
  //     expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
  //       id: expect.any(String),
  //       isCompleted: true,
  //       endTime: expect.any(Date),
  //     });
  //   });
  // });

  // TODO need to figure out a way to mock the step count
  //   it('completes a walking exercise and updates task', async () => {
  //     // Mock Pedometer to simulate step count updates
  //     Pedometer.watchStepCount.mockImplementation(callback => {
  //       callback({ steps: 101 }); // Simulate steps exceeding the target
  //       return { remove: jest.fn() };
  //     });

  //     // Mock API response to simulate having a current active task
  //     axios.get.mockResolvedValue({
  //       data: { tasks: [{ _id: '1', isCompleted: false }] },
  //     });

  //     const { getByTestId, getByText } = render(
  //       <PaperProvider>
  //         <ExerciseScreen />
  //       </PaperProvider>
  //     );

  //     await waitFor(() => {
  //         expect(getByText(/Walk 100 steps|Do 15 pushups|Do 15 jumping jacks/)).toBeTruthy();
  //       });

  //     // Simulate the exercise being selected and the modal being shown
  //     // This step depends on your component's implementation

  //     // Attempt to press the "Complete Exercise" button
  //     fireEvent.press(getByTestId('complete-exercise-button'));

  //     // Wait for the axios.put call
  //     await waitFor(() => {
  //       expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
  //         id: expect.any(String),
  //         isCompleted: true,
  //         endTime: expect.any(Date),
  //       });
  //     });
  //   });

  it('updates step count for walking exercise', async () => {
    // Mock Pedometer to simulate step count updates
    Pedometer.watchStepCount.mockImplementation(callback => {
      callback({ steps: 101 }); // Simulate steps exceeding the target
      return { remove: jest.fn() };
    });

    const { getByText } = render(
      <PaperProvider>
        <ExerciseScreen />
      </PaperProvider>
    );

    await waitFor(() => {
      expect(getByText('Current step count: 0')).toBeTruthy();
    });
  });

  // Add more tests as needed to cover additional functionalities and edge cases
});
