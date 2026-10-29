import { describe, expect, it, vi } from 'vitest';
import createPageLoader from './createPageLoader.js';

describe('Page loading', () => {
  it('shares an in-flight request between preloading and entry', async () => {
    let resolveImport;
    const importPage = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveImport = resolve;
        }),
    );
    const loadPage = createPageLoader(importPage);
    const preload = loadPage();
    const entry = loadPage();
    expect(entry).toBe(preload);
    resolveImport({ default: 'Home' });
    await expect(entry).resolves.toBe('Home');
    expect(importPage).toHaveBeenCalledTimes(1);
  });

  it('reuses a successful load', async () => {
    const importPage = vi.fn().mockResolvedValue({ default: 'Home' });
    const loadPage = createPageLoader(importPage);
    await loadPage();
    await expect(loadPage()).resolves.toBe('Home');
    expect(importPage).toHaveBeenCalledTimes(1);
  });

  it('allows another attempt after a failed import', async () => {
    const failure = new Error('Module unavailable');
    const importPage = vi
      .fn()
      .mockRejectedValueOnce(failure)
      .mockResolvedValueOnce({ default: 'Home' });
    const loadPage = createPageLoader(importPage);
    await expect(loadPage()).rejects.toBe(failure);
    await expect(loadPage()).resolves.toBe('Home');
    expect(importPage).toHaveBeenCalledTimes(2);
  });
});
