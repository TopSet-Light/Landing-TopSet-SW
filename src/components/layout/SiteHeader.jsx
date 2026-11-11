import { useEffect, useState } from 'react';
import { navigation, pageTitle } from '../../data/navigation.js';

/**
 * Fixed site header: brand (mark + name) on the left, section links on the right.
 * Transparent over the hero; once the page scrolls it gets a solid, blurred
 * background so it stays legible over the light sections. The link of the
 * section currently in view is highlighted. On small screens the links fold
 * into a toggle menu.
 */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = navigation
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else if (entry.target.id === sections[0]?.id && entry.boundingClientRect.top > 0)
            setActive('');
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Browser tab follows the section in view, e.g. "Proyectos · TOPSET".
  useEffect(() => {
    const section = navigation.find((item) => item.href.slice(1) === active);
    document.title = pageTitle(section ? section.title : 'Inicio');
  }, [active]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`site-header${scrolled || menuOpen ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}
    >
      <div className="site-header-bar">
        <a className="site-header-brand" href="#" aria-label="TOPSET Software, ir al inicio">
          <img src="/brand/topset-mark.svg" alt="" width={168} height={144} />
          <span>
            TOPSET-SOFTWARE<sup>®</sup>
          </span>
        </a>
        <nav aria-label="Navegación principal" className="site-header-nav">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href.slice(1) ? 'location' : undefined}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="site-header-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-header-menu"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      <nav id="site-header-menu" aria-label="Menú" className="site-header-menu" hidden={!menuOpen}>
        {navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
