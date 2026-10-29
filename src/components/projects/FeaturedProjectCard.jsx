export default function FeaturedProjectCard({ project }) {
  return (
    <article className={project.cardClassName}>
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-[#faf9f5]">
        <div className="bg-white rounded-lg p-3.5 px-5 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[#0a0a0a] text-lg">{project.icon}</span>
            <span className="font-label-sm text-label-sm font-bold text-[#0a0a0a] uppercase tracking-wider">
              {project.name}
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-sm font-bold">north_east</span>
          </div>
        </div>
        <div className="my-space-lg">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#484946] font-bold block mb-space-xs">
            {project.category}
          </span>
          <h3 className="font-headline-md text-headline-md font-bold text-[#0a0a0a] leading-[1.2]">
            {project.title}
          </h3>
        </div>
        <div className="pt-space-md flex items-center justify-between">
          <a
            className="font-label-md text-label-md font-bold text-[#0a0a0a] hover:text-primary-container uppercase tracking-wider flex items-center gap-space-xs group"
            href="#"
          >
            <span>VER CASO DE ESTUDIO</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <span className="font-label-sm text-label-sm text-[#484946] uppercase">
            {project.metric}
          </span>
        </div>
      </div>
      <div className="w-full lg:w-1/2 relative bg-[#131313] min-h-[300px] lg:min-h-0 overflow-hidden">
        <img
          loading="lazy"
          decoding="async"
          alt={project.imageAlt}
          className="w-full h-full object-cover project-photo hover:scale-105 transition-transform duration-700"
          src={project.image}
          width={1200}
          height={900}
        />
        <span className="absolute bottom-5 right-7 font-headline-xl font-black text-white/90 text-8xl leading-none select-none pointer-events-none drop-shadow-md">
          {project.number}
        </span>
      </div>
    </article>
  );
}
