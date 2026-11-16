# Spec — WARIS! Kalkulator Waris Islam

## Capability: waris

### Overview
Satu capability: menghitung pembagian harta waris Islam (faraid) dari input
pengguna, menampilkan hasil + penjelasan, menyimpan skenario, dan
mengajarkan aturan dasarnya. Semua komputasi client-side, state persisten
di localStorage.

### Requirements

#### R1 — Input pewaris & harta (waterfall)
- SHALL: pengguna dapat memasukkan nama pewaris (opsional) dan jenis kelamin
  pewaris (laki-laki/perempuan) — jenis kelamin menentukan label pasangan
  (suami bila pewaris perempuan, istri bila pewaris laki-laki).
- SHALL: pengguna dapat memasukkan total harta (Rp, > 0), biaya pemakaman,
  utang, dan wasiat (masing-masing ≥ 0, default 0).
- SHALL: toggle "harta bersama (gono-gini)": bila aktif, 50% total harta
  dipisahkan untuk pasangan yang masih hidup SEBELUM potongan lain,
  dan ditampilkan sebagai baris tersendiri.
- SHALL: wasiat divalidasi maksimal 1/3 dari sisa setelah pemakaman+utang;
  bila input melebihi, aplikasi menampilkan peringatan dan memakai batas 1/3
  (dengan penjelasan).
- SHALL: aplikasi menampilkan waterfall harta bersih secara live:
  total → gono-gini → pemakaman → utang → wasiat → harta bersih yang dibagi.
- WHEN total harta ≤ 0 THEN tombol hitung nonaktif dengan pesan yang jelas.

#### R2 — Input ahli waris
- SHALL: tersedia stepper jumlah (0–20) untuk tiap jenis ahli waris:
  suami (hanya bila pewaris perempuan), istri 1–4 (hanya bila pewaris
  laki-laki), anak laki-laki, anak perempuan, ayah, ibu, kakek (ayah dari
  ayah), nenek (ibu dari ibu / ibu dari ayah), saudara kandung laki-laki,
  saudara kandung perempuan, saudara seayah laki-laki, saudara seayah
  perempuan, saudara seibu laki-laki, saudara seibu perempuan.
- SHALL: tersedia input ahli waris pengganti (KHI Pasal 185): untuk anak
  yang sudah meninggal lebih dulu, jumlah cucu laki-laki dan perempuan
  yang menggantikannya (dipisah anak laki-laki yang meninggal vs anak
  perempuan yang meninggal).
- SHALL: jenis ahli waris yang tidak relevan dengan jenis kelamin pewaris
  disembunyikan (suami vs istri).

#### R3 — Engine faraid (inti)
- SHALL: engine memakai aritmetika pecahan eksak (bukan float) untuk semua
  bagian, lalu mengonversi ke Rupiah bulat (sisa pembulatan ≤ jumlah ahli
  waris rupiah dialokasikan ke bagian terbesar, dan dicatat).
- SHALL: engine menerapkan hijab (penghalang): anak laki-laki menghalangi
  cucu & saudara; ayah menghalangi kakek & saudara; ibu menghalangi nenek;
  anak/cucu menghalangi saudara seibu; ayah/kakek menghalangi saudara
  kandung & seayah. Ahli waris yang terhalang tampil di hasil dengan
  keterangan "terhalang oleh X" dan bagian 0.
- SHALL: engine menerapkan bagian tetap (dzawil furud) sesuai QS An-Nisa
  11/12/176 + KHI 176–180: suami 1/2 tanpa anak, 1/4 bila ada anak;
  istri 1/4 tanpa anak, 1/8 bila ada anak (dibagi rata bila >1 istri);
  anak perempuan 1/2 bila tunggal, 2/3 bila ≥2, tanpa anak laki-laki;
  ayah 1/6 bila ada anak; ibu 1/6 bila ada anak atau ≥2 saudara,
  1/3 bila tidak; kakek seperti ayah bila ayah tiada; nenek 1/6 (dibagi
  rata bila dua nenek) bila ibu tiada; saudara seibu 1/6 bila tunggal,
  1/3 bila ≥2 (dibagi rata); saudara kandung perempuan 1/2 bila tunggal,
  2/3 bila ≥2 (tanpa saudara laki-laki).
- SHALL: engine menerapkan asabah (sisa) dengan urutan prioritas:
  anak laki-laki (2:1 dengan anak perempuan) → ayah (1/6 + sisa bila
  hanya ada anak perempuan; sisa penuh bila tanpa keturunan) → kakek →
  saudara kandung laki-laki (2:1 dengan saudara perempuan) → saudara
  seayah laki-laki → saudara kandung perempuan bila ada anak perempuan
  dan tanpa asabah laki-laki di atasnya.
