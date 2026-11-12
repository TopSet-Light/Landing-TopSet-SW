import ProjectDemoButton from './ProjectDemoButton.jsx';

export default function FeaturedProjectCard({ project, flipped = false }) {
  return (
    <article className={`${project.cardClassName}${flipped ? ' lg:flex-row-reverse' : ''}`}>
      <div className="w-full lg:w-1/2 p-5 sm:p-8 lg:p-12 flex flex-col justify-between bg-[#faf9f5]">
        <div className="bg-white rounded-lg p-3 px-4 sm:p-3.5 sm:px-5 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-space-sm">
            <span className="material-symbols-outlined shrink-0 text-[#0a0a0a] text-lg">
              {project.icon}
            </span>
            <span className="font-label-sm text-label-sm font-bold text-[#0a0a0a] uppercase tracking-wider leading-snug">
              {project.name}
            </span>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a0a0a] text-white">
            <span className="material-symbols-outlined text-sm font-bold">north_east</span>
          </div>
        </div>
        <div className="my-6 sm:my-space-lg">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#484946] font-bold block mb-space-xs">
            {project.category}
          </span>
          <h3 className="font-headline-md text-[1.5rem] sm:text-[1.875rem] lg:text-headline-md font-bold text-[#0a0a0a] leading-[1.15]">
            {project.title}
          </h3>
        </div>
        <div className="flex flex-col items-start gap-3 pt-space-md sm:flex-row sm:items-center sm:justify-between">
          {project.demoUrl ? (
            <ProjectDemoButton project={project} />
          ) : (
            <a className="demo-project-contact" href="#contacto">
              <span className="demo-project-contact-label">
                Quiero un proyecto así <span aria-hidden={true}>↗</span>
              </span>
            </a>
          )}
          <span className="font-label-sm text-label-sm text-[#484946] uppercase">
            {project.metric}
          </span>
        </div>
      </div>
      <div className="relative w-full lg:w-1/2 bg-[#131313] min-h-[240px] sm:min-h-[300px] lg:min-h-0 overflow-hidden">
        <img
          loading="lazy"
          decoding="async"
          alt={project.imageAlt}
          className="w-full h-full object-cover project-photo hover:scale-105 transition-transform duration-700"
          src={project.image}
          width={1200}
          height={900}
        />
        <span className="absolute bottom-5 right-7 font-headline-xl font-black text-white/90 text-7xl sm:text-8xl leading-none select-none pointer-events-none drop-shadow-md">
          {project.number}
        </span>
      </div>
    </article>
  );
}
