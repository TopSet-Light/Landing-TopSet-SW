export const CONTACT_EMAIL = 'topsetsoftware@gmail.com';

/** Keep header-bound fields on a single line to avoid mailto injection. */
function oneLine(value) {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/** Build the mailto URL used by the static contact form (no backend required). */
export function buildContactMailto({ name, email, message }) {
  const safeName = oneLine(name);
  const safeEmail = oneLine(email);
  const subject = `Consulta desde topSet.studio — ${safeName}`;
  const body = [`Nombre: ${safeName}`, `Email: ${safeEmail}`, '', message.trim()].join('\r\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
