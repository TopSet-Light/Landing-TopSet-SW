import { ADVANCE, STATUSES } from './tallerDemo.js';
import './taller.css';

const money = (value) => {
  const [int, dec] = Math.abs(value).toFixed(2).split('.');
  return `${value < 0 ? '−' : ''}$ ${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}`;
};

const NAV = [
  { id: 'inicio', label: 'Inicio', icon: '⌂', screens: ['inicio'] },
  { id: 'ordenes', label: 'Órdenes de trabajo', icon: '▤', screens: ['tablero', 'ingreso', 'ot'] },
  { id: 'clientes', label: 'Clientes', icon: '◎', screens: ['clientes'] },
  { id: 'vehiculos', label: 'Vehículos', icon: '◇', screens: ['vehiculos'] },
  {
    id: 'presupuestos',
    label: 'Presupuestos',
    icon: '▦',
    screens: ['presupuestos', 'presupuesto', 'whatsapp'],
  },
  {
    id: 'cobros',
    label: 'Liquidaciones y cobros',
    icon: '$',
    screens: ['cobros', 'cobro', 'cobrado'],
  },
  { id: 'productos', label: 'Productos y stock', icon: '▥', screens: ['productos'] },
  { id: 'config', label: 'Configuración', icon: '✲', screens: ['config'] },
];
const NAV_TARGET = { ordenes: 'tablero' };

const TONES = {
  Ingresado: 'blue',
  'En diagnóstico': 'violet',
  'Esperando aprobación': 'amber',
  'En reparación': 'blue',
  'Listo para entregar': 'green',
  Entregado: 'gray',
  Conforme: 'green',
  Observado: 'amber',
  'Sin revisar': 'blue',
};

function Pill({ children, tone }) {
  return <span className={`tl-pill tl-${tone || TONES[children] || 'blue'}`}>{children}</span>;
}

