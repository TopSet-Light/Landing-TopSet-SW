import { TEAM } from '../data/team.js';

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const PRINCIPLES = [
  {
    icon: 'forum',
    title: 'Hablás directo con nosotros',
    text: 'Sin intermediarios: los que te escuchan son los mismos que programan.',
  },
  {
    icon: 'visibility',
    title: 'Avances que podés ver',
    text: 'Te mostramos el sistema funcionando seguido, no solo al final.',
  },
  {
    icon: 'tune',
    title: 'Hecho a tu medida',
    text: 'Partimos de cómo trabaja tu negocio, no de una plantilla.',
  },
];

export default function AboutSection() {
  return (
    <section
      className="w-full bg-[#ece9df] text-[#0a0a0a] py-16 sm:py-20 lg:py-[120px] px-margin-mobile lg:px-[8vw]"
      id="sobre-nosotros"
    >
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 flex flex-col">
          <p className="about-eyebrow">Quiénes somos</p>
          <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-black text-[#0a0a0a] uppercase leading-[0.95] tracking-tight">
            Cuatro amigos, un proyecto propio.
          </h2>
          <p className="font-body-lg text-body-lg text-[#333333] leading-relaxed mt-space-lg max-w-xl">
            Somos Emiliano, Ezequiel, Francisco y Matías: estudiantes de Ingeniería en Sistemas a
            punto de recibirnos. Un día nos dijimos <em>“arranquemos algo nuestro”</em> y elegimos
            lo que más nos gusta hacer: software.
          </p>
          <p className="font-body-lg text-body-lg text-[#333333] leading-relaxed mt-space-md mb-space-xl max-w-xl">
            Así nació TOPSET, una agencia chica a propósito: cada proyecto lo llevamos nosotros, de
            la primera charla a la entrega.
          </p>
          <div className="flex items-center gap-space-sm mb-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#0a0a0a] font-bold">
              Cómo trabajamos
            </span>
            <span className="flex-1 h-px bg-black/10" />
          </div>
          <ul className="flex flex-col gap-3">
            {PRINCIPLES.map((item) => (
              <li
                key={item.title}
                className="bg-white rounded-xl px-5 py-4 shadow-[0_4px_15px_rgba(0,0,0,0.04)] flex items-center gap-4"
              >
                <span className="w-10 h-10 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">
                    {item.icon}
                  </span>
                </span>
                <span className="flex flex-col">
                  <span className="font-headline-sm text-[17px] sm:text-headline-sm font-bold text-[#0a0a0a] leading-snug">
                    {item.title}
                  </span>
                  <span className="text-[14px] text-[#484946] leading-snug">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6">
          <div className="about-team">
            <div className="about-team-head">
              <span>El equipo</span>
              <span>4 cofundadores</span>
            </div>
            <ul className="about-team-grid">
              {TEAM.map(({ name, photo, linkedin }) => (
                <li key={name} className="about-member">
                  <span className="about-avatar">
                    {photo ? (
                      <img
                        src={photo}
                        alt={`Foto de ${name}`}
                        width={256}
                        height={256}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span aria-hidden="true">{name.slice(0, 2)}</span>
                    )}
                  </span>
                  <strong>{name}</strong>
                  <small>Cofundador</small>
                  <a
                    className="about-member-link"
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn de ${name} (se abre en una pestaña nueva)`}
                  >
                    <span className="about-member-icon">
                      <LinkedInIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
