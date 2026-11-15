// Lightweight display data: importing this file must not load either demo app.
export const tallerInfo = {
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
  previewStepCount: 6,
  compactPreviewStepCount: 6,
  intro: {
    title: 'Todo el taller, de un vistazo.',
    caption: 'Autos en el taller, entregas pendientes y saldos apenas abrís el día.',
  },
};

export const turneroInfo = {
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
  previewStepCount: 7,
  compactPreviewStepCount: 6,
  intro: {
    title: 'Tus pacientes sacan turno solos.',
    caption: 'Desde la web o WhatsApp, a cualquier hora. Se identifican con su DNI.',
  },
};

export default [tallerInfo, turneroInfo];
