import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Home from '../pages/Home.jsx';

// Simulate the demos chunk failing to download (offline, stale deploy…).
vi.mock('../demos/DemoPlayer.jsx', () => {
  throw new Error('Failed to fetch dynamically imported module');
});

afterEach(cleanup);

describe('DemosSection when the demos fail to load', () => {
  it('shows an error card and keeps the rest of the landing working', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Home />);

    expect(await screen.findByText(/no pudimos cargar las demos/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /recargar/i })).toBeTruthy();
    expect(screen.getByRole('form', { name: /formulario de contacto/i })).toBeTruthy();
    expect(document.getElementById('sobre-nosotros')).not.toBeNull();
    consoleError.mockRestore();
  });
});