function Header({ eyebrow, title, subtitle, action }) {
  return (
    <div className="tl-head">
      <div>
        <p className="tl-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {subtitle && <p className="tl-sub">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Field({ label, tour, value, placeholder, onChange, wide }) {
  return (
    <label className={`tl-field${wide ? ' is-wide' : ''}`}>
      <span>{label}</span>
      <input
        data-tour={tour}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

const crumbs = {
  inicio: 'Inicio',
  tablero: 'Órdenes de trabajo',
  ingreso: 'Órdenes de trabajo',
  ot: 'Órdenes de trabajo',
  clientes: 'Clientes',
  vehiculos: 'Vehículos',
  presupuestos: 'Presupuestos',
  presupuesto: 'Presupuestos',
  whatsapp: 'Presupuestos',
  cobros: 'Liquidaciones y cobros',
  cobro: 'Liquidaciones y cobros',
  cobrado: 'Liquidaciones y cobros',
  productos: 'Productos y stock',
  config: 'Configuración',
};

// Bottom tab bar on narrow screens: the four areas the tour walks through.
const COMPACT_NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'ordenes', label: 'Órdenes' },
  { id: 'presupuestos', label: 'Presupuestos' },
  { id: 'cobros', label: 'Cobros' },
];

export default function TallerApp({ state, dispatch, compact }) {
  const go = (screen) => dispatch({ type: 'GO', screen });
  const Screen = SCREENS[state.screen] || Inicio;
  if (compact) {
    return (
      <div className="tl-app is-compact">
        <div className="tl-mobile-top">
          <div className="tl-brand">
            <span>T</span>
            <div>
              <strong>Taller Horizonte</strong>
              <small>{crumbs[state.screen]}</small>
            </div>
          </div>
          <span className="tl-avatar" aria-hidden="true">
            LT
          </span>
        </div>
        <div className="tl-main">
          {/* Keyed by screen so each new screen starts scrolled to the top */}
          <div className="tl-content" data-scroll key={state.screen}>
            <Screen state={state} dispatch={dispatch} go={go} />
          </div>
          {state.toast && <div className="tl-toast">✓ {state.toast}</div>}
        </div>
        <nav className="tl-tabbar">
          {COMPACT_NAV.map(({ id, label }) => {
            const item = NAV.find((entry) => entry.id === id);
            return (
              <button
                key={id}
                type="button"
                data-tour={`nav-${id}`}
                className={item.screens.includes(state.screen) ? 'is-active' : ''}
                onClick={() => go(NAV_TARGET[id] || item.screens[0])}
              >
                <i aria-hidden="true">{item.icon}</i>
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }
  return (
    <div className="tl-app">
      <aside className="tl-side">
        <div className="tl-brand">
          <span>T</span>
          <div>
            <strong>Taller</strong>
            <small>Espacio de trabajo</small>
          </div>
        </div>
        <div className="tl-card-dark">
          <strong>Taller Horizonte</strong>
          <small>Sucursal única</small>
        </div>
        <p className="tl-side-label">Operación</p>
        <nav>
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              data-tour={`nav-${item.id}`}
              className={item.screens.includes(state.screen) ? 'is-active' : ''}
              onClick={() => go(NAV_TARGET[item.id] || item.screens[0])}
            >
              <i aria-hidden="true">{item.icon}</i>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="tl-card-dark tl-user">
          <strong>Lucía Torres</strong>
          <small>Recepción · Cerrar sesión</small>
        </div>
      </aside>
      <div className="tl-main">
        <div className="tl-top">
          <span>
            Taller Horizonte <b>/</b> {crumbs[state.screen]}
          </span>
          <div className="tl-search">⌕ Buscar patente, cliente u OT</div>
        </div>
        <div className="tl-content">
          <Screen state={state} dispatch={dispatch} go={go} />
        </div>
        {state.toast && <div className="tl-toast">✓ {state.toast}</div>}
      </div>
    </div>
  );
}

function NewIntakeButton({ go }) {
  return (
    <button
      type="button"
      className="tl-btn tl-primary"
      data-tour="nuevo-ingreso"
      onClick={() => go('ingreso')}
    >
      + Nuevo ingreso
    </button>
  );
}

function Inicio({ state, dispatch, go }) {
  const active = state.orders.filter((order) => order.status !== 'Entregado');
  const ready = state.orders.filter((order) => order.status === 'Listo para entregar');
  const pending = state.orders.reduce(
    (sum, order) => sum + (order.total ? order.total - (order.paid || 0) : 0),
    0,
  );
  const kpis = [
    ['Vehículos en el taller', active.length],
    ['Listos para entregar', ready.length],
    ['Saldo pendiente', money(pending)],
    ['Presupuestos sin respuesta', 2],
    ['Alerta de stock mínimo', 1],
    ['Órdenes activas', active.length],
  ];
  return (
    <>
      <Header
        eyebrow="Panel de recepción"
        title="Inicio"
        subtitle="Viernes 6 de noviembre · Resumen del taller"
        action={<NewIntakeButton go={go} />}
      />
      <div className="tl-kpis">
        {kpis.map(([label, value]) => (
          <div className="tl-box" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="tl-box tl-list">
        <div className="tl-list-head">
          <div>
            <h3>Prioridades de hoy</h3>
            <span>Operación del taller · 06/11/2026</span>
          </div>
          <button type="button" className="tl-btn" onClick={() => go('tablero')}>
            Ver órdenes
          </button>
        </div>
        {state.orders.slice(0, 3).map((order) => (
          <button
            type="button"
            className="tl-row"
            key={order.id}
            onClick={() => dispatch({ type: 'OPEN_ORDER', id: order.id })}
          >
            <span>
              <strong>
                {order.id} · {order.car}
              </strong>
              <small>
                {order.plate} · {order.client}
              </small>
            </span>
            <Pill>{order.status}</Pill>
          </button>
        ))}
      </div>
    </>
  );
}

function Ingreso({ state, dispatch, go }) {
  const f = state.fields;
  const set = (field) => (value) => dispatch({ type: 'SET_FIELD', field, value });
  return (
    <>
      <Header
        eyebrow="Orden de trabajo / Alta"
        title="Nuevo ingreso"
        subtitle="Buscá o registrá al cliente y su vehículo. Al confirmar se genera la orden."
      />
      <div className="tl-split">
        <div className="tl-stack">
          <div className="tl-box">
            <div className="tl-section-title">
              <span className="tl-num">01</span>
              <div>
                <h3>Cliente y vehículo</h3>
                <small>Identificá el vehículo y registrá un teléfono de contacto.</small>
              </div>
            </div>
            <div className="tl-grid">
              <Field
                label="Cliente"
                tour="f-cliente"
                value={f.cliente}
                placeholder="Nombre y apellido"
                onChange={set('cliente')}
              />
              <Field
                label="Vehículo"
                tour="f-vehiculo"
                value={f.vehiculo}
                placeholder="Marca y modelo"
                onChange={set('vehiculo')}
              />
              <Field
                label="Patente"
                tour="f-patente"
                value={f.patente}
                placeholder="AA 000 AA"
                onChange={set('patente')}
              />
              <Field
                label="Kilometraje"
                tour="f-km"
                value={f.km}
                placeholder="0 km"
                onChange={set('km')}
              />
            </div>
          </div>
          <div className="tl-box">
            <div className="tl-section-title">
              <span className="tl-num">02</span>
              <div>
                <h3>Recepción</h3>
                <small>Registrá qué pasó y en qué condiciones ingresó.</small>
              </div>
            </div>
            <Field
              label="Motivo del ingreso"
              tour="f-motivo"
              value={f.motivo}
              placeholder="Contanos qué le pasa al vehículo"
              onChange={set('motivo')}
              wide
            />
            <div className="tl-chips">
              <span>Fecha · 06/11/2026</span>
              <span>Mecánico · Nicolás Sosa</span>
            </div>
          </div>
        </div>
        <div className="tl-box tl-aside">
          <p className="tl-eyebrow">Vista previa</p>
          <h3>{f.vehiculo || 'Vehículo'}</h3>
          <small>
            {f.patente || 'Patente'} · {f.cliente || 'Cliente'}
          </small>
          <Pill>Ingresado</Pill>
          <hr />
          <small>El número se asigna al confirmar el ingreso.</small>
          <button
            type="button"
            className="tl-btn tl-primary"
            data-tour="confirmar-ingreso"
            onClick={() => dispatch({ type: 'CREATE_ORDER' })}
          >
            Confirmar ingreso
          </button>
          <button type="button" className="tl-btn" onClick={() => go('tablero')}>
            Volver al tablero
          </button>
        </div>
      </div>
    </>
  );
}

function Tablero({ state, dispatch, go }) {
  return (
    <>
      <Header
        eyebrow="Operación / Tablero"
        title="Órdenes de trabajo"
        subtitle="Seguí cada vehículo desde el ingreso hasta la entrega."
        action={<NewIntakeButton go={go} />}
      />
      <div className="tl-board">
        {STATUSES.map((status) => (
          <div className="tl-column" key={status}>
            <Pill>{status}</Pill>
            {state.orders
              .filter((order) => order.status === status)
              .map((order) => (
                <button
                  type="button"
                  key={order.id}
                  data-tour={`ot-${order.id}`}
                  className={`tl-ot${state.highlight === order.id ? ' is-highlight' : ''}`}
                  onClick={() => dispatch({ type: 'OPEN_ORDER', id: order.id })}
                >
                  <b>{order.id}</b>
                  <strong>{order.car}</strong>
                  <small>
                    {order.plate} · {order.client}
                  </small>
                  <span>{order.note}</span>
                </button>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}

function Orden({ state, dispatch }) {
  const order = state.orders.find((item) => item.id === state.selected) || state.orders[0];
  const balance = order.total ? order.total - (order.paid || 0) : null;
  return (
    <>
      <Header
        eyebrow="Orden de trabajo / Detalle"
        title={`${order.id} · ${order.car}`}
        subtitle={`${order.plate} · ${order.client} · Ingreso 06/11/2026`}
        action={
          <button
            type="button"
            className="tl-btn tl-primary"
            data-tour="cambiar-estado"
            onClick={() => dispatch({ type: 'NEXT_STATUS' })}
          >
            Cambiar estado
          </button>
        }
      />
      <div className="tl-split">
        <div className="tl-box">
          <div className="tl-list-head">
            <p className="tl-eyebrow">Estado operativo</p>
            <Pill>{order.status}</Pill>
          </div>
          <h3>Descripción del problema</h3>
          <small className="tl-muted">{order.note}</small>
          <div className="tl-check">
            <h4>Control general del vehículo</h4>
            <div className="tl-check-grid">
              {Object.entries(state.checklist).map(([item, value]) => (
                <button
                  type="button"
                  key={item}
                  data-tour={`check-${item}`}
                  onClick={() => dispatch({ type: 'TOGGLE_CHECK', item })}
                >
                  <span>{item}</span>
                  <Pill>{`${value}`}</Pill>
                </button>
              ))}
            </div>
          </div>
          <div className="tl-facts">
            <span>
              <strong>{order.km || '54.300 km'}</strong>
              <small>Kilometraje</small>
            </span>
            <span>
              <strong>Nicolás Sosa</strong>
              <small>Mecánico responsable</small>
            </span>
            <span>
              <strong>09/11/2026</strong>
              <small>Entrega estimada</small>
            </span>
          </div>
          {order.log && (
            <div className="tl-log">
              <p className="tl-eyebrow">Actividad de la orden</p>
              {order.log.slice(-2).map((line) => (
                <small key={line}>{line}</small>
              ))}
            </div>
          )}
        </div>
        <div className="tl-box tl-aside">
          <p className="tl-eyebrow">Estado de cobro</p>
          {balance === null ? (
            <small className="tl-muted">Todavía no hay presupuesto aceptado.</small>
          ) : (
            <>
              <Pill tone={balance ? 'amber' : 'green'}>
                {balance ? 'Pendiente parcial' : 'Pagado'}
              </Pill>
              <strong className="tl-big">{money(balance)}</strong>
              <small className="tl-muted">
                Total {money(order.total)} · Pagado {money(order.paid || 0)}
              </small>
            </>
          )}
          <hr />
          <button
            type="button"
            className="tl-btn"
            data-tour="crear-presupuesto"
            onClick={() => dispatch({ type: 'OPEN_PRESUPUESTO', id: order.id })}
          >
            Crear presupuesto
          </button>
          <button
            type="button"
            className="tl-btn"
            onClick={() => dispatch({ type: 'OPEN_COBRO', id: order.id })}
            disabled={!balance}
          >
            Registrar cobro
          </button>
        </div>
      </div>
    </>
  );
}

function presupuestoTarget(state) {
  return (
    state.orders.find((order) => order.id === state.presupuestoFor) || {
      client: 'Valentina Acosta',
      car: 'Toyota Etios',
    }
  );
}

function Presupuesto({ state, dispatch }) {
  const target = presupuestoTarget(state);
  const subtotal = state.items.reduce((sum, item) => sum + item.amount, 0);
  return (
    <>
      <Header
        eyebrow="Cotizaciones / Editor"
        title="Nuevo presupuesto"
        subtitle={
          state.presupuestoFor
            ? `Vinculado a ${state.presupuestoFor}`
            : 'Cotizá para un contacto nuevo o asociá una ficha existente.'
        }
      />
      <div className="tl-split">
        <div className="tl-stack">
          <div className="tl-box">
            <h3>Contacto y condiciones</h3>
            <div className="tl-grid tl-readonly">
              <span>
                <small>Nombre</small>
                {target.client}
              </span>
              <span>
                <small>WhatsApp</small>11 4567 0042
              </span>
              <span>
                <small>Vehículo</small>
                {target.car}
              </span>
              <span>
                <small>Vigencia</small>13/11/2026
              </span>
            </div>
          </div>
          <div className="tl-box">
            <h3>Detalle</h3>
            {state.items.map((item) => (
              <div className="tl-line" key={item.label}>
                <span>
                  {item.label} · <small>{item.kind}</small>
                </span>
                <strong>{money(item.amount)}</strong>
              </div>
            ))}
            <button
              type="button"
              className="tl-btn"
              data-tour="agregar-concepto"
              onClick={() => dispatch({ type: 'ADD_ITEM' })}
            >
              + Agregar concepto
            </button>
          </div>
        </div>
        <div className="tl-box tl-aside">
          <h3>Resumen</h3>
          <div className="tl-line">
            <span>Subtotal</span>
            <strong>{money(subtotal)}</strong>
          </div>
          <div className="tl-line">
            <span>Anticipo sugerido</span>
            <strong>{money(ADVANCE)}</strong>
          </div>
          <hr />
          <div className="tl-line">
            <span>Total</span>
            <strong className="tl-big">{money(subtotal)}</strong>
          </div>
          <button
            type="button"
            className="tl-btn tl-primary"
            data-tour="guardar-presupuesto"
            onClick={() => dispatch({ type: 'SAVE_PRESUPUESTO' })}
          >
            Guardar y compartir
          </button>
        </div>
      </div>
    </>
  );
}

function WhatsApp({ state, dispatch }) {
  const target = presupuestoTarget(state);
  const total = state.items.reduce((sum, item) => sum + item.amount, 0);
  const firstName = target.client.split(' ')[0];
  return (
    <>
      <Header
        eyebrow="Cotizaciones / Envío"
        title="Compartir por WhatsApp"
        subtitle={`PRE-0019 · ${target.client}`}
      />
      <div className="tl-split">
        <div className="tl-box">
          <h3>Mensaje preparado</h3>
          <div className="tl-wa">
            <p>
              Hola, {firstName}. Te compartimos el presupuesto PRE-0019 de Taller Horizonte para tu{' '}
              {target.car} por {money(total)}. Es válido hasta el 13/11/2026.
            </p>
            <small>PRE-0019.pdf · 1 página</small>
          </div>
          <div className="tl-note">
            <strong>El cliente responde por WhatsApp</strong>
            <small>Cuando acepta, lo marcás y la orden pasa a reparación con el anticipo.</small>
          </div>
          <div className="tl-actions">
            <button
              type="button"
              className="tl-btn tl-primary"
              data-tour="presupuesto-aceptado"
              onClick={() => dispatch({ type: 'ACCEPT_PRESUPUESTO' })}
            >
              Marcar como aceptado
            </button>
            <button type="button" className="tl-btn">
              Ver PDF
            </button>
          </div>
        </div>
        <div className="tl-box tl-aside">
          <p className="tl-eyebrow">Estado</p>
          <Pill tone="amber">Enviado · esperando respuesta</Pill>
          <small className="tl-muted">Enviado hoy 10:42 · Vence en 7 días</small>
        </div>
      </div>
    </>
  );
}

function Cobros({ state, dispatch }) {
  const rows = state.orders.filter((order) => order.total);
  return (
    <>
      <Header
        eyebrow="Administración"
        title="Liquidaciones y cobros"
        subtitle="Saldos por orden, anticipos y pagos registrados."
      />
      <div className="tl-box tl-table">
        <div className="tl-tr tl-th">
          <span>Liquidación</span>
          <span>Cliente</span>
          <span>Total</span>
          <span>Saldo</span>
          <span />
        </div>
        {rows.map((order, index) => {
          const balance = order.total - (order.paid || 0);
          return (
            <div className="tl-tr" key={order.id}>
              <span>
                <strong>LIQ-00{28 - index}</strong>
                <small>
                  {order.id} · {order.car}
                </small>
              </span>
              <span>{order.client}</span>
              <span>{money(order.total)}</span>
              <span>
                {balance ? (
                  <Pill tone="amber">{money(balance)}</Pill>
                ) : (
                  <Pill tone="green">Pagado</Pill>
                )}
              </span>
              <span>
                {balance > 0 && (
                  <button
                    type="button"
                    className="tl-btn"
                    data-tour={`registrar-${order.id}`}
                    onClick={() => dispatch({ type: 'OPEN_COBRO', id: order.id })}
                  >
                    Registrar cobro
                  </button>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Cobro({ state, dispatch }) {
  const order = state.orders.find((item) => item.id === state.cobroFor);
  if (!order) return <Cobros state={state} dispatch={dispatch} />;
  const balance = order.total - (order.paid || 0);
  return (
    <>
      <Header
        eyebrow="Administración / Nuevo pago"
        title="Registrar cobro"
        subtitle={`LIQ-0028 · ${order.client} · ${order.id}`}
      />
      <div className="tl-split">
        <div className="tl-box">
          <h3>Datos del pago</h3>
          <div className="tl-grid tl-readonly">
            <span className="is-wide">
              <small>Importe</small>
              {money(balance)}
            </span>
            <button
              type="button"
              className="tl-select is-wide"
              data-tour="medio-pago"
              onClick={() => dispatch({ type: 'NEXT_MEDIO' })}
            >
              <small>Medio de pago</small>
              {state.medio} ▾
            </button>
          </div>
          <button
            type="button"
            className="tl-btn tl-primary"
            data-tour="confirmar-cobro"
            onClick={() => dispatch({ type: 'CONFIRM_COBRO' })}
          >
            Confirmar cobro
          </button>
        </div>
        <div className="tl-box tl-aside">
          <h3>Saldo</h3>
          <div className="tl-line">
            <span>Total de la orden</span>
            <strong>{money(order.total)}</strong>
          </div>
          <div className="tl-line">
            <span>Anticipo</span>
            <strong>{money(-(order.paid || 0))}</strong>
          </div>
          <hr />
          <div className="tl-line">
            <span>Después del cobro</span>
            <strong className="tl-big">{money(0)}</strong>
          </div>
        </div>
      </div>
    </>
  );
}

function Cobrado({ state, go }) {
  const order = state.orders.find((item) => item.id === state.cobroFor);
  return (
    <div className="tl-done">
      <span>✓</span>
      <h1>Cobro registrado</h1>
      <p>
        {order?.id} · {order?.car} quedó <b>entregado</b> y sin saldo pendiente.
      </p>
      <div className="tl-actions">
        <button type="button" className="tl-btn tl-primary">
          Ver comprobante
        </button>
        <button type="button" className="tl-btn" onClick={() => go('tablero')}>
          Volver al tablero
        </button>
      </div>
    </div>
  );
}

function SimpleTable({ eyebrow, title, subtitle, head, rows }) {
  return (
    <>
      <Header eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="tl-box tl-table">
        <div className="tl-tr tl-th">
          {head.map((cell) => (
            <span key={cell}>{cell}</span>
          ))}
        </div>
        {rows.map((row) => (
          <div className="tl-tr" key={row[0]}>
            {row.map((cell, index) => (
              <span key={index}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function Clientes({ state }) {
  return (
    <SimpleTable
      eyebrow="Fichas"
      title="Clientes"
      subtitle="Cada cliente con sus vehículos, órdenes y saldos."
      head={['Cliente', 'Teléfono', 'Vehículos', 'Última orden']}
      rows={state.orders.map((order) => [
        order.client,
        '11 4' + order.id.slice(-3) + ' 1200',
        order.car,
        order.id,
      ])}
    />
  );
}
function Vehiculos({ state }) {
  return (
    <SimpleTable
      eyebrow="Fichas"
      title="Vehículos"
      subtitle="Historial completo por patente."
      head={['Patente', 'Vehículo', 'Titular', 'Estado']}
      rows={state.orders.map((order) => [
        order.plate,
        order.car,
        order.client,
        <Pill key="s">{order.status}</Pill>,
      ])}
    />
  );
}
function Presupuestos({ state, dispatch }) {
  return (
    <>
      <SimpleTable
        eyebrow="Cotizaciones"
        title="Presupuestos"
        subtitle="Enviados, aceptados y vencidos."
        head={['Número', 'Contacto', 'Total', 'Estado']}
        rows={[
          [
            'PRE-0018',
            'Valentina Acosta',
            money(185000),
            <Pill key="a" tone="amber">
              Enviado
            </Pill>,
          ],
          [
            'PRE-0017',
            'Paula Gil',
            money(132000),
            <Pill key="b" tone="amber">
              Enviado
            </Pill>,
          ],
          [
            'PRE-0016',
            'Julia Paz',
            money(210000),
            <Pill key="c" tone="green">
              Aceptado
            </Pill>,
          ],
        ]}
      />
      <button
        type="button"
        className="tl-btn tl-primary tl-gap"
        onClick={() => dispatch({ type: 'OPEN_PRESUPUESTO', id: state.selected })}
      >
        + Nuevo presupuesto
      </button>
    </>
  );
}
function Productos() {
  return (
    <SimpleTable
      eyebrow="Inventario"
      title="Productos y stock"
      subtitle="Repuestos con stock mínimo y movimientos por orden."
      head={['Código', 'Producto', 'Stock', 'Precio']}
      rows={[
        [
          'FR-021',
          'Pastillas de freno delanteras',
          <Pill key="a" tone="amber">
            2 · mínimo 4
          </Pill>,
          money(95000),
        ],
        ['FR-034', 'Discos de freno delanteros', '6', money(80000)],
        ['AC-110', 'Aceite 5W30 · 4 L', '14', money(48000)],
        ['FI-008', 'Filtro de aceite', '22', money(12500)],
      ]}
    />
  );
}
function Config() {
  return (
    <div className="tl-done">
      <span>✲</span>
      <h1>Configuración</h1>
      <p>
        Equipo, permisos y auditoría están en la versión completa. En la demo nos enfocamos en el
        día a día del taller.
      </p>
    </div>
  );
}

const SCREENS = {
  inicio: Inicio,
  ingreso: Ingreso,
  tablero: Tablero,
  ot: Orden,
  presupuesto: Presupuesto,
  whatsapp: WhatsApp,
  cobros: Cobros,
  cobro: Cobro,
  cobrado: Cobrado,
  clientes: Clientes,
  vehiculos: Vehiculos,
  presupuestos: Presupuestos,
  productos: Productos,
  config: Config,
};
