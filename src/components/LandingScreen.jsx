import { useState, useRef } from 'react';
import { VESSELS, PASSION_CHIPS } from '../config/vessels';
import BrandMark from './icons/BrandMark';
import { WineBadge, FireBadge } from './icons/Icons';
import VesselShowcase from './VesselShowcase';
import WorkflowShowcase from './WorkflowShowcase';

function LandingScreen({ onSubmit, error, previewVessel, setPreviewVessel, reducedMotion = false }) {
  const [passion, setPassion] = useState('');
  const [vessel, setVessel] = useState(null);
  const inputRef = useRef(null);

  const activeVessel = vessel || previewVessel || 'wine';
  const v = VESSELS[activeVessel];
  const highlightVessel = vessel || previewVessel || null;

  function handleChip(chip) {
    setPassion(chip);
    inputRef.current?.focus();
  }

  function handleVesselClick(chosenVessel) {
    setVessel(chosenVessel);
    setPreviewVessel(chosenVessel);
    if (passion.trim().length >= 2) {
      onSubmit(passion, chosenVessel);
    } else {
      inputRef.current?.focus();
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (vessel && passion.trim().length >= 2) {
      onSubmit(passion, vessel);
    }
  }

  return (
    <div className="screen-landing screen-overlay">
      <div className="landing-layout">
        <VesselShowcase
          highlightVessel={highlightVessel}
          accentColor={v.accentUi}
          parchment={v.parchment}
          reducedMotion={reducedMotion}
        />

        <div className="landing-grid">
          <div className="landing-main">
            <div className="landing-copy">
              <BrandMark size={64} wineColor={v.accentUi} fireColor={VESSELS.fire.accentUi} />

              <h1 className="landing-title" style={{ color: v.parchment }}>
                Passion Uncorked
              </h1>
              <p className="landing-tagline" style={{ color: v.parchment }}>
                Every passion is either aged or forged.
              </p>

              <form onSubmit={handleFormSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={60}
                  placeholder='e.g. "open source"'
                  aria-label="What are you passionate about"
                  value={passion}
                  onChange={(e) => setPassion(e.target.value)}
                  className="landing-input"
                  style={{
                    borderBottomColor: v.accentUi,
                    color: v.parchment,
                  }}
                />

                <div className="landing-vessel-buttons">
                  {Object.values(VESSELS).map((vesselOption) => {
                    const selected = vessel === vesselOption.key;
                    const hovered = previewVessel === vesselOption.key;
                    const isWine = vesselOption.key === 'wine';
                    return (
                      <button
                        key={vesselOption.key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleVesselClick(vesselOption.key)}
                        onMouseEnter={() => setPreviewVessel(vesselOption.key)}
                        onMouseLeave={() => setPreviewVessel(vessel)}
                        onFocus={() => setPreviewVessel(vesselOption.key)}
                        onBlur={() => setPreviewVessel(vessel)}
                        className={[
                          'vessel-cta',
                          `vessel-cta--${vesselOption.key}`,
                          selected ? 'is-selected' : '',
                          hovered ? 'is-hovered' : '',
                        ].filter(Boolean).join(' ')}
                      >
                        <span className="vessel-cta-frame" aria-hidden="true" />
                        <span className="vessel-cta-glow" aria-hidden="true" />
                        <span className="vessel-cta-shimmer" aria-hidden="true" />
                        {selected && (
                          <span className="vessel-cta-badge" aria-hidden="true">Chosen</span>
                        )}

                        <span className="vessel-cta-icon">
                          {isWine ? (
                            <WineBadge size={30} color={hovered || selected ? '#D4AF37' : '#B87333'} />
                          ) : (
                            <FireBadge size={30} color={hovered || selected ? '#FF8A3D' : '#E8531C'} />
                          )}
                        </span>

                        <span className="vessel-cta-copy">
                          <span className="vessel-cta-label">{vesselOption.label}</span>
                          <span className="vessel-cta-sub">{vesselOption.ctaSubtitle}</span>
                        </span>

                        <span className="vessel-cta-arrow" aria-hidden="true">→</span>
                      </button>
                    );
                  })}
                </div>
              </form>

              {error && (
                <p className="fade-in landing-error">{error}</p>
              )}

              <div className="landing-chips">
                <p className="landing-chips-label" style={{ color: v.parchment }}>Try these passions</p>
                <div className="landing-chips-row">
                  {PASSION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChip(chip)}
                      className="passion-chip"
                      style={{
                        borderColor: `${v.accentUi}55`,
                        color: v.parchment,
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="landing-aside">
            <WorkflowShowcase
              accentColor={v.accentUi}
              parchment={v.parchment}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </div>

      <div className="landing-footer">Google AI · ElevenLabs</div>
    </div>
  );
}

export default LandingScreen;
