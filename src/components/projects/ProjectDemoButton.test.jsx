import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ProjectDemoButton from './ProjectDemoButton.jsx';

const project = { name: 'Forma — Tienda online', demoUrl: null };

afterEach(cleanup);

describe('ProjectDemoButton', () => {
  it('renders a real link when the project has a demo URL', () => {
    render(<ProjectDemoButton project={{ ...project, demoUrl: 'https://demo.example.com' }} />);
    const link = screen.getByRole('link', { name: /ver demo de forma/i });
    expect(link.getAttribute('href')).toBe('https://demo.example.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders a pending state instead of a dead link when there is no URL', () => {
    render(<ProjectDemoButton project={project} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(/demo próximamente/i)).toBeTruthy();
  });

  it('treats a blank URL as pending', () => {
    render(<ProjectDemoButton project={{ ...project, demoUrl: '   ' }} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(/demo próximamente/i)).toBeTruthy();
  });
});
