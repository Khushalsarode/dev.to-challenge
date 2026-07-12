function Seal({ vessel, cx, cy, r, accentColor }) {
  const isWine = vessel === 'wine';
  return (
    <g className={isWine ? 'wax-seal' : 'ember-seal'} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} fill={accentColor} opacity={isWine ? 1 : 0.92} />
      {!isWine && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF8A3D" strokeWidth="2" opacity="0.6" />}
      <text x={cx} y={cy + 5} textAnchor="middle" fontFamily={isWine ? "'Cormorant Garamond'" : "'Cinzel'"}
            fontSize="14" fill={isWine ? '#F2E8D5' : '#1A1512'}>
        {isWine ? 'P · U' : '⚒'}
      </text>
    </g>
  );
}

export default Seal;
