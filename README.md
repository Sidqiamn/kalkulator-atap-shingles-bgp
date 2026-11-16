# Kalkulator Kebutuhan GNET Atap Shingles (React + Tailwind)

Versi 2 kalkulator estimasi bundle shingles, dibuat dengan React 18, Vite 5, dan Tailwind CSS 3.

## Mengubah angka (tanpa menyentuh kode lain)

Semua angka yang sering diubah ada di **`src/config.js`**:

| Pengaturan | Isi |
|---|---|
| `WASTE_REKOMENDASI` | Rekomendasi waste (%) per bentuk bidang: persegi panjang, trapesium, segitiga, luas aktual |
| `PRODUCTS` | Tipe shingles dan cakupan m²/bundle |
| `SUDUT_MIN`, `SUDUT_MAX`, `SUDUT_LANDAI` | Batas sudut dan batas peringatan atap landai |

## Menjalankan di komputer

Butuh Node.js 18 atau lebih baru.

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya http://localhost:5173).

## Deploy ke Vercel

1. Ganti isi repo lama dengan seluruh isi folder ini (hapus `index.html` lama yang berisi kalkulator versi 1).
2. `git add .` → `git commit -m "kalkulator v2 react"` → `git push`.
3. Vercel otomatis menjalankan `npm run build` dan menayangkan folder `dist` (sudah diatur di `vercel.json`).
4. Jika masih tampil halaman kosong/404, buka **Project → Settings → Build and Deployment** lalu pastikan
   **Framework Preset = Vite**, **Build Command = `npm run build`**, **Output Directory = `dist`**.

## Struktur

```
src/
  config.js              ← angka yang bisa diubah
  lib/calc.js            ← rumus luas, sudut, waste per bidang, total bundle
  lib/summary.js         ← teks "Salin ringkasan"
  components/
    ProjectInfo.jsx      ← 01 Informasi proyek, tipe shingles, bentuk atap
    PlaneCard.jsx        ← kartu tiap bidang atap
    ResultPanel.jsx      ← 03 Hasil estimasi
    diagrams.jsx         ← ilustrasi ukur bidang & tampak samping
```

## Karakter asisten

Karakter kontraktor di pojok kanan bawah ada di `src/components/MascotFigure.jsx` (gambar SVG) dan
`src/components/Mascot.jsx` (logika pose & balon kata, animasi pakai library [Motion](https://motion.dev)).

| Kondisi | Pose | Pesan |
|---|---|---|
| Baru dibuka | Melambai | Salam pembuka |
| Ukuran belum lengkap | Memegang meteran | Jumlah bidang yang belum lengkap |
| Ada input salah | Menggaruk helm | Jumlah bidang yang perlu dicek |
| Hasil lengkap | Jempol + lompat kecil | Total bundle & tipe produk |

- Kalimat pesan bisa diubah di fungsi `getMessage` dalam `Mascot.jsx`.
- Di HP karakter mulai sebagai avatar bulat kecil; ketuk untuk membuka. Tombol "–" untuk memperkecil.
- Pada layar ≥1280px, konten digeser sedikit ke kiri supaya karakter tidak menutupi panel hasil.
- Animasi otomatis dimatikan bila perangkat memakai pengaturan "kurangi gerakan".

## Rumus

- Luas bidang: persegi = a × t, trapesium = (a + b) ÷ 2 × t, segitiga = a × t ÷ 2
- Dari denah: luas ÷ cos(sudut). Bila sudut tidak diketahui: sudut = arctan(tinggi ÷ alas)
- Tiap bidang: luas order = luas × (1 + waste bidang ÷ 100)
- Jumlah bundle = pembulatan ke atas (Σ luas order ÷ cakupan per bundle)
