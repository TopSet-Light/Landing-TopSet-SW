import { navigation } from '../../data/navigation.js';
export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#070707]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="h-20 w-full px-margin-mobile lg:px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          <img
            loading="lazy"
            decoding="async"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-white/10"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Ub0GRwSCECzwb8fdTfjmjw7GJVc1QB0Tw46LlHL-7wfGf0Y_9nJtzRPIcRdaNw0l2yMYafszLS6-F8eHAh2vXNlmn5o4qVfIt7NoIOZnMPTovTfnyKTzg-F9KjUozLnsxuGB-BbEsvK9Wx4hrUBogtpVUhDgCE1zYOOgzPqqZzS0IUMd-jzRGwW7AklkiLyoGXawaI4Jo-la6XLpg15Gb9lJuN-cOb71LkXytpD1pfvrvyGKaHuqSGbRVn"
          />
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface whitespace-nowrap">
            TOPSET-SW
          </span>
        </div>
        <nav
          className="hidden md:flex items-center gap-space-xl"
          data-active-classes="text-primary border-b border-primary"
        >
          <a
            aria-current="page"
            className="font-label-md uppercase tracking-widest transition-colors py-1 text-primary border-b border-primary"
            data-path="proyectos"
            href={navigation[0].href}
          >
            {navigation[0].label}
          </a>
          <a
            className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors py-1"
            data-path="sobre-nosotros"
            href={navigation[1].href}
          >
            {navigation[1].label}
          </a>
          <a
            className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors py-1"
            data-path="contacto"
            href={navigation[2].href}
          >
            {navigation[2].label}
          </a>
        </nav>
      </div>
    </header>
  );
}
