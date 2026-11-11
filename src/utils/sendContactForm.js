export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Web3Forms access key. It is public by design (Web3Forms keys only allow
 * sending to the inbox they were created for), so it can live in a VITE_ var.
 * While it is empty the contact form falls back to the mailto flow.
 */
export const WEB3FORMS_ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? '').trim();

/** Send the contact form through Web3Forms. Resolves on success, throws otherwise. */
export async function sendContactForm({ accessKey, name, email, message }, fetchImpl = fetch) {
  const response = await fetchImpl(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Consulta desde topSet.studio — ${name}`,
      from_name: 'TOPSET — Formulario web',
      name,
      email,
      replyto: email,
      message,
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON answer: handled as a failure below.
  }
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || `Web3Forms respondió ${response.status}`);
  }
  return data;
}
