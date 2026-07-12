import { getAccentColor } from '../utils/colorMood';
import { wrapText } from '../utils/wrapText';
import { VESSELS } from '../config/vessels';
import Seal from './Seal';

function Label({ vessel, labelData, accentOverride = 'auto', backgroundImage }) {
  const f = VESSELS[vessel].fields;
  const mood = accentOverride !== 'auto' ? accentOverride : labelData.color_mood;
  const accentColor = getAccentColor(vessel, mood);
  const isWine = vessel === 'wine';
  const bg = isWine ? '#F2E8D5' : '#C9BFB5';
  const ink = isWine ? '#2C1810' : '#3D3835';
  const rule = isWine ? '#B87333' : '#FF8A3D';
  const cornerRadius = isWine ? 3 : 0;
  const titleFont = isWine ? "'Cormorant Garamond'" : "'Cinzel'";

  const lines = wrapText(labelData[f.body], 28);
  const bodyStartY = 188;
  const bodyLineHeight = 22;

  return (
    <svg
      viewBox="0 0 400 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      className="label-card label-artifact"
      style={{ width: '100%', height: 'auto', maxWidth: 420 }}
      aria-label={`${isWine ? 'Wine label' : 'Forge mark'} for passion: ${labelData[f.title]}`}
    >
      <defs>
        <filter id={`paper-${vessel}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={`shadow-${vessel}`} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000000" floodOpacity="0.38" />
        </filter>
        <filter id={`edge-wear-${vessel}`}>
          <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="2" result="wear" />
          <feDisplacementMap in="SourceGraphic" in2="wear" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <g filter={`url(#shadow-${vessel})`}>
        <rect width="400" height="600" fill={bg} filter={`url(#paper-${vessel})`} rx={cornerRadius} />
        {backgroundImage && (
          <image
            href={backgroundImage}
            x="8"
            y="8"
            width="384"
            height="584"
            preserveAspectRatio="xMidYMid slice"
            opacity="0.32"
            style={{ mixBlendMode: 'multiply' }}
          />
        )}
        <rect x="8" y="8" width="384" height="584" fill="none" stroke={accentColor} strokeWidth="2.5" rx={cornerRadius} />
        <rect x="16" y="16" width="368" height="568" fill="none" stroke={accentColor} strokeWidth="1" rx={Math.max(cornerRadius - 1, 0)} />

        <text
          x="200"
          y="72"
          textAnchor="middle"
          fontFamily={titleFont}
          fontSize="30"
          fontWeight="700"
          fontStyle={isWine ? 'italic' : 'normal'}
          letterSpacing={isWine ? 0 : 2}
          fill={accentColor}
        >
          {isWine ? labelData[f.title].toUpperCase() : labelData[f.title].toUpperCase()}
        </text>

        <text x="200" y="98" textAnchor="middle" fontFamily="'Cormorant Garamond'" fontSize="17" fill={ink}>
          {labelData[f.subtitle]}
        </text>

        <line x1="40" y1="112" x2="360" y2="112" stroke={rule} strokeWidth="0.75" />
        <text
          x="200"
          y="138"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond'"
          fontSize="15"
          fontWeight="600"
          letterSpacing="4"
          fill={ink}
        >
          {f.yearPrefix} · {labelData[f.year]}
        </text>
        <line x1="40" y1="152" x2="360" y2="152" stroke={rule} strokeWidth="0.75" />

        <text x="40" y="176" fontFamily="'Cormorant Garamond'" fontSize="11" fontWeight="600" letterSpacing="2.5" fill={rule}>
          {f.labels.body}
        </text>
        {lines.map((line, i) => (
          <text key={i} x="40" y={bodyStartY + i * bodyLineHeight} fontFamily="EB Garamond" fontSize="16" fill={ink}>
            {line}
          </text>
        ))}

        <text x="40" y={bodyStartY + lines.length * bodyLineHeight + 28} fontFamily="'Cormorant Garamond'" fontSize="11" fontWeight="600" letterSpacing="2.5" fill={rule}>
          {f.labels.tag}
        </text>
        <text x="40" y={bodyStartY + lines.length * bodyLineHeight + 50} fontFamily="EB Garamond" fontSize="15" fill={ink}>
          {labelData[f.tag]}
        </text>

        <text x="40" y={bodyStartY + lines.length * bodyLineHeight + 82} fontFamily="'Cormorant Garamond'" fontSize="11" fontWeight="600" letterSpacing="2.5" fill={rule}>
          {f.labels.extra}
        </text>
        <text x="40" y={bodyStartY + lines.length * bodyLineHeight + 104} fontFamily="EB Garamond" fontSize="15" fill={ink}>
          {labelData[f.extra]}
        </text>

        <line x1="40" y1={bodyStartY + lines.length * bodyLineHeight + 124} x2="360" y2={bodyStartY + lines.length * bodyLineHeight + 124} stroke={rule} strokeWidth="0.75" />

        <text x="40" y={bodyStartY + lines.length * bodyLineHeight + 148} fontFamily="'Cormorant Garamond'" fontSize="11" fontWeight="600" letterSpacing="2.5" fill={rule}>
          {f.labels.closer}
        </text>
        <text x="40" y={bodyStartY + lines.length * bodyLineHeight + 170} fontFamily="EB Garamond" fontSize="15" fontStyle="italic" fill={ink}>
          {labelData[f.closer]}
        </text>

        <Seal vessel={vessel} cx={200} cy={470} r={56} accentColor={accentColor} />
      </g>
    </svg>
  );
}

export default Label;
