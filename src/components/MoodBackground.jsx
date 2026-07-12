import { useEffect, useRef } from 'react';

const PARTICLE_COUNTS = {
  idle: { wine: 28, fire: 36 },
  hover: { wine: 70, fire: 90 },
  loading: { wine: 110, fire: 140 },
  result: { wine: 50, fire: 65 },
  selected: { wine: 45, fire: 55 },
};

function MoodBackground({ vessel, intensity = 'idle', reducedMotion = false, global = false }) {
  const canvasRef = useRef(null);
  const isWine = vessel === 'wine';
  const counts = PARTICLE_COUNTS[intensity] || PARTICLE_COUNTS.idle;
  const particleCount = isWine ? counts.wine : counts.fire;
  const isIntense = intensity === 'hover' || intensity === 'loading';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return undefined;

    const ctx = canvas.getContext('2d');
    let raf = 0;
    let w = 0;
    let h = 0;

    const speedMult = intensity === 'loading' ? 2.4 : intensity === 'hover' ? 1.6 : 1;
    const opacityMult = intensity === 'loading' ? 2.2 : intensity === 'hover' ? 1.7 : 1;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: isWine ? 0.8 + Math.random() * 3.5 : 1.2 + Math.random() * 4,
      speed: (0.00012 + Math.random() * 0.0004) * speedMult,
      drift: (Math.random() - 0.5) * 0.0006,
      phase: Math.random() * Math.PI * 2,
      opacity: (0.08 + Math.random() * 0.28) * opacityMult,
    }));

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * window.devicePixelRatio);
      canvas.height = Math.floor(h * window.devicePixelRatio);
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (isWine) {
          p.y -= p.speed;
          p.x += p.drift + Math.sin(time * 0.0008 + p.phase) * 0.0002;
          if (p.y < -0.05) {
            p.y = 1.05;
            p.x = Math.random();
          }
        } else {
          p.y -= p.speed * 2.6;
          p.x += p.drift + Math.sin(time * 0.002 + p.phase) * 0.0005;
          if (p.y < -0.05) {
            p.y = 1.05;
            p.x = Math.random();
          }
        }

        const flicker = isWine
          ? 0.55 + Math.sin(time * 0.0018 + p.phase) * 0.45
          : 0.45 + Math.sin(time * 0.004 + p.phase) * 0.55;

        const px = p.x * w;
        const py = p.y * h;
        const alpha = Math.min(p.opacity * flicker, 0.85);

        if (isWine) {
          ctx.fillStyle = `rgba(242, 232, 213, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r * 3.5);
          grad.addColorStop(0, `rgba(255, 138, 61, ${alpha})`);
          grad.addColorStop(0.5, `rgba(232, 83, 28, ${alpha * 0.5})`);
          grad.addColorStop(1, 'rgba(232, 83, 28, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, p.r * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [isWine, reducedMotion, particleCount, intensity]);

  return (
    <div
      className={[
        'mood-background',
        `mood-background--${vessel}`,
        `mood-background--${intensity}`,
        global ? 'mood-background--global' : '',
        isIntense ? 'mood-background--intense' : '',
      ].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <div className="mood-base-gradient" />
      <div className="mood-color-wash" />
      <div className="mood-light-pool mood-light-pool--a" />
      <div className="mood-light-pool mood-light-pool--b" />
      <div className="mood-light-pool mood-light-pool--c" />
      {isWine ? (
        <>
          <div className="mood-cellar-rays" />
          <div className="mood-wine-surge" />
          {intensity === 'loading' && <div className="mood-wine-pour" />}
        </>
      ) : (
        <>
          <div className="mood-forge-glow" />
          <div className="mood-fire-surge" />
          <div className="mood-heat-shimmer" />
          {intensity === 'loading' && <div className="mood-fire-flicker" />}
        </>
      )}
      <canvas ref={canvasRef} className="mood-particle-canvas" />
      <div className="mood-vignette" />
      <div className="mood-grain" />
      {intensity === 'loading' && <div className="mood-loading-pulse" />}
    </div>
  );
}

export default MoodBackground;
