import SketchfabViewer from './vessel3d/SketchfabViewer';
import VesselBottle from './VesselBottle';

function VesselHero({
  vessel,
  accentColor,
  intensityText,
  reveal = false,
  reducedMotion = false,
  height = 420,
  interactive = true,
  showCredit = true,
}) {
  if (reducedMotion) {
    return (
      <div className="vessel-hero-fallback" style={{ display: 'flex', justifyContent: 'center', height }}>
        <VesselBottle
          vessel={vessel}
          accentColor={accentColor}
          intensityText={intensityText}
          reveal={reveal}
          reducedMotion
        />
      </div>
    );
  }

  return (
    <SketchfabViewer
      vessel={vessel}
      height={height}
      autospin={interactive ? 0.08 : 0.14}
      showHint={interactive}
      showCredit={showCredit}
    />
  );
}

export default VesselHero;
