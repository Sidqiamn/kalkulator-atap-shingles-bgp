// =====================================================================
//  PENGATURAN KALKULATOR — cukup ubah angka di file ini
// =====================================================================

/**
 * Rekomendasi waste (%) per bentuk bidang.
 * Angka ini muncul sebagai "Rekomendasi: X%" dan otomatis mengisi
 * input waste setiap bidang. Sales tetap bisa mengubahnya per bidang.
 * Boleh desimal, contoh: 12.5
 */
export const WASTE_REKOMENDASI = {
  rect: 10, // Persegi panjang
  trap: 12, // Trapesium
  tri: 15, // Segitiga
  luasAktual: 10, // Mode "Luas Aktual" (bentuk bidang tidak dipilih)
};

/**
 * Tipe produk dan cakupan efektif per bundle (m²).
 * Sumber: E-Catalog GNET Atap Shingles 2026 — konfirmasi sebelum penawaran final.
 */
export const PRODUCTS = [
  { id: 'mosaic', name: 'Mosaic', coverage: 2.99 },
  { id: 'fish', name: 'Fish Scale', coverage: 3.1 },
  { id: 'laminated', name: 'Laminated', coverage: 2.32 },
  { id: 'single', name: 'Single Layer', coverage: 3.1 },
];
export const DEFAULT_PRODUCT = 'fish';

/** Batas sudut kemiringan yang diterima (°) */
export const SUDUT_MIN = 1;
export const SUDUT_MAX = 75;
/** Di bawah sudut ini muncul peringatan atap landai (°) */
export const SUDUT_LANDAI = 15;
