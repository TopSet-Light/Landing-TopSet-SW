import { navigation } from '../../data/navigation.js';
import DepthButton from '../ui/DepthButton.jsx';
export default function SiteFooter() {
  return (
    <footer className="w-full bg-[#070707] border-t border-white/[0.08] pt-space-2xl pb-space-xl">
      <div className="w-full px-margin-mobile lg:px-margin flex flex-col gap-space-2xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-xl pb-space-xl border-b border-white/[0.08]">
          <div className="max-w-3xl">
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface tracking-tight uppercase leading-none">
              ¿LISTO PARA CONSTRUIR TU PRÓXIMO PROYECTO?
            </h2>
          </div>
          <div>
            <DepthButton className="" data-path="contacto" href="#contacto">
              <span>Empecemos</span>
              <span className="tracking-tighter transition-transform duration-200 group-hover:translate-x-1">
                {'>>>'}
              </span>
            </DepthButton>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md">
            <span className="font-headline-sm text-headline-sm uppercase text-on-surface tracking-tighter">
              TOPSET
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant/60">
              [EDICIÓN BRUTALISTA DE VANGUARDIA]
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-space-lg">
            <a
              className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="proyectos"
              href={navigation[0].href}
            >
              {navigation[0].label}
            </a>
            <a
              className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="sobre-nosotros"
              href={navigation[1].href}
            >
              {navigation[1].label}
            </a>
            <a
              className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="contacto"
              href={navigation[2].href}
            >
              {navigation[2].label}
            </a>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant/50">
            © 2025 TOPSET STUDIO. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </div>
      </div>
    </footer>
  );
}
