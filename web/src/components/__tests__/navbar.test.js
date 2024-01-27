import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Navbar from '../Navbar.js';



test('Navbar renders correctly', () => {
    const tree = renderer
      .create(<Navbar />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

test('Check navbar elements', () => {
  render(<Navbar />);
  const linkElement = screen.getByText(/sign up/i);
  expect(linkElement).toBeInTheDocument();
});
