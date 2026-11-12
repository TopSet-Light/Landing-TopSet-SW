// label: texto del menú. title: cómo se nombra la sección en la pestaña del navegador.
export const navigation = [
  { href: '#demos', label: 'DEMOS', title: 'Demos' },
  { href: '#proyectos', label: 'PROYECTOS', title: 'Proyectos' },
  { href: '#sobre-nosotros', label: 'SOBRE NOSOTROS', title: 'Sobre nosotros' },
  { href: '#contacto', label: 'CONTACTO', title: 'Contacto' },
];

export const BRAND = 'TOPSET';
export const pageTitle = (section) => `${section} · ${BRAND}`;
