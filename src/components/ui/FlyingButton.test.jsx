import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import FlyingButton from './FlyingButton.jsx';

afterEach(cleanup);

function endAnimation(target, animationName) {
  const event = new Event('animationend', { bubbles: true });
  Object.defineProperty(event, 'animationName', { value: animationName });
  fireEvent(target, event);
}

// jsdom has no PointerEvent, so build one with the pointerType React reads.
function firePointer(target, type, pointerType) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
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

  it('does not lift the button on touch, so the tap still lands on it', () => {
    const onIntent = vi.fn();
    const onClick = vi.fn();
    render(<FlyingButton onIntent={onIntent} onClick={onClick} />);
    const button = screen.getByRole('button');
    const zone = button.parentElement;
    firePointer(zone, 'pointerover', 'touch');
    firePointer(button, 'pointerdown', 'touch');
    fireEvent.focus(button);
    expect(button.className).not.toContain('is-flying');
    expect(onIntent).toHaveBeenCalled();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('lifts the button on mouse hover', () => {
    render(<FlyingButton />);
    const button = screen.getByRole('button');
    firePointer(button.parentElement, 'pointerover', 'mouse');
    expect(button.className).toContain('is-flying');
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
