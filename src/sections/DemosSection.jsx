import { lazy, Suspense, useEffect, useRef, useState } from 'react';

// The demos are a separate chunk: they only download when the visitor gets close.
const DemoPlayer = lazy(() => import('../demos/DemoPlayer.jsx'));

function DemoPlaceholder() {
  return <div className="demos-placeholder" aria-hidden="true" />;
}

export default function DemosSection() {
  const ref = useRef(null);
  const [near, setNear] = useState(typeof IntersectionObserver === 'undefined');

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
          <p className="demos-eyebrow">Demos en vivo</p>
          <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg font-black uppercase tracking-tight leading-none">
            Probalo vos.
          </h2>
          <p className="demos-lead">
            Dos sistemas que diseñamos, funcionando con datos de ejemplo. Mirá el recorrido o tocá
            la pantalla y navegalos como si fueran tuyos.
          </p>
        </div>
        {near ? (
          <Suspense fallback={<DemoPlaceholder />}>
            <DemoPlayer />
          </Suspense>
        ) : (
          <DemoPlaceholder />
        )}
      </div>
    </section>
  );
}
