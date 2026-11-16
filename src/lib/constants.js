export const MODES = {
  projection: { label: 'Dari Denah', hint: 'perlu sudut' },
  slope: { label: 'Di Atas Atap', hint: 'diukur langsung' },
  area: { label: 'Luas Aktual', hint: 'dari QS' },
};

export const SHAPES = {
  rect: 'Persegi panjang',
  trap: 'Trapesium',
  tri: 'Segitiga',
};

export const ANGLE_MODES = {
  known: { label: 'Sudut diketahui', hint: 'isi derajat' },
  unknown: { label: 'Sudut tidak diketahui', hint: 'hitung dari alas & tinggi' },
};

export const REC_NAMES = {
  rect: 'persegi panjang',
  trap: 'trapesium',
  tri: 'segitiga',
  luasAktual: 'luas aktual',
};

export const TEMPLATES = {
  satu: { label: '1 Bidang', hint: 'hitung satu sisi', planes: [['', 'rect']] },
  pelana: { label: 'Pelana', hint: '2 bidang', planes: [['Sisi depan', 'rect'], ['Sisi belakang', 'rect']] },
  limasan: {
    label: 'Limasan',
    hint: '4 bidang',
    planes: [['Sisi depan', 'trap'], ['Sisi belakang', 'trap'], ['Sisi kiri', 'tri'], ['Sisi kanan', 'tri']],
  },
};

export const TEMPLATE_INFO = {
  satu: 'Pilih bentuk bidangnya di bagian Bidang Atap: persegi panjang, trapesium, atau segitiga. Cocok untuk atap miring satu arah atau menghitung satu sisi atap saja.',
  pelana: '2 bidang persegi panjang. Dari denah: a = panjang atap (sejajar nok), t = ½ lebar denah. Biasanya sudut kedua sisi sama.',
  limasan:
    '2 trapesium + 2 segitiga. Dari denah: trapesium a = panjang denah, b = panjang nok, t = ½ lebar denah • segitiga a = lebar denah, t = ½ × (panjang denah − panjang nok).',
  custom: 'Susunan bidang sudah diubah manual. Pilih salah satu bentuk di atas untuk mulai ulang.',
};
