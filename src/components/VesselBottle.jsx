// Derives a rough 0.6–1.3 flame-strength multiplier from the AI-written
// intensity line so the fire vessel's flame visibly reacts to the copy
// instead of always looking the same regardless of what was generated.
function deriveFlameStrength(intensityText = '') {
  const text = intensityText.toLowerCase();
  const HOT_WORDS = ['white-hot', 'blazing', 'scorching', 'inferno', 'molten', 'ablaze'];
  const COOL_WORDS = ['ember', 'smolder', 'low', 'quiet', 'faint'];
  if (HOT_WORDS.some((w) => text.includes(w))) return 1.25;
  if (COOL_WORDS.some((w) => text.includes(w))) return 0.75;
  return 1;
}

const EMBER_OFFSETS = [
  { left: 58, delay: 0, drift: 4, r: 2.2 },
  { left: 76, delay: 0.3, drift: -6, r: 1.6 },
  { left: 94, delay: 0.6, drift: 8, r: 2.4 },
  { left: 68, delay: 0.9, drift: -3, r: 1.4 },
  { left: 88, delay: 1.2, drift: 5, r: 1.8 },
  { left: 104, delay: 1.5, drift: -8, r: 1.5 },
];

const BUBBLE_OFFSETS = [
  { left: 45, delay: 0, duration: 3.6, r: 2.2 },
  { left: 70, delay: 1.1, duration: 4.2, r: 1.6 },
  { left: 95, delay: 0.5, duration: 3.8, r: 1.9 },
  { left: 115, delay: 1.8, duration: 4.6, r: 1.4 },
  { left: 58, delay: 2.4, duration: 4.0, r: 1.7 },
];

