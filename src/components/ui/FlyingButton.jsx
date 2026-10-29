import { useRef, useState } from 'react';
/** Animate a native button and notify the parent when departure completes. */
export default function FlyingButton({
  children = 'Take off',
  theme = 'dark',
  size = 'medium',
  altitude = 170,
  hoverTime = 2.4,
  jets = 2,
  thrusters = true,
  trigger = 'hover',
  carryCursor = true,
  smoke = 1,
  turbulence = 1,
  wobble = 1,
  ramp = false,
  thrustColor = '#8ec5ff',
  smokeColor = '#eef1f6',
  onClick,
  launching = false,
  onFlightEnd,
  onIntent,
}) {
  const [isHovered, setHovered] = useState(false);
  const buttonRef = useRef(null);
  const isFlying = isHovered || launching;
  function resetPointer() {
    setHovered(false);
    buttonRef.current?.style.setProperty('--pointer-x', '0px');
  }
  return (
    <div
      className="flight-zone"
      onPointerEnter={() => {
        if (trigger === 'hover') setHovered(true);
        onIntent?.();
      }}
      onPointerLeave={resetPointer}
    >
      <div className="launch-pad" aria-hidden={true} />
      <div className="launch-orbit orbit-one" aria-hidden={true} />
      <div className="launch-orbit orbit-two" aria-hidden={true} />
      <button
        ref={buttonRef}
        type="button"
        className={`flying-button theme-${theme} size-${size}${isFlying ? ' is-flying' : ''}${launching ? ' is-launching' : ''}${ramp ? ' has-ramp' : ''}`}
        style={{
          '--altitude': `${altitude}px`,
          '--hover-time': `${hoverTime}s`,
          '--thrust': thrustColor,
          '--smoke': smokeColor,
          '--wobble': `${wobble * 2}deg`,
          '--turbulence': `${turbulence * 3}px`,
        }}
        aria-label="Entrar al sitio de TOPSET Studio"
        aria-disabled={launching}
        onFocus={() => {
          setHovered(true);
          onIntent?.();
        }}
        onBlur={resetPointer}
        onPointerMove={(event) => {
          if (!carryCursor || launching || event.pointerType === 'touch') return;
          const bounds = event.currentTarget.parentElement.getBoundingClientRect();
          buttonRef.current.style.setProperty(
            '--pointer-x',
            `${Math.max(-12, Math.min(12, (event.clientX - bounds.left - bounds.width / 2) * 0.08))}px`,
          );
        }}
        onClick={(event) => {
          if (!launching) onClick?.(event);
        }}
        onAnimationEnd={(event) => {
          if (event.animationName === 'launch-away' && event.target === event.currentTarget)
            onFlightEnd?.();
        }}
      >
        <span className="flight-button-face">
          <span className="flight-symbol" aria-hidden={true}>
            ↗
          </span>
          {children}
          <span className="flight-light" aria-hidden={true} />
        </span>
        {thrusters && (
          <span className="thruster-bank" aria-hidden={true}>
            {Array.from(
              {
                length: Math.max(1, Math.min(4, jets)),
              },
              (_, index) => (
                <span key={index} className="thruster">
                  <span className="jet-flame" />
                  {smoke > 0 &&
                    Array.from(
                      {
                        length: 3,
                      },
                      (_, puff) => (
                        <span
                          key={puff}
                          className="smoke-puff"
                          style={{
                            animationDelay: `${puff * -0.4}s`,
                            '--smoke-strength': Math.min(1, smoke * 0.35),
                          }}
                        />
                      ),
                    )}
                </span>
              ),
            )}
          </span>
        )}
      </button>
    </div>
  );
}
