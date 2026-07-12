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

  const lines = wrapText(labelData[f.body], 33);

  return (
    <svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg" role="img"
         className="label-card"
         style={{ width: '100%', height: 'auto', maxWidth: 400 }}
         aria-label={`${isWine ? 'Wine label' : 'Forge mark'} for passion: ${labelData[f.title]}`}>
      <defs>
        <filter id={`paper-${vessel}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>

      <rect width="400" height="560" fill={bg} filter={`url(#paper-${vessel})`} rx={cornerRadius}/>
      {backgroundImage && (
        <image
          href={backgroundImage}
          x="8" y="8" width="384" height="544"
          preserveAspectRatio="xMidYMid slice"
          opacity="0.35"
          style={{ mixBlendMode: 'multiply' }}
        />
      )}
      <rect x="8" y="8" width="384" height="544" fill="none" stroke={accentColor} strokeWidth="2" rx={cornerRadius}/>
      <rect x="16" y="16" width="368" height="528" fill="none" stroke={accentColor} strokeWidth="0.75" rx={Math.max(cornerRadius - 1, 0)}/>

      <text x="200" y="62" textAnchor="middle" fontFamily={titleFont} fontSize="22" fontWeight="700"
            fontStyle={isWine ? 'italic' : 'normal'} letterSpacing={isWine ? 0 : 2} fill={accentColor}>
        {isWine ? `✦ ${labelData[f.title].toUpperCase()} ✦` : labelData[f.title].toUpperCase()}
      </text>

      <text x="200" y="80" textAnchor="middle" fontFamily="'Cormorant Garamond'" fontSize="13" fill={ink}>
        {labelData[f.subtitle]}
      </text>

      <line x1="40" y1="92" x2="360" y2="92" stroke={rule} strokeWidth="0.5"/>

      <text x="200" y="114" textAnchor="middle" fontFamily="'Cormorant Garamond'" fontSize="12"
            fontWeight="600" letterSpacing="4" fill={ink}>
        {f.yearPrefix} · {labelData[f.year]}
      </text>

      <line x1="40" y1="126" x2="360" y2="126" stroke={rule} strokeWidth="0.5"/>

      <text x="40" y="148" fontFamily="'Cormorant Garamond'" fontSize="9" fontWeight="600"
            letterSpacing="2.5" fill={rule}>{f.labels.body}</text>
      {lines.map((line, i) => (
        <text key={i} x="40" y={164 + i * 16} fontFamily="EB Garamond" fontSize="12.5" fill={ink}>{line}</text>
      ))}

      <text x="40" y={220} fontFamily="'Cormorant Garamond'" fontSize="9" fontWeight="600"
            letterSpacing="2.5" fill={rule}>{f.labels.tag}</text>
      <text x="40" y={236} fontFamily="EB Garamond" fontSize="12" fill={ink}>{labelData[f.tag]}</text>

      <text x="40" y={262} fontFamily="'Cormorant Garamond'" fontSize="9" fontWeight="600"
            letterSpacing="2.5" fill={rule}>{f.labels.extra}</text>
      <text x="40" y={278} fontFamily="EB Garamond" fontSize="12" fill={ink}>{labelData[f.extra]}</text>

      <line x1="40" y1="295" x2="360" y2="295" stroke={rule} strokeWidth="0.5"/>

      <text x="40" y="314" fontFamily="'Cormorant Garamond'" fontSize="9" fontWeight="600"
            letterSpacing="2.5" fill={rule}>{f.labels.closer}</text>
      <text x="40" y="332" fontFamily="EB Garamond" fontSize="12" fontStyle="italic" fill={ink}>
        {labelData[f.closer]}
      </text>

      <Seal vessel={vessel} cx={200} cy={430} r={50} accentColor={accentColor} />
    </svg>
  );
}

export default Label;
