const WINE_MOTES = [
  { left: '8%', top: '18%', delay: 0, size: 3 },
  { left: '22%', top: '62%', delay: 1.4, size: 2 },
  { left: '41%', top: '34%', delay: 2.8, size: 4 },
  { left: '67%', top: '72%', delay: 0.6, size: 2.5 },
  { left: '84%', top: '28%', delay: 3.2, size: 3 },
  { left: '55%', top: '12%', delay: 1.9, size: 2 },
  { left: '73%', top: '48%', delay: 4.1, size: 3.5 },
];

const FIRE_EMBERS = [
  { left: '12%', bottom: '8%', delay: 0, drift: 12 },
  { left: '28%', bottom: '14%', delay: 0.8, drift: -8 },
  { left: '44%', bottom: '6%', delay: 1.6, drift: 16 },
  { left: '61%', bottom: '12%', delay: 0.4, drift: -14 },
  { left: '78%', bottom: '10%', delay: 2.2, drift: 10 },
  { left: '90%', bottom: '18%', delay: 1.1, drift: -6 },
  { left: '35%', bottom: '20%', delay: 2.8, drift: 18 },
];

function AtmosphereOverlay({ vessel, reducedMotion = false }) {
  const isWine = vessel === 'wine';
  const accent = isWine ? '#f2e8d5' : '#ff8a3d';

  return (
    <div className="atmosphere-overlay" aria-hidden="true">
      <div
        className="atmosphere-vignette"
        style={{
          background: isWine
            ? 'radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(10, 6, 2, 0.72) 100%)'
            : 'radial-gradient(ellipse at 50% 85%, rgba(232, 83, 28, 0.18) 0%, transparent 45%), radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(8, 5, 3, 0.8) 100%)',
        }}
      />

      {!reducedMotion && isWine && WINE_MOTES.map((m, i) => (
        <span
          key={i}
          className="atmosphere-mote"
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            background: accent,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}

      {!reducedMotion && !isWine && FIRE_EMBERS.map((e, i) => (
        <span
          key={i}
          className="atmosphere-ember"
          style={{
            left: e.left,
            bottom: e.bottom,
            background: accent,
            boxShadow: `0 0 8px ${accent}`,
            animationDelay: `${e.delay}s`,
            '--ember-drift': `${e.drift}px`,
          }}
        />
      ))}

      {!reducedMotion && !isWine && (
        <div className="atmosphere-heat-shimmer" />
      )}
    </div>
  );
}

export default AtmosphereOverlay;
