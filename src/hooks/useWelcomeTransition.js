import { useState, useEffect } from 'react';
import createPageLoader from '../utils/createPageLoader.js';

const prepareHome = createPageLoader(() => import('../pages/Home.jsx'));

/** Coordinate loading and flight completion before revealing the home. */
export default function useWelcomeTransition() {
  const [Home, setHome] = useState(null);
  const [launching, setLaunching] = useState(false);
  const [flightDone, setFlightDone] = useState(false);
  const [error, setError] = useState('');
  const [entered, setEntered] = useState(false);

  // A stale hash (e.g. #proyectos left by an in-page link before a refresh) must not
  // send the user past the hero after take-off: drop it so the home always opens at the top.
  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  function enter() {
    setError('');
    setLaunching(true);
    setFlightDone(matchMedia('(prefers-reduced-motion: reduce)').matches);
    prepareHome()
      .then((component) => setHome(() => component))
      .catch(() => {
        setError('No pudimos cargar el sitio. Revisá tu conexión y volvé a intentarlo.');
        setLaunching(false);
        setFlightDone(false);
      });
  }
  useEffect(() => {
    if (Home && flightDone) setEntered(true);
  }, [Home, flightDone]);

  return {
    Home,
    entered,
    launching,
    error,
    enter,
    preloadHome: () => {
      prepareHome().catch(() => {});
    },
    completeFlight: () => setFlightDone(true),
  };
}
