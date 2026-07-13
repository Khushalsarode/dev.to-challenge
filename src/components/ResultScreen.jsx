import { useEffect, useRef } from 'react';
import { VESSELS } from '../config/vessels';
import { getAccentColor } from '../utils/colorMood';
import { useTilt } from '../hooks/useTilt';
import Label from './Label';
import Controls from './Controls';
import VesselShowcase from './VesselShowcase';
import VesselBottle from './VesselBottle';

function ResultScreen({
  vessel, passion, labelData, audioUrl, backgroundImage, vesselPhoto,
  accentOverride = 'auto', volume = 0.45, narrationEnabled = true,
  reducedMotion = false, onReset,
}) {
  const v = VESSELS[vessel];
  const f = v.fields;
  const compositeRef = useRef(null);
  const labelRef = useRef(null);
  const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useTilt({ max: 14, disabled: reducedMotion });

  const mood = accentOverride !== 'auto' ? accentOverride : labelData.color_mood;
  const accentColor = getAccentColor(vessel, mood);

  useEffect(() => {
    if (!audioUrl || !narrationEnabled) return;
    const audio = new Audio(audioUrl);
    audio.volume = volume;
    audio.play().catch(() => {});
  }, [audioUrl, narrationEnabled, volume]);

  const labelNode = (
    <div
      ref={(el) => { labelRef.current = el; tiltRef.current = el; }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="artifact-label tilt-container artifact-label--result"
    >
      <Label
        vessel={vessel}
        labelData={labelData}
        accentOverride={accentOverride}
        backgroundImage={backgroundImage}
      />
    </div>
  );

  return (
    <div className={`screen-result screen-overlay screen-result--${vessel}`}>
      <div className="screen-result-content">
        <div className="result-headline-block">
          <p className="result-eyebrow" style={{ color: accentColor }}>
            Your {vessel === 'wine' ? 'vintage' : 'forge mark'} of
          </p>
          <h1 className="result-title" style={{ color: v.parchment }}>
            {passion}
          </h1>
        </div>

        <div ref={compositeRef} className="artifact-composite artifact-composite--with-vessels">
          {vesselPhoto && (
            <img
              src={vesselPhoto}
              alt={vessel === 'wine' ? 'AI-generated photograph of the wine bottle' : 'AI-generated photograph of the forge mark'}
              className="artifact-ai-photo artifact-ai-photo--banner"
              style={{ boxShadow: `0 16px 48px ${accentColor}44` }}
            />
          )}

          <VesselShowcase
            variant="result"
            activeVessel={vessel}
            accentColor={accentColor}
            moodTint={accentColor}
            parchment={v.parchment}
            reducedMotion={reducedMotion}
            centerContent={labelNode}
            resultVisual={!vesselPhoto ? (
              <VesselBottle
                vessel={vessel}
                accentColor={accentColor}
                intensityText={vessel === 'fire' ? labelData[f.tag] : undefined}
                reveal
                reducedMotion={reducedMotion}
              />
            ) : null}
          />
        </div>

        <Controls
          vessel={vessel}
          passion={passion}
          labelData={labelData}
          audioUrl={narrationEnabled ? audioUrl : null}
          volume={volume}
          labelRef={labelRef}
          compositeRef={compositeRef}
          onReset={onReset}
        />
      </div>
    </div>
  );
}

export default ResultScreen;
