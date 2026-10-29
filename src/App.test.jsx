import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App.jsx';

vi.mock('./pages/Home.jsx', () => ({ default: () => <div>Portfolio loaded</div> }));

beforeEach(() => {
  window.scrollTo = vi.fn();
  window.matchMedia = vi.fn(() => ({ matches: false }));
  history.replaceState(null, '', '/');
});
afterEach(cleanup);

describe('Welcome entry', () => {
  it.each(['', '#proyectos', '#contacto', '#sobre-nosotros'])(
    'shows welcome after refresh with %s',
    (hash) => {
      history.replaceState(null, '', '/' + hash);
      render(<App />);
      expect(screen.getByRole('button', { name: /entrar al sitio/i })).toBeTruthy();
      expect(screen.queryByText('Portfolio loaded')).toBeNull();
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
    },
  );
  it('enters only after clicking and completing the flight', async () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /entrar al sitio/i });
    fireEvent.click(button);
    expect(screen.queryByText('Portfolio loaded')).toBeNull();
    const animationEnd = new Event('animationend', { bubbles: true });
    Object.defineProperty(animationEnd, 'animationName', { value: 'launch-away' });
    fireEvent(button, animationEnd);
    expect(await screen.findByText('Portfolio loaded')).toBeTruthy();
  });
  it('enters without waiting for animation when reduced motion is enabled', async () => {
    window.matchMedia = vi.fn(() => ({ matches: true }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /entrar al sitio/i }));
    expect(await screen.findByText('Portfolio loaded')).toBeTruthy();
  });
  it('shows welcome again when the application mounts after entry', async () => {
    window.matchMedia = vi.fn(() => ({ matches: true }));
    const view = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /entrar al sitio/i }));
    await screen.findByText('Portfolio loaded');
    view.unmount();
    history.replaceState(null, '', '/#proyectos');
    render(<App />);
    expect(screen.getByRole('button', { name: /entrar al sitio/i })).toBeTruthy();
  });
});
