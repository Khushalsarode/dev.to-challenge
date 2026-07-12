function BrandMark({ size = 56, wineColor = '#B87333', fireColor = '#FF8A3D' }) {
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 120 86"
      aria-hidden="true"
      style={{ display: 'block', margin: '0 auto' }}
    >
      <defs>
        <linearGradient id="brand-wine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c3a2b" />
          <stop offset="100%" stopColor="#0f2419" />
        </linearGradient>
        <linearGradient id="brand-flame" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor={fireColor} />
          <stop offset="100%" stopColor="#ffe9b0" />
        </linearGradient>
      </defs>

      <g transform="translate(8 4)">
        <path
          d="M28 0h8v10c0 4 8 5.5 8 11v48H12V21c0-5.5 8-7 8-11V0z"
          fill="url(#brand-wine)"
        />
        <rect x="27" y="7" width="10" height="3" fill={wineColor} rx="0.5" />
        <ellipse cx="32" cy="52" rx="14" ry="3" fill={wineColor} opacity="0.45" />
      </g>

      <g transform="translate(62 18)">
        <rect x="0" y="38" width="44" height="8" fill="#2a2622" />
        <rect x="10" y="28" width="24" height="12" fill="#35302c" />
        <rect x="0" y="24" width="44" height="6" fill="#3d3835" />
        <path
          d="M22 0c-4 8-8 12-8 18a8 8 0 0016 0c0-6-4-10-8-18z"
          fill="url(#brand-flame)"
        />
        <circle cx="14" cy="10" r="1.5" fill="#ffb347" opacity="0.8" />
        <circle cx="30" cy="14" r="1.2" fill="#ffb347" opacity="0.6" />
      </g>
    </svg>
  );
}

export default BrandMark;
