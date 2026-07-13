import { useEffect, useRef } from 'react';
import { syncSketchfabWrapper, hideSketchfabWrapper } from './sketchfabIframeCache';

function SketchfabFrame({ vessel, compact = false, tint = null }) {
  const slotRef = useRef(null);
  const tintRef = useRef(tint);
  tintRef.current = tint;

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return undefined;
    const panel = slot.closest('.vessel-showcase-panel');

    let rafId;
    function tick() {
      const rect = slot.getBoundingClientRect();
      const computed = panel ? window.getComputedStyle(panel) : null;
      syncSketchfabWrapper(vessel, {
        rect,
        opacity: computed?.opacity,
        filter: computed?.filter,
        tint: tintRef.current,
      });
      rafId = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      hideSketchfabWrapper(vessel);
    };
  }, [vessel]);

  return (
    <div className={`sketchfab-frame ${compact ? 'sketchfab-frame--compact' : ''}`}>
      <div className="sketchfab-frame-viewport" ref={slotRef} />
      <div className="sketchfab-frame-mask sketchfab-frame-mask--top" />
      <div className="sketchfab-frame-mask sketchfab-frame-mask--bottom" />
      <div className="sketchfab-frame-mask sketchfab-frame-mask--corner-tl" />
      <div className="sketchfab-frame-mask sketchfab-frame-mask--corner-tr" />
      <div className="sketchfab-frame-mask sketchfab-frame-mask--corner-bl" />
    </div>
  );
}

export default SketchfabFrame;
