import { MODES, SHAPES, TEMPLATES } from './constants';
import { fx, f1, f2, m2, num, formatDate, inputNum } from './format';

function describe(p, r) {
  if (p.mode === 'area') return 'luas aktual';
  const m = (x) => `${fx(num(x))} m`;
  let s = `${SHAPES[p.shape]}, ${MODES[p.mode].label.toLowerCase()}: a ${m(p.a)}`;
  if (p.shape === 'trap') s += `, b ${m(p.b)}`;
  s += `, t ${m(p.t)}`;
  if (p.mode === 'projection') {
    s += p.angleMode === 'unknown' ? `, alas ${m(p.run)}, tinggi ${m(p.rise)} (≈ ${f1(r.derived.g)}°)` : `, ${fx(num(p.angle))}°`;
  }
  return s;
}

export function buildSummary({ state, product, planes, results, sum }) {
  const tplLabel = state.tpl === 'custom' ? 'Kustom' : TEMPLATES[state.tpl].label;
  return [
    'ESTIMASI GNET ATAP SHINGLES',
    `Proyek: ${state.project || '-'}`,
    `Tanggal: ${formatDate(state.date)}`,
    `Tipe: ${product.name} (${f2(product.coverage)} m²/bundle)`,
    `Bentuk atap: ${tplLabel} (${planes.length} bidang)`,
    '',
    'Rincian bidang:',
    ...planes.map((p, i) => {
      const r = results[i];
      return `${i + 1}. ${p.name || `Bidang ${i + 1}`} — ${describe(p, r)} → ${m2(r.area)} + waste ${inputNum(r.waste)}% = ${m2(r.order)}`;
    }),
    '',
    `Luas permukaan aktual: ${m2(sum.area)}`,
    `Total waste: ${m2(sum.extra)} (rata-rata ${fx(sum.avgWaste)}%)`,
    `Luas perhitungan order: ${m2(sum.order)}`,
    `JUMLAH BUNDLE YANG DIBELI: ${sum.bundles} bundle`,
    '',
    'Estimasi awal, belum termasuk aksesoris dan wajib verifikasi gambar kerja.',
  ].join('\n');
}
