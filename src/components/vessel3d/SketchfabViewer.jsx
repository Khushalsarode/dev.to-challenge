import { SKETCHFAB_MODELS, buildSketchfabEmbedUrl } from '../../config/sketchfab';

function SketchfabViewer({
  vessel,
  height = 420,
  showCredit = false,
}) {
  const model = SKETCHFAB_MODELS[vessel];
  const src = buildSketchfabEmbedUrl(model.uid, { autospin: 0, backdrop: true });

  return (
    <div className="sketchfab-viewer sketchfab-viewer--inline" style={{ width: '100%', height, position: 'relative' }}>
      <iframe
        title={`${vessel === 'wine' ? 'Wine bottle' : 'Forge anvil'} 3D model`}
        src={src}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        loading="lazy"
        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
      />
      {showCredit && (
        <a className="sketchfab-credit" href={model.creditUrl} target="_blank" rel="noopener noreferrer">
          3D: {model.credit} · Sketchfab
        </a>
      )}
    </div>
  );
}

export default SketchfabViewer;
