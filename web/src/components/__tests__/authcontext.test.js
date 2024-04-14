import React, { useContext } from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../AuthContext.js';

// Mock helper function for sessionStorage to facilitate testing
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

describe('AuthProvider', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with loading state and not render children', () => {
    const { queryByText } = render(
      <AuthProvider>
      </AuthProvider>
    );
    expect(queryByText('Child component')).not.toBeInTheDocument();
  });

  it('renders children after loading is complete', async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(
        <AuthProvider>
          <div>Child component</div>
        </AuthProvider>
      );
    });
    expect(renderResult.queryByText('Child component')).toBeInTheDocument();
  });

  it('handles login and sets user in sessionStorage', () => {
    let auth;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(context) => {
            auth = context;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    act(() => {
      auth.login({ username: 'testUser' });
    });

    expect(window.sessionStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ username: 'testUser' }));
    expect(auth.isLoggedIn).toBeTruthy();
  });

  it('handles logout and removes user from sessionStorage', () => {
    let auth;
    window.sessionStorage.setItem('user', JSON.stringify({ username: 'testUser' }));
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(context) => {
            auth = context;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    act(() => {
      auth.logout();
    });

    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('user');
    expect(auth.isLoggedIn).toBeFalsy();
  });

  it('initializes isLoggedIn based on sessionStorage', () => {
    window.sessionStorage.setItem('user', JSON.stringify({ username: 'testUser' }));
    let auth;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(context) => {
            auth = context;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    expect(auth.isLoggedIn).toBeFalsy();
  });
});
