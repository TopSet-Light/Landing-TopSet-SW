import { useEffect, useRef, useState } from 'react';
import './TrueFocus.css';

/** Keep one accessible sentence while a decorative frame follows the focused word. */
export default function TrueFocus({
  sentence = 'SOFTWARE A MEDIDA', manualMode = false, focusStyle = 'brackets',
  easing = 'smooth', order = 'sequential', blurAmount = 5, focusScale = 1,
  unfocusedOpacity = 1, borderColor = '#5227FF', cornerSize = 16, borderWidth = 3,
  animationDuration = 0.5, pauseBetweenAnimations = 1, highlightColor = '#5227FF',
}) {
  const words = sentence.trim().split(/\s+/);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [frame, setFrame] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    function update() { setReducedMotion(Boolean(media?.matches)); }
    update();
    media?.addEventListener?.('change', update);
    return () => media?.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (manualMode || reducedMotion || words.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setActiveIndex(index => order === 'random' ? Math.floor(Math.random() * words.length) : (index + 1) % words.length);
    }, Math.max(0.1, animationDuration + pauseBetweenAnimations) * 1000);
    return () => window.clearInterval(timer);
  }, [manualMode, reducedMotion, words.length, order, animationDuration, pauseBetweenAnimations]);

  useEffect(() => {
    let disposed = false;
    function measure() {
      if (disposed) return;
      const word = wordRefs.current[activeIndex];
      if (!word || !containerRef.current) return;
      setFrame({ x: word.offsetLeft - 12, y: word.offsetTop - 10,
        width: word.offsetWidth + 24, height: word.offsetHeight + 20 });
    }
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(containerRef.current);
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => { disposed = true; observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [activeIndex, sentence]);

  return (
    <span ref={containerRef} className={`true-focus${reducedMotion ? ' is-static' : ''}`}
      style={{ '--focus-blur': `${blurAmount}px`, '--focus-scale': focusScale,
        '--focus-opacity': unfocusedOpacity, '--focus-border': borderColor,
        '--focus-highlight': highlightColor, '--focus-corner': `${cornerSize}px`,
        '--focus-border-width': `${borderWidth}px`, '--focus-duration': `${animationDuration}s`,
        '--focus-easing': easing === 'smooth' ? 'cubic-bezier(.22,.68,0,1)' : 'linear' }}>
      <span className="sr-only">{sentence}</span>
      <span className="true-focus-words" aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} ref={element => { wordRefs.current[index] = element; }}
            className={`true-focus-word${activeIndex === index ? ' is-focused' : ''}`}
            onPointerEnter={manualMode ? () => setActiveIndex(index) : undefined}>{word}</span>
        ))}
      </span>
      {!reducedMotion && frame && <span aria-hidden="true" className={`true-focus-frame focus-${focusStyle}`}
        style={{ transform: `translate(${frame.x}px, ${frame.y}px)`, width: frame.width, height: frame.height }}>
        <i /><i /><i /><i />
      </span>}
    </span>
  );
}
