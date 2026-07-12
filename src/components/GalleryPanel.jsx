import Drawer from './Drawer';
import { VESSELS } from '../config/vessels';
import { WineBadge, FireBadge } from './icons/Icons';

function GalleryPanel({ open, onClose, vessel, entries, onSelect, onDelete, onClearAll }) {
  const v = VESSELS[vessel || 'wine'];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Gallery (${entries.length})`}
      accentColor={v.accentUi}
      bg={v.bg}
      textColor={v.parchment}
    >
      {entries.length === 0 ? (
        <p style={{ fontFamily: 'EB Garamond', fontStyle: 'italic', opacity: 0.6, fontSize: 15 }}>
          Nothing here yet — generated labels are saved automatically.
        </p>
      ) : (
        <>
          {entries.map((entry) => {
            const ev = VESSELS[entry.vessel];
            const f = ev.fields;
            const title = entry.labelData[f.title];
            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: `1px solid ${entry.accentColor}55`,
                  padding: '10px 12px',
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
                onClick={() => onSelect(entry)}
              >
                {entry.vessel === 'wine' ? (
                  <WineBadge size={22} color={entry.accentColor} />
                ) : (
                  <FireBadge size={22} color={entry.accentColor} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond'",
                      fontStyle: 'italic',
                      fontSize: 16,
                      color: entry.accentColor,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {title}
                  </div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, opacity: 0.5 }}>{entry.passion}</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                  aria-label={`Delete ${title}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: v.parchment,
                    opacity: 0.5,
                    fontSize: 18,
                    padding: 4,
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={onClearAll}
            style={{
              width: '100%',
              marginTop: 8,
              padding: '10px',
              fontFamily: 'Inter',
              fontSize: 13,
              background: 'transparent',
              color: v.parchment,
              opacity: 0.6,
              border: `1px solid ${v.accentUi}33`,
            }}
          >
            Clear all
          </button>
        </>
      )}
    </Drawer>
  );
}

export default GalleryPanel;
