import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

// Helper function to render the App component within a Router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('App Routing', () => {
  test('renders the Navbar component', () => {
    renderWithRouter(<App />);
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  test('renders the Homepage component on the root route', () => {
    renderWithRouter(<App />, { route: '/' });
    const homepage = screen.getByTestId('homepage');
    expect(homepage).toBeInTheDocument();
  });

  test('renders the Login component on the /login route', () => {
    renderWithRouter(<App />, { route: '/login' });
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toBeInTheDocument();
  });
});
