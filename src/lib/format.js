const nf2 = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nfx = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });
const nf1 = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf3 = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export const f2 = (n) => nf2.format(n);
export const fx = (n) => nfx.format(n);
export const f1 = (n) => nf1.format(n);
export const f3 = (n) => nf3.format(n);
export const m2 = (n) => `${nf2.format(n)} m²`;
/** Angka untuk diisi ke input (tanpa pemisah ribuan, desimal koma) */
export const inputNum = (n) => nfx.format(n).replace(/\./g, '');

/** Terima koma atau titik desimal. undefined = kosong, NaN = tidak valid */
export function num(v) {
  const s = String(v ?? '').trim().replace(',', '.');
  if (s === '') return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export function formatDate(v) {
  if (!v) return '-';
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
