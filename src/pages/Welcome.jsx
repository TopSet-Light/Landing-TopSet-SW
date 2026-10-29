import FlyingButton from '../components/ui/FlyingButton.jsx';

export default function Welcome({ launching, error, onEnter, onIntent, onFlightEnd }) {
  return (
    <main className={`intro${launching ? ' is-departing' : ''}`}>
      <header className="intro-header">
        <span className="intro-brand">
          TOPSET-SW<span>®</span>
        </span>
      </header>
      <div className="intro-copy">
        <p className="intro-eyebrow">DE LA IDEA AL DESPEGUE</p>
        <h1>
          Todo empieza
          <br />
          <span>con un impulso.</span>
        </h1>
        <p className="intro-description">Tu próximo proyecto está a un clic de despegar.</p>
      </div>
      <FlyingButton
        theme="dark"
        size="medium"
        altitude={170}
        hoverTime={2.4}
        jets={2}
        thrusters
        trigger="hover"
        carryCursor
        smoke={1}
        turbulence={1}
        wobble={1}
        ramp={false}
        thrustColor="#8ec5ff"
        smokeColor="#eef1f6"
        launching={launching}
        onClick={onEnter}
        onFlightEnd={onFlightEnd}
        onIntent={onIntent}
      >
        Take off
      </FlyingButton>
      <p className="intro-status" role="status" aria-live="polite">
        {error ||
          (launching
            ? 'Preparando el despegue…'
            : 'Pasá el cursor para encenderlo. Tocá para entrar.')}
      </p>
    </main>
  );
}
