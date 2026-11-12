import TallerApp from './TallerApp.jsx';

/** Datos ficticios basados en el Figma "SaaS Taller" (MVP escritorio). */
export const STATUSES = [
  'Ingresado',
  'En diagnóstico',
  'Esperando aprobación',
  'En reparación',
  'Listo para entregar',
  'Entregado',
];

const ORDERS = [
  {
    id: 'OT-0041',
    car: 'Renault Kangoo',
    plate: 'AC 456 EF',
    client: 'Martín Vera',
    status: 'En diagnóstico',
    note: 'Revisión de dirección',
  },
  {
    id: 'OT-0040',
    car: 'Toyota Etios',
    plate: 'AD 789 GH',
    client: 'Paula Gil',
    status: 'Esperando aprobación',
    note: 'Presupuesto enviado',
  },
  {
    id: 'OT-0038',
    car: 'Peugeot 208',
    plate: 'AF 567 LM',
    client: 'Julia Paz',
    status: 'En reparación',
    note: 'Cambio de correa',
  },
  {
    id: 'OT-0037',
    car: 'VW Gol',
    plate: 'AG 890 NP',
    client: 'Eva Ruiz',
    status: 'Listo para entregar',
    note: 'Avisar al cliente',
    total: 180000,
    paid: 60000,
  },
  {
    id: 'OT-0039',
    car: 'Ford Ka',
    plate: 'AE 234 JK',
    client: 'Diego Luna',
    status: 'Entregado',
    note: 'Retirado por el cliente',
    total: 95000,
    paid: 95000,
  },
];

const CHECKLIST = {
  'Nivel de aceite del motor': 'Conforme',
  'Presión y estado de neumáticos': 'Sin revisar',
  'Nivel de refrigerante': 'Conforme',
  'Luces exteriores': 'Conforme',
  'Nivel de líquido de frenos': 'Conforme',
  'Limpiaparabrisas y lavaparabrisas': 'Sin revisar',
};

const BASE_ITEMS = [
  { label: 'Pastillas de freno delanteras', kind: 'Repuesto', amount: 95000 },
  { label: 'Discos de freno delanteros', kind: 'Repuesto', amount: 80000 },
];
const EXTRA_ITEM = { label: 'Reemplazo y prueba de frenado', kind: 'Mano de obra', amount: 75000 };
export const ADVANCE = 100000;

const EMPTY_FIELDS = {
  cliente: '',
  vehiculo: '',
  patente: '',
  km: '',
  motivo: '',
  referencia: '',
};

export const initialState = {
  screen: 'inicio',
  orders: ORDERS,
  fields: EMPTY_FIELDS,
  selected: null,
  highlight: null,
  checklist: CHECKLIST,
  items: BASE_ITEMS,
  presupuestoFor: null,
  cobroFor: null,
  medio: 'Transferencia',
  toast: null,
};

const MEDIOS = ['Transferencia', 'Efectivo', 'Tarjeta de débito'];
const CHECK_CYCLE = ['Sin revisar', 'Observado', 'Conforme'];

const updateOrder = (orders, id, patch) =>
  orders.map((order) => (order.id === id ? { ...order, ...patch } : order));

export function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'GO':
      return { ...state, screen: action.screen, toast: null, highlight: action.highlight ?? null };
    case 'SET_FIELD':
      return { ...state, fields: { ...state.fields, [action.field]: action.value } };
    case 'CREATE_ORDER': {
      if (state.orders.some((order) => order.id === 'OT-0042')) {
        return { ...state, screen: 'tablero', highlight: 'OT-0042' };
      }
      const f = state.fields;
      const order = {
        id: 'OT-0042',
        car: f.vehiculo || 'Fiat Cronos',
        plate: f.patente || 'AB 123 CD',
        client: f.cliente || 'Sofía Ríos',
        km: f.km || '68.420 km',
        status: 'Ingresado',
        note: f.motivo || 'Ruido al frenar a baja velocidad.',
        isNew: true,
        log: ['Lucía Torres creó la OT y la dejó en Ingresado.'],
      };
      return {
        ...state,
        orders: [order, ...state.orders],
        selected: order.id,
        screen: 'tablero',
        highlight: order.id,
        toast: 'Ingreso registrado · OT-0042',
      };
    }
    case 'OPEN_ORDER':
      return { ...state, selected: action.id, screen: 'ot', toast: null, highlight: null };
    case 'TOGGLE_CHECK': {
      const current = state.checklist[action.item];
      const next = CHECK_CYCLE[(CHECK_CYCLE.indexOf(current) + 1) % CHECK_CYCLE.length];
      return { ...state, checklist: { ...state.checklist, [action.item]: next } };
    }
    case 'NEXT_STATUS': {
      const order = state.orders.find((item) => item.id === state.selected);
      if (!order) return state;
      const index = STATUSES.indexOf(order.status);
      const status = STATUSES[Math.min(index + 1, STATUSES.length - 1)];
      return {
        ...state,
        orders: updateOrder(state.orders, order.id, {
          status,
          log: [...(order.log || []), `Nicolás Sosa pasó la orden a ${status}.`],
        }),
        toast: `Estado actualizado · ${status}`,
      };
    }
    case 'OPEN_PRESUPUESTO':
      return {
        ...state,
        screen: 'presupuesto',
        presupuestoFor: action.id ?? state.selected,
        items: BASE_ITEMS,
        toast: null,
      };
    case 'ADD_ITEM':
      return state.items.length > BASE_ITEMS.length
        ? state
        : { ...state, items: [...state.items, EXTRA_ITEM] };
    case 'SAVE_PRESUPUESTO':
      return { ...state, screen: 'whatsapp', toast: null };
    case 'ACCEPT_PRESUPUESTO': {
      const id = state.presupuestoFor;
      const total = state.items.reduce((sum, item) => sum + item.amount, 0);
      const order = state.orders.find((item) => item.id === id);
      return {
        ...state,
        orders: id
          ? updateOrder(state.orders, id, {
              status: 'En reparación',
              total,
              paid: ADVANCE,
              log: [
                ...(order?.log || []),
                'El cliente aceptó el presupuesto PRE-0019 y dejó un anticipo.',
              ],
            })
          : state.orders,
        selected: id ?? state.selected,
        screen: id ? 'ot' : 'presupuestos',
        toast: 'Presupuesto aceptado · Anticipo registrado',
      };
    }
    case 'OPEN_COBRO':
      return { ...state, screen: 'cobro', cobroFor: action.id, toast: null };
    case 'NEXT_MEDIO':
      return { ...state, medio: MEDIOS[(MEDIOS.indexOf(state.medio) + 1) % MEDIOS.length] };
    case 'CONFIRM_COBRO': {
      const order = state.orders.find((item) => item.id === state.cobroFor);
      if (!order) return state;
      return {
        ...state,
        orders: updateOrder(state.orders, order.id, {
          paid: order.total,
          status: 'Entregado',
          log: [...(order.log || []), `Cobro registrado por ${state.medio}. Vehículo entregado.`],
        }),
        screen: 'cobrado',
      };
    }
    default:
      return state;
  }
}

