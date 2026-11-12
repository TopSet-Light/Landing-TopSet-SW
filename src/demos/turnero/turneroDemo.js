import TurneroApp from './TurneroApp.jsx';

/** Datos ficticios basados en el Figma "Turnero · Chatbot web · UX" (Kine). */
export const SERVICES = ['Kinesiología', 'Plantillas ortopédicas', 'RPG'];
export const DAYS = ['MAR 10', 'MIÉ 11', 'JUE 12', 'VIE 13'];
export const DAY_NAMES = {
  'MAR 10': 'Martes 10 de noviembre',
  'MIÉ 11': 'Miércoles 11 de noviembre',
  'JUE 12': 'Jueves 12 de noviembre',
  'VIE 13': 'Viernes 13 de noviembre',
};
export const MORNING = ['09:00', '10:00', '11:00', '11:30'];
export const AFTERNOON = ['15:00', '16:00', '17:00', '17:30'];
export const AGENDA_TIMES = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

export const initialState = {
  phone: 'inicio',
  admin: 'agenda',
  fields: { dni: '' },
  servicio: null,
  day: null,
  time: null,
  booking: null,
  reminder: false,
  agenda: { '15:00': 1, '15:30': 0, '16:00': 2, '16:30': 1, '17:00': 0, '17:30': 2 },
  cupos: 2,
  blocked: { 'VIE 13': false },
  blockServices: { 'Plantillas ortopédicas': true, RPG: true, Kinesiología: false },
  flash: null,
};

const isKineTuesday = (state) => state.servicio === 'Kinesiología' && state.day === 'MAR 10';

export function reducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'PHONE':
      return { ...state, phone: action.screen };
    case 'ADMIN':
      return { ...state, admin: action.view, flash: null };
    case 'SET_FIELD':
      return { ...state, fields: { ...state.fields, [action.field]: action.value } };
    case 'PICK_SERVICE':
      return { ...state, servicio: action.servicio, day: 'MAR 10', time: null, phone: 'horario' };
    case 'PICK_DAY':
      return { ...state, day: action.day, time: null };
    case 'PICK_TIME':
      return { ...state, time: action.time };
    case 'BOOK': {
      if (!state.time) return state;
      const agenda =
        isKineTuesday(state) && state.time in state.agenda
          ? { ...state.agenda, [state.time]: state.agenda[state.time] + 1 }
          : state.agenda;
      return {
        ...state,
        agenda,
        booking: { servicio: state.servicio, day: state.day, time: state.time },
        phone: 'reservado',
        admin: 'agenda',
        flash: state.time,
      };
    }
    case 'REMINDER':
      return { ...state, reminder: true, phone: 'recordatorio' };
    case 'CANCEL_BOOKING': {
      const booking = state.booking;
      if (!booking) return state;
      const counted =
        booking.servicio === 'Kinesiología' &&
        booking.day === 'MAR 10' &&
        booking.time in state.agenda;
      return {
        ...state,
        agenda: counted
          ? { ...state.agenda, [booking.time]: Math.max(0, state.agenda[booking.time] - 1) }
          : state.agenda,
        booking: null,
        phone: 'cancelado',
        admin: 'agenda',
        flash: counted ? booking.time : null,
      };
    }
    case 'CUPOS':
      return { ...state, cupos: Math.min(4, Math.max(1, state.cupos + action.delta)) };
    case 'TOGGLE_BLOCK_SERVICE':
      return {
        ...state,
        blockServices: {
          ...state.blockServices,
          [action.servicio]: !state.blockServices[action.servicio],
        },
      };
    case 'BLOCK_DAY':
      return { ...state, blocked: { ...state.blocked, 'VIE 13': !state.blocked['VIE 13'] } };
    default:
      return state;
  }
}

/** Recorrido guiado: reserva autogestionada, agenda en vivo, recordatorio, cancelación y cupos. */
export const steps = [
  {
    title: 'Tus pacientes sacan turno solos.',
    caption: 'Desde la web o WhatsApp, a cualquier hora. Se identifican con su DNI.',
    script: [
      { wait: 900 },
      { click: 'sacar-turno', act: { type: 'PHONE', screen: 'dni' } },
      { type: 'dni', field: 'dni', text: '30123456' },
      { click: 'continuar-dni', act: { type: 'PHONE', screen: 'servicio' } },
      { wait: 600 },
    ],
  },
  {
    title: 'Eligen el tipo de atención.',
    caption: 'Kinesiología, plantillas ortopédicas o RPG, cada una con su agenda.',
    script: [
      { wait: 900 },
      { click: 'svc-Kinesiología', act: { type: 'PICK_SERVICE', servicio: 'Kinesiología' } },
      { wait: 600 },
    ],
  },
  {
    title: 'Solo ven horarios libres.',
    caption: 'Los ocupados aparecen tachados: nadie reserva un cupo que ya no existe.',
    script: [
      { wait: 700 },
      { click: 'time-15:00', act: { type: 'PICK_TIME', time: '15:00' } },
      { click: 'continuar-horario', act: { type: 'PHONE', screen: 'revisar' } },
      { wait: 700 },
    ],
  },
  {
    title: 'Confirman y aparece en tu agenda.',
    caption: 'El turno entra al instante en el panel del consultorio. Sin llamados.',
    script: [{ wait: 600 }, { click: 'confirmar-turno', act: { type: 'BOOK' } }, { wait: 2600 }],
  },
  {
    title: 'Recordatorio por WhatsApp.',
    caption: '24 horas antes le llega el aviso. Menos ausencias, sin perseguir a nadie.',
    script: [{ wait: 500 }, { click: 'recordatorio', act: { type: 'REMINDER' } }, { wait: 2800 }],
  },
  {
    title: 'Si no puede ir, cancela solo.',
    caption: 'El cupo se libera en la agenda y vuelve a estar disponible.',
    script: [
      { click: 'volver-inicio', act: { type: 'PHONE', screen: 'inicio' } },
      { click: 'cancelar-turno', act: { type: 'PHONE', screen: 'mis-turnos' } },
      { click: 'turno-propio', act: { type: 'PHONE', screen: 'cancelar-confirm' } },
      { click: 'confirmar-cancelacion', act: { type: 'CANCEL_BOOKING' } },
      { wait: 2400 },
    ],
  },
  {
    title: 'Vos definís horarios y cupos.',
    desktopOnly: true,
    caption: 'Franjas, intervalos y pacientes por turno, servicio por servicio.',
    script: [
      { click: 'nav-horarios', act: { type: 'ADMIN', view: 'horarios' } },
      { click: 'cupos-mas', act: { type: 'CUPOS', delta: 1 } },
      { wait: 1200 },
      { click: 'nav-agenda', act: { type: 'ADMIN', view: 'agenda' } },
      { wait: 2200 },
    ],
  },
];

export default {
  id: 'turnero',
  label: 'Turnero',
  name: 'Turnos online para consultorios',
  summary: 'Reservas 24/7, agenda del profesional y recordatorios automáticos.',
  icon: 'calendar_month',
  url: 'turnos.kine.com.ar',
  accent: '#146b5d',
  stage: { width: 1240, height: 760 },
  compactStage: { width: 430, height: 760 },
  compactBreakpoint: 700,
  initialState,
  reducer,
  steps,
  App: TurneroApp,
};
