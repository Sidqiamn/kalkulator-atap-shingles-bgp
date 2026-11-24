import { WASTE_REKOMENDASI, SUDUT_MIN, SUDUT_MAX, SUDUT_LANDAI } from '../config';
import { num, f1, inputNum } from './format';

export const recKey = (p) => (p.mode === 'area' ? 'luasAktual' : p.shape);
export const recFor = (p) => WASTE_REKOMENDASI[recKey(p)];

let idSeed = 1;
export const bumpIdSeed = (planes) => {
  idSeed = Math.max(idSeed, ...planes.map((p) => (Number(p.id) || 0) + 1));
};

const PLANE_DEFAULTS = {
  name: '',
  mode: 'projection',
  shape: 'rect',
  angleMode: 'known',
  a: '',
  b: '',
  t: '',
  angle: '',
  run: '',
  rise: '',
  area: '',
  waste: '',
  wasteManual: false,
  mirrorOf: null, // id bidang sumber bila bidang ini otomatis sama (Pelana / Limasan)
};

/** Data yang diambil dari bidang sumber oleh bidang yang otomatis sama */
const MIRRORED = ['mode', 'shape', 'angleMode', 'a', 'b', 't', 'angle', 'run', 'rise', 'area', 'waste', 'wasteManual'];

/**
 * Bidang dengan mirrorOf memakai ukuran, sudut, dan waste bidang sumbernya.
 * Hasilnya dipakai untuk tampilan dan perhitungan; state asli tidak diubah.
 */
export function resolvePlanes(planes) {
  const byId = new Map(planes.map((p) => [p.id, p]));
  return planes.map((p) => {
    if (p.mirrorOf == null) return p;
    const src = byId.get(p.mirrorOf);
    if (!src || src.mirrorOf != null) return { ...p, mirrorOf: null };
    return { ...p, ...Object.fromEntries(MIRRORED.map((k) => [k, src[k]])), mirrorName: src.name };
  });
}

/** Susun bidang untuk sebuah template, termasuk tautan bidang yang otomatis sama */
export function planesForTemplate(tplPlanes, carry = {}) {
  const made = [];
  tplPlanes.forEach(([name, shape, src]) => {
    made.push(src === undefined ? makePlane({ ...carry, name, shape }) : makePlane({ name, shape, mirrorOf: made[src].id }));
  });
  return made;
}

/** Cek apakah susunan bidang tersimpan masih cocok dengan template tetapnya */
export function fitsTemplate(tpl, planes) {
  if (!tpl?.fixed) return true;
  return (
    planes.length === tpl.planes.length &&
    tpl.planes.every(([, shape, src], i) =>
      src === undefined ? planes[i].mirrorOf == null && planes[i].shape === shape : planes[i].mirrorOf === planes[src].id,
    )
  );
}

/** Isi waste dengan rekomendasi bila belum diubah manual */
export function withRec(p) {
  return p.wasteManual ? p : { ...p, waste: inputNum(recFor(p)) };
}

export function makePlane(init = {}) {
  const { mirrorName, ...rest } = init;
  return withRec({ ...PLANE_DEFAULTS, ...rest, id: idSeed++ });
}

export function normalizePlane(p) {
  return { ...PLANE_DEFAULTS, ...p };
}

export const hasData = (p) =>
  ['a', 'b', 't', 'angle', 'run', 'rise', 'area'].some((k) => String(p[k] ?? '').trim() !== '') || p.wasteManual;

/** Bagian yang dibawa saat membuat bidang baru dari bidang lain */
export function carryFrom(p) {
  if (!p) return {};
  const proj = p.mode === 'projection';
  return { mode: p.mode, angleMode: p.angleMode, angle: proj ? p.angle : '', run: proj ? p.run : '', rise: proj ? p.rise : '' };
}

/**
 * Hitung satu bidang.
 * status: 'ok' | 'empty' | 'error'
 * area = luas permukaan miring, order = area × (1 + waste/100)
 */
