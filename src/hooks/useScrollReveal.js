import { useEffect } from 'react';

/**
 * Reveal-on-scroll: marks every `root > section` (except the hero) with `.reveal`
 * and adds `.is-visible` once it enters the viewport. Runs once per element.
 * Progressive enhancement: without IntersectionObserver or with reduced motion,
 * nothing is hidden, so content is never lost.
 */
export default function useScrollReveal(selector = 'main > section:not(:first-child)') {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const targets = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((element) => {
      element.classList.add('reveal');
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      targets.forEach((element) => element.classList.remove('reveal', 'is-visible'));
    };
  }, [selector]);
}

