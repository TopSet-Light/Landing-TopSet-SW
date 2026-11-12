import { AFTERNOON, AGENDA_TIMES, DAY_NAMES, DAYS, MORNING, SERVICES } from './turneroDemo.js';
import './turnero.css';

const LOGO = '/demos/kine/logo.jpg';

/** Turnero Kine: chatbot del paciente (celular) + panel del consultorio. */
export default function TurneroApp({ state, dispatch, compact }) {
  return (
    <div className={`kn-app${compact ? ' is-compact' : ''}`}>
      <div className="kn-phone-area">
        <p className="kn-caption">Lo que ve el paciente</p>
        <Phone state={state} dispatch={dispatch} />
      </div>
      {!compact && (
        <div className="kn-admin-area">
          <p className="kn-caption">Lo que ve el consultorio</p>
          <Admin state={state} dispatch={dispatch} />
        </div>
      )}
    </div>
  );
}

function Brand({ size = 'md' }) {
  return (
    <div className={`kn-brand is-${size}`}>
      <img src={LOGO} alt="" width={111} height={130} />
      <strong>Kine</strong>
    </div>
  );
}

function Assistant({ children }) {
  return (
    <div className="kn-bubble">
      <small>Asistente</small>
      <p>{children}</p>
    </div>
  );
}

