# Proposal — WARIS! Kalkulator Waris Islam (Faraid)

## Apa ini
Web app kalkulator pembagian harta waris menurut hukum Islam (ilmu faraid),
berdasarkan QS An-Nisa ayat 11, 12, 176 dan Kompilasi Hukum Islam (KHI) Buku II
Pasal 176–193 — standar yang dipakai Pengadilan Agama di Indonesia.

Pengguna memasukkan: data pewaris, total harta, potongan (biaya pemakaman,
utang, wasiat, pemisahan harta bersama/gono-gini), lalu jumlah tiap ahli waris
(suami/istri, anak, ayah, ibu, kakek, nenek, saudara, cucu pengganti).
Aplikasi menghitung bagian tiap ahli waris dalam pecahan, persen, dan Rupiah,
lengkap dengan penjelasan langkah-demi-langkah (dalil tiap bagian) serta
penanganan kasus khusus: hijab (ahli waris terhalang), asabah (sisa),
'awl (bagian melebihi harta), radd (sisa dibagikan kembali), gharawain,
dan ahli waris pengganti (KHI Pasal 185).

## Kenapa ide ini mengejutkan
- **Tidak ada yang kepikiran bikin ini sebagai daily project.** Waris adalah
  topik yang hampir semua keluarga Muslim Indonesia akan hadapi, tapi
  kalkulator faraid berbahasa Indonesia yang bagus, jujur soal dalil, dan
  enak dipakai praktis tidak ada — yang ada situs lama, berbahasa Inggris,
  atau kalkulator yang hasilnya cuma angka tanpa penjelasan.
- **Ini bukan kalkulator satu rumus.** Engine-nya mengimplementasikan ilmu
  faraid beneran: 6 pecahan Qur'ani, aturan hijab, asabah berprioritas,
  'awl, radd, gharawain, plus kekhasan Indonesia: harta bersama (gono-gini)
  dan ahli waris pengganti KHI 185. Logikanya diuji dengan 15 kasus uji
  (termasuk kasus 'awl klasik istri+ayah+ibu+2 anak perempuan).
- **Kejujuran sebagai fitur.** Setiap bagian menampilkan dalilnya (QS/KHI),
  setiap asumsi mazhab ditulis terbuka di tab Pelajari, dan ada disclaimer
  jelas: ini alat edukasi, bukan fatwa atau putusan pengadilan.

## Kenapa bentuk output ini (web app, frontend-only, tanpa backend)
- Pengguna akhirnya keluarga biasa, bukan developer — mereka butuh buka link
  dan langsung pakai, bukan install package.
- Semua logika murni komputasi deterministik dari input pengguna; tidak ada
  data eksternal, tidak ada login, tidak ada server yang dibutuhkan.
- Data sensitif (harta keluarga) sebaiknya tidak keluar dari perangkat:
  semua tersimpan di localStorage saja. Frontend-only adalah pilihan privasi,
  bukan keterbatasan.

## Uji bar scope
- Bukan utilitas satu fungsi: engine faraid + waterfall harta + skenario
  tersimpan + contoh kasus + modul edukasi + salin/cetak hasil.
- Sekelas patokan (JUKIR!/TAWAR!/BengkelCheck): ya — produk beneran dengan
  alur end-to-end (input → hitung → pahami → simpan → bagikan).
- Bukan kata-angka/Berani Resign: bukan satu layar satu rumus.

## IP check
- Semua aset original: pola geometris bintang delapan digambar sebagai SVG
  inline, tidak ada gambar/foto pihak ketiga, tidak ada karakter berlisensi.
- Kutipan ayat Al-Qur'an (An-Nisa 11, 12, 176) adalah teks suci domain publik,
  dikutip singkat dengan rujukan jelas.

## Anti-AI-slop
Copy memakai bahasa Indonesia natural, istilah faraid yang benar
(dzawil furud, asabah, 'awl, radd, hijab, gono-gini, wasiat), tanpa emoji
di label, tanpa kalimat generik ("selamat datang di aplikasi...").
Nada: tenang, hormat, jelas — topiknya sensitif (orang meninggal),
jadi tidak ada confetti, tidak ada lelucon.
