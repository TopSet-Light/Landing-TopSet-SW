/**
 * These are project ideas (what we can build), not delivered client work.
 * `demoUrl` is a public demo or live site; while it is null the card invites the
 * visitor to get in touch instead of promising a demo.
 */
export const featuredProjects = [
  {
    id: 'fintech',
    cardClassName:
      'w-full max-w-[1240px] h-auto lg:h-[520px] rounded-xl overflow-hidden bg-[#faf9f5] shadow-[-8px_24px_45px_rgba(0,0,0,0.10)] flex flex-col lg:flex-row transition-transform duration-300',
    icon: 'terminal',
    name: '01 · Plataforma Fintech & Pagos',
    category: 'IDEA DE PROYECTO · FINTECH',
    title:
      'Una plataforma de pagos que procese operaciones en tiempo real y sea simple de usar para tus clientes.',
    metric: 'PAGOS EN TIEMPO REAL',
    imageAlt: 'Plataforma Fintech',
    image: '/images/projects/fintech.webp',
    number: '01',
    demoUrl: null,
  },
  {
    id: 'analytics',
    cardClassName:
      'w-full max-w-[1240px] h-auto lg:h-[520px] rounded-xl overflow-hidden bg-[#faf9f5] shadow-[-8px_24px_45px_rgba(0,0,0,0.10)] flex flex-col lg:flex-row transition-transform duration-300',
    icon: 'smart_toy',
    name: '02 · Sistema ERP & Automatización IA',
    category: 'IDEA DE PROYECTO · EMPRESAS',
    title:
      'Un sistema de gestión con reportes e IA para ordenar la operación diaria de tu empresa.',
    metric: 'REPORTES + IA',
    imageAlt: 'Sistema ERP Cloud',
    image: '/images/projects/analytics.webp',
    number: '02',
    demoUrl: null,
  },
];
export const demoProjects = [
  {
    id: 'commerce',
    name: 'Forma — Tienda online',
    category: 'E-commerce / Web',
    title: 'Una experiencia de compra simple, desde el catálogo hasta el checkout.',
    description:
      'Concepto de tienda para una marca de diseño: catálogo filtrable, variantes de producto, carrito y seguimiento de pedidos.',
    features: ['Catálogo y filtros', 'Carrito de compras', 'Panel de pedidos'],
    image: '/images/projects/commerce.webp',
    demoUrl: null,
    theme: 'peach',
    label: 'FORMA / OBJECTS',
    headline: 'Objetos para vivir mejor.',
    panels: ['Colección hogar', 'Diseño cotidiano', 'Nuevos objetos'],
    icon: 'shopping_bag',
  },
  {
    id: 'health',
    name: 'Aura — Turnos digitales',
    category: 'Salud / Aplicación web',
    title: 'Reservar un turno debería ser la parte más fácil del día.',
    description:
      'Ejemplo de portal de turnos con búsqueda por especialidad, selección de horarios y gestión de reservas con datos ficticios.',
    features: ['Agenda por profesional', 'Reserva de turnos', 'Recordatorios'],
    demoUrl: null,
    theme: 'mint',
    label: 'AURA / TU ESPACIO',
    headline: 'Tu próximo turno, más cerca.',
    panels: ['Clínica general', 'Odontología', 'Nutrición'],
    icon: 'calendar_month',
  },
  {
    id: 'logistics',
    name: 'Ruta — Gestión logística',
    category: 'Operaciones / Dashboard',
    title: 'Toda la operación conectada en una sola vista.',
    description:
      'Concepto de tablero logístico para organizar entregas, asignar recorridos y consultar el estado de cada envío con información simulada.',
    features: ['Planificación de rutas', 'Estado de entregas', 'Gestión de flota'],
    demoUrl: null,
    theme: 'blue',
    label: 'RUTA / CONTROL CENTER',
    headline: 'Cada envío, bajo control.',
    panels: ['En preparación', 'En camino', 'Entregados'],
    icon: 'local_shipping',
  },
  {
    id: 'learning',
    name: 'Órbita — Campus online',
    category: 'Educación / Plataforma SaaS',
    title: 'Aprender a tu ritmo, sin perder el rumbo.',
    description:
      'Ejemplo de campus digital con cursos, lecciones, seguimiento del progreso y un espacio para organizar contenidos educativos.',
    features: ['Biblioteca de cursos', 'Progreso por lección', 'Panel docente'],
    demoUrl: null,
    theme: 'lilac',
    label: 'ÓRBITA / APRENDÉ ALGO NUEVO',
    headline: 'Tu siguiente gran idea empieza acá.',
    panels: ['Diseño digital', 'Desarrollo web', 'Producto'],
    icon: 'school',
  },
];