/** Recorrido guiado: funcionalidades principales del MVP (recorridos A, B y C del Figma). */
export const steps = [
  {
    title: 'Todo el taller, de un vistazo.',
    caption: 'Autos en el taller, entregas pendientes y saldos apenas abrís el día.',
    script: [{ wait: 1800 }, { click: 'nuevo-ingreso', act: { type: 'GO', screen: 'ingreso' } }],
  },
  {
    title: 'Ingresás el auto en segundos.',
    caption: 'Cliente, patente, kilometraje y motivo. Al confirmar se genera la orden.',
    script: [
      { type: 'f-cliente', field: 'cliente', text: 'Sofía Ríos' },
      { type: 'f-vehiculo', field: 'vehiculo', text: 'Fiat Cronos' },
      { type: 'f-patente', field: 'patente', text: 'AB 123 CD' },
      { type: 'f-km', field: 'km', text: '68.420 km' },
      { type: 'f-motivo', field: 'motivo', text: 'Ruido al frenar a baja velocidad.' },
      { click: 'confirmar-ingreso', act: { type: 'CREATE_ORDER' } },
      { wait: 1600 },
    ],
  },
  {
    title: 'Seguís cada auto en el tablero.',
    caption: 'Cada orden avanza por estado, del ingreso a la entrega.',
    script: [{ wait: 1200 }, { click: 'ot-OT-0042', act: { type: 'OPEN_ORDER', id: 'OT-0042' } }],
  },
  {
    title: 'El mecánico carga el diagnóstico.',
    caption: 'Checklist del vehículo, observaciones y cambios de estado con historial.',
    script: [
      { wait: 900 },
      {
        click: 'check-Presión y estado de neumáticos',
        act: { type: 'TOGGLE_CHECK', item: 'Presión y estado de neumáticos' },
      },
      { click: 'cambiar-estado', act: { type: 'NEXT_STATUS' } },
      { wait: 1300 },
      { click: 'crear-presupuesto', act: { type: 'OPEN_PRESUPUESTO' } },
    ],
  },
  {
    title: 'Presupuestás y lo mandás por WhatsApp.',
    caption: 'El mensaje sale listo. Cuando el cliente acepta, la orden sigue sola.',
    script: [
      { wait: 700 },
      { click: 'agregar-concepto', act: { type: 'ADD_ITEM' } },
      { click: 'guardar-presupuesto', act: { type: 'SAVE_PRESUPUESTO' } },
      { wait: 1800 },
      { click: 'presupuesto-aceptado', act: { type: 'ACCEPT_PRESUPUESTO' } },
      { wait: 1500 },
    ],
  },
  {
    title: 'Cobrás y entregás, sin planillas.',
    caption: 'Liquidación con anticipo y saldo. La orden queda entregada y registrada.',
    script: [
      { click: 'nav-cobros', act: { type: 'GO', screen: 'cobros' } },
      { click: 'registrar-OT-0042', act: { type: 'OPEN_COBRO', id: 'OT-0042' } },
      { click: 'medio-pago', act: { type: 'NEXT_MEDIO' } },
      { click: 'confirmar-cobro', act: { type: 'CONFIRM_COBRO' } },
      { wait: 1500 },
      { click: 'nav-ordenes', act: { type: 'GO', screen: 'tablero', highlight: 'OT-0042' } },
      { wait: 2200 },
    ],
  },
];

export default {
  id: 'taller',
  label: 'Taller',
  name: 'Gestión de taller mecánico',
  summary: 'Ingreso de autos, diagnóstico, presupuesto por WhatsApp y cobro.',
  icon: 'car_repair',
  url: 'taller.topset.com.ar',
  accent: '#1d4ed8',
  stage: { width: 1240, height: 760 },
  compactStage: { width: 430, height: 820 },
  compactBreakpoint: 700,
  initialState,
  reducer,
  steps,
  App: TallerApp,
};
