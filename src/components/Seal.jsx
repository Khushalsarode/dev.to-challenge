function Seal({ vessel, cx, cy, r, accentColor }) {
  const isWine = vessel === 'wine';
  return (
    <g className={isWine ? 'wax-seal' : 'ember-seal'} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} fill={accentColor} opacity={isWine ? 1 : 0.92} />
      {!isWine && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF8A3D" strokeWidth="2.5" opacity="0.6" />}
      {!isWine && (
        <g transform={`translate(${cx - 14} ${cy - 10})`} fill="#1A1512" opacity="0.9">
          <rect x="6" y="10" width="16" height="3" rx="0.5" />
          <rect x="2" y="6" width="8" height="3" rx="0.5" transform="rotate(-35 6 7.5)" />
          <rect x="18" y="6" width="8" height="3" rx="0.5" transform="rotate(35 22 7.5)" />
        </g>
      )}
      {isWine && (
        <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="'Cormorant Garamond'" fontSize="18" fontWeight="700" fill="#F2E8D5">
          P · U
        </text>
      )}
    </g>
  );
}

export default Seal;
