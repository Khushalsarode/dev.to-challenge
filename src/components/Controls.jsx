import { VESSELS } from '../config/vessels';
import { downloadLabel } from '../utils/download';
import { buildTwitterShareUrl } from '../utils/share';

function Controls({ vessel, passion, labelData, audioUrl, volume = 0.45, labelRef, onReset }) {
  const v = VESSELS[vessel];

  function handleReplay() {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.volume = volume;
    audio.play().catch(() => {});
  }

  async function handleDownload() {
    await downloadLabel(labelRef, passion, vessel);
  }

  function handleShare() {
    const url = buildTwitterShareUrl(passion, vessel, labelData, window.location.href);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const buttonStyle = {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 14,
    padding: '10px 16px',
    border: `1px solid ${v.accentUi}`,
    borderRadius: 0,
    background: 'transparent',
    color: v.parchment,
  };

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
      {audioUrl && (
        <button type="button" style={buttonStyle} onClick={handleReplay}>
          🔊 Replay
        </button>
      )}
      <button type="button" style={buttonStyle} onClick={handleDownload}>
        ⬇ Download
      </button>
      <button type="button" style={buttonStyle} onClick={handleShare}>
        🐦 Share on X
      </button>
      <button type="button" style={{ ...buttonStyle, borderColor: `${v.accentUi}66`, opacity: 0.7 }} onClick={onReset}>
        ↺ Try Another
      </button>
    </div>
  );
}

export default Controls;
