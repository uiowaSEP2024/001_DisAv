import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import CountdownTimer from "../components/CountdownTimer";

jest.useFakeTimers();

describe('CountdownTimer', () => {
  let container = null;

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('renders with initial props', () => {
    act(() => {
      render(<CountdownTimer totalTime={60} timeLeft={60} />, container);
    });

    const textElement = container.querySelector('h3');
    expect(textElement.textContent).toBe(' Browser will freeze in:');

    const circularProgressBar = container.querySelector('.CircularProgressbar');
    expect(circularProgressBar).toBeTruthy();
  });


  it('clears interval on unmount', () => {
    act(() => {
      render(<CountdownTimer totalTime={60} timeLeft={60} />, container);
    });

    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

    act(() => {
      unmountComponentAtNode(container);
    });

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
