import { SHAPES } from '../lib/constants';

/** Panduan ukur bentuk bidang (tampak atas / permukaan) */
export function ShapeDiagram({ shape }) {
  const S = { fill: '#E9E6FF', stroke: '#5B4FD0', strokeWidth: 2, strokeLinejoin: 'round' };
  const D = { stroke: '#F28B29', strokeWidth: 2, strokeDasharray: '4 3' };
  const T = { fontSize: 12, fontWeight: 700, fill: '#180F5E' };
  const M = { fontSize: 10, fill: '#6C7891', textAnchor: 'middle' };
  return (
    <svg viewBox="0 0 170 112" role="img" aria-label={`Panduan ukur ${SHAPES[shape]}`} className="h-auto w-full">
      {shape === 'rect' && (
        <>
          <rect x="20" y="24" width="120" height="60" {...S} />
          <line x1="152" y1="24" x2="152" y2="84" {...D} />
          <text x="157" y="58" {...T}>t</text>
          <text x="80" y="16" {...M}>nok</text>
        </>
      )}
      {shape === 'trap' && (
        <>
          <polygon points="20,84 140,84 108,24 52,24" {...S} />
          <line x1="80" y1="24" x2="80" y2="84" {...D} />
          <text x="86" y="60" {...T}>t</text>
          <text x="80" y="16" {...T} textAnchor="middle">b (nok)</text>
        </>
      )}
      {shape === 'tri' && (
        <>
          <polygon points="20,84 140,84 80,24" {...S} />
          <line x1="80" y1="24" x2="80" y2="84" {...D} />
          <text x="86" y="66" {...T}>t</text>
          <text x="80" y="16" {...M}>puncak</text>
        </>
      )}
      <text x="80" y="102" {...T} textAnchor="middle">a (talang)</text>
    </svg>
  );
}

/** Tampak samping atap: alas mendatar & tinggi tegak untuk mencari sudut */
export function SlopeDiagram() {
  return (
    <svg viewBox="0 0 230 150" role="img" aria-label="Tampak samping atap: alas mendatar dari talang ke bawah nok, tinggi tegak dari garis talang ke nok" className="h-auto w-full">
      <polygon points="24,112 196,112 196,32" fill="#EEECFF" />
      <line x1="24" y1="112" x2="196" y2="112" stroke="#F28B29" strokeWidth="2.5" strokeDasharray="6 4" />
      <line x1="196" y1="112" x2="196" y2="32" stroke="#F28B29" strokeWidth="2.5" strokeDasharray="6 4" />
      <path d="M186 112V102H196" fill="none" stroke="#F28B29" strokeWidth="1.5" />
      <line x1="12" y1="117.6" x2="196" y2="32" stroke="#180F5E" strokeWidth="5" strokeLinecap="round" />
      <path d="M64 112A40 40 0 0 0 60.3 95.2" fill="none" stroke="#180F5E" strokeWidth="1.8" />
      <text x="68" y="107" fontSize="13" fontWeight="800" fill="#180F5E">θ</text>
      <circle cx="196" cy="32" r="4" fill="#180F5E" />
      <text x="196" y="22" textAnchor="middle" fontSize="11" fontWeight="800" fill="#180F5E">nok</text>
      <text x="4" y="132" fontSize="10.5" fontWeight="700" fill="#6C7891">talang</text>
      <text x="50" y="92" fontSize="10.5" fontWeight="700" fill="#180F5E" transform="rotate(-24.9 50 92)">permukaan atap (miring)</text>
      <text x="110" y="130" textAnchor="middle" fontSize="12" fontWeight="800" fill="#A85109">alas (mendatar)</text>
      <text x="204" y="76" fontSize="12" fontWeight="800" fill="#A85109" transform="rotate(90 204 76)" textAnchor="middle">tinggi</text>
      <text x="110" y="145" textAnchor="middle" fontSize="9.5" fill="#6C7891">tampak samping / potongan atap</text>
    </svg>
  );
}
