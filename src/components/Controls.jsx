import { VESSELS } from '../config/vessels';
import { downloadLabel } from '../utils/download';
import { buildTwitterShareUrl } from '../utils/share';
import { IconReplay, IconDownload, IconShare, IconReset } from './icons/Icons';

function Controls({
  vessel, passion, labelData, audioUrl, volume = 0.45, labelRef, compositeRef, onReset,
}) {
  const v = VESSELS[vessel];

  function handleReplay() {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.volume = volume;
    audio.play().catch(() => {});
  }

  async function handleDownload() {
    await downloadLabel(compositeRef || labelRef, passion, vessel);
  }

  function handleShare() {
    const url = buildTwitterShareUrl(passion, vessel, labelData, window.location.href);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const buttonStyle = {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 16,
    padding: '12px 18px',
    border: `1px solid ${v.accentUi}`,
    borderRadius: 0,
    background: 'transparent',
    color: v.parchment,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    letterSpacing: '0.03em',
  };

  return (
    <div
      className="artifact-controls"
      style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 8,
      }}
    >
      {audioUrl && (
        <button type="button" style={buttonStyle} onClick={handleReplay}>
          <IconReplay />
          Replay
        </button>
      )}
      <button type="button" style={buttonStyle} onClick={handleDownload}>
        <IconDownload />
        Download
      </button>
      <button type="button" style={buttonStyle} onClick={handleShare}>
        <IconShare />
        Share
      </button>
      <button
        type="button"
        style={{ ...buttonStyle, borderColor: `${v.accentUi}66`, opacity: 0.8 }}
        onClick={onReset}
      >
        <IconReset />
        Try Another
      </button>
    </div>
  );
}

export default Controls;
