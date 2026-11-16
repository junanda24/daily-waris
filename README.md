# WARIS! — Kalkulator Waris Islam (Faraid)

Kalkulator pembagian harta waris menurut hukum Islam (ilmu faraid),
berdasarkan **QS An-Nisa ayat 11, 12, 176** dan **Kompilasi Hukum Islam (KHI)
Buku II Pasal 176–193** — standar yang dipakai Pengadilan Agama di Indonesia.

Bukan sekadar kalkulator angka: WARIS! menjelaskan **kenapa** tiap ahli waris
mendapat bagiannya (dalil tiap bagian), menangani kasus-kasus khusus ilmu
faraid ('awl, radd, gharawain, hijab, ahli waris pengganti), dan memisahkan
harta bersama (gono-gini) sebelum pembagian — hal yang sering jadi sumber
ribut keluarga.

> **Ini alat edukasi, bukan fatwa atau putusan pengadilan.** Kasus kompleks,
> sengketa, atau harta berupa perusahaan: konsultasikan ke Pengadilan Agama
> atau ustaz yang berkompeten.

## Kenapa ide ini dipilih

Topik waris akan dihadapi hampir semua keluarga Muslim Indonesia — tapi
kalkulator faraid berbahasa Indonesia yang bagus, jujur soal dalil, dan enak
dipakai praktis tidak ada. Yang ada situs lama, berbahasa Inggris, atau
kalkulator yang hasilnya cuma angka tanpa penjelasan. WARIS! menutup celah
itu: engine faraid beneran (bukan satu rumus), penjelasan langkah-demi-langkah,
dan semua data tetap di perangkat pengguna (privasi harta keluarga).

## Fitur

- **Waterfall harta** — total harta → pisah gono-gini (50% untuk pasangan
  hidup) → biaya pemakaman → utang → wasiat (otomatis dibatasi maks 1/3)
  → harta bersih yang dibagi. Ditampilkan live saat mengetik.
- **Engine faraid teruji** — pecahan eksak (bukan float), 20 kasus uji hijau:
  - Bagian tetap (dzawil furud): suami 1/2–1/4, istri 1/4–1/8, anak
    perempuan 1/2–2/3, ayah/ibu 1/6–1/3, kakek, nenek, saudara.
  - Asabah (penerima sisa) dengan urutan prioritas + rasio 2:1.
  - **'Awl** (KHI 192): bagian melebihi harta → dikecilkan proporsional.
  - **Radd** (KHI 193): sisa dibagikan kembali, kecuali pasangan.
  - **Gharawain**: ibu 1/3 dari sisa, ayah ambil sisanya.
  - **Hijab**: ahli waris yang terhalang tampil dengan keterangan
    "Terhalang oleh X" (bagian Rp 0).
  - **Ahli waris pengganti** (KHI 185): cucu menggantikan orang tua yang
    meninggal lebih dulu, dibagi 2:1.
  - Hanya pasangan → 100%. Tanpa ahli waris → penjelasan baitul mal.
- **Cara hitung** — tiap hasil disertai langkah bernomor + dalil (QS/KHI).
- **Contoh kasus siap pakai** — Keluarga inti, Tanpa anak (gharawain),
  Kasus 'awl; sekali ketuk langsung terhitung.
- **Simpan skenario** — riwayat perhitungan tersimpan di localStorage
  (hanya di perangkat, tidak dikirim ke mana pun); bisa dimuat & dihapus.
- **Salin hasil** — ringkasan teks rapi siap tempel ke WhatsApp.
- **Cetak / Simpan PDF** — print stylesheet hanya mencetak ringkasan.
- **Tab Pelajari** — tabel bagian tiap ahli waris, urutan penyelesaian harta,
  glosarium (dzawil furud, asabah, 'awl, radd, hijab, gono-gini, wasiat),
  dalil, serta batasan & asumsi yang ditulis jujur.
- **Delight** — distribution bar animasi + count-up Rupiah saat hasil muncul.

## Cara pakai

1. Buka link aplikasi di HP atau laptop.
2. Isi jenis kelamin pewaris, total harta, dan (bila ada) pemakaman, utang,
   wasiat; aktifkan gono-gini bila harta tersebut harta bersama.
3. Atur jumlah tiap ahli waris dengan tombol − / +; tambahkan ahli waris
   pengganti bila ada anak yang meninggal lebih dulu.
4. Ketuk **Hitung Pembagian** — hasil, grafik pembagian, dan penjelasan
   langkah-demi-langkah muncul di bawah.
5. Salin hasilnya untuk dibagikan ke keluarga, atau simpan sebagai skenario.

## Tech stack

- Frontend-only, tanpa backend (sengaja: data harta keluarga tidak boleh
  keluar dari perangkat).
- HTML + CSS + JavaScript vanilla (single-page artifact).
- Engine faraid: `engine/faraid.js` — modul JS murni, aritmetika pecahan
  eksak, 20 kasus uji (`engine/faraid.test.js`, jalankan `node faraid.test.js`).
- Font: Fraunces + Inter + Amiri (Google Fonts).
- State persisten: localStorage (skenario tersimpan).

## Struktur folder

```
2026-11-17-waris/
  README.md                  # file ini
  PRODUCT.md, DESIGN.md      # konteks produk & desain
  engine/
    faraid.js                # engine faraid (modul murni, bisa dipakai ulang)
    faraid.test.js           # 20 kasus uji (node) — HARUS hijau
  src/                       # hasil export artifact (index.html dkk.)
  openspec/changes/
    2026-11-17-waris/        # proposal, spec, design, tasks
    archive/2026-11-17-waris/
```

## Menjalankan dari source

```bash
# Tes engine (wajib hijau sebelum mengubah logika):
cd engine && node faraid.test.js

# Aplikasi web: buka src/index.html di browser,
# atau sajikan statis: npx serve src
```

## Link hasil

- Aplikasi: artifact Muse `waris-kalkulator-waris-islam` (web app statis,
  dibuka lewat kartu artifact di app Muse; belum di-share publik, belum
  deploy Vercel — keputusan di tangan Junan)
- Repo: https://github.com/junanda24/daily-waris

## Catatan / temuan saat build

- **Keputusan: frontend-only.** Bukan keterbatasan — privasi. Harta keluarga
  tidak seharusnya transit ke server mana pun.
- **Kakek diperlakukan seperti ayah** (menghalangi saudara) mengikuti
  pendapat Hanafi yang dipakai KHI. Mazhab Syafi'i punya rincian berbeda
  untuk kakek + saudara (muqasamah) — sengaja tidak diimplementasikan dan
  ditulis terbuka di tab Pelajari sebagai batasan.
- **Saudara tetap dihitung untuk syarat "dua saudara atau lebih"** yang
  menurunkan bagian ibu ke 1/6, meski mereka terhalang — mengikuti jumhur.
- **Paman/bibi tidak dihitung** (di luar cakupan v1); anak angkat/anak tiri
  bukan ahli waris (bisa menerima wasiat maks 1/3).
- **Bug yang ketemu saat tes engine:** bagian cucu pengganti sempat memakai
  share per orang, bukan share kelompok — ketahuan oleh kasus uji 19
  (2 cucu perempuan). Diperbaiki sebelum build artifact.
- **Pembulatan Rupiah:** floor per ahli waris, sisa (maks beberapa Rupiah)
  ke bagian terbesar; total akhir dijamin persis = harta bersih
  (dicek `checkOk` di engine + lencana "Terbagi 100%" di UI).
- **Tidak dibuat:** mode gelap, multi-bahasa, dan ekspor Excel — sengaja
  dipangkas demi fokus (daily scope).

## Rilis

- 2026-11-17 — v1.0, program "1 Hari 1 Project".
