import { useEffect, useRef } from 'react';
import './Particles.css';

const WHITE = ['#ffffff', '#ffffff', '#ffffff'];

/** Decorative canvas: no React updates per frame, paused outside the viewport. */
export default function Particles({
  particleColors = WHITE, particleCount = 200, particleSpread = 10,
  speed = 0.1, particleBaseSize = 100, glow = 0.5, twinkle = 0.3,
  moveParticlesOnHover = true, hoverEffect = 'parallax', sizeRandomness = 1,
  shape = 'circle', depthOfField = 0, connections = false, connectionDistance = 110,
  particleHoverFactor = 1, hoverRadius = 140, drift = 'none', driftSpeed = 1,
  alphaParticles = false, disableRotation = false, cameraDistance = 20,
  variation = 0, opacity = 1, clickBurst = true, intro = true, lightMode = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // jsdom and browsers without canvas can still render the complete hero.
    if (typeof CanvasRenderingContext2D === 'undefined') return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const host = canvas.parentElement;
    const surface = host.closest('section') || host;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const colors = particleColors.length ? particleColors : WHITE;
    const particles = Array.from({ length: Math.min(1000, Math.max(0, particleCount)) }, () => ({
      x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2,
      z: Math.random(), phase: Math.random() * Math.PI * 2,
      size: 1 - sizeRandomness * Math.random() * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    let width = 1, height = 1, frame = 0, lastTime = 0, elapsed = 0, visible = true;
    const pointer = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };
    let burst = null;

    function draw(delta) {
      elapsed += delta;
      context.clearRect(0, 0, width, height);
      offset.x += (pointer.x - offset.x) * 0.06;
      offset.y += (pointer.y - offset.y) * 0.06;
      const time = motion.matches ? 0 : elapsed * speed;
      const angle = disableRotation ? 0 : time * 0.035;
      const projected = [];
      for (const particle of particles) {
        const perspective = Math.max(0.3, cameraDistance / (cameraDistance + particle.z * particleSpread));
        const rotatedX = particle.x * Math.cos(angle) - particle.y * Math.sin(angle);
        const rotatedY = particle.x * Math.sin(angle) + particle.y * Math.cos(angle);
        const parallax = moveParticlesOnHover && hoverEffect === 'parallax' && !motion.matches;
        let x = width / 2 + rotatedX * width * 0.6 * perspective;
        let y = height / 2 + rotatedY * height * 0.65 * perspective;
        x += Math.sin(time + particle.phase) * (8 + variation);
        y += Math.cos(time * 0.7 + particle.phase) * 10;
        if (parallax) {
          x += offset.x * 28 * perspective * particleHoverFactor;
          y += offset.y * 28 * perspective * particleHoverFactor;
        }
        if (drift !== 'none') y = ((y + elapsed * driftSpeed * 8) % height + height) % height;
        if (burst && !motion.matches) {
          const age = elapsed - burst.time;
          const dx = x - burst.x, dy = y - burst.y;
          const distance = Math.hypot(dx, dy);
          if (age < 1.2 && distance < hoverRadius * 2 && distance > 0) {
            const force = Math.sin(age / 1.2 * Math.PI) * 55 * (1 - distance / (hoverRadius * 2));
            x += dx / distance * force;
            y += dy / distance * force;
          }
        }
        const radius = Math.max(0.4, particleBaseSize / 100 * (1 + particle.size) * perspective);
        const shimmer = 1 - twinkle * (0.5 + Math.sin(time * 3 + particle.phase) * 0.5);
        const entrance = intro && !motion.matches ? Math.min(1, elapsed / 1.2) : 1;
        context.globalAlpha = Math.max(0, Math.min(1, opacity * shimmer * entrance * (alphaParticles ? perspective : 1)));
        context.fillStyle = lightMode && particle.color === '#ffffff' ? '#272334' : particle.color;
        context.shadowColor = context.fillStyle;
        context.shadowBlur = glow * 12 + depthOfField * particle.z * 5;
        context.beginPath();
        if (shape === 'circle') context.arc(x, y, radius, 0, Math.PI * 2);
        else context.rect(x - radius, y - radius, radius * 2, radius * 2);
        context.fill();
        projected.push({ x, y });
      }
      context.shadowBlur = 0;
      if (connections) {
        context.strokeStyle = lightMode ? '#272334' : colors[0];
        for (let i = 0; i < projected.length; i++) {
          for (let j = i + 1; j < projected.length; j++) {
            const a = projected[i], b = projected[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance >= connectionDistance) continue;
            context.globalAlpha = (1 - distance / connectionDistance) * 0.15 * opacity;
            context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke();
          }
        }
      }
    }

    function tick(now) {
      draw(lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0);
      lastTime = now;
      frame = requestAnimationFrame(tick);
    }
    function syncAnimation() {
      cancelAnimationFrame(frame);
      lastTime = 0;
      if (motion.matches) draw(0);
      else if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function resize() {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(0);
    }
    function move(event) {
      if (event.pointerType === 'touch') return;
      const bounds = host.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / width - 0.5;
      pointer.y = (event.clientY - bounds.top) / height - 0.5;
    }
    function leave() { pointer.x = 0; pointer.y = 0; }
    function burstOnClick(event) {
      if (!clickBurst || motion.matches || event.target.closest('a, button')) return;
      const bounds = host.getBoundingClientRect();
      burst = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, time: elapsed };
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    intersectionObserver.observe(host);
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerleave', leave);
    surface.addEventListener('click', burstOnClick);
    document.addEventListener('visibilitychange', syncAnimation);
    motion.addEventListener('change', syncAnimation);
    resize(); syncAnimation();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', leave);
      surface.removeEventListener('click', burstOnClick);
      document.removeEventListener('visibilitychange', syncAnimation);
      motion.removeEventListener('change', syncAnimation);
    };
  }, [particleColors, particleCount, particleSpread, speed, particleBaseSize, glow, twinkle,
    moveParticlesOnHover, hoverEffect, sizeRandomness, shape, depthOfField, connections,
    connectionDistance, particleHoverFactor, hoverRadius, drift, driftSpeed, alphaParticles,
    disableRotation, cameraDistance, variation, opacity, clickBurst, intro, lightMode]);

  return <div className="particles" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
