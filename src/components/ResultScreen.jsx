import { useEffect, useRef } from 'react';
import { VESSELS } from '../config/vessels';
import { getAccentColor } from '../utils/colorMood';
import { useTilt } from '../hooks/useTilt';
import VesselBottle from './VesselBottle';
import Label from './Label';
import Controls from './Controls';

function ResultScreen({
  vessel, passion, labelData, audioUrl, backgroundImage, vesselPhoto,
  accentOverride = 'auto', volume = 0.45, narrationEnabled = true,
  reducedMotion = false, onReset,
}) {
  const v = VESSELS[vessel];
  const labelRef = useRef(null);
  const { ref: tiltRef, handleMouseMove, handleMouseLeave } = useTilt({ max: 8, disabled: reducedMotion });

  const mood = accentOverride !== 'auto' ? accentOverride : labelData.color_mood;
  const accentColor = getAccentColor(vessel, mood);

  useEffect(() => {
    if (!audioUrl || !narrationEnabled) return;
    const audio = new Audio(audioUrl);
    audio.volume = volume; // Quiet auto-play — never jarring
    audio.play().catch(() => {}); // Silently swallow autoplay-policy errors; button still works
  }, [audioUrl, narrationEnabled, volume]);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: v.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        gap: 24,
      }}
    >
      <p
        style={{
          fontFamily: "'Cormorant Garamond'",
          fontStyle: 'italic',
          fontSize: 20,
          color: v.parchment,
          textAlign: 'center',
          margin: 0,
        }}
      >
        Your {vessel === 'wine' ? 'vintage' : 'forge mark'} of: <strong>{passion}</strong>
      </p>

      <div
        className="result-layout"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div className="vessel-silhouette" style={{ display: 'none' }}>
          {vesselPhoto ? (
            <img
              src={vesselPhoto}
              alt={vessel === 'wine' ? 'AI-generated photograph of the wine bottle' : 'AI-generated photograph of the forge mark'}
              className={reducedMotion ? '' : 'label-card'}
              style={{ width: 220, height: 'auto', maxHeight: 460, objectFit: 'cover', boxShadow: `0 12px 40px ${accentColor}33` }}
            />
          ) : (
            <VesselBottle
              vessel={vessel}
              accentColor={accentColor}
              intensityText={vessel === 'fire' ? labelData.intensity : undefined}
              reveal
              reducedMotion={reducedMotion}
            />
          )}
        </div>
        <div
          ref={(el) => { labelRef.current = el; tiltRef.current = el; }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="tilt-container"
          style={{ width: 'min(88vw, 340px)' }}
        >
          <Label vessel={vessel} labelData={labelData} accentOverride={accentOverride} backgroundImage={backgroundImage} />
        </div>
      </div>

      <Controls
        vessel={vessel}
        passion={passion}
        labelData={labelData}
        audioUrl={narrationEnabled ? audioUrl : null}
        volume={volume}
        labelRef={labelRef}
        onReset={onReset}
      />

      <style>{`
        @media (min-width: 900px) {
          .vessel-silhouette { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default ResultScreen;