- SHALL: engine menerapkan 'awl (KHI Pasal 192): bila jumlah bagian tetap
  > 1, semua bagian tetap dikecilkan proporsional; asabah mendapat 0.
- SHALL: engine menerapkan radd (KHI Pasal 193): bila jumlah bagian tetap
  < 1 dan tidak ada asabah, sisa dibagikan proporsional kepada ahli waris
  bagian tetap KECUALI suami/istri.
- SHALL: engine menangani kasus gharawain: pewaris tanpa anak, ada pasangan
  + ibu + ayah → ibu mendapat 1/3 dari sisa setelah pasangan, ayah
  mendapat sisa.
- SHALL: engine menangani ahli waris pengganti (KHI Pasal 185): bagian
  yang seharusnya diterima anak yang sudah meninggal dihitung seolah ia
  hidup, lalu dibagi kepada cucu-cucunya dengan rasio 2:1 (laki-laki :
  perempuan).
- SHALL: bila hanya pasangan yang menjadi ahli waris, pasangan mendapat
  100% harta bersih.
- SHALL: bila tidak ada ahli waris sama sekali, aplikasi menampilkan
  penjelasan (harta menjadi urusan baitul mal/negara — konsultasikan ke
  Pengadilan Agama), bukan angka kosong.
- SHALL: engine lolos 15 kasus uji yang tercantum di tasks.md (termasuk
  kasus 'awl klasik dan radd).

#### R4 — Hasil & penjelasan
- SHALL: hasil menampilkan per ahli waris: nama, jumlah orang, bagian
  pecahan (mis. "1/8 — seperdelapan"), persen, Rp per orang, dan Rp total.
- SHALL: hasil menampilkan distribution bar animasi: segmen proporsional
  per ahli waris dengan warna berbeda.
- SHALL: hasil menampilkan "Cara hitung" langkah-demi-langkah: tiap langkah
  menyebut ahli waris, alasan bagiannya, dan dalil (QS/KHI) — termasuk
  penanda bila terjadi 'awl, radd, gharawain, atau hijab.
- SHALL: total semua bagian = 100% harta bersih (ditampilkan sebagai
  lencana verifikasi "Terbagi 100%").
- SHALL: angka Rupiah dianimasikan count-up saat hasil muncul.

#### R5 — Contoh kasus (preset)
- SHALL: tersedia 3 contoh siap pakai yang mengisi form dengan sekali ketuk:
  (a) "Keluarga inti" — istri + 2 anak laki-laki + 1 anak perempuan;
  (b) "Tanpa anak" — suami + ayah + ibu (gharawain);
  (c) "Kasus 'awl" — istri + ayah + ibu + 2 anak perempuan.
- WHEN preset diketuk THEN form terisi dan hasil langsung dihitung.

#### R6 — Simpan skenario (localStorage)
- SHALL: pengguna dapat menyimpan skenario (nama + seluruh input + hasil
  ringkas) ke localStorage; daftar tersimpan tampil di tab Riwayat.
- SHALL: skenario tersimpan dapat dimuat kembali ke kalkulator dan dihapus.
- SHALL: data hanya tersimpan lokal di perangkat; tidak ada pengiriman data
  ke server mana pun (dinyatakan di UI).

#### R7 — Salin & cetak
- SHALL: tombol "Salin hasil" menyalin ringkasan teks berbahasa Indonesia
  yang rapi (cocok ditempel ke WhatsApp) berisi harta bersih + tiap ahli
  waris + total.
- SHALL: tombol "Cetak / Simpan PDF" memicu print stylesheet yang hanya
  mencetak ringkasan hasil (bukan seluruh aplikasi).

#### R8 — Edukasi (tab Pelajari)
- SHALL: tab Pelajari memuat: (a) tabel bagian tiap ahli waris + syaratnya;
  (b) urutan penyelesaian harta (pemakaman → utang → wasiat → waris);
  (c) glosarium istilah (dzawil furud, asabah, 'awl, radd, hijab,
  gono-gini, wasiat, ahli waris pengganti); (d) dalil (QS An-Nisa 11, 12,
  176 + KHI 176–193); (e) batasan & asumsi (kakek diperlakukan seperti
  ayah dan menghalangi saudara — pendapat Hanafi yang dipakai KHI;
  pengganti mengikuti KHI 185; kasus kompleks → Pengadilan Agama);
  (f) disclaimer: alat edukasi, bukan fatwa/putusan pengadilan.

#### R9 — Kualitas umum
- SHALL: mobile-first, satu kolom, tombol Hitung sticky di bawah pada layar
  kecil; tidak ada teks placeholder/lorem ipsum; tidak ada tombol mati.
- SHALL: copy Bahasa Indonesia natural; tanpa emoji pada label.
- SHALL: tidak ada error console; semua kontrol bekerja dari input pertama.
