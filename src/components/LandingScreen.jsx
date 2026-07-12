import { useState, useRef } from 'react';
import { VESSELS, PASSION_CHIPS } from '../config/vessels';

function Particles({ vessel }) {
  const isWine = vessel === 'wine';
  const color = isWine ? '#F2E8D5' : '#FF8A3D';
  const positions = [
    { left: '15%', bottom: '10%', delay: '0s' },
    { left: '50%', bottom: '20%', delay: '2s' },
    { left: '80%', bottom: '5%', delay: '4s' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {positions.map((p, i) => (
        <div
          key={i}
          className="float-particle"
          style={{
            position: 'absolute',
            left: p.left,
            bottom: p.bottom,
            animationDelay: p.delay,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: color,
          }}
        />
      ))}
    </div>
  );
}

function LandingScreen({ onSubmit, error, previewVessel, setPreviewVessel }) {
  const [passion, setPassion] = useState('');
  const [vessel, setVessel] = useState(null);
  const inputRef = useRef(null);

  const activeVessel = vessel || previewVessel || 'wine';
  const v = VESSELS[activeVessel];

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
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 56px)',
        background: v.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        transition: 'background 0.4s ease',
        overflow: 'hidden',
      }}
    >
      <Particles vessel={activeVessel} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 480, width: '100%' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🍷🔥</div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond'",
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 'clamp(36px, 6vw, 48px)',
            color: v.parchment,
            margin: 0,
          }}
        >
          Passion Uncorked
        </h1>
        <p
          style={{
            fontFamily: "'Cormorant Garamond'",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 22,
            color: v.parchment,
            opacity: 0.65,
            margin: '8px 0 40px',
          }}
        >
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
            style={{
              width: '100%',
              maxWidth: 420,
              fontFamily: 'EB Garamond',
              fontSize: 20,
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${v.accentUi}`,
              borderRadius: 0,
              color: v.parchment,
              padding: '10px 4px',
              textAlign: 'center',
            }}
          />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            {Object.values(VESSELS).map((vesselOption) => {
              const selected = vessel === vesselOption.key;
              return (
                <button
                  key={vesselOption.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handleVesselClick(vesselOption.key)}
                  onMouseEnter={() => setPreviewVessel(vesselOption.key)}
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: 15,
                    padding: '12px 20px',
                    border: `1px solid ${selected ? vesselOption.primary : `${vesselOption.accentUi}66`}`,
                    borderRadius: 0,
                    background: selected ? vesselOption.primary : 'transparent',
                    color: selected ? vesselOption.parchment : vesselOption.parchment,
                    opacity: selected ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {vesselOption.label}
                </button>
              );
            })}
          </div>
        </form>

        {error && (
          <p
            className="fade-in"
            style={{ fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 14, color: '#E74C3C', marginTop: 16 }}
          >
            {error}
          </p>
        )}

        <div style={{ marginTop: 40 }}>
          <p style={{ fontFamily: 'Inter', fontSize: 11, opacity: 0.4, color: v.parchment, marginBottom: 10 }}>
            — Try these passions —
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {PASSION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChip(chip)}
                style={{
                  fontFamily: 'Inter',
                  fontSize: 13,
                  padding: '6px 14px',
                  border: `1px solid ${v.accentUi}66`,
                  borderRadius: 0,
                  background: 'transparent',
                  color: v.parchment,
                  opacity: 0.7,
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          fontFamily: 'Inter',
          fontSize: 11,
          color: v.parchment,
          opacity: 0.28,
        }}
      >
        Powered by Google AI + ElevenLabs
      </div>
    </div>
  );
}

export default LandingScreen;
