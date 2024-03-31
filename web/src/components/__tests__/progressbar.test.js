import React from 'react';
import { render } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('<ProgressBar />', () => {
  test('renders correctly with completion percentage', () => {
    const { getByTestId } = render(<ProgressBar completionPercentage={75} />);
    const progressBar = getByTestId('progress-bar');
    expect(progressBar).toHaveStyle('width: 75%');
  });
});
