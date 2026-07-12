import { SKETCHFAB_MODELS, buildSketchfabEmbedUrl } from '../../config/sketchfab';

function SketchfabFrame({ vessel, compact = false }) {
  const model = SKETCHFAB_MODELS[vessel];
  const src = buildSketchfabEmbedUrl(model.uid, { autospin: 0, backdrop: true });

  return (
    <div className={`sketchfab-frame ${compact ? 'sketchfab-frame--compact' : ''}`}>
      <div className="sketchfab-frame-viewport">
        <iframe
          title={vessel === 'wine' ? 'Wine bottle 3D model' : 'Forge anvil 3D model'}
          src={src}
          loading="lazy"
          tabIndex={-1}
          allow="autoplay; fullscreen; xr-spatial-tracking"
        />
      </div>
      <div className="sketchfab-frame-mask sketchfab-frame-mask--top" />
      <div className="sketchfab-frame-mask sketchfab-frame-mask--bottom" />
      <div className="sketchfab-frame-mask sketchfab-frame-mask--corner-tl" />
      <div className="sketchfab-frame-mask sketchfab-frame-mask--corner-tr" />
      <div className="sketchfab-frame-mask sketchfab-frame-mask--corner-bl" />
    </div>
  );
}

export default SketchfabFrame;
