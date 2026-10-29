import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import Home from './Home.jsx';

const originalScrollIntoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
);

beforeEach(() => {
  history.replaceState(null, '', '/');
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});
afterEach(() => {
  cleanup();
  if (originalScrollIntoView)
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView);
  else delete HTMLElement.prototype.scrollIntoView;
});

describe('Home navigation and content', () => {
  it('focuses the main heading after entry', () => {
    render(<Home />);
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 }));
  });

  it.each(['proyectos', 'sobre-nosotros', 'contacto'])(
    'scrolls to the requested section: %s',
    (id) => {
      history.replaceState(null, '', '/#' + id);
      render(<Home />);
      expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(HTMLElement.prototype.scrollIntoView.mock.instances[0]).toBe(
        document.getElementById(id),
      );
    },
  );

  it('preserves the six projects and navigation destinations', () => {
    render(<Home />);
    expect(screen.getAllByRole('article')).toHaveLength(6);
    for (const link of within(screen.getByRole('navigation')).getAllByRole('link')) {
      expect(document.getElementById(link.hash.slice(1))).not.toBeNull();
    }
    expect(screen.getAllByText('DEMO')).toHaveLength(4);
  });
});
