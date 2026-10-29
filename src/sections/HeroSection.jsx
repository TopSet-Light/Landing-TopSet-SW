import DepthButton from '../components/ui/DepthButton.jsx';
import Particles from '../components/ui/Particles.jsx';
import TrueFocus from '../components/ui/TrueFocus.jsx';

// Stable reference: Particles re-initializes its canvas when this prop changes identity.
const PARTICLE_COLORS = ['#ffffff', '#ffffff', '#ffffff'];

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col justify-center hero-section">
      <Particles
        particleColors={PARTICLE_COLORS}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        glow={0.5}
        twinkle={0.3}
        moveParticlesOnHover
        hoverEffect="parallax"
        sizeRandomness={1}
        shape="circle"
        depthOfField={0}
        connections={false}
        connectionDistance={110}
        particleHoverFactor={1}
        hoverRadius={140}
        drift="none"
        driftSpeed={1}
        alphaParticles={false}
        disableRotation={false}
        cameraDistance={20}
        variation={0}
        opacity={1}
        clickBurst
        intro
        lightMode={false}
      />
      <span className="home-brand">
        TOPSET-SOFTWARE<span>®</span>
      </span>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0">
        <span className="font-headline-xl font-black tracking-tighter text-[22vw] leading-none uppercase text-white/[0.035] block whitespace-nowrap">
          TOPSET
        </span>
      </div>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="relative z-10 w-full lg:w-[62%] px-margin-mobile lg:pl-[8vw] lg:pr-gutter flex flex-col justify-center">
        <h1 className="font-headline-xl text-headline-xl text-on-surface uppercase font-black leading-[0.93] tracking-tighter">
          <TrueFocus
            sentence="Software a medida"
            manualMode={false}
            focusStyle="brackets"
            easing="smooth"
            order="sequential"
            blurAmount={5}
            focusScale={1}
            unfocusedOpacity={1}
            borderColor="#8ec5ff"
            cornerSize={16}
            borderWidth={3}
            animationDuration={0.5}
            pauseBetweenAnimations={1}
            highlightColor="#8ec5ff"
          />
        </h1>
        <p className="font-body-lg text-body-lg text-secondary max-w-[530px] mt-space-lg leading-relaxed">
          Diseñamos y desarrollamos aplicaciones web, móviles y sistemas críticos listos para
          producción.
        </p>
        <div className="flex flex-wrap items-center gap-space-md mt-space-xl">
          <DepthButton className="" href="#contacto">
            <span>Empecemos</span>
            <span className="tracking-tighter transition-transform duration-200 group-hover:translate-x-1.5">
              {'>>>'}
            </span>
          </DepthButton>
          <DepthButton className="" href="#proyectos">
            <span>Nuestros trabajos</span>
            <span className="text-primary tracking-tighter transition-transform duration-200 group-hover:translate-x-1.5">
              {'>>>'}
            </span>
          </DepthButton>
        </div>
      </div>
    </section>
  );
}
