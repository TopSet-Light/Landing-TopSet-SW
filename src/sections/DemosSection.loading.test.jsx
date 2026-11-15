import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import DemosSection from './DemosSection.jsx';

const loader = vi.hoisted(() => {
  let resolve;
  const promise = new Promise((ready) => {
    resolve = ready;
  });
  return { resolve, load: vi.fn(() => promise) };
});
vi.mock('../demos/loadDemoPlayer.js', () => ({ default: loader.load }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('keeps the picker available before observation and while loading, then preserves selection and next-demo navigation', async () => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true })),
  );
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(350);

  render(<DemosSection />);
  const taller = screen.getByRole('tab', { name: /gestión de taller/i });
  const turnero = screen.getByRole('tab', { name: /turnos online/i });
  expect(taller.getAttribute('aria-selected')).toBe('true');
  expect(screen.getByRole('status').textContent).toMatch(/cargando demos/i);
  expect(loader.load).not.toHaveBeenCalled();

  // Selecting a card also starts loading without waiting for the observer.
  fireEvent.click(turnero);
  expect(loader.load).toHaveBeenCalledTimes(1);
  expect(turnero.getAttribute('aria-selected')).toBe('true');
  expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(turnero.id);
  expect(screen.getByRole('status').textContent).toMatch(/cargando demos/i);

  await act(async () => loader.resolve(await import('../demos/DemoPlayer.jsx')));
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByRole('tab', { name: /turnos online/i })).toBe(turnero);
  expect(screen.getByText('turnos.kine.com.ar')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: /probar taller/i }));
  expect(taller.getAttribute('aria-selected')).toBe('true');
  expect(screen.getByText('taller.topset.com.ar')).toBeTruthy();
  fireEvent.click(turnero);
  expect(screen.getByText('turnos.kine.com.ar')).toBeTruthy();
  expect(loader.load).toHaveBeenCalledTimes(1);
});