function Btn({ children, tour, primary, onClick, disabled, className = '' }) {
  return (
    <button
      type="button"
      data-tour={tour}
      className={`kn-btn${primary ? ' is-primary' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/* ---------- Paciente ---------- */

function Phone({ state, dispatch }) {
  const phone = (screen) => dispatch({ type: 'PHONE', screen });
  const Screen = PHONE_SCREENS[state.phone];
  const isWhatsApp = state.phone === 'recordatorio';
  return (
    <div className={`kn-phone${isWhatsApp ? ' is-wa' : ''}`}>
      {!isWhatsApp && (
        <header className="kn-phone-head">
          <Brand />
          <small>Kinesiología · Plantillas · RPG</small>
        </header>
      )}
      <div className="kn-phone-body" key={state.phone}>
        <Screen state={state} dispatch={dispatch} phone={phone} />
      </div>
    </div>
  );
}

function Inicio({ state, phone }) {
  return (
    <>
      <p className="kn-eyebrow">Turnos online</p>
      <h2>¡Hola! ¿Qué necesitás hacer?</h2>
      <Assistant>
        Soy el asistente de Kine. Te ayudo a reservar o cancelar un turno en un minuto.
      </Assistant>
      <Btn primary tour="sacar-turno" onClick={() => phone('dni')}>
        Sacar un turno
      </Btn>
      <Btn tour="cancelar-turno" onClick={() => phone(state.booking ? 'mis-turnos' : 'sin-turnos')}>
        Cancelar un turno
      </Btn>
    </>
  );
}

function Dni({ state, dispatch, phone }) {
  return (
    <>
      <p className="kn-eyebrow">Identificación</p>
      <h2>Primero, te identificamos</h2>
      <Assistant>Ingresá tu DNI para continuar con la gestión que elegiste.</Assistant>
      <label className="kn-field">
        <span>DNI</span>
        <input
          data-tour="dni"
          inputMode="numeric"
          placeholder="Ej. 99000001"
          value={state.fields.dni}
          onChange={(event) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'dni',
              value: event.target.value.replace(/\D/g, ''),
            })
          }
        />
      </label>
      <small className="kn-hint">Ingresalo sin puntos ni espacios.</small>
      <Btn
        primary
        tour="continuar-dni"
        onClick={() => phone('servicio')}
        disabled={state.fields.dni.length < 7 && state.fields.dni.length > 0}
      >
        Continuar
      </Btn>
      <Btn onClick={() => phone('inicio')}>Volver al inicio</Btn>
    </>
  );
}

function Servicio({ dispatch }) {
  return (
    <>
      <p className="kn-eyebrow">Sacar turno · Tipo de atención</p>
      <h2>¿Qué turno necesitás?</h2>
      <Assistant>
        Elegí el tipo de atención para consultar los días y horarios disponibles.
      </Assistant>
      {SERVICES.map((servicio) => (
        <Btn
          primary
          key={servicio}
          tour={`svc-${servicio}`}
          onClick={() => dispatch({ type: 'PICK_SERVICE', servicio })}
        >
          {servicio}
        </Btn>
      ))}
    </>
  );
}

function takenFor(state, time) {
  if (state.blocked[state.day] && state.blockServices[state.servicio]) return true;
  if (state.servicio === 'Kinesiología' && state.day === 'MAR 10') {
    if (time in state.agenda) return state.agenda[time] >= state.cupos;
    return time === '09:00';
  }
  // Disponibilidad ilustrativa para el resto de los días y servicios.
  return (time.charCodeAt(1) + (state.day || '').charCodeAt(5)) % 3 === 0;
}

function Horario({ state, dispatch, phone }) {
  const slot = (time) => {
    const taken = takenFor(state, time);
    return (
      <button
        type="button"
        key={time}
        data-tour={`time-${time}`}
        className={`kn-slot${taken ? ' is-taken' : ''}${state.time === time ? ' is-selected' : ''}`}
        disabled={taken}
        onClick={() => dispatch({ type: 'PICK_TIME', time })}
      >
        {time}
      </button>
    );
  };
  return (
    <>
      <p className="kn-eyebrow">Reservar turno · Fecha y horario</p>
      <p className="kn-service">{state.servicio}</p>
      <h2>¿Cuándo te viene bien?</h2>
      <div className="kn-days">
        {DAYS.map((day) => {
          const [name, num] = day.split(' ');
          const closed = state.blocked[day] && state.blockServices[state.servicio];
          return (
            <button
              type="button"
              key={day}
              data-tour={`day-${day}`}
              className={`kn-day${state.day === day ? ' is-selected' : ''}`}
              disabled={closed}
              onClick={() => dispatch({ type: 'PICK_DAY', day })}
            >
              {name}
              <b>{num}</b>
            </button>
          );
        })}
      </div>
      <small className="kn-hint">Noviembre 2026 · Buenos Aires</small>
      <small className="kn-label">Mañana</small>
      <div className="kn-slots">{MORNING.map(slot)}</div>
      <small className="kn-label">Tarde</small>
      <div className="kn-slots">{AFTERNOON.map(slot)}</div>
      <small className="kn-hint">Los horarios tachados ya están ocupados.</small>
      {state.time && (
        <p className="kn-pick">
          {state.day?.replace(' ', ' ')} nov. · {state.time} h
        </p>
      )}
      <Btn primary tour="continuar-horario" disabled={!state.time} onClick={() => phone('revisar')}>
        Continuar
      </Btn>
    </>
  );
}

function Revisar({ state, dispatch, phone }) {
  return (
    <>
      <p className="kn-eyebrow">{state.servicio} · Confirmación</p>
      <h2>Revisá tu turno</h2>
      <Assistant>
        {state.servicio}
        <br />
        {DAY_NAMES[state.day]} de 2026
        <br />
        {state.time} · Hora de Buenos Aires
      </Assistant>
      <Btn primary tour="confirmar-turno" onClick={() => dispatch({ type: 'BOOK' })}>
        Confirmar turno
      </Btn>
      <Btn onClick={() => phone('inicio')}>No, volver al inicio</Btn>
    </>
  );
}

function Reservado({ state, dispatch, phone }) {
  const booking = state.booking;
  return (
    <>
      <p className="kn-eyebrow">Gestión finalizada</p>
      <h2>¡Tu turno está reservado!</h2>
      <Assistant>
        {booking?.servicio}
        <br />
        {DAY_NAMES[booking?.day]} de 2026
        <br />
        {booking?.time} · Hora de Buenos Aires
      </Assistant>
      <small className="kn-hint">Opcional. Te avisamos 24 horas antes del turno.</small>
      <Btn tour="recordatorio" onClick={() => dispatch({ type: 'REMINDER' })}>
        {state.reminder ? '☑' : '☐'} Recibir recordatorio por WhatsApp
      </Btn>
      <Btn primary>Agregar a tu calendario</Btn>
      <Btn tour="volver-inicio" onClick={() => phone('inicio')}>
        Volver al inicio
      </Btn>
    </>
  );
}

function Recordatorio({ state, phone }) {
  const booking = state.booking || { servicio: 'Kinesiología', time: '15:00', day: 'MAR 10' };
  return (
    <div className="kn-wa">
      <header>
        <span className="kn-wa-avatar">
          <img src={LOGO} alt="" width={111} height={130} />
        </span>
        <div>
          <strong>Kine</strong>
          <small>Cuenta de empresa</small>
        </div>
      </header>
      <div className="kn-wa-chat">
        <span className="kn-wa-date">Lunes</span>
        <div className="kn-wa-msg">
          <p>
            Hola 👋 Te recordamos tu turno de <b>{booking.servicio}</b> mañana,{' '}
            {DAY_NAMES[booking.day]?.toLowerCase()}, a las <b>{booking.time} h</b>.
          </p>
          <p>Si no podés asistir, cancelalo desde el link así liberamos el horario.</p>
          <small>10:00 ✓✓</small>
        </div>
        <div className="kn-wa-actions">
          <span>Confirmo asistencia</span>
          <span>Cancelar turno</span>
        </div>
      </div>
      <button
        type="button"
        data-tour="volver-inicio"
        className="kn-wa-back"
        onClick={() => phone('inicio')}
      >
        ← Volver al asistente
      </button>
    </div>
  );
}

function MisTurnos({ state, phone }) {
  return (
    <>
      <p className="kn-eyebrow">Cancelar turno</p>
      <h2>Elegí el turno a cancelar</h2>
      <Assistant>Estos son tus próximos turnos. Seleccioná el que quieras cancelar.</Assistant>
      {state.booking && (
        <Btn primary tour="turno-propio" onClick={() => phone('cancelar-confirm')}>
          {state.booking.servicio} · {state.booking.day.split(' ')[1]} nov. · {state.booking.time}
        </Btn>
      )}
      <Btn>Plantillas · 19 nov. · 10:00</Btn>
      <Btn onClick={() => phone('inicio')}>Volver al inicio</Btn>
    </>
  );
}

function ConfirmarCancelacion({ state, dispatch, phone }) {
  const booking = state.booking;
  return (
    <>
      <p className="kn-eyebrow">Cancelar turno</p>
      <h2>¿Cancelamos este turno?</h2>
      <Assistant>
        {booking?.servicio}
        <br />
        {DAY_NAMES[booking?.day]} · {booking?.time} h
      </Assistant>
      <Btn
        primary
        className="is-danger"
        tour="confirmar-cancelacion"
        onClick={() => dispatch({ type: 'CANCEL_BOOKING' })}
      >
        Sí, cancelar turno
      </Btn>
      <Btn onClick={() => phone('mis-turnos')}>No, mantenerlo</Btn>
    </>
  );
}

function Cancelado({ phone }) {
  return (
    <>
      <p className="kn-eyebrow">Gestión finalizada</p>
      <h2>Tu turno quedó cancelado</h2>
      <Assistant>
        Listo. Liberamos el horario para otro paciente. Cuando quieras, sacás un turno nuevo.
      </Assistant>
      <Btn primary onClick={() => phone('dni')}>
        Sacar otro turno
      </Btn>
      <Btn onClick={() => phone('inicio')}>Volver al inicio</Btn>
    </>
  );
}

function SinTurnos({ phone }) {
  return (
    <>
      <p className="kn-eyebrow">Cancelar turno</p>
      <h2>No tenés turnos pendientes</h2>
      <Assistant>No encontramos turnos a tu nombre. ¿Querés sacar uno?</Assistant>
      <Btn primary onClick={() => phone('dni')}>
        Sacar un turno
      </Btn>
      <Btn onClick={() => phone('inicio')}>Volver al inicio</Btn>
    </>
  );
}

const PHONE_SCREENS = {
  inicio: Inicio,
  dni: Dni,
  servicio: Servicio,
  horario: Horario,
  revisar: Revisar,
  reservado: Reservado,
  recordatorio: Recordatorio,
  'mis-turnos': MisTurnos,
  'cancelar-confirm': ConfirmarCancelacion,
  cancelado: Cancelado,
  'sin-turnos': SinTurnos,
};

/* ---------- Consultorio ---------- */

const ADMIN_NAV = [
  ['agenda', 'Agenda'],
  ['horarios', 'Horarios y cupos'],
  ['bloqueos', 'Bloqueos'],
];

function Admin({ state, dispatch }) {
  const View = ADMIN_VIEWS[state.admin];
  return (
    <div className="kn-admin">
      <aside>
        <Brand size="sm" />
        <small className="kn-eyebrow">Administración</small>
        {ADMIN_NAV.map(([id, label]) => (
          <button
            type="button"
            key={id}
            data-tour={`nav-${id}`}
            className={state.admin === id ? 'is-active' : ''}
            onClick={() => dispatch({ type: 'ADMIN', view: id })}
          >
            {label}
          </button>
        ))}
        <small className="kn-admin-foot">
          Consultorio
          <br />
          Acceso del profesional
        </small>
      </aside>
      <div className="kn-admin-body">
        <View state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}

function Agenda({ state }) {
  const booked = Object.values(state.agenda).reduce((sum, value) => sum + value, 0);
  const free = AGENDA_TIMES.length * state.cupos - booked;
  return (
    <>
      <small className="kn-crumb">Consultorio / Agenda</small>
      <h3>Tu agenda, de un vistazo</h3>
      <p className="kn-muted">Martes 10 de noviembre de 2026 · Disponibilidad de la tarde</p>
      <div className="kn-stats">
        <span>
          <b>{booked}</b>Turnos reservados
        </span>
        <span>
          <b>{free}</b>Cupos libres
        </span>
        <span>
          <b>{state.cupos}</b>Pacientes por horario
        </span>
      </div>
      <div className="kn-table">
        <div className="kn-tr kn-th">
          <span>Inicio</span>
          <span>Kinesiología</span>
          <span>Plantillas</span>
          <span>RPG</span>
        </div>
        {AGENDA_TIMES.map((time) => {
          const count = state.agenda[time];
          const full = count >= state.cupos;
          return (
            <div
              className={`kn-tr${state.flash === time ? ' is-flash' : ''}`}
              key={time}
              data-tour={`agenda-${time}`}
            >
              <span className="kn-time">{time}</span>
              <span>
                <i className="kn-meter">
                  {Array.from({ length: state.cupos }, (_, index) => (
                    <em key={index} className={index < count ? 'is-on' : ''} />
                  ))}
                </i>
                {count} de {state.cupos} reservados
                {full && <b className="kn-tag">Completo</b>}
              </span>
              <span className="kn-muted">{time.endsWith('00') ? 'Disponible' : 'Sin inicio'}</span>
              <span className="kn-muted">{time === '16:00' ? '1 de 1' : 'Sin configurar'}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Horarios({ state, dispatch }) {
  const field = (label, value) => (
    <label className="kn-admin-field">
      <span>{label}</span>
      <b>{value}</b>
    </label>
  );
  return (
    <>
      <small className="kn-crumb">Consultorio / Horarios y cupos</small>
      <h3>Horarios y cupos</h3>
      <p className="kn-muted">
        Configurá la oferta semanal de cada servicio y desde cuándo se aplica.
      </p>
      <div className="kn-tabs">
        {SERVICES.map((servicio, index) => (
          <span key={servicio} className={index === 0 ? 'is-active' : ''}>
            {servicio}
          </span>
        ))}
      </div>
      <div className="kn-split">
        <div className="kn-card">
          <h4>Franja de atención</h4>
          <div className="kn-admin-grid">
            {field('Días de atención', 'Lun · Mar · Mié · Jue · Vie')}
            {field('Vigente desde', '16/11/2026')}
            {field('Primer inicio', '15:00')}
            {field('Último inicio', '17:30')}
            {field('Intervalo entre inicios', '30 minutos')}
            <div className="kn-admin-field">
              <span>Cupos por inicio</span>
              <div className="kn-stepper">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'CUPOS', delta: -1 })}
                  aria-label="Menos cupos"
                >
                  −
                </button>
                <b>{state.cupos} pacientes</b>
                <button
                  type="button"
                  data-tour="cupos-mas"
                  onClick={() => dispatch({ type: 'CUPOS', delta: 1 })}
                  aria-label="Más cupos"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="kn-card">
          <h4>Así se ofrecerán los turnos</h4>
          <span className="kn-chip">Kinesiología</span>
          {AGENDA_TIMES.slice(0, 4).map((time) => (
            <p key={time} className="kn-offer">
              {time} · <b>{state.cupos} cupos</b>
            </p>
          ))}
          <small className="kn-muted">
            La duración de la atención es distinta del intervalo entre inicios.
          </small>
        </div>
      </div>
    </>
  );
}

function Bloqueos({ state, dispatch }) {
  const services = SERVICES.filter((servicio) => state.blockServices[servicio]);
  return (
    <>
      <small className="kn-crumb">Consultorio / Bloqueos</small>
      <h3>Bloquear disponibilidad</h3>
      <p className="kn-muted">Cerrá una fecha o franja solo para los servicios que necesites.</p>
      <div className="kn-split">
        <div className="kn-card">
          <h4>Nuevo bloqueo</h4>
          <div className="kn-admin-grid">
            <label className="kn-admin-field">
              <span>Fecha</span>
              <b>Viernes 13 de noviembre</b>
            </label>
            <label className="kn-admin-field">
              <span>Franja</span>
              <b>Todo el día</b>
            </label>
          </div>
          <p className="kn-label">Servicios afectados</p>
          {SERVICES.map((servicio) => (
            <button
              type="button"
              key={servicio}
              className="kn-check"
              onClick={() => dispatch({ type: 'TOGGLE_BLOCK_SERVICE', servicio })}
            >
              {state.blockServices[servicio] ? '☑' : '☐'} {servicio}
            </button>
          ))}
          <button
            type="button"
            className="kn-btn is-primary is-inline"
            onClick={() => dispatch({ type: 'BLOCK_DAY' })}
          >
            {state.blocked['VIE 13'] ? 'Quitar bloqueo' : 'Aplicar bloqueo'}
          </button>
        </div>
        <div className="kn-card">
          <h4>Resumen</h4>
          <p>
            <b>Viernes 13 de noviembre</b>
            <br />
            Todo el día
          </p>
          <p className="kn-muted">{services.join(' y ') || 'Ningún servicio'}</p>
          <span className={`kn-chip${state.blocked['VIE 13'] ? ' is-warn' : ''}`}>
            {state.blocked['VIE 13'] ? 'Bloqueo aplicado' : 'Borrador'}
          </span>
          <small className="kn-muted">Probá sacar un turno ese día desde el celular.</small>
        </div>
      </div>
    </>
  );
}

const ADMIN_VIEWS = { agenda: Agenda, horarios: Horarios, bloqueos: Bloqueos };
