const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function IconVolume({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} d="M11 5L6 9H3v6h3l5 4V5z" />
      <path {...stroke} d="M15.5 8.5a5 5 0 010 7M18 6a8 8 0 010 12" />
    </svg>
  );
}

export function IconVolumeOff({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} d="M11 5L6 9H3v6h3l5 4V5z" />
      <path {...stroke} d="M22 9l-6 6M16 9l6 6" />
    </svg>
  );
}

export function IconGallery({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect {...stroke} x="3" y="5" width="18" height="14" rx="1" />
      <path {...stroke} d="M3 15l5-5 4 4 3-3 6 6" />
      <circle {...stroke} cx="8.5" cy="10" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSettings({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle {...stroke} cx="12" cy="12" r="3" />
      <path {...stroke} d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

export function IconReplay({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} d="M3 12a9 9 0 0115.5-6.4L21 8" />
      <path {...stroke} d="M21 3v5h-5M21 12a9 9 0 01-15.5 6.4L3 16" />
      <path {...stroke} d="M3 21v-5h5" />
    </svg>
  );
}

export function IconDownload({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} d="M12 3v12M7 10l5 5 5-5" />
      <path {...stroke} d="M4 20h16" />
    </svg>
  );
}

export function IconShare({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} d="M8 12l12-5v10l-12-5v-5z" />
      <path {...stroke} d="M4 6v12" />
    </svg>
  );
}

export function IconReset({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...stroke} d="M4 12a8 8 0 0113.7-5.7L20 8" />
      <path {...stroke} d="M20 4v4h-4M20 12a8 8 0 01-13.7 5.7L4 16" />
      <path {...stroke} d="M4 20v-4h4" />
    </svg>
  );
}

export function WineBadge({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 32" aria-hidden="true">
      <path fill={color} d="M9 0h6v7c0 2.5 4 3.5 4 7v16H5V14c0-3.5 4-4.5 4-7V0z" opacity="0.9" />
      <rect x="8" y="5" width="8" height="2" fill="#c9a227" rx="0.5" />
    </svg>
  );
}

export function FireBadge({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="14" width="20" height="4" fill="#2a2622" />
      <rect x="6" y="10" width="12" height="5" fill="#35302c" />
      <path fill={color} d="M12 2c-2 4-4 6-4 9a4 4 0 008 0c0-3-2-5-4-9z" />
    </svg>
  );
}
