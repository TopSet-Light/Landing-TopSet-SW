import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import tallerDemo from './taller/tallerDemo.js';
import turneroDemo from './turnero/turneroDemo.js';
import { estimateStep, runScript } from './runScript.js';
import './demo-player.css';

const DEMOS = [tallerDemo, turneroDemo];

/**
 * Interactive product demo: a scaled-down copy of the app plus a guided tour.
 * In "tour" mode a fake cursor plays each step's script; any real click on the
 * app (or the "Tocalo vos" button) hands control to the visitor.
 */
export default function DemoPlayer() {
  const [demoIndex, setDemoIndex] = useState(0);
  const demo = DEMOS[demoIndex];
  const goToNextDemo = useCallback(() => setDemoIndex((index) => (index + 1) % DEMOS.length), []);
  return (
    <div className="demo-showcase">
      <div className="demo-picker" role="tablist" aria-label="Elegí qué sistema probar">
        {DEMOS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`demo-tab-${item.id}`}
            aria-selected={index === demoIndex}
            aria-controls="demo-panel"
            className={`demo-pick${index === demoIndex ? ' is-active' : ''}`}
            style={{ '--demo-accent': item.accent }}
            onClick={() => setDemoIndex(index)}
          >
            <span className="demo-pick-icon material-symbols-outlined" aria-hidden="true">
              {item.icon}
            </span>
            <span className="demo-pick-text">
              <span className="demo-pick-kicker">
                {String(index + 1).padStart(2, '0')} · {item.label}
              </span>
              <strong>{item.name}</strong>
              <span className="demo-pick-summary">{item.summary}</span>
            </span>
            <span className="demo-pick-state" aria-hidden="true">
              {index === demoIndex ? 'En pantalla' : 'Ver demo →'}
            </span>
          </button>
        ))}
      </div>
      <div id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${demo.id}`}>
        <DemoStage
          key={demo.id}
          demo={demo}
          nextDemo={DEMOS.length > 1 ? DEMOS[(demoIndex + 1) % DEMOS.length] : null}
          onNextDemo={goToNextDemo}
        />
      </div>
    </div>
  );
}

function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function DemoStage({ demo, nextDemo, onNextDemo }) {
  const [state, dispatch] = useReducer(demo.reducer, demo.initialState);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState(() => (prefersReducedMotion() ? 'free' : 'tour'));
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0);
  const [compact, setCompact] = useState(false);
  const [cursor, setCursor] = useState({ x: demo.stage.width / 2, y: demo.stage.height / 2 });
  const [clicking, setClicking] = useState(false);
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const appRef = useRef(null);

  // On narrow screens some demos drop the steps that need the desktop panel.
  const steps = useMemo(
    () => (compact ? demo.steps.filter((item) => !item.desktopOnly) : demo.steps),
    [demo, compact],
  );
  const safeStep = Math.min(step, steps.length - 1);

  const stageWidth = compact && demo.compactStage ? demo.compactStage.width : demo.stage.width;
  const stageHeight = compact && demo.compactStage ? demo.compactStage.height : demo.stage.height;

  // Fit the fixed-size app into the available width.
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const update = () => {
      const width = frame.clientWidth;
      setCompact(Boolean(demo.compactStage) && width < demo.compactBreakpoint);
      const targetWidth =
        demo.compactStage && width < demo.compactBreakpoint
          ? demo.compactStage.width
          : demo.stage.width;
      setScale(width / targetWidth);
    };
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [demo]);

  // Only play while the demo is on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const locate = useCallback((target) => {
    const app = appRef.current;
    const element = app?.querySelector(`[data-tour="${target}"]`);
    if (!app || !element) return null;
    // Compact layouts scroll their content: bring the target into view first
    // (only that container, never the page).
    const scroller = element.closest('[data-scroll]');
    if (scroller) {
      const box = scroller.getBoundingClientRect();
      const target = element.getBoundingClientRect();
      if (target.top < box.top || target.bottom > box.bottom) {
        const factor = box.height / scroller.clientHeight || 1;
        scroller.scrollTop +=
          (target.top + target.height / 2 - (box.top + box.height / 2)) / factor;
      }
    }
    const appRect = app.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const factor = appRect.width / app.offsetWidth || 1;
    return {
      x: (rect.left - appRect.left + rect.width / 2) / factor,
      y: (rect.top - appRect.top + rect.height / 2) / factor,
    };
  }, []);

  // Play the current step. Earlier steps are fast-forwarded so any step can be
  // jumped to from the progress bar.
  const playing = mode === 'tour' && !paused && visible;
  useEffect(() => {
    if (mode !== 'tour') return undefined;
    const controller = { cancelled: false };
    dispatch({ type: 'RESET' });
    for (let index = 0; index < safeStep; index += 1) {
      runScript(steps[index].script, { dispatch, instant: true });
    }
    if (!playing) return () => (controller.cancelled = true);
    runScript(steps[safeStep].script, {
      dispatch,
      controller,
      moveTo: (target) => {
        const point = locate(target);
        if (point) setCursor(point);
        return Boolean(point);
      },
      press: (value) => setClicking(value),
    }).then((finished) => {
      if (!finished || controller.cancelled) return;
      // After the last step, hand over to the other product so visitors see both.
      if (safeStep === steps.length - 1 && nextDemo) onNextDemo();
      else setStep((current) => (current + 1) % steps.length);
    });
    return () => {
      controller.cancelled = true;
      setClicking(false);
    };
  }, [steps, safeStep, mode, playing, locate, nextDemo, onNextDemo]);

  const takeControl = () => {
    if (mode === 'tour') {
      setMode('free');
      setClicking(false);
    }
  };
  const resumeTour = () => {
    setPaused(false);
    setMode('tour');
  };
  const goToStep = (index) => {
    setStep(index);
    setPaused(false);
    setMode('tour');
  };

  const current = steps[safeStep];
  const stepDuration = estimateStep(current.script);
  const App = demo.App;

  return (
    <div className="demo-player" ref={rootRef}>
      <div className="demo-window" style={{ '--demo-accent': demo.accent }}>
        <div className="demo-window-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <p>{demo.url}</p>
        </div>
        <div
          className="demo-frame"
          ref={frameRef}
          style={{ height: scale ? stageHeight * scale : undefined }}
        >
          <div
            className={`demo-stage${mode === 'tour' ? ' is-touring' : ''}`}
            style={{
              width: stageWidth,
              height: stageHeight,
              transform: `scale(${scale || 0.001})`,
            }}
            onPointerDownCapture={takeControl}
            ref={appRef}
          >
            <App state={state} dispatch={dispatch} compact={compact} />
            {mode === 'tour' && (
              <div
                className={`demo-cursor${clicking ? ' is-clicking' : ''}`}
                style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" width="26" height="26">
                  <path
                    d="M5 3l14 8.2-6.3 1.5L10 19z"
                    fill="#111"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="demo-bar">
        <div className="demo-step" aria-live="polite">
          <span className="demo-step-number">
            <small>Paso</small>
            {String(safeStep + 1).padStart(2, '0')}
          </span>
          <span className="demo-step-text">
            <strong>{mode === 'tour' ? current.title : 'Ahora probalo vos.'}</strong>
            <span>
              {mode === 'tour'
                ? current.caption
                : 'Hacé clic en la demo y navegala libremente. Los datos son de ejemplo.'}
            </span>
          </span>
        </div>

        <div className="demo-controls">
          <div className="demo-progress" aria-label="Pasos del recorrido">
            {steps.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Paso ${index + 1}: ${item.title}`}
                aria-current={index === safeStep && mode === 'tour' ? 'step' : undefined}
                className={index < safeStep ? 'is-done' : index === safeStep ? 'is-current' : ''}
                onClick={() => goToStep(index)}
              >
                <span
                  key={`${demo.id}-${safeStep}-${mode}`}
                  style={{
                    animationDuration: `${stepDuration}ms`,
                    animationPlayState: playing ? 'running' : 'paused',
                  }}
                />
              </button>
            ))}
          </div>
          {mode === 'tour' ? (
            <>
              <button
                type="button"
                className="demo-icon-button"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? 'Reanudar recorrido' : 'Pausar recorrido'}
              >
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  {paused ? (
                    <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
                  ) : (
                    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />
                  )}
                </svg>
              </button>
              <button type="button" className="demo-text-button" onClick={takeControl}>
                Tocalo vos
              </button>
            </>
          ) : (
            <button type="button" className="demo-text-button" onClick={resumeTour}>
              Ver recorrido
            </button>
          )}
          {nextDemo && (
            <button type="button" className="demo-next-button" onClick={onNextDemo}>
              Probar {nextDemo.label} <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
