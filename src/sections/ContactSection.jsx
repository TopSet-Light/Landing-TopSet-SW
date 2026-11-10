import { useState } from 'react';
import DepthButton from '../components/ui/DepthButton.jsx';
import { CONTACT_EMAIL, buildContactMailto } from '../utils/contactMailto.js';
import { WEB3FORMS_ACCESS_KEY, sendContactForm } from '../utils/sendContactForm.js';

const EMPTY_FORM = { name: '', email: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEND_ERROR = `No pudimos enviar tu consulta. Probá de nuevo en unos minutos o escribinos a ${CONTACT_EMAIL}.`;

function openMailClient(href) {
  window.location.href = href;
}

/**
 * With a Web3Forms access key the form posts the message directly; without one
 * it falls back to composing a mailto link in the visitor's mail client.
 * status: idle | sending | sent | mailto | error
 */
export default function ContactSection({
  navigate = openMailClient,
  accessKey = WEB3FORMS_ACCESS_KEY,
  submit = sendContactForm,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const usesService = Boolean(accessKey);
  const sending = status === 'sending';

  function updateField(field) {
    return (event) => {
      const { value } = event.target;
      setForm((current) => ({ ...current, [field]: value }));
      if (error) setError('');
      if (status !== 'idle' && status !== 'sending') setStatus('idle');
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return;
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus('idle');
      setError('Completá tu nombre, email y mensaje para enviar la consulta.');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setStatus('idle');
      setError('Ingresá un email válido, por ejemplo nombre@empresa.com.');
      return;
    }
    setError('');

    // Honeypot: real visitors never see or fill this field.
    if (event.currentTarget.elements.botcheck?.checked) {
      setForm(EMPTY_FORM);
      setStatus('sent');
      return;
    }

    if (!usesService) {
      setStatus('mailto');
      navigate(buildContactMailto({ name, email, message }));
      return;
    }

    setStatus('sending');
    try {
      await submit({ accessKey, name, email, message });
      setForm(EMPTY_FORM);
      setStatus('sent');
    } catch {
      setStatus('error');
      setError(SEND_ERROR);
    }
  }

  return (
    <section
      className="w-full bg-[#070707] py-16 sm:py-20 px-margin-mobile lg:px-[8vw]"
      id="contacto"
    >
      <div className="mx-auto max-w-[1240px] overflow-hidden rounded-2xl border border-white/[0.06] bg-surface-container-low shadow-[0_0_50px_-10px_rgba(255,80,112,0.1)]">
        <div className="p-6 sm:p-10 lg:p-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">
                CONTACTO
              </p>
              <h2 className="mt-4 font-headline-md text-[clamp(28px,7vw,42px)] font-bold leading-[1.06] text-on-surface uppercase">
                ¿TIENES UNA IDEA O UN SISTEMA QUE ESCALAR?
              </h2>
              <p className="mt-4 max-w-xl font-body-md text-body-md text-secondary">
                Contanos qué necesitás y coordinamos una sesión de diagnóstico técnico de 30 minutos
                sin costo.
              </p>
            </div>
            <div className="shrink-0 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <p className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">
                ESCRIBINOS DIRECTO
              </p>
              <a
                className="mt-2 inline-flex font-body-lg text-body-lg text-on-surface underline decoration-white/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                {CONTACT_EMAIL}
              </a>
              <p className="mt-3 font-body-sm text-body-sm text-secondary">
                Respondemos en un día hábil.
              </p>
            </div>
          </div>

          <form
            aria-label="Formulario de contacto"
            className="mt-10 rounded-xl border border-white/10 bg-[#0a0f16]/70 p-5 sm:p-8"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2" htmlFor="contact-name">
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  NOMBRE
                </span>
                <input
                  autoComplete="name"
                  className="w-full rounded-lg border border-white/10 bg-[#070b11] px-5 py-4 text-base text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-[17px]"
                  id="contact-name"
                  maxLength={120}
                  name="name"
                  onChange={updateField('name')}
                  placeholder="Tu nombre"
                  required
                  type="text"
                  value={form.name}
                />
              </label>
              <label className="flex flex-col gap-2" htmlFor="contact-email">
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">
                  EMAIL
                </span>
                <input
                  autoComplete="email"
                  className="w-full rounded-lg border border-white/10 bg-[#070b11] px-5 py-4 text-base text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-[17px]"
                  id="contact-email"
                  inputMode="email"
                  maxLength={160}
                  name="email"
                  onChange={updateField('email')}
                  placeholder="nombre@empresa.com"
                  required
                  type="email"
                  value={form.email}
                />
              </label>
            </div>

            <label className="mt-5 flex flex-col gap-2" htmlFor="contact-message">
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">
                MENSAJE
              </span>
              <textarea
                className="min-h-[160px] w-full resize-y rounded-lg border border-white/10 bg-[#070b11] px-5 py-4 text-base text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-[17px]"
                id="contact-message"
                maxLength={2000}
                name="message"
                onChange={updateField('message')}
                placeholder="Contanos qué querés construir o mejorar..."
                required
                rows={5}
                value={form.message}
              />
            </label>

            <input
              aria-hidden="true"
              className="hidden"
              name="botcheck"
              tabIndex={-1}
              type="checkbox"
            />

            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <DepthButton
                aria-busy={sending}
                className="!m-0 !min-h-[54px] w-full !px-8 sm:w-auto disabled:cursor-wait disabled:opacity-70"
                disabled={sending}
                type="submit"
              >
                <span>{sending ? 'Enviando…' : 'Enviar consulta'}</span>
                <span className="tracking-tighter transition-transform duration-200 group-hover:translate-x-1.5">
                  {'>>>'}
                </span>
              </DepthButton>
              <p className="font-body-sm text-body-sm text-secondary">
                {usesService
                  ? 'Te respondemos en un día hábil.'
                  : 'Se abre tu programa de correo con la consulta lista.'}
              </p>
            </div>

            <div aria-live="polite">
              {error ? (
                <p className="mt-4 font-body-sm text-body-sm text-error" role="alert">
                  {error}
                </p>
              ) : null}
              {status === 'sent' ? (
                <p className="mt-4 font-body-sm text-body-sm text-primary" role="status">
                  ¡Gracias! Recibimos tu consulta y te respondemos en un día hábil.
                </p>
              ) : null}
              {status === 'mailto' ? (
                <p className="mt-4 font-body-sm text-body-sm text-primary" role="status">
                  Abrimos tu programa de correo con la consulta lista para enviar. Si no se abrió,
                  escribinos a {CONTACT_EMAIL}.
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
