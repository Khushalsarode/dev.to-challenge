import { useEffect, useMemo, useState } from 'react';
import { VESSELS } from '../config/vessels';

function LoadingScreen({ vessel, aiArtEnabled = false, reducedMotion = false }) {
  const v = VESSELS[vessel];
  const copy = useMemo(
    () => (aiArtEnabled ? [...v.loadingCopy, 'Painting the label…'] : v.loadingCopy),
    [v.loadingCopy, aiArtEnabled]
  );
  const [copyIndex, setCopyIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCopyIndex((i) => (i + 1) % copy.length);
    }, 900);
    return () => clearInterval(interval);
  }, [copy.length]);

  const isWine = vessel === 'wine';

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: v.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: 24,
      }}
    >
      <div style={{ position: 'relative', width: 120, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isWine ? (
          <div
            className={reducedMotion ? '' : 'cork-pop'}
            style={{
              width: 24,
              height: 36,
              background: v.gold,
              borderRadius: '4px 4px 2px 2px',
            }}
          />
        ) : (
          <div
            className={reducedMotion ? '' : 'ember-pulse'}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: v.primary,
              boxShadow: `0 0 30px 10px ${v.primary}`,
            }}
          />
        )}
      </div>

      <p
        key={copyIndex}
        className={reducedMotion ? '' : 'fade-in'}
        style={{
          fontFamily: 'EB Garamond',
          fontStyle: 'italic',
          fontSize: 16,
          color: v.parchment,
          minHeight: 24,
        }}
      >
        {copy[copyIndex]}
      </p>

      <div style={{ width: 240, height: 2, background: `${v.accentUi}33`, overflow: 'hidden' }}>
        <div className={reducedMotion ? '' : 'progress-fill'} style={{ height: '100%', background: v.accentUi }} />
      </div>
    </div>
  );
}

export default LoadingScreen;
