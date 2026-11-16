# Design — WARIS! Kalkulator Waris Islam

## Bentuk output
Web app static (artifact), frontend-only, tanpa backend. Alasan: logika murni
komputasi deterministik; data harta keluarga tidak boleh keluar dari perangkat.

## Stack
- Artifact static: `index.html` + `styles.css` + `app.js` (pola baku
  ARCHITECTURE.md §1: satu objek `state`, data terpisah dari logic, fungsi
  `render()` murni state → DOM, handler tipis, satu modul `store` untuk
  localStorage, IIFE/module scope).
- Engine faraid sebagai modul JS murni (`engine/faraid.js` di repo, dites
  dengan Node sebelum ditempel ke artifact). Aritmetika pecahan eksak
  (pembilang/penyebut + gcd), tanpa float untuk bagian.
- Font: Fraunces (display serif) + Inter (body) via Google Fonts; Amiri
  untuk satu baris kutipan Arab. Tanpa library lain — tidak butuh GSAP;
  animasi cukup CSS transition + count-up JS.

## Arsitektur state (lima keranjang, ARCHITECTURE.md)
1. **Lokal** — input form (pewaris, harta, ahli waris), tab aktif, hasil
   hitung terakhir. Semua di satu objek `state`.
2. **URL** — tidak dipakai (bukan state shareable; data sensitif).
3. **Server state** — tidak ada (tanpa backend).
4. **Global client UI** — toast (salin berhasil / skenario tersimpan).
5. **Form** — validasi inline di handler (wasiat > 1/3, harta ≤ 0).

## Engine faraid — algoritma
1. Normalisasi input → daftar ahli waris + jumlah.
2. Hijab: tentukan yang berhak (eligible) + yang terhalang + oleh siapa.
3. Pengganti (KHI 185): anak yang meninggal diwakili secara virtual untuk
   hitung bagian, lalu bagiannya diteruskan ke cucu-cucunya 2:1.
4. Cek gharawain (tanpa anak + pasangan + ibu + ayah).
5. Tetapkan bagian tetap (furud) per aturan R3.
6. Tentukan asabah (prioritas) → ambil sisa.
7. Bila Σ furud > 1 → 'awl (skala proporsional, asabah 0).
   Bila Σ furud < 1 dan tanpa asabah → radd (sisa proporsional ke furud
   non-pasangan).
8. Bila hanya pasangan → 100%. Bila tanpa ahli waris → status khusus.
9. Konversi ke Rupiah: exact fraction × harta bersih → floor per ahli waris,
   sisa rupiah ke bagian terbesar. Kembalikan juga `steps[]` (penjelasan +
   dalil tiap keputusan) dan `flags` (awl/radd/gharawain/hijab).

## Visual direction (mode: Operate — tool yang dipercaya)
- **Dunia visual:** tenang, hormat, dapat dipercaya. Bukan playful.
- **Palet:** krem kertas `#FAF6EF` (bg), putih hangat `#FFFDF8` (surface),
  hijau zamrud gelap `#0B3D2E` (primary), emas `#B98A1F` (aksen),
  tinta `#1C2B23`, sage `#6B7F72` (sekunder). Kontras ≥ 4.5:1.
- **Tipografi:** Fraunces untuk judul & angka besar (editorial, hangat);
  Inter untuk body/label; Amiri untuk kutipan Arab.
- **Motif:** pita pola geometris bintang delapan (SVG inline, digambar
  sendiri) di header — satu-satunya ornamen.
- **Layout:** satu kolom max-width 640px, kartu-kartu dengan pemisah yang
  jelas, section heading lebih besar dari label, tombol Hitung sticky bawah
  (mobile). Distribution bar horizontal dengan segmen berwarna (satu warna
  per kelompok ahli waris, emas untuk pasangan, hijau untuk anak, sage
  untuk orang tua, coklat muda untuk saudara).
- **Motion (satu momen authored):** saat hasil muncul — distribution bar
  tumbuh dari 0 ke lebar akhir (ease-out 700ms) + angka Rupiah count-up.
  Selain itu hanya transisi hover/focus. Tanpa confetti (topik sensitif).
- **States:** hover/focus jelas, disabled pada Hitung bila harta invalid,
  empty state di Riwayat, toast sukses salin/simpan.
- **Browser surfaces:** selection color emas, focus ring hijau, scrollbar
  tipis senada, angka tabular (font-variant-numeric).
- **Craft floor:** tanpa kicker/eyebrow di atas heading, tanpa kartu
  ikon-judul-teks sebagai struktur, tanpa gradient text, tanpa emoji
  sebagai ikon (ikon SVG garis tipis: kalkulator, buku, riwayat, salin).

## Struktur layar (satu halaman, 4 tab)
1. **Kalkulator** — Pewaris → Harta (waterfall live) → Ahli waris
   (stepper) → Pengganti → [Hitung] → Hasil (ringkasan, distribution bar,
   tabel, cara hitung, salin/simpan/cetak).
2. **Contoh Kasus** — 3 kartu preset.
3. **Pelajari** — tabel bagian, urutan penyelesaian, glosarium, dalil,
   batasan & asumsi, disclaimer.
4. **Riwayat** — skenario tersimpan (localStorage).

## File di repo
```
2026-11-17-waris/
  README.md
  PRODUCT.md, DESIGN.md        # konteks impeccable
  engine/faraid.js             # engine murni + tes (node)
  engine/faraid.test.js
  src/                         # hasil export artifact
  openspec/changes/2026-11-17-waris/  → archive/ setelah selesai
```
