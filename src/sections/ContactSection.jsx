import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TEAM } from '../data/team.js';
import { CONTACT_EMAIL, buildContactMailto } from '../utils/contactMailto.js';
import { WEB3FORMS_ACCESS_KEY, sendContactForm } from '../utils/sendContactForm.js';

const EMPTY_FORM = { name: '', email: '', message: '' };
const TOPICS = [
  { id: 'gestion', icon: 'dashboard', label: 'Sistema de gestión' },
  { id: 'turnos', icon: 'calendar_month', label: 'Turnos online' },
  { id: 'web', icon: 'devices', label: 'Página o app web' },
  { id: 'mejorar', icon: 'build', label: 'Mejorar algo que ya tengo' },
  { id: 'otra', icon: 'lightbulb', label: 'Otra idea' },
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEND_ERROR = `No pudimos enviar tu consulta. Probá de nuevo en unos minutos o escribinos a ${CONTACT_EMAIL}.`;

const TOAST_MS = 8000;

function openMailClient(href) {
  window.location.href = href;
}

/**
 * Floating confirmation shown after the message is sent. Rendered on <body> so
 * no transformed ancestor can trap its fixed position; closes itself after a
 * few seconds or with its buttons.
 */
function SentToast({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, TOAST_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return createPortal(
    <div className="toast" role="status">
      <span className="toast-icon" aria-hidden="true">
        <span className="material-symbols-outlined">check</span>
      </span>
      <div className="toast-body">
        <p className="toast-title">Consulta enviada correctamente</p>
        <p className="toast-text">
          Recibimos tu consulta y ya está en nuestra casilla. Te respondemos en un día hábil.
        </p>
        <div className="toast-actions">
          <button type="button" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
      <button aria-label="Cerrar aviso" className="toast-close" onClick={onClose} type="button">
        <span className="material-symbols-outlined" aria-hidden="true">
          close
        </span>
      </button>
    </div>,
    document.body,
  );
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
  const [topics, setTopics] = useState([]);
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

  function toggleTopic(label) {
    setTopics((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
    if (status !== 'idle' && status !== 'sending') setStatus('idle');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return;
    const name = form.name.trim();
    const email = form.email.trim();
    const text = form.message.trim();

    if (!name || !email || !text) {
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
    // The chosen topics travel as the first line of the message.
    const message = topics.length ? `Necesito: ${topics.join(', ')}\n\n${text}` : text;

    // Honeypot: real visitors never see or fill this field.
    if (event.currentTarget.elements.botcheck?.checked) {
      setForm(EMPTY_FORM);
      setTopics([]);
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
      setTopics([]);
      setStatus('sent');
    } catch {
      setStatus('error');
      setError(SEND_ERROR);
    }
  }

  return (
    <section className="contact-section" id="contacto">
      <div className="contact-card">
        <div className="contact-intro">
          <p className="contact-eyebrow">Contacto</p>
          <h2>¿Tenés una idea o un sistema que escalar?</h2>
          <p className="contact-lead">
            Contanos qué necesitás y coordinamos una sesión de diagnóstico técnico de 30 minutos sin
            costo.
          </p>

          <div className="contact-people">
            <div className="contact-faces" aria-hidden="true">
              {TEAM.map(({ name, photo }) => (
                <img key={name} src={photo} alt="" width={256} height={256} loading="lazy" />
              ))}
            </div>
            <p>
              <strong>Te contesta uno de nosotros cuatro, no un bot.</strong>
              <span>{TEAM.map(({ name }) => name).join(' · ')}</span>
            </p>
          </div>

          <div className="contact-direct">
            <p>Escribinos directo</p>
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <span className="material-symbols-outlined" aria-hidden="true">
                mail
              </span>
              {CONTACT_EMAIL}
            </a>
            <p className="contact-direct-note">Respondemos en un día hábil.</p>
          </div>
        </div>

        <form
          aria-label="Formulario de contacto"
          className="contact-form"
          noValidate
          onSubmit={handleSubmit}
        >
          <fieldset className="contact-topics">
            <legend>
              ¿Qué necesitás? <span>Podés elegir más de una</span>
            </legend>
            <div className="contact-chips">
              {TOPICS.map((topic) => (
                <label className="contact-chip" key={topic.id}>
                  <input
                    checked={topics.includes(topic.label)}
                    name="topics"
                    onChange={() => toggleTopic(topic.label)}
                    type="checkbox"
                    value={topic.label}
                  />
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {topic.icon}
                  </span>
                  {topic.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="contact-row">
            <label className="contact-field" htmlFor="contact-name">
              <span>Nombre</span>
              <input
                autoComplete="name"
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
            <label className="contact-field" htmlFor="contact-email">
              <span>Email</span>
              <input
                autoComplete="email"
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

          <label className="contact-field" htmlFor="contact-message">
            <span>Mensaje</span>
            <textarea
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

          <div className="contact-actions">
            <button aria-busy={sending} className="contact-submit" disabled={sending} type="submit">
              <span>{sending ? 'Enviando…' : 'Enviar consulta'}</span>
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </button>
            {usesService ? null : (
              <p className="contact-hint">Se abre tu programa de correo con la consulta lista.</p>
            )}
          </div>

          <div aria-live="polite">
            {error ? (
              <p className="contact-message is-error" role="alert">
                {error}
              </p>
            ) : null}
            {status === 'sent' ? <SentToast onClose={() => setStatus('idle')} /> : null}
            {status === 'mailto' ? (
              <p className="contact-message is-ok" role="status">
                Abrimos tu programa de correo con la consulta lista para enviar. Si no se abrió,
                escribinos a {CONTACT_EMAIL}.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
