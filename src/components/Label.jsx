import { getAccentColor } from '../utils/colorMood';
import { VESSELS } from '../config/vessels';

function Label({ vessel, labelData, accentOverride = 'auto', backgroundImage }) {
  const f = VESSELS[vessel].fields;
  const mood = accentOverride !== 'auto' ? accentOverride : labelData.color_mood;
  const accentColor = getAccentColor(vessel, mood);
  const isWine = vessel === 'wine';
  const titleFont = isWine ? "'Cormorant Garamond'" : "'Cinzel'";

  return (
    <div
      className={`certificate certificate--${vessel} label-card label-artifact`}
      style={{ '--cert-accent': accentColor }}
      role="img"
      aria-label={`${isWine ? 'Wine label' : 'Forge mark'} for passion: ${labelData[f.title]}`}
    >
      {backgroundImage && (
        <div className="certificate-bg-art" style={{ backgroundImage: `url(${backgroundImage})` }} aria-hidden="true" />
      )}
      <div className="certificate-grain" aria-hidden="true" />

      <span className="certificate-corner certificate-corner--tl" aria-hidden="true" />
      <span className="certificate-corner certificate-corner--tr" aria-hidden="true" />
      <span className="certificate-corner certificate-corner--bl" aria-hidden="true" />
      <span className="certificate-corner certificate-corner--br" aria-hidden="true" />

      <div className="certificate-inner">
        <header className="certificate-header">
          <h2 className="certificate-title" style={{ fontFamily: titleFont }}>
            {labelData[f.title]}
          </h2>
          <p className="certificate-subtitle">{labelData[f.subtitle]}</p>
        </header>

        {isWine ? (
          <div className="certificate-rule certificate-rule--ornament" aria-hidden="true">
            <span />
            <em>&#10022;</em>
            <span />
          </div>
        ) : (
          <div className="certificate-rule" aria-hidden="true" />
        )}

        <section className="certificate-notes">
          <span className="certificate-eyebrow">{f.labels.body}</span>
          <p>{labelData[f.body]}</p>
        </section>

        <div className="certificate-stats">
          <div className="certificate-stat">
            <span className="certificate-eyebrow">{f.labels.tag}</span>
            <p>{labelData[f.tag]}</p>
          </div>
          <div className="certificate-stat-divider" aria-hidden="true" />
          <div className="certificate-stat">
            <span className="certificate-eyebrow">{f.labels.extra}</span>
            <p>{labelData[f.extra]}</p>
          </div>
        </div>

        <div className="certificate-rule" aria-hidden="true" />

        <footer className="certificate-footer">
          <div className="certificate-footer-text">
            <span className="certificate-eyebrow">{f.yearPrefix}</span>
            <p className="certificate-year">{labelData[f.year]}</p>
          </div>

          <div className={`certificate-seal ${isWine ? 'wax-seal' : 'ember-seal'}`}>
            <span className="certificate-seal-mark">{isWine ? 'P·U' : '⚒'}</span>
          </div>
        </footer>

        <p className="certificate-closer">{labelData[f.closer]}</p>
      </div>
    </div>
  );
}

export default Label;
