import { VESSELS } from '../config/vessels';
import { useSettings } from '../context/SettingsContext';
import { startAmbient, stopAmbient } from '../services/ambientSound';

function NavBar({ vessel, onReset, onOpenSettings, onOpenGallery, galleryCount }) {
  const { settings, updateSettings } = useSettings();
  const v = vessel ? VESSELS[vessel] : null;
  const textColor = v ? v.parchment : '#F2E8D5';
  const accent = v ? v.accentUi : '#B87333';
  const bg = v ? `${v.bg}CC` : 'rgba(26, 18, 9, 0.8)';

  function toggleAmbient() {
    const nextMuted = !settings.ambientMuted;
    updateSettings({ ambientMuted: nextMuted });
    if (nextMuted) {
      stopAmbient();
    } else {
      startAmbient(vessel || 'wine', settings.ambientVolume);
    }
  }

  const iconButtonStyle = {
    background: 'transparent',
    border: `1px solid ${accent}55`,
    color: textColor,
    width: 36,
    height: 36,
    borderRadius: 0,
    fontSize: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: bg,
        backdropFilter: 'blur(6px)',
        borderBottom: `1px solid ${accent}33`,
        transition: 'background 0.4s ease',
      }}
    >
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset and return to landing"
        style={{
          background: 'transparent',
          border: 'none',
          color: textColor,
          fontFamily: "'Cormorant Garamond'",
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span aria-hidden="true">🍷🔥</span>
        Passion Uncorked
      </button>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={toggleAmbient}
          aria-label={settings.ambientMuted ? 'Enable ambient sound' : 'Mute ambient sound'}
          aria-pressed={!settings.ambientMuted}
          style={iconButtonStyle}
        >
          {settings.ambientMuted ? '🔇' : '🔊'}
        </button>
        <button type="button" onClick={onOpenGallery} aria-label="Open gallery" style={iconButtonStyle}>
          🖼
          {galleryCount > 0 && (
            <span
              style={{
                position: 'absolute', top: -6, right: -6,
                background: accent, color: v ? v.bg : '#1A1209',
                borderRadius: '50%', width: 16, height: 16,
                fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Inter',
              }}
            >
              {galleryCount > 9 ? '9+' : galleryCount}
            </span>
          )}
        </button>
        <button type="button" onClick={onOpenSettings} aria-label="Open settings" style={iconButtonStyle}>
          ⚙
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
