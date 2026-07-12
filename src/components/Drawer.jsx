import { useEffect, useRef } from 'react';

function Drawer({ open, onClose, title, accentColor, bg, textColor, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="drawer-panel"
        style={{
          position: 'relative',
          width: 'min(360px, 92vw)',
          height: '100%',
          background: bg,
          color: textColor,
          borderLeft: `1px solid ${accentColor}55`,
          padding: '20px 20px 32px',
          overflowY: 'auto',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond'", fontStyle: 'italic', fontSize: 22, margin: 0, color: textColor }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent', border: `1px solid ${accentColor}66`, color: textColor,
              width: 30, height: 30, fontSize: 16, borderRadius: 0, lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Drawer;
