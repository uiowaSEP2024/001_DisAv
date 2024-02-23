import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Preferences from '../../screens/Preferences';
import axios from 'axios';
import { Provider as PaperProvider } from 'react-native-paper';

// Mock axios
jest.mock('axios', () => ({
  put: jest.fn(),
}));

// Mock the useSession hook
jest.mock('../../context/SessionContext', () => ({
  useSession: () => ({
    user: {
      preferredTasks: { work: false, read: true, exercise: false, rest: true },
    },
    saveUser: jest.fn().mockImplementation(() => Promise.resolve(true)),
  }),
}));

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};
// Mock response data for axios
const mockResponseData = {
  data: {
    user: {
      Work: false,
      Reading: false,
      Exercise: false,
      Break: false,
    },
  },
};

axios.put.mockImplementation(() => Promise.resolve(mockResponseData));

// Mock the api variable from the config file
jest.mock('../../config/Api', () => ({
  api: 'http://localhost:3002',
}));

describe('Preferences', () => {
  // it('renders correctly with initial user preferences', () => {
  //   const { getByText, getByTestId } = render(
  //     <PaperProvider>
  //       <Preferences navigation={mockNavigation} />
  //     </PaperProvider>
  //   );
  //   expect(getByText('What are your preferred tasks?')).toBeTruthy();
  //   // Check for task buttons based on the mocked user's preferred tasks
  //   expect(getByTestId('work-checkbox')).toBeTruthy();
  //   expect(getByTestId('read-checkbox')).toBeTruthy();
  //   expect(getByTestId('exercise-checkbox')).toBeTruthy();
  //   expect(getByTestId('rest-checkbox')).toBeTruthy();
  // });

  it('renders work description input when "Work" is selected', async () => {
    const { getByTestId, queryByText } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    // Click the "Work" checkbox
    fireEvent.press(getByTestId('work-checkbox'));

    // Wait for the checkbox to be checked
    await waitFor(() => {
      expect(getByTestId('work-checkbox').props.accessibilityState.checked).toBe(true);
    });

    // Ensure the state has had time to update
    await waitFor(() => expect(getByTestId('next-button')).toBeTruthy());

    // Now press the "Next" button
    fireEvent.press(getByTestId('next-button'));

    // Then wait for the work description input to appear
    await waitFor(() => {
      expect(
        queryByText('What kind of work do you do? (be as descriptive as possible)')
      ).toBeTruthy();
      expect(getByTestId('work-description-input')).toBeTruthy();
    });
  });

  it('renders read description input when "Reading" is selected', async () => {
    const { getByTestId, queryByText } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    // Click the "Reading" checkbox
    fireEvent.press(getByTestId('read-checkbox'));

    // Ensure the state has had time to update
    await waitFor(() => expect(getByTestId('next-button')).toBeTruthy());

    // Now press the "Next" button
    fireEvent.press(getByTestId('next-button'));

    // Then wait for the work description input to appear
    await waitFor(() => {
      expect(
        queryByText('What kind of reading do you enjoy? (be as descriptive as possible)')
      ).toBeTruthy();
      expect(getByTestId('reading-description-input')).toBeTruthy();
    });
  });

  it('shows task frequency selection after clicking "Next"', async () => {
    const { getByText, queryByText, getByTestId } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    const workCheckbox = getByTestId('work-checkbox');
    fireEvent.press(workCheckbox); // Select "Work"

    // Press "Next" to show task frequency selection
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      // Now we expect the work description input to be in the document
      expect(queryByText('How often do you want a task to be triggered?')).toBeTruthy();
    });
  });

  it('submits user preferences with work description, reading description and task frequency', async () => {
    const { getByText, getByTestId } = render(
      <PaperProvider>
        <Preferences navigation={mockNavigation} />
      </PaperProvider>
    );

    // Click the "Work" checkbox
    fireEvent.press(getByTestId('work-checkbox'));

    // Wait for the checkbox to be checked
    await waitFor(() => {
      expect(getByTestId('work-checkbox').props.accessibilityState.checked).toBe(true);
    });

    fireEvent.press(getByTestId('read-checkbox'));

    // Ensure the state has had time to update
    await waitFor(() => expect(getByTestId('next-button')).toBeTruthy());

    // Now press the "Next" button
    fireEvent.press(getByTestId('next-button'));

    // Fill in the work description
    const workDescriptionInput = getByTestId('work-description-input'); // Ensure you add testID='work-description-input' to your TextInput for work description
    fireEvent.changeText(workDescriptionInput, 'Software Development');

    // Fill in the reading description
    const readingDescriptionInput = getByTestId('reading-description-input'); // Ensure you add testID='reading-description-input' to your TextInput for reading description
    fireEvent.changeText(readingDescriptionInput, 'Science fiction, fantasy and self-help books');

    // Assuming you have testIDs for your Picker components for hours and minutes
    const hoursPicker = getByTestId('hours-picker');
    const minutesPicker = getByTestId('minutes-picker');
    fireEvent(hoursPicker, 'onValueChange', '2');
    fireEvent(minutesPicker, 'onValueChange', '30');

    // Submit the form
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      // Check if axios.put was called with the expected payload
      expect(axios.put).toHaveBeenCalledWith(expect.any(String), {
        user: expect.objectContaining({
          preferredTasks: expect.any(Object),
          taskFrequency: expect.any(Number), // You might need to adjust this based on how you calculate taskFrequency
          workPreferences: 'Software Development',
          readingPreferences: 'Science fiction, fantasy and self-help books',
        }),
      });
    });
  });

  // Add more tests as needed, for example, testing individual task selection toggles
});
