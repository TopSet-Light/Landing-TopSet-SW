import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import FlyingButton from './FlyingButton.jsx';

afterEach(cleanup);

function endAnimation(target, animationName) {
  const event = new Event('animationend', { bubbles: true });
  Object.defineProperty(event, 'animationName', { value: animationName });
  fireEvent(target, event);
}

describe('FlyingButton interactions', () => {
  it('preloads on focus without entering the home', () => {
    const onIntent = vi.fn();
    const onClick = vi.fn();
    render(<FlyingButton onIntent={onIntent} onClick={onClick} />);
    fireEvent.focus(screen.getByRole('button'));
    expect(onIntent).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores additional clicks during departure', () => {
    const onClick = vi.fn();
    render(<FlyingButton launching onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('only completes the flight for the button departure animation', () => {
    const onFlightEnd = vi.fn();
    render(
      <FlyingButton launching onFlightEnd={onFlightEnd}>
        Take off
      </FlyingButton>,
    );
    const button = screen.getByRole('button');
    endAnimation(screen.getByText('Take off'), 'launch-away');
    endAnimation(button, 'jet-flicker');
    expect(onFlightEnd).not.toHaveBeenCalled();
    endAnimation(button, 'launch-away');
    expect(onFlightEnd).toHaveBeenCalledTimes(1);
  });
});
