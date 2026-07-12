import { SKETCHFAB_MODELS, buildSketchfabEmbedUrl } from '../config/sketchfab';

function SiteBackdrop3D({ focusVessel = 'wine', reducedMotion = false }) {
  if (reducedMotion) return null;

  const wineSrc = buildSketchfabEmbedUrl(SKETCHFAB_MODELS.wine.uid, { autospin: 0, backdrop: true });
  const fireSrc = buildSketchfabEmbedUrl(SKETCHFAB_MODELS.fire.uid, { autospin: 0, backdrop: true });

  return (
    <div className="site-backdrop-3d" data-focus={focusVessel} aria-hidden="true">
      <div className="site-backdrop-model site-backdrop-model--wine">
        <iframe
          title="Wine bottle 3D model"
          src={wineSrc}
          tabIndex={-1}
          loading="eager"
          allow="autoplay; fullscreen; xr-spatial-tracking"
        />
      </div>

      <div className="site-backdrop-model site-backdrop-model--fire">
        <iframe
          title="Forge anvil 3D model"
          src={fireSrc}
          tabIndex={-1}
          loading="eager"
          allow="autoplay; fullscreen; xr-spatial-tracking"
        />
      </div>

      <div className="site-backdrop-scrim" />
      <div className="site-backdrop-vignette" />

      <div className="site-backdrop-credits">
        <a href={SKETCHFAB_MODELS.wine.creditUrl} target="_blank" rel="noopener noreferrer">
          Bottle: {SKETCHFAB_MODELS.wine.credit}
        </a>
        <span aria-hidden="true"> · </span>
        <a href={SKETCHFAB_MODELS.fire.creditUrl} target="_blank" rel="noopener noreferrer">
          Anvil: {SKETCHFAB_MODELS.fire.credit}
        </a>
        <span aria-hidden="true"> · Sketchfab</span>
      </div>
    </div>
  );
}

export default SiteBackdrop3D;
