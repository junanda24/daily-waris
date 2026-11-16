# Tasks — WARIS! (2026-11-17)

## Propose (selesai)
- [x] Riset KHI 176–193 + faraid ('awl/radd/asabah/hijab/pengganti)
- [x] proposal.md, specs/waris/spec.md, design.md, tasks.md

## Apply
- [ ] 1. Tulis `engine/faraid.js` (pecahan eksak + algoritma §design) +
      `engine/faraid.test.js` (15 kasus uji) — JALANKAN `node` sampai hijau
- [ ] 2. PRODUCT.md + DESIGN.md di root project; jalankan impeccable
      `context` (bila launcher gagal, lanjut baca konteks langsung)
- [ ] 3. Bangun artifact static `waris-kalkulator-islam` sesuai design
      (4 tab, engine ditempel, animasi bar + count-up, salin/cetak,
      localStorage riwayat, preset, edukasi)
- [ ] 4. Verifikasi mandiri: tiap SHALL di spec → cek di artifact;
      mainkan alur penuh (preset → hitung → salin → simpan → muat → hapus);
      cek console bersih; cek mobile 390px

## Kasus uji engine (harus hijau semua)
1. Istri + 2 anakL + 1 anakP, 240jt → 30 / 84 / 84 / 42
2. Suami + ayah + ibu (gharawain), 120jt → 60 / 40 / 20
3. Istri + ibu + 2 anakP (radd), 240jt → 30 / 42 / 84 / 84
4. Istri + ayah + ibu + 2 anakP ('awl), 270jt → 30 / 40 / 40 / 80 / 80
5. 2 anakP + ayah, 180jt → 60 / 60 / 60
6. Suami + 1 anakP (radd), 120jt → 30 / 90
7. 1 sdrKandungL + 1 sdrKandungP saja, 90jt → 60 / 30
8. Ibu + 1 sdrSeibu (radd), 120jt → 80 / 40
9. Gono-gini + wasiat: total 400jt, gono-gini, makam 10, utang 30,
   wasiat 20 → bersih 140; istri + 1 anakL → 17,5 / 122,5
   (pasangan terima 200 gono-gini terpisah)
10. Pengganti KHI 185: 1 anakP hidup + 1 anakL meninggal (1 cucuL + 1 cucuP),
    150jt → anakP 50 / cucuL 66.667 / cucuP 33.333 (pembulatan ±1 Rp)
11. Istri saja, 100jt → 100
12. Ayah saja, 100jt → 100
13. 1 anakP saja, 100jt → 100 (1/2 + radd)
14. Kakek + ibu (tanpa anak), 120jt → ibu 40 / kakek 80
15. Istri + ayah + 1 anakP, 240jt → 30 / 120 / 90
16. Wasiat > 1/3: total 90jt, utang 0, makam 0, wasiat 40jt → wasiat
    dicap 30jt, bersih 60jt (peringatan tampil)
17. Istri + ibu + 1 sdrKandungP (tanpa anak): istri 1/4, ibu 1/3,
    sdrP 1/2 → Σ=13/12 → 'awl ke 13: 240jt → istri 55.385 (3/13),
    ibu 73.846 (4/13), sdrP 110.769 (6/13) — bulat ±1 Rp

## Archive
- [ ] Export artifact → `src/`; README lengkap; `.gitignore`
- [ ] `git init` + commit; buat repo `junanda24/daily-waris` (public);
      push via push_repo.py; verifikasi via API (source ADA di listing)
- [ ] Update `~/workspace/daily-webs/BUILT.md`
- [ ] Update profile README `junanda24/junanda24` (tabel Project harian)
- [ ] Arsip openspec → `openspec/changes/archive/2026-11-17-waris/`
- [ ] Log ke `~/memory/2026-11-17.md` + tracking entry goal
