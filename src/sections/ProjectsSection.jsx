import FeaturedProjectCard from '../components/projects/FeaturedProjectCard.jsx';
import { demoProjects, featuredProjects } from '../data/projects.js';
import DemoProjectCard from '../components/projects/DemoProjectCard.jsx';
export default function ProjectsSection() {
  return (
    <section
      className="w-full bg-[#f3f3f1] text-[#0a0a0a] py-[100px] px-margin-mobile lg:px-[8vw]"
      id="proyectos"
    >
      <div className="max-w-[1240px] mx-auto flex flex-col gap-space-2xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-black text-[#0a0a0a] tracking-tight uppercase leading-none">
              PROYECTOS QUE RESUELVEN.
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-12 relative pb-24">
          {featuredProjects.map((project) => (
            <FeaturedProjectCard key={project.id} project={project} />
          ))}
          {demoProjects.map((project, index) => (
            <DemoProjectCard project={project} index={index} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
