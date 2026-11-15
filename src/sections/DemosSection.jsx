import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import ErrorBoundary from '../components/ui/ErrorBoundary.jsx';
import loadDemoPlayer from '../demos/loadDemoPlayer.js';
import demos from '../demos/demoCatalog.js';
import DemoPicker from '../demos/DemoPicker.jsx';
import DemoPlaceholder from '../demos/DemoChrome.jsx';
import '../demos/demo-player.css';

// Render the separate player chunk only when the visitor gets close.
const DemoPlayer = lazy(loadDemoPlayer);

// Shown when the demos chunk fails to download or the player crashes, so the
// rest of the landing (contact form included) keeps working.
function DemoError() {
  return (
    <div className="demos-placeholder demos-error" role="alert">
      <span className="material-symbols-outlined" aria-hidden="true">
        cloud_off
      </span>
      <p className="demos-error-title">No pudimos cargar las demos.</p>
      <p className="demos-error-text">
        Puede ser un problema de conexión. Recargá la página o escribinos y te las mostramos.
      </p>
      <div className="demos-error-actions">
        <button type="button" onClick={() => window.location.reload()}>
          Recargar
        </button>
        <a href="#contacto">Escribinos</a>
      </div>
    </div>
  );
}

export default function DemosSection() {
  const ref = useRef(null);
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined');
  const [selectedId, setSelectedId] = useState(demos[0].id);
  const demoIndex = demos.findIndex((item) => item.id === selectedId);
  const demo = demos[demoIndex];
  const nextDemo = demos[(demoIndex + 1) % demos.length];
  const selectDemo = useCallback((id) => {
    setSelectedId(id);
    setNear(true);
  }, []);

  useEffect(() => {
    if (near || !ref.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [near]);

  return (
    <section
      ref={ref}
      id="demos"
      className="demos-section w-full py-16 sm:py-20 lg:py-[110px] px-margin-mobile lg:px-[6vw]"
    >
      <div className="max-w-[1320px] mx-auto flex flex-col gap-10 lg:gap-14">
        <div className="demos-intro">
          <p className="demos-eyebrow">En qué estamos trabajando</p>
          <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-black uppercase tracking-tight leading-none">
            Lo que estamos construyendo.
          </h2>
          <p className="demos-lead">
            Dos sistemas que estamos desarrollando, funcionando con datos de ejemplo. Mirá el
            recorrido o tocá la pantalla y probalos como si fueran tuyos.
          </p>
        </div>
        <div className="demo-showcase">
          <DemoPicker selectedId={selectedId} onSelect={selectDemo} />
          <div
            id="demo-panel"
            className="demo-panel"
            role="tabpanel"
            aria-labelledby={`demo-tab-${selectedId}`}
            style={{
              '--demo-accent': demo.accent,
              '--demo-stage-ratio': `${demo.stage.width} / ${demo.stage.height}`,
              '--demo-compact-ratio': `${demo.compactStage.width} / ${demo.compactStage.height}`,
              '--demo-preview-steps': demo.previewStepCount,
              '--demo-compact-preview-steps': demo.compactPreviewStepCount,
            }}
          >
            {near ? (
              <ErrorBoundary fallback={<DemoError />}>
                <Suspense fallback={<DemoPlaceholder demo={demo} nextDemo={nextDemo} />}>
                  <DemoPlayer selectedId={selectedId} onSelect={selectDemo} />
                </Suspense>
              </ErrorBoundary>
            ) : (
              <DemoPlaceholder demo={demo} nextDemo={nextDemo} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
