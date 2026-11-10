import { describe, expect, it } from 'vitest';
import { CONTACT_EMAIL, buildContactMailto } from './contactMailto.js';

function parse(href) {
  const url = new URL(href);
  return {
    pathname: url.pathname,
    subject: url.searchParams.get('subject'),
    body: url.searchParams.get('body'),
  };
}

describe('buildContactMailto', () => {
  it('builds a mailto URL with the contact address, subject and body', () => {
    const href = buildContactMailto({
      name: 'Ana Pérez',
      email: 'ana@empresa.com',
      message: 'Necesito una plataforma de pagos.',
    });
    const { pathname, subject, body } = parse(href);

    expect(href.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true);
    expect(pathname).toBe(CONTACT_EMAIL);
    expect(subject).toBe('Consulta desde topSet.studio — Ana Pérez');
    expect(body).toContain('Nombre: Ana Pérez');
    expect(body).toContain('Email: ana@empresa.com');
    expect(body).toContain('Necesito una plataforma de pagos.');
  });

  it('keeps name and email on one line to avoid mailto header injection', () => {
    const href = buildContactMailto({
      name: 'Ana\r\nBcc: otra@empresa.com',
      email: 'ana@empresa.com\r\nBcc: otra@empresa.com',
      message: 'Hola',
    });
    const { subject, body } = parse(href);

    expect(subject).toBe('Consulta desde topSet.studio — Ana Bcc: otra@empresa.com');
    expect(body).toContain('Nombre: Ana Bcc: otra@empresa.com');
    expect(body).toContain('Email: ana@empresa.com Bcc: otra@empresa.com');
    expect(body).not.toContain('\rBcc:');
  });
});
