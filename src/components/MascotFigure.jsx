/**
 * Karakter asisten GNET: kontraktor dengan helm proyek, rompi safety,
 * papan klip, dan meteran. Digambar orisinal dalam SVG.
 *
 * Pose (mood):
 *  - wave    : melambai (salam pembuka)
 *  - idle    : berdiri memegang meteran (menunggu input)
 *  - happy   : jempol ke atas (hasil lengkap)
 *  - concern : menggaruk helm (ada input yang perlu dicek)
 *
 * Sendi lengan diputar dengan CSS transform (transform-origin dalam koordinat viewBox).
 */

const SKIN = '#F2C29B';
const SKIN_SHADE = '#E2A97E';
const NAVY = '#263E83';
const NAVY_DARK = '#1C2943';
const ORANGE = '#F28B29';
const REFLECT = '#E8ECF5';

const POSES = {
  wave: { upper: -112, fore: -70, foreAnim: 'mascot-wave', head: 3 },
  idle: { upper: 6, fore: -12, foreAnim: '', head: 0 },
  happy: { upper: -28, fore: -122, foreAnim: '', head: 4 },
  concern: { upper: -150, fore: -80, foreAnim: 'mascot-scratch', head: -6 },
};

function Face({ mood }) {
  const brow = {
    wave: ['M95 67 Q101 63.5 106 66.5', 'M114 66.5 Q119 63.5 125 67'],
    idle: ['M95 67.5 Q101 65 106 67', 'M114 67 Q119 65 125 67.5'],
    happy: ['M95 66.5 Q101 62.5 106 66', 'M114 66 Q119 62.5 125 66.5'],
    concern: ['M95 65 Q101 66 106 68.5', 'M114 68.5 Q119 66 125 65'],
  }[mood];
  return (
    <g>
      {brow.map((d) => (
        <path key={d} d={d} fill="none" stroke="#3A2A22" strokeWidth="2.2" strokeLinecap="round" />
      ))}
      <ellipse className="mascot-eye" cx="101" cy="75" rx="2.7" ry="3.4" fill={NAVY_DARK} />
      <ellipse className="mascot-eye" cx="119" cy="75" rx="2.7" ry="3.4" fill={NAVY_DARK} />
      <circle cx="94" cy="83" r="3.6" fill="#E8897A" opacity=".28" />
      <circle cx="126" cy="83" r="3.6" fill="#E8897A" opacity=".28" />
      {mood === 'happy' || mood === 'wave' ? (
        <path d="M102.5 84.5 Q110 94 117.5 84.5 Z" fill="#8B3A2E" stroke="#8B3A2E" strokeWidth="1.5" strokeLinejoin="round" />
      ) : mood === 'concern' ? (
        <path d="M104 88.5 Q110 85.5 116 88.5" fill="none" stroke="#8B3A2E" strokeWidth="2.3" strokeLinecap="round" />
      ) : (
        <path d="M103.5 86 Q110 91 116.5 86" fill="none" stroke="#8B3A2E" strokeWidth="2.3" strokeLinecap="round" />
      )}
    </g>
  );
}

function Helmet() {
  return (
    <g>
      <path d="M81 66 Q81 37 110 36.5 Q139 37 139 66 Z" fill="#F7F8FC" stroke="#CBD3E3" strokeWidth="1.5" />
      <path d="M110 38 V64" stroke="#E2E7F1" strokeWidth="5" strokeLinecap="round" />
      <rect x="74" y="62" width="72" height="9" rx="4.5" fill="#FFFFFF" stroke="#CBD3E3" strokeWidth="1.5" />
      <rect x="97" y="46" width="26" height="10" rx="5" fill={ORANGE} />
      <text x="110" y="53.6" textAnchor="middle" fontSize="7" fontWeight="800" fill="#FFFFFF" fontFamily="Plus Jakarta Sans Variable, Arial, sans-serif">
        gnet
      </text>
    </g>
  );
}

export function MascotHead({ mood = 'idle' }) {
  return (
    <svg viewBox="72 30 76 76" aria-hidden="true" className="h-full w-full">
      <circle cx="84" cy="77" r="5" fill={SKIN_SHADE} />
      <circle cx="136" cy="77" r="5" fill={SKIN_SHADE} />
      <circle cx="110" cy="75" r="26" fill={SKIN} />
      <path d="M84 70 Q85 62 92 60 L92 70 Z M136 70 Q135 62 128 60 L128 70 Z" fill="#3A2A22" />
      <Face mood={mood} />
      <Helmet />
    </svg>
  );
}

