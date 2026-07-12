import { useEffect, useMemo, useState } from 'react';
import { VESSELS } from '../config/vessels';

function LoadingScreen({ vessel, aiArtEnabled = false, reducedMotion = false }) {
  const v = VESSELS[vessel];
  const copy = useMemo(
    () => (aiArtEnabled ? [...v.loadingCopy, 'Painting the label…'] : v.loadingCopy),
    [v.loadingCopy, aiArtEnabled],
  );
  const [copyIndex, setCopyIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCopyIndex((i) => (i + 1) % copy.length);
    }, 900);
    return () => clearInterval(interval);
  }, [copy.length]);

  return (
    <div className={`screen-loading screen-overlay screen-loading--${vessel}`}>
      <div className="screen-loading-content">
        <div className={`loading-orb loading-orb--${vessel}`} aria-hidden="true" />

        <p
          key={copyIndex}
          className={`loading-copy ${reducedMotion ? '' : 'fade-in'} loading-copy--${vessel}`}
          style={{ color: v.parchment }}
        >
          {copy[copyIndex]}
        </p>

        <div className={`loading-progress loading-progress--${vessel}`} style={{ background: `${v.accentUi}33` }}>
          <div className={reducedMotion ? '' : 'progress-fill'} style={{ background: v.accentUi }} />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
