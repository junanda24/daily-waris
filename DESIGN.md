# DESIGN.md — WARIS! Kalkulator Waris Islam

## Dunia visual
Tenang, hormat, dapat dipercaya. Krem kertas `#FAF6EF`, putih hangat `#FFFDF8`,
hijau zamrud gelap `#0B3D2E` (primary), emas `#B98A1F` (aksen), tinta `#1C2B23`,
sage `#6B7F72`. Kontras ≥ 4.5:1.

## Tipografi
Fraunces (display serif — judul & angka besar), Inter (body/label),
Amiri (satu baris kutipan Arab). Angka tabular.

## Motif
Pita pola geometris bintang delapan (SVG inline, digambar sendiri) di header —
satu-satunya ornamen. Tanpa emoji sebagai ikon (ikon SVG garis tipis).

## Layout
Satu kolom max-width 640px, mobile-first. 4 tab: Kalkulator, Contoh Kasus,
Pelajari, Riwayat. Tombol Hitung sticky di bawah (mobile). Distribution bar
horizontal dengan segmen per kelompok ahli waris.

## Motion (satu momen authored)
Saat hasil muncul: distribution bar tumbuh 0 → lebar akhir (ease-out 700ms)
+ angka Rupiah count-up. Selain itu hanya transisi hover/focus.
Tanpa confetti (topik sensitif).

## Craft floor
Tanpa kicker/eyebrow, tanpa kartu ikon-judul-teks sebagai struktur, tanpa
gradient text, tanpa hard offset shadow. Selection emas, focus ring hijau,
scrollbar tipis senada.