export default function MascotFigure({ mood = 'idle' }) {
  const pose = POSES[mood] ?? POSES.idle;
  const showTape = mood === 'idle';
  const showThumb = mood === 'happy';

  return (
    <svg viewBox="0 0 220 280" aria-hidden="true" className="h-auto w-full overflow-visible">
      {/* bayangan */}
      <ellipse cx="110" cy="266" rx="56" ry="7.5" fill="#180F5E" opacity=".13" />

      <g className="mascot-breathe">
        {/* kaki & sepatu safety */}
        <rect x="87" y="186" width="21" height="66" rx="8" fill={NAVY_DARK} />
        <rect x="112" y="186" width="21" height="66" rx="8" fill={NAVY_DARK} />
        <path d="M80 262 Q80 247 94 246 L108 246 L108 262 Z" fill="#4A3424" />
        <path d="M140 262 Q140 247 126 246 L112 246 L112 262 Z" fill="#4A3424" />
        <rect x="79" y="259" width="30" height="4" rx="2" fill="#2E2018" />
        <rect x="111" y="259" width="30" height="4" rx="2" fill="#2E2018" />

        {/* badan: kemeja navy */}
        <rect x="78" y="104" width="64" height="94" rx="22" fill={NAVY} />
        <rect x="102" y="94" width="16" height="14" rx="4" fill={SKIN_SHADE} />
        <path d="M100 104 L110 117 L106 104 Z M120 104 L110 117 L114 104 Z" fill="#FFFFFF" />

        {/* rompi safety */}
        <path d="M78 126 Q78 107 97 105 L104 105 L104 196 L86 196 Q78 196 78 188 Z" fill={ORANGE} />
        <path d="M142 126 Q142 107 123 105 L116 105 L116 196 L134 196 Q142 196 142 188 Z" fill={ORANGE} />
        <rect x="78" y="150" width="26" height="7" fill={REFLECT} />
        <rect x="116" y="150" width="26" height="7" fill={REFLECT} />
        <rect x="78" y="172" width="26" height="7" fill={REFLECT} />
        <rect x="116" y="172" width="26" height="7" fill={REFLECT} />
        {/* kartu identitas */}
        <rect x="121" y="122" width="13" height="16" rx="2" fill="#FFFFFF" />
        <rect x="124" y="126" width="7" height="2" rx="1" fill={NAVY} />
        <rect x="124" y="130" width="7" height="1.6" rx=".8" fill="#9AA5BB" />
        <rect x="124" y="133" width="5" height="1.6" rx=".8" fill="#9AA5BB" />
        {/* sabuk */}
        <rect x="80" y="191" width="60" height="7" rx="2" fill={NAVY_DARK} />
        <rect x="106" y="190.5" width="9" height="8" rx="1.5" fill="#C9CFDD" />

        {/* lengan kiri (kanan karakter) memegang papan klip */}
        <rect x="66" y="112" width="18" height="52" rx="9" fill={NAVY} transform="rotate(12 75 116)" />
        <rect x="58" y="138" width="36" height="46" rx="4" fill="#8B5E3C" />
        <rect x="62" y="146" width="28" height="34" rx="2" fill="#FFFFFF" />
        <rect x="69" y="135" width="14" height="7" rx="2" fill="#5B5F6B" />
        <path d="M65 153 l2 2 3.5-4" fill="none" stroke={ORANGE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="72" y="152" width="14" height="2" rx="1" fill="#B8C0D0" />
        <path d="M65 161 l2 2 3.5-4" fill="none" stroke={ORANGE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="72" y="160" width="12" height="2" rx="1" fill="#B8C0D0" />
        <rect x="65" y="168" width="4" height="4" rx="1" fill="none" stroke="#B8C0D0" strokeWidth="1.2" />
        <rect x="72" y="169" width="14" height="2" rx="1" fill="#B8C0D0" />
        <circle cx="86" cy="160" r="7.5" fill={SKIN} />

        {/* kepala */}
        <g className="mascot-limb" style={{ transformOrigin: '110px 100px', transform: `rotate(${pose.head}deg)` }}>
          <circle cx="84" cy="77" r="5" fill={SKIN_SHADE} />
          <circle cx="136" cy="77" r="5" fill={SKIN_SHADE} />
          <circle cx="110" cy="75" r="26" fill={SKIN} />
          <path d="M84 70 Q85 62 92 60 L92 70 Z M136 70 Q135 62 128 60 L128 70 Z" fill="#3A2A22" />
          <Face mood={mood} />
          <Helmet />
        </g>

        {/* lengan kanan (kiri karakter): lengan atas → lengan bawah → tangan */}
        <g className="mascot-limb" style={{ transformOrigin: '142px 116px', transform: `rotate(${pose.upper}deg)` }}>
          <rect x="133.5" y="110" width="17" height="44" rx="8.5" fill={NAVY} />
          <g
            className={`mascot-limb ${pose.foreAnim}`}
            style={{ transformOrigin: '142px 150px', transform: `rotate(${pose.fore}deg)`, '--fore': `${pose.fore}deg` }}
          >
            <rect x="134" y="144" width="16" height="40" rx="8" fill={NAVY} />
            <rect x="134" y="176" width="16" height="6" rx="3" fill="#1E3170" />
            {showThumb && <rect x="139" y="189" width="6.5" height="12" rx="3.2" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="1" />}
            <circle cx="142" cy="187" r="8" fill={SKIN} />
            {showTape && (
              <g>
                <rect x="133" y="189" width="21" height="18" rx="5" fill={ORANGE} />
                <circle cx="143.5" cy="198" r="5" fill="#FFE0BD" />
                <circle cx="143.5" cy="198" r="1.8" fill={ORANGE} />
                <path d="M154 202 h9 v3 h-9" fill="#F5D24B" stroke="#C9A93A" strokeWidth=".8" />
              </g>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
}