export function evalPlane(p) {
  const errors = {};
  const warnings = [];
  let derived = null;
  let geoMissing = false;

  const take = (k, ok, msg) => {
    const v = num(p[k]);
    if (v === undefined) {
      geoMissing = true;
      return undefined;
    }
    if (Number.isNaN(v) || !ok(v)) {
      errors[k] = msg;
      return undefined;
    }
    return v;
  };
  const pos = (v) => v > 0;
  const POS_MSG = 'Isi angka lebih dari 0';

  let area;
  if (p.mode === 'area') {
    area = take('area', pos, POS_MSG);
  } else {
    const a = take('a', pos, POS_MSG);
    const b = p.shape === 'trap' ? take('b', pos, POS_MSG) : 0;
    const t = take('t', pos, POS_MSG);
    let g;
    if (p.mode === 'projection') {
      if (p.angleMode === 'unknown') {
        const run = take('run', pos, POS_MSG);
        const rise = take('rise', pos, POS_MSG);
        if (run !== undefined && rise !== undefined) {
          const slope = Math.hypot(run, rise);
          g = (Math.atan2(rise, run) * 180) / Math.PI;
          derived = { slope, cos: run / slope, g };
          if (g < SUDUT_MIN || g > SUDUT_MAX) errors.rise = `Sudut hasil hitung ${f1(g)}° di luar ${SUDUT_MIN}–${SUDUT_MAX}°`;
        }
      } else {
        g = take('angle', (v) => v >= SUDUT_MIN && v <= SUDUT_MAX, `Isi ${SUDUT_MIN}–${SUDUT_MAX}°`);
      }
    }
    if (!geoMissing && Object.keys(errors).length === 0) {
      area = p.shape === 'rect' ? a * t : p.shape === 'trap' ? ((a + b) / 2) * t : (a * t) / 2;
      if (p.mode === 'projection') {
        area /= Math.cos((g * Math.PI) / 180);
        if (g < SUDUT_LANDAI) warnings.push(`Sudut di bawah ${SUDUT_LANDAI}°. Cek kemiringan minimum shingles pada spesifikasi GNET.`);
      }
      if (p.shape === 'trap' && b > a) warnings.push('Sisi nok (b) lebih panjang dari sisi talang (a). Pastikan tidak tertukar.');
    }
  }

  const geoErr = Object.keys(errors).length > 0;
  const wRaw = num(p.waste);
  let waste;
  if (wRaw === undefined) waste = undefined;
  else if (Number.isNaN(wRaw) || wRaw < 0 || wRaw > 100) errors.waste = 'Isi 0–100%';
  else waste = wRaw;

  const base = { area: geoErr ? undefined : area, derived, warnings, errors };
  if (Object.keys(errors).length) return { ...base, status: 'error' };
  if (geoMissing || area === undefined) return { ...base, status: 'empty', need: 'ukuran' };
  if (waste === undefined) return { ...base, status: 'empty', need: 'waste' };
  return { ...base, status: 'ok', waste, extra: (area * waste) / 100, order: area * (1 + waste / 100) };
}

export function summarize(results, coverage) {
  const okCount = results.filter((r) => r.status === 'ok').length;
  const errorCount = results.filter((r) => r.status === 'error').length;
  const count = results.length;
  const base = { okCount, errorCount, count, pending: count - okCount };
  if (!count || okCount !== count) return { ...base, complete: false };
  const area = results.reduce((s, r) => s + r.area, 0);
  const extra = results.reduce((s, r) => s + r.extra, 0);
  const order = results.reduce((s, r) => s + r.order, 0);
  const bundles = Math.ceil(order / coverage - 1e-10);
  const covered = bundles * coverage;
  return { ...base, complete: true, area, extra, order, bundles, covered, remainder: Math.max(0, covered - order), avgWaste: area ? (extra / area) * 100 : 0 };
}
