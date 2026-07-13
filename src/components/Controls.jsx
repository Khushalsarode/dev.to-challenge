import { VESSELS } from '../config/vessels';
import { downloadLabel } from '../utils/download';
import { buildTwitterShareUrl } from '../utils/share';
import {
  IconVolume, IconDownload, IconShare, IconReset,
} from './icons/Icons';

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

  return (
    <div className="artifact-controls">
      {audioUrl && (
        <button
          type="button"
          className="control-btn control-btn--secondary"
          style={{ '--btn-accent': v.accentUi, color: v.parchment }}
          onClick={handleReplay}
        >
          <IconVolume size={16} />
          Listen again
        </button>
      )}
      <button
        type="button"
        className="control-btn control-btn--secondary"
        style={{ '--btn-accent': v.accentUi, color: v.parchment }}
        onClick={handleDownload}
      >
        <IconDownload />
        Download
      </button>
      <button
        type="button"
        className="control-btn control-btn--secondary"
        style={{ '--btn-accent': v.accentUi, color: v.parchment }}
        onClick={handleShare}
      >
        <IconShare />
        Share
      </button>
      <button
        type="button"
        className="control-btn control-btn--primary"
        style={{ '--btn-accent': v.accentUi, '--btn-ink': v.bg }}
        onClick={onReset}
      >
        <IconReset />
        Try Another
      </button>
    </div>
  );
}

export default Controls;
