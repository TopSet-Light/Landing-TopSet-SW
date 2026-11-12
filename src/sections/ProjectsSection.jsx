import { useEffect, useRef } from 'react';
import FeaturedProjectCard from '../components/projects/FeaturedProjectCard.jsx';
import { demoProjects, featuredProjects } from '../data/projects.js';
import DemoProjectCard from '../components/projects/DemoProjectCard.jsx';

/**
 * Zig-zag reveal: each card slides in from its own side (left, right, left…)
 * when it enters the viewport. On large screens the cards also stack like a
 * deck while scrolling (sticky, see projects.css). Without IntersectionObserver or with reduced
 * motion the cards are simply shown.
 */
function useSlideIn(listRef) {
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const slides = list.querySelectorAll('.project-slide');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );
    slides.forEach((slide) => {
      slide.classList.add('is-armed');
      observer.observe(slide);
    });
    return () => {
      observer.disconnect();
      slides.forEach((slide) => slide.classList.remove('is-armed', 'is-in'));
    };
  }, [listRef]);
}

export default function ProjectsSection() {
  const listRef = useRef(null);
  useSlideIn(listRef);
  const side = (index) => (index % 2 === 0 ? 'left' : 'right');
  return (
    <section
      className="projects-section w-full bg-[#f3f3f1] text-[#0a0a0a] py-16 sm:py-20 lg:py-[100px] px-margin-mobile lg:px-[8vw]"
      id="proyectos"
    >
      <div className="max-w-[1240px] mx-auto flex flex-col gap-space-2xl">
        <div className="projects-intro">
          <p className="projects-eyebrow">Ideas a medida</p>
          <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-black text-[#0a0a0a] tracking-tight uppercase leading-none">
            Lo que podemos crear para vos.
          </h2>
          <p className="projects-lead">
            Todavía no son trabajos entregados: son ideas de sistemas que podemos construir para
            distintos rubros. Si alguno se parece a lo que necesitás, lo diseñamos a tu medida.
          </p>
        </div>
        <div ref={listRef} className="relative flex flex-col gap-10 sm:gap-16">
          {featuredProjects.map((project, index) => (
            <div className="project-slide" data-side={side(index)} key={project.id}>
              <FeaturedProjectCard project={project} flipped={index % 2 === 1} />
            </div>
          ))}
          {demoProjects.map((project, index) => {
            const position = featuredProjects.length + index;
            return (
              <div className="project-slide" data-side={side(position)} key={project.id}>
                <DemoProjectCard project={project} index={index} flipped={position % 2 === 1} />
              </div>
            );
          })}
        </div>
        <div className="projects-cta">
          <p>¿Tu negocio tiene un proceso parecido?</p>
          <a href="#contacto">
            Contanos y lo armamos a medida <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