function VesselBottle({ vessel, accentColor = '#B87333', intensityText, reveal = true, reducedMotion = false }) {
  const isWine = vessel === 'wine';
  const flameStrength = deriveFlameStrength(intensityText);
  const revealClass = (base) => (reveal && !reducedMotion ? base : '');
  const loopClass = (base) => (!reducedMotion ? base : '');

  return (
    <svg width="180" height="500" viewBox="0 0 180 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {isWine ? (
        <g>
          <defs>
            <clipPath id="bottle-clip">
              <path d="M75,0 L105,0 L105,80 C105,110 140,120 140,160 L140,460 L20,460 L20,160
                       C20,120 75,110 75,80 Z" />
            </clipPath>
            <linearGradient id="glass-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0F2419" />
              <stop offset="45%" stopColor="#1C3A2B" />
              <stop offset="100%" stopColor="#15291D" />
            </linearGradient>
          </defs>

          {/* glass shell */}
          <path
            d="M75,0 L105,0 L105,80 C105,110 140,120 140,160 L140,460 L160,460 L150,470 L30,470
               L20,460 L20,160 C20,120 75,110 75,80 Z"
            fill="url(#glass-grad)"
          />

          <g clipPath="url(#bottle-clip)">
            {/* liquid fill, tinted by accent */}
            <rect
              x="20" y="146" width="120" height="320"
              fill={accentColor}
              opacity="0.55"
              className={revealClass('liquid-fill')}
            />
            {/* liquid surface meniscus — a soft highlighted line that gently breathes */}
            <ellipse cx="80" cy="146" rx="60" ry="4" fill={accentColor} opacity="0.85" className={loopClass('liquid-meniscus')} />

            {/* rising bubbles, contained within the glass */}
            {BUBBLE_OFFSETS.map((b, i) => (
              <circle
                key={i}
                cx={b.left}
                cy={440}
                r={b.r}
                fill="#FFF3D0"
                opacity="0.5"
                className={loopClass('wine-bubble')}
                style={{ animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }}
              />
            ))}
          </g>

          {/* glass highlight streak (static) */}
          <rect x="35" y="90" width="10" height="360" fill="#FFFFFF" opacity="0.08" />

          {/* animated shine sweep */}
          <g clipPath="url(#bottle-clip)">
            <rect x="0" y="0" width="30" height="500" fill="#FFFFFF" className={revealClass('glass-shine')} />
          </g>

          {/* foil capsule around the neck */}
          <rect x="72" y="32" width="36" height="22" fill="#C9A227" opacity="0.9" />
          <rect x="72" y="32" width="36" height="4" fill="#EBD98A" opacity="0.7" />
          <rect x="72" y="50" width="36" height="4" fill="#8B6914" opacity="0.5" />

          {/* cork, pops on reveal */}
          <g className={revealClass('cork-fly-reveal')}>
            <rect x="79" y="-16" width="22" height="18" rx="3" fill="#D9B382" />
            <ellipse cx="90" cy="-16" rx="11" ry="3" fill="#EAD3AE" />
            <rect x="79" y="-4" width="22" height="3" fill="#B98F5E" opacity="0.6" />
          </g>
        </g>
      ) : (
        <g>
          <defs>
            <radialGradient id="flame-outer-grad" cx="50%" cy="100%" r="90%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="60%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#FFE9B0" />
            </radialGradient>
            <linearGradient id="flame-inner-grad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FFD9A0" />
              <stop offset="100%" stopColor="#FFF7E0" />
            </linearGradient>
            <filter id="glow-blur" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          {/* anvil top plate */}
          <rect x="10" y="160" width="140" height="60" fill="#2A2622" />
          <path d="M150,180 L178,190 L178,205 L150,210 Z" fill="#2A2622" />
          <path d="M50,220 L110,220 L100,260 L60,260 Z" fill="#2A2622" />
          <rect x="30" y="260" width="100" height="200" fill="#2A2622" />
          <rect x="10" y="160" width="140" height="6" fill="#FF8A3D" opacity="0.12" />

          {/* hammer-strike flash + shockwave, centered over where the seal lands */}
          <circle cx="90" cy="190" r="26" fill="#FFF3E0" className={revealClass('hammer-flash')} />
          <circle cx="90" cy="190" r="20" fill="none" stroke={accentColor} strokeWidth="3" className={revealClass('shockwave-ring')} />

          {/* soft glow bloom behind the flame */}
          <ellipse cx="92" cy="130" rx="36" ry="48" fill={accentColor} opacity="0.4" filter="url(#glow-blur)" className={loopClass('flame-glow')} />

          {/* flame layer, strength-scaled, flickering */}
          <g style={{ transform: `scale(${flameStrength})`, transformOrigin: '90px 160px' }}>
            <path
              d="M75,160 C68,130 82,110 78,90 C90,105 96,125 90,140 C100,128 98,108 92,95
                 C108,112 106,140 96,155 C104,150 108,142 108,135 C112,150 106,162 92,163 Z"
              fill="url(#flame-outer-grad)"
              opacity="0.9"
              className={loopClass('flame-flicker')}
              style={{ animationDelay: '0s' }}
            />
            <path
              d="M100,160 C96,142 104,128 100,112 C110,122 113,138 108,150 C114,144 115,134 111,126
                 C120,138 118,155 108,161 Z"
              fill="url(#flame-inner-grad)"
              opacity="0.9"
              className={loopClass('flame-flicker')}
              style={{ animationDelay: '0.4s' }}
            />
            <path
              d="M91,161 C88,146 93,134 90,122 C97,130 99,142 96,150 C100,146 101,140 99,135
                 C104,143 102,154 96,159 Z"
              fill="#FFFBEF"
              opacity="0.95"
              className={loopClass('flame-core')}
            />
          </g>

          {/* rising embers */}
          {EMBER_OFFSETS.map((e, i) => (
            <circle
              key={i}
              cx={e.left}
              cy={150}
              r={e.r}
              fill="#FFB347"
              className={loopClass('ember-spark')}
              style={{ '--spark-drift': `${e.drift}px`, animationDelay: `${e.delay}s` }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}

export default VesselBottle;
