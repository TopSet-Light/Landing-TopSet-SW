import { describe, expect, it, vi } from 'vitest';
import { WEB3FORMS_ENDPOINT, sendContactForm } from './sendContactForm.js';

const data = { accessKey: 'test-key', name: 'Ana', email: 'ana@empresa.com', message: 'Hola' };

function respond(ok, body) {
  return vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 400, json: async () => body });
}

describe('sendContactForm', () => {
  it('posts the message to Web3Forms with the access key', async () => {
    const fetchImpl = respond(true, { success: true });
    await sendContactForm(data, fetchImpl);

    const [url, options] = fetchImpl.mock.calls[0];
    expect(url).toBe(WEB3FORMS_ENDPOINT);
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toMatchObject({
      access_key: 'test-key',
      name: 'Ana',
      email: 'ana@empresa.com',
      replyto: 'ana@empresa.com',
      message: 'Hola',
    });
  });

  it('throws when Web3Forms rejects the submission', async () => {
    await expect(
      sendContactForm(data, respond(true, { success: false, message: 'Invalid key' })),
    ).rejects.toThrow('Invalid key');
    await expect(sendContactForm(data, respond(false, null))).rejects.toThrow();
  });
});
