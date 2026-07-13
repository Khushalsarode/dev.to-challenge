import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SketchfabFrame from './vessel3d/SketchfabFrame';
import SketchfabCredit from './vessel3d/SketchfabCredit';

function VesselShowcase({
  highlightVessel = null,
  accentColor,
  moodTint = null,
  parchment,
  reducedMotion = false,
  variant = 'landing',
  activeVessel = null,
  centerContent = null,
  resultVisual = null,
}) {
  const containerRef = useRef(null);
  const winePanelRef = useRef(null);
  const firePanelRef = useRef(null);
  const [cycleIndex, setCycleIndex] = useState(0);
  const isResult = variant === 'result';

  const emphasizedVessel = isResult
    ? activeVessel
    : (highlightVessel ?? (cycleIndex === 0 ? 'wine' : 'fire'));

  useEffect(() => {
    if (reducedMotion || isResult) return undefined;
    const timer = setInterval(() => {
      setCycleIndex((i) => (i + 1) % 2);
    }, 4200);
    return () => clearInterval(timer);
  }, [reducedMotion, isResult]);

  useEffect(() => {
    if (reducedMotion || !winePanelRef.current || !firePanelRef.current) return;

    const wineActive = emphasizedVessel === 'wine';
    const inactiveOpacity = isResult ? 0.55 : 0.42;
    const inactiveScale = isResult ? 0.92 : 0.94;

    gsap.to(winePanelRef.current, {
      opacity: wineActive ? 1 : inactiveOpacity,
      scale: wineActive ? 1 : inactiveScale,
      filter: wineActive ? 'brightness(1)' : 'brightness(0.78)',
      duration: 0.9,
      ease: 'power2.inOut',
    });
    gsap.to(firePanelRef.current, {
      opacity: wineActive ? inactiveOpacity : 1,
      scale: wineActive ? inactiveScale : 1,
      filter: wineActive ? 'brightness(0.78)' : 'brightness(1.05)',
      duration: 0.9,
      ease: 'power2.inOut',
    });
  }, [emphasizedVessel, reducedMotion, isResult]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return undefined;

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const parallax = isResult ? 10 : 18;

      if (winePanelRef.current) {
        gsap.to(winePanelRef.current, {
          x: px * -parallax,
          y: py * -10,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
      if (firePanelRef.current) {
        gsap.to(firePanelRef.current, {
          x: px * parallax,
          y: py * -10,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    }

    function onLeave() {
      gsap.to([winePanelRef.current, firePanelRef.current], {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      });
    }

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [reducedMotion, isResult]);

  const winePanel = (
    <article
      ref={winePanelRef}
      className={`vessel-showcase-panel vessel-showcase-panel--wine ${emphasizedVessel === 'wine' ? 'is-active' : ''}`}
    >
      {isResult && activeVessel === 'wine' && resultVisual ? (
        <div className="vessel-showcase-illustration">{resultVisual}</div>
      ) : (
        <SketchfabFrame
          vessel="wine"
          compact={isResult}
          tint={isResult && emphasizedVessel === 'wine' ? moodTint : null}
        />
      )}
      {!isResult && (
        <div className="vessel-showcase-label" style={{ color: parchment }}>
          <span className="vessel-showcase-label-title">Age in wine</span>
          <span className="vessel-showcase-label-sub">Devotion · patience · depth</span>
        </div>
      )}
      <SketchfabCredit vessel="wine" />
    </article>
  );

  const firePanel = (
    <article
      ref={firePanelRef}
      className={`vessel-showcase-panel vessel-showcase-panel--fire ${emphasizedVessel === 'fire' ? 'is-active' : ''}`}
    >
      {isResult && activeVessel === 'fire' && resultVisual ? (
        <div className="vessel-showcase-illustration">{resultVisual}</div>
      ) : (
        <SketchfabFrame
          vessel="fire"
          compact={isResult}
          tint={isResult && emphasizedVessel === 'fire' ? moodTint : null}
        />
      )}
      {!isResult && (
        <div className="vessel-showcase-label" style={{ color: parchment }}>
          <span className="vessel-showcase-label-title">Forge in fire</span>
          <span className="vessel-showcase-label-sub">Intensity · edge · heat</span>
        </div>
      )}
      <SketchfabCredit vessel="fire" />
    </article>
  );

  return (
    <section
      className={`vessel-showcase ${isResult ? 'vessel-showcase--result' : ''}`}
      ref={containerRef}
      aria-label="Interactive 3D vessels"
    >
      {!isResult && (
        <p className="vessel-showcase-eyebrow" style={{ color: parchment, borderColor: `${accentColor}44` }}>
          The vessels
        </p>
      )}

      <div className={`vessel-showcase-stage ${isResult ? 'vessel-showcase-stage--result' : ''}`}>
        {winePanel}
        {!isResult && (
          <div className="vessel-showcase-divider" style={{ background: `${accentColor}33` }} aria-hidden="true" />
        )}
        {isResult && centerContent && (
          <div className="vessel-showcase-center">{centerContent}</div>
        )}
        {firePanel}
      </div>

      {!isResult && (
        <p className="vessel-showcase-hint" style={{ color: parchment }}>
          Drag to explore · cycles between vessels
        </p>
      )}
    </section>
  );
}

export default VesselShowcase;
