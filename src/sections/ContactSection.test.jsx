import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ContactSection from './ContactSection.jsx';
import { CONTACT_EMAIL } from '../utils/contactMailto.js';

function fillForm({ name = 'Ana Pérez', email = 'ana@empresa.com', message = 'Hola' } = {}) {
  fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/mensaje/i), { target: { value: message } });
}

afterEach(cleanup);

describe('ContactSection form', () => {
  it('shows the direct email and the form fields', () => {
    render(<ContactSection accessKey="" navigate={vi.fn()} />);
    expect(screen.getByRole('link', { name: CONTACT_EMAIL })).toBeTruthy();
    expect(screen.getByLabelText(/nombre/i)).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/mensaje/i)).toBeTruthy();
  });

  it('requires all fields before opening the mail client', () => {
    const navigate = vi.fn();
    render(<ContactSection accessKey="" navigate={navigate} />);

    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(screen.getByRole('alert').textContent).toMatch(/completá tu nombre/i);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('rejects an invalid email', () => {
    const navigate = vi.fn();
    render(<ContactSection accessKey="" navigate={navigate} />);

    fillForm({ email: 'ana' });
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(screen.getByRole('alert').textContent).toMatch(/email válido/i);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('opens a mailto URL with the submitted data', () => {
    const navigate = vi.fn();
    render(<ContactSection accessKey="" navigate={navigate} />);

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(navigate).toHaveBeenCalledTimes(1);
    const href = navigate.mock.calls[0][0];
    expect(href.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);
    expect(href).toContain(encodeURIComponent('Ana Pérez'));
    expect(screen.getByRole('status').textContent).toMatch(/programa de correo/i);
  });

  it('clears the status when the user edits the form again', () => {
    render(<ContactSection accessKey="" navigate={vi.fn()} />);

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));
    expect(screen.getByRole('status')).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana P.' } });
    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('ContactSection form with Web3Forms', () => {
  it('sends the trimmed data, clears the form and confirms', async () => {
    const navigate = vi.fn();
    const submit = vi.fn().mockResolvedValue({ success: true });
    render(<ContactSection accessKey="test-key" navigate={navigate} submit={submit} />);

    fillForm({ name: '  Ana Pérez ', message: ' Hola ' });
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(submit).toHaveBeenCalledWith({
      accessKey: 'test-key',
      name: 'Ana Pérez',
      email: 'ana@empresa.com',
      message: 'Hola',
    });
    expect((await screen.findByRole('status')).textContent).toMatch(/recibimos tu consulta/i);
    expect(screen.getByLabelText(/nombre/i).value).toBe('');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('adds the chosen topics at the start of the message', async () => {
    const submit = vi.fn().mockResolvedValue({ success: true });
    render(<ContactSection accessKey="test-key" navigate={vi.fn()} submit={submit} />);

    fireEvent.click(screen.getByLabelText(/turnos online/i));
    fireEvent.click(screen.getByLabelText(/sistema de gestión/i));
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(submit.mock.calls[0][0].message).toBe(
      'Necesito: Turnos online, Sistema de gestión\n\nHola',
    );
    await screen.findByRole('status');
    expect(screen.getByLabelText(/turnos online/i).checked).toBe(false);
  });

  it('shows an error and keeps the data when sending fails', async () => {
    const submit = vi.fn().mockRejectedValue(new Error('down'));
    render(<ContactSection accessKey="test-key" navigate={vi.fn()} submit={submit} />);

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect((await screen.findByRole('alert')).textContent).toMatch(/no pudimos enviar/i);
    expect(screen.getByLabelText(/nombre/i).value).toBe('Ana Pérez');
  });

  it('silently drops submissions that fill the honeypot', () => {
    const submit = vi.fn();
    const { container } = render(
      <ContactSection accessKey="test-key" navigate={vi.fn()} submit={submit} />,
    );

    fillForm();
    container.querySelector('input[name="botcheck"]').checked = true;
    fireEvent.click(screen.getByRole('button', { name: /enviar consulta/i }));

    expect(submit).not.toHaveBeenCalled();
  });
});
