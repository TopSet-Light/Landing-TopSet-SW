export function DemoWindow({ demo, children, frameRef, frameStyle }) {
  return (
    <div className="demo-window">
      <div className="demo-window-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <p>{demo.url}</p>
      </div>
      <div className="demo-frame" ref={frameRef} style={frameStyle}>
        {children}
      </div>
    </div>
  );
}

export function DemoStepSummary({ step = 0, title, caption }) {
  return (
    <div className="demo-step" aria-live="polite">
      <span className="demo-step-number">
        <small>Paso</small>
        {String(step + 1).padStart(2, '0')}
      </span>
      <span className="demo-step-text">
        <strong>{title}</strong>
        <span>{caption}</span>
      </span>
    </div>
  );
}

export default function DemoPlaceholder({ demo, nextDemo }) {
  return (
    <div className="demo-player demo-loading" aria-busy="true">
      <DemoWindow demo={demo}>
        <div className="demo-skeleton" aria-hidden="true">
          <div className="demo-skeleton-header" />
          <div className="demo-skeleton-title" />
          <div className="demo-skeleton-action" />
          <div className="demo-skeleton-grid">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <p className="demo-loading-status" role="status">
          Cargando demos interactivas…
        </p>
      </DemoWindow>
      {/* The initial summary and control sizes reserve the same toolbar layout.
          Hidden content is only a sizing aid, never focusable or announced. */}
      <div className="demo-bar" aria-hidden="true">
        <DemoStepSummary {...demo.intro} />
        <div className="demo-controls">
          <span className="demo-progress demo-loading-progress" />
          <span className="demo-icon-button" />
          <span className="demo-text-button">Tocalo vos</span>
          <span className="demo-next-button">Probar {nextDemo.label} →</span>
        </div>
      </div>
    </div>
  );
}
