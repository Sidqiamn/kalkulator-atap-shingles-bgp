const Svg = ({ children, className = 'h-4 w-4', ...rest }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} {...rest}>
    {children}
  </svg>
);

export const IconPlus = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const IconTrash = (p) => <Svg {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Svg>;
export const IconCopy = (p) => <Svg {...p}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></Svg>;
export const IconPrinter = (p) => <Svg {...p}><path d="M7 9V3h10v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M7 14h10v7H7z" /></Svg>;
export const IconChevron = (p) => <Svg {...p}><path d="M6 9l6 6 6-6" /></Svg>;
export const IconUndo = (p) => <Svg {...p}><path d="M9 14L4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></Svg>;
export const IconReset = (p) => <Svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></Svg>;
export const IconInfo = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></Svg>;
export const IconAlert = (p) => <Svg {...p}><path d="M12 3l9.5 17h-19z" /><path d="M12 10v4M12 17h.01" /></Svg>;
export const IconCheck = (p) => <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7" /></Svg>;
export const IconCalc = (p) => <Svg {...p}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2" /></Svg>;

/** Ikon bentuk bidang (persegi / trapesium / segitiga) */
export function ShapeIcon({ shape, className = 'h-5 w-8' }) {
  const s = { fill: 'currentColor', fillOpacity: 0.2, stroke: 'currentColor', strokeWidth: 1.6, strokeLinejoin: 'round' };
  return (
    <svg viewBox="0 0 36 22" aria-hidden="true" className={className}>
      {shape === 'rect' && <rect x="4" y="3" width="28" height="16" {...s} />}
      {shape === 'trap' && <polygon points="3,19 33,19 25,3 11,3" {...s} />}
      {shape === 'tri' && <polygon points="3,19 33,19 18,3" {...s} />}
    </svg>
  );
}

/** Ikon bentuk atap (template) */
export function RoofIcon({ tpl, className = 'h-9 w-14' }) {
  const c = { stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round', fill: 'currentColor' };
  return (
    <svg viewBox="0 0 64 40" aria-hidden="true" className={className}>
      {tpl === 'satu' && <polygon points="6,34 46,34 58,10 18,10" {...c} fillOpacity=".25" />}
      {tpl === 'pelana' && (
        <>
          <polygon points="4,34 18,8 32,34" {...c} fillOpacity=".1" />
          <polygon points="18,8 46,8 60,34 32,34" {...c} fillOpacity=".3" />
        </>
      )}
      {tpl === 'limasan' && (
        <>
          <polygon points="4,34 60,34 44,10 20,10" {...c} fillOpacity=".25" />
          <line x1="20" y1="10" x2="12" y2="34" stroke="currentColor" strokeWidth="1.4" strokeOpacity=".6" />
          <line x1="44" y1="10" x2="52" y2="34" stroke="currentColor" strokeWidth="1.4" strokeOpacity=".6" />
        </>
      )}
    </svg>
  );
}

/** Pola kecil penanda tipe shingles (ilustratif, bukan warna produk) */
export function ProductPattern({ id, className = 'h-7 w-10' }) {
  const st = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 };
  return (
    <svg viewBox="0 0 40 28" aria-hidden="true" className={className}>
      {id === 'mosaic' &&
        [0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={2 + c * 9 + (r % 2) * 4.5} y={2 + r * 8.5} width="8" height="7.5" rx="1" {...st} />))}
      {id === 'fish' &&
        [0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <path key={`${r}${c}`} d={`M${2 + c * 9 + (r % 2) * 4.5} ${4 + r * 8} a4.5 4.5 0 0 0 9 0`} {...st} />))}
      {id === 'laminated' && (
        <>
          <path d="M2 6h36M2 14h36M2 22h36" {...st} />
          <path d="M9 6v8M22 6v8M32 6v8M5 14v8M16 14v8M28 14v8" {...st} />
          <path d="M3 9h5M23 9h8M6 17h9M29 17h8" stroke="currentColor" strokeWidth="3" strokeOpacity=".35" />
        </>
      )}
      {id === 'single' && (
        <>
          <path d="M2 6h36M2 14h36M2 22h36" {...st} />
          <path d="M11 6v8M20 6v8M29 6v8M6.5 14v8M15.5 14v8M24.5 14v8M33.5 14v8" {...st} />
        </>
      )}
    </svg>
  );
}
