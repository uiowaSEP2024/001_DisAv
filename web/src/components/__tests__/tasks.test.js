import { render, fireEvent, act } from '@testing-library/react';
import Tasks from '../Tasks';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('Tasks', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { user: { frozenBrowsing: false } } });
    axios.put.mockResolvedValue({ data: { user: { frozenBrowsing: false } } });
    localStorage.setItem('username', 'testUser');
    sessionStorage.setItem('user', JSON.stringify({ frozenBrowsing: false }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MemoryRouter><Tasks assignedTask="break" /></MemoryRouter>);
  });

  // it('renders break task when assignedTask is break', () => {
  //   const { getByText } = render(<MemoryRouter><Tasks assignedTask="break" /></MemoryRouter>);
  //   expect(getByText('Break task')).toBeInTheDocument();
  // });

  // it('renders work task when assignedTask is work', () => {
  //   const { getByText } = render(<MemoryRouter><Tasks assignedTask="work" /></MemoryRouter>);
  //   expect(getByText('Work task')).toBeInTheDocument();
  // });

  // it('renders exercise task when assignedTask is exercise', () => {
  //   const { getByText } = render(<MemoryRouter><Tasks assignedTask="exercise" /></MemoryRouter>);
  //   expect(getByText('Exercise task')).toBeInTheDocument();
  // });

  // it('renders reading task when assignedTask is reading', () => {
  //   const { getByText } = render(<MemoryRouter><Tasks assignedTask="reading" /></MemoryRouter>);
  //   expect(getByText('Reading task')).toBeInTheDocument();
  // });

  // it('renders browsing is not frozen when user is not frozen', () => {
  //   const { getByText } = render(<MemoryRouter><Tasks assignedTask="break" /></MemoryRouter>);
  //   expect(getByText('Browsing is not frozen')).toBeInTheDocument();
  // });

  // it('renders task completed when timer reaches 0', async () => {
  //   jest.useFakeTimers();
  //   const { getByText } = render(<MemoryRouter><Tasks assignedTask="break" /></MemoryRouter>);
  //   await act(async () => {
  //     jest.advanceTimersByTime(300000);
  //   });
  //   expect(getByText('Task completed!')).toBeInTheDocument();
  //   jest.useRealTimers();
  // });

  // it('triggers skip task when skip button is clicked', async () => {
  //   localStorage.setItem('username', 'testUser');
  //   sessionStorage.setItem('user', JSON.stringify({ frozenBrowsing: true }));
  //   jest.useFakeTimers();
  //   const { getByText } = render(<MemoryRouter><Tasks assignedTask="break" /></MemoryRouter>);
  //   fireEvent.click(getByText('Skip'));
  //   await act(async () => {
  //     jest.advanceTimersByTime(300000);
  //   });
  //   expect(getByText('Task completed!')).toBeInTheDocument();
  //   jest.useRealTimers();
  // });
});
