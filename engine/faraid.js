/**
 * WARIS! — Engine faraid (ilmu waris Islam)
 * Berdasarkan QS An-Nisa 11, 12, 176 dan Kompilasi Hukum Islam (KHI)
 * Buku II Pasal 176-193. Aritmetika pecahan eksak (bukan float).
 *
 * Asumsi yang didokumentasikan (lihat README + tab Pelajari):
 *  - Kakek diperlakukan seperti ayah bila ayah tiada, dan menghalangi
 *    saudara (pendapat Hanafi yang dipakai KHI).
 *  - Ahli waris pengganti mengikuti KHI Pasal 185 (cucu menggantikan
 *    orang tua yang meninggal lebih dulu; bagiannya dibagi 2:1).
 *  - Saudara (semua jenis) tetap dihitung untuk syarat "dua saudara atau
 *    lebih" yang menurunkan bagian ibu ke 1/6, meski mereka terhalang.
 *  - Paman/bibi dan kerabat lebih jauh TIDAK dihitung (di luar cakupan).
 *  - Anak yang meninggal dihitung sebagai ahli waris virtual untuk
 *    menentukan bagian yang lain, lalu bagiannya diteruskan ke cucu.
 */
(function (root) {
  'use strict';

  // ---------- Pecahan eksak ----------
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function F(n, d) {
    if (d === undefined) d = 1;
    if (d < 0) { n = -n; d = -d; }
    if (n === 0) return { n: 0, d: 1 };
    var g = gcd(n, d); return { n: n / g, d: d / g };
  }
  function fadd(a, b) { return F(a.n * b.d + b.n * a.d, a.d * b.d); }
  function fsub(a, b) { return F(a.n * b.d - b.n * a.d, a.d * b.d); }
  function fmul(a, b) { return F(a.n * b.n, a.d * b.d); }
  function fdiv(a, b) { return F(a.n * b.d, a.d * b.n); }
  function fcmp(a, b) { var x = a.n * b.d - b.n * a.d; return x > 0 ? 1 : x < 0 ? -1 : 0; }
  function fnum(a) { return a.n / a.d; }
  function fstr(a) { return a.n + '/' + a.d; }
  var ZERO = F(0), ONE = F(1);

  var FRACTION_WORDS = {
    '1/2': 'separuh', '1/3': 'sepertiga', '1/4': 'seperempat',
    '1/6': 'seperenam', '1/8': 'seperdelapan', '2/3': 'dua pertiga'
  };

  function num(v) { v = Number(v) || 0; return v < 0 ? 0 : v; }
  function fmtRp(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function dalilFor(key) {
    switch (key) {
      case 'spouse': return 'QS An-Nisa 12; KHI Pasal 179–180';
      case 'sons': case 'daughters': return 'QS An-Nisa 11; KHI Pasal 176';
      case 'father': return 'QS An-Nisa 11; KHI Pasal 177';
      case 'mother': return 'QS An-Nisa 11; KHI Pasal 178';
      case 'grandfather': return 'QS An-Nisa 11; KHI Pasal 184';
      case 'grandmothers': return 'QS An-Nisa 11; KHI Pasal 183';
      case 'fullBrothers': case 'fullSisters': return 'QS An-Nisa 176; KHI Pasal 181';
      case 'patBrothers': case 'patSisters': return 'QS An-Nisa 176; KHI Pasal 182';
      case 'utSiblings': return 'QS An-Nisa 12; KHI Pasal 181';
      default: return 'KHI Pasal 176–193';
    }
  }

  function compute(input) {
    var inp = input || {};
    var gender = inp.gender === 'P' ? 'P' : 'L';
    var spouseCount = Math.min(4, Math.max(0, Math.floor(num(inp.spouseCount))));
    if (gender === 'P') spouseCount = Math.min(1, spouseCount);
    var sons = Math.floor(num(inp.sons));
    var daughters = Math.floor(num(inp.daughters));
    var father = !!inp.father, mother = !!inp.mother;
    var grandfather = !!inp.grandfather && !father;
    var grandmotherM = !!inp.grandmotherM && !mother;
    var grandmotherF = !!inp.grandmotherF && !mother && !father;
    var fullB = Math.floor(num(inp.fullBrothers));
    var fullS = Math.floor(num(inp.fullSisters));
    var patB = Math.floor(num(inp.patBrothers));
    var patS = Math.floor(num(inp.patSisters));
    var utB = Math.floor(num(inp.utBrothers));
    var utS = Math.floor(num(inp.utSisters));

    function cleanDead(list) {
      return (list || []).filter(function (e) {
        return Math.floor(num(e.boys)) + Math.floor(num(e.girls)) > 0;
      }).map(function (e) {
        return { boys: Math.floor(num(e.boys)), girls: Math.floor(num(e.girls)) };
      });
    }
    var deadSons = cleanDead(inp.deadSons);
    var deadDaughters = cleanDead(inp.deadDaughters);

    var total = Math.floor(num(inp.total));
    var funeral = Math.floor(num(inp.funeral));
    var debt = Math.floor(num(inp.debt));
    var bequestRaw = Math.floor(num(inp.bequest));
    var joint = !!inp.jointProperty && spouseCount > 0;

    var steps = [];
    var flags = { awl: false, radd: false, gharawain: false, bequestCapped: false };
    var excluded = [];

    // ---------- Waterfall harta ----------
    var jointAmount = joint ? Math.floor(total / 2) : 0;
    if (joint) steps.push({ text: 'Harta bersama (gono-gini) dipisah dulu: separuh (Rp ' + fmtRp(jointAmount) + ') menjadi hak pasangan yang masih hidup.', dalil: 'Harta bersama — praktik & KHI Buku I' });
    var base = total - jointAmount;
    var afterFuneral = base - funeral;
    if (funeral > 0) steps.push({ text: 'Biaya pemakaman Rp ' + fmtRp(funeral) + ' dibayar dari harta pewaris.', dalil: 'QS An-Nisa 11–12' });
    var afterDebt = afterFuneral - debt;
    if (debt > 0) steps.push({ text: 'Utang Rp ' + fmtRp(debt) + ' dilunasi dari harta pewaris.', dalil: 'QS An-Nisa 11–12' });
    var bequestMax = Math.max(0, Math.floor(afterDebt / 3));
    var bequest = Math.min(bequestRaw, bequestMax);
    if (bequestRaw > bequestMax) {
      flags.bequestCapped = true;
      steps.push({ text: 'Wasiat dibatasi maksimal sepertiga harta (Rp ' + fmtRp(bequestMax) + '); kelebihan butuh persetujuan ahli waris.', dalil: 'Hadis: "Sepertiga, dan sepertiga itu sudah banyak" (HR Bukhari)' });
    } else if (bequest > 0) {
      steps.push({ text: 'Wasiat Rp ' + fmtRp(bequest) + ' dilaksanakan (maksimal sepertiga).', dalil: 'QS An-Nisa 11–12' });
    }
    var net = afterDebt - bequest;
    if (net <= 0) {
      return { error: 'Harta bersih tidak tersisa (Rp ' + fmtRp(net) + ') setelah gono-gini, pemakaman, utang, dan wasiat. Tidak ada yang bisa dibagi.',
        gross: total, jointAmount: jointAmount, funeral: funeral, debt: debt,
        bequest: bequest, bequestMax: bequestMax, net: net, steps: steps, flags: flags };
    }

    // ---------- Hitungan gabungan (hidup + virtual) ----------
    var dSons = sons + deadSons.length;       // anak laki-laki (hidup + virtual)
    var dDaughters = daughters + deadDaughters.length;
    var hasDescendant = dSons > 0 || dDaughters > 0;
    var hasSons = dSons > 0;
    var siblingCountAll = fullB + fullS + patB + patS + utB + utS;

    // ---------- Hijab ----------
    var hasFatherOrGrandfather = father || grandfather;
    var sibEligible = !hasDescendant && !hasFatherOrGrandfather;
    function excl(label, by) { excluded.push({ label: label, blockedBy: by }); }

    var g = {}; // kelompok HIDUP saja: key -> {label,count,furud,asabah,note}
    function addGroup(key, label, count) {
      if (count <= 0) return null;
      g[key] = { key: key, label: label, count: count, furud: ZERO, asabah: ZERO, note: '' };
      return g[key];
    }
    if (spouseCount > 0) addGroup('spouse', gender === 'L' ? 'Istri' : 'Suami', spouseCount);
    if (sons > 0) addGroup('sons', 'Anak laki-laki', sons);
    if (daughters > 0) addGroup('daughters', 'Anak perempuan', daughters);
    if (father) addGroup('father', 'Ayah', 1);
    if (mother) addGroup('mother', 'Ibu', 1);
    if (grandfather) addGroup('grandfather', 'Kakek', 1);
    if (grandmotherM || grandmotherF) addGroup('grandmothers', 'Nenek', (grandmotherM ? 1 : 0) + (grandmotherF ? 1 : 0));
    if (sibEligible) {
      if (fullB > 0) addGroup('fullBrothers', 'Saudara kandung laki-laki', fullB);
      if (fullS > 0) addGroup('fullSisters', 'Saudara kandung perempuan', fullS);
      if (patB > 0 && fullB === 0) addGroup('patBrothers', 'Saudara seayah laki-laki', patB);
      if (patS > 0) addGroup('patSisters', 'Saudara seayah perempuan', patS);
      if (utB + utS > 0) addGroup('utSiblings', 'Saudara seibu', utB + utS);
    }
    if (!sibEligible && siblingCountAll > 0) {
      excl('Saudara (' + siblingCountAll + ' orang)', hasDescendant ? 'anak/cucu pewaris' : (father ? 'ayah' : 'kakek'));
    } else if (sibEligible && patB > 0 && fullB > 0) {
      excl('Saudara seayah laki-laki (' + patB + ' orang)', 'saudara kandung laki-laki');
    }
    if (father && inp.grandfather) excl('Kakek', 'ayah');
    if (mother && (inp.grandmotherM || inp.grandmotherF)) excl('Nenek', 'ibu');
    if (father && inp.grandmotherF) excl('Nenek dari ayah', 'ayah');

    var hasAnyHeir = Object.keys(g).length > 0 || deadSons.length > 0 || deadDaughters.length > 0;
    if (!hasAnyHeir) {
      return { error: 'Tidak ada ahli waris yang tercatat. Bila pewaris benar-benar tidak meninggalkan ahli waris, harta menjadi urusan baitul mal (negara) — konsultasikan ke Pengadilan Agama.',
        gross: total, jointAmount: jointAmount, funeral: funeral, debt: debt,
        bequest: bequest, bequestMax: bequestMax, net: net, steps: steps, flags: flags };
    }

    // ---------- Kasus khusus: hanya pasangan ----------
    if (Object.keys(g).length === 1 && g.spouse && deadSons.length === 0 && deadDaughters.length === 0) {
      g.spouse.furud = ONE;
      g.spouse.note = 'Satu-satunya ahli waris — mendapat seluruh harta bersih.';
      steps.push({ text: 'Hanya pasangan yang menjadi ahli waris, maka seluruh harta bersih menjadi haknya.', dalil: 'Kaidah: pasangan mendapat seluruh harta bila tidak ada ahli waris lain' });
      return finalize({ spouse: ONE }, {}, ZERO, null);
    }

    // ---------- Gharawain ----------
    if (!hasDescendant && g.spouse && g.mother && g.father) {
      flags.gharawain = true;
      var spouseShare = gender === 'L' ? F(1, 4) : F(1, 2);
      var rem = fsub(ONE, spouseShare);
      g.spouse.note = gender === 'L' ? 'Istri mendapat 1/4 karena pewaris tidak meninggalkan anak.' : 'Suami mendapat 1/2 karena pewaris tidak meninggalkan anak.';
      g.mother.note = 'Ibu mendapat sepertiga dari sisa setelah bagian pasangan (kasus gharawain).';
      g.father.note = 'Ayah mendapat sisa harta (kasus gharawain).';
      steps.push({ text: 'Kasus gharawain: tanpa anak, bersama pasangan + ibu + ayah — ibu mendapat 1/3 dari sisa, ayah mendapat sisanya.', dalil: 'KHI Pasal 177–178 jo. SEMA No. 2/1994' });
      return finalize({ spouse: spouseShare, mother: fmul(rem, F(1, 3)) }, { father: fmul(rem, F(2, 3)) }, ZERO, null);
    }

    // ---------- Bagian tetap (furud) — gabungan hidup + virtual ----------
    var furud = {}; // key -> fraction (kelompok gabungan; daughters = hidup+virtual)
    function setFurud(k, v) { furud[k] = v; }
    if (g.spouse) {
      var sp = gender === 'L' ? (hasDescendant ? F(1, 8) : F(1, 4)) : (hasDescendant ? F(1, 4) : F(1, 2));
      setFurud('spouse', sp);
      g.spouse.note = gender === 'L'
        ? (hasDescendant ? 'Istri mendapat 1/8 karena pewaris meninggalkan anak.' : 'Istri mendapat 1/4 karena pewaris tidak meninggalkan anak.')
        : (hasDescendant ? 'Suami mendapat 1/4 karena pewaris meninggalkan anak.' : 'Suami mendapat 1/2 karena pewaris tidak meninggalkan anak.');
    }
    if (dDaughters > 0 && !hasSons) {
      setFurud('daughters', dDaughters === 1 ? F(1, 2) : F(2, 3));
      if (g.daughters) g.daughters.note = dDaughters === 1
        ? 'Anak perempuan tunggal mendapat 1/2 (tanpa anak laki-laki).'
        : 'Dua anak perempuan atau lebih bersama-sama mendapat 2/3 (tanpa anak laki-laki).';
    }
    if (g.father && hasDescendant) { setFurud('father', F(1, 6)); g.father.note = 'Ayah mendapat 1/6 karena pewaris meninggalkan anak.'; }
    if (g.mother) {
      if (hasDescendant || siblingCountAll >= 2) {
        setFurud('mother', F(1, 6));
        g.mother.note = hasDescendant ? 'Ibu mendapat 1/6 karena pewaris meninggalkan anak.' : 'Ibu mendapat 1/6 karena ada dua saudara atau lebih.';
      } else {
        setFurud('mother', F(1, 3));
        g.mother.note = 'Ibu mendapat 1/3 karena pewaris tidak meninggalkan anak dan saudara kurang dari dua.';
      }
    }
    if (g.grandfather && hasDescendant) { setFurud('grandfather', F(1, 6)); g.grandfather.note = 'Kakek (ayah tidak ada) mendapat 1/6 karena pewaris meninggalkan anak.'; }
    if (g.grandmothers) { setFurud('grandmothers', F(1, 6)); g.grandmothers.note = 'Nenek mendapat 1/6 (dibagi rata bila ada dua nenek) karena ibu tidak ada.'; }
    if (g.fullSisters && fullB === 0 && dDaughters === 0) {
      setFurud('fullSisters', fullS === 1 ? F(1, 2) : F(2, 3));
      g.fullSisters.note = fullS === 1
        ? 'Saudara kandung perempuan tunggal mendapat 1/2 (tanpa anak, ayah, dan saudara laki-laki).'
        : 'Dua saudara kandung perempuan atau lebih mendapat 2/3 (tanpa anak, ayah, dan saudara laki-laki).';
    }
    if (g.patSisters && patB === 0) {
      if (dDaughters === 0 && fullS === 0) {
        setFurud('patSisters', patS === 1 ? F(1, 2) : F(2, 3));
        g.patSisters.note = 'Saudara seayah perempuan mendapat 1/2 (tunggal) / 2/3 (≥2) bila tidak ada saudara kandung perempuan.';
      } else if (dDaughters === 0 && fullS === 1) {
        setFurud('patSisters', F(1, 6));
        g.patSisters.note = 'Saudara seayah perempuan mendapat 1/6 sebagai pelengkap dua pertiga bersama satu saudara kandung perempuan.';
      }
    }
    if (g.utSiblings) {
      setFurud('utSiblings', (utB + utS) === 1 ? F(1, 6) : F(1, 3));
      g.utSiblings.note = (utB + utS) === 1
        ? 'Saudara seibu tunggal mendapat 1/6 (dibagi rata tanpa beda laki/perempuan).'
        : 'Dua saudara seibu atau lebih bersama-sama mendapat 1/3 (dibagi rata).';
    }

    var sumFurud = ZERO;
    Object.keys(furud).forEach(function (k) { sumFurud = fadd(sumFurud, furud[k]); });
    var residue = fsub(ONE, sumFurud);

    // ---------- Asabah ----------
    // unit = satu bagian asabah anak (perempuan 1 unit, laki-laki 2 unit).
    var asabah = {}; // key -> fraction (kelompok gabungan)
    var asabahExists = false;
    var childUnit = ZERO;
    if (fcmp(residue, ZERO) > 0) {
      if (hasSons) {
        var parts = dSons * 2 + dDaughters;
        childUnit = fdiv(residue, F(parts, 1));
        if (sons > 0) { asabah.sons = fmul(childUnit, F(2 * sons, 1)); g.sons.note = 'Anak laki-laki mengambil sisa harta, tiap anak laki-laki dua kali bagian anak perempuan.'; }
        if (daughters > 0) { asabah.daughters = fmul(childUnit, F(daughters, 1)); g.daughters.note = 'Anak perempuan bersama anak laki-laki mengambil sisa harta (satu berbanding dua).'; }
        asabahExists = true;
      } else if (g.father) {
        asabah.father = residue;
        g.father.note = (g.father.note ? g.father.note + ' ' : '') + (dDaughters > 0
          ? 'Ayah juga mengambil sisa harta setelah bagiannya 1/6 (hanya ada anak perempuan).'
          : 'Ayah mengambil seluruh sisa harta sebagai asabah (tanpa keturunan).');
        asabahExists = true;
      } else if (g.grandfather) {
        asabah.grandfather = residue;
        g.grandfather.note = (g.grandfather.note ? g.grandfather.note + ' ' : '') + (dDaughters > 0
          ? 'Kakek juga mengambil sisa harta setelah bagiannya 1/6 (hanya ada anak perempuan).'
          : 'Kakek mengambil seluruh sisa harta sebagai asabah (tanpa keturunan).');
        asabahExists = true;
      } else if (fullB > 0 && g.fullBrothers) {
        var p2 = fullB * 2 + fullS;
        var u2 = fdiv(residue, F(p2, 1));
        asabah.fullBrothers = fmul(u2, F(2 * fullB, 1));
        if (g.fullSisters) asabah.fullSisters = fmul(u2, F(fullS, 1));
        g.fullBrothers.note = 'Saudara kandung laki-laki mengambil sisa harta (dua kali bagian saudara perempuan).';
        if (g.fullSisters) g.fullSisters.note = 'Saudara kandung perempuan bersama saudara laki-laki mengambil sisa harta (satu berbanding dua).';
        asabahExists = true;
      } else if (fullS > 0 && g.fullSisters && dDaughters > 0) {
        asabah.fullSisters = residue;
        g.fullSisters.note = 'Saudara kandung perempuan mengambil sisa harta bersama anak perempuan.';
        asabahExists = true;
      } else if (patB > 0 && g.patBrothers) {
        var p3 = patB * 2 + patS;
        var u3 = fdiv(residue, F(p3, 1));
        asabah.patBrothers = fmul(u3, F(2 * patB, 1));
        if (g.patSisters) asabah.patSisters = fmul(u3, F(patS, 1));
        g.patBrothers.note = 'Saudara seayah laki-laki mengambil sisa harta (dua kali bagian saudara perempuan).';
        if (g.patSisters) g.patSisters.note = 'Saudara seayah perempuan bersama saudara laki-laki mengambil sisa harta (satu berbanding dua).';
        asabahExists = true;
      } else if (patS > 0 && g.patSisters && dDaughters > 0 && fullS === 0) {
        asabah.patSisters = residue;
        g.patSisters.note = 'Saudara seayah perempuan mengambil sisa harta bersama anak perempuan.';
        asabahExists = true;
      }
    }

    // ---------- 'Awl / Radd ----------
    var awlScale = null, raddScale = null;
    if (fcmp(sumFurud, ONE) > 0) {
      flags.awl = true;
      awlScale = fdiv(ONE, sumFurud);
      Object.keys(furud).forEach(function (k) { furud[k] = fmul(furud[k], awlScale); });
      asabah = {}; childUnit = ZERO; asabahExists = false;
      steps.push({ text: "Jumlah bagian tetap melebihi harta (Σ > 1), maka semua bagian dikecilkan secara proporsional ('awl).", dalil: 'KHI Pasal 192' });
    } else if (fcmp(sumFurud, ONE) < 0 && !asabahExists) {
      flags.radd = true;
      var spouseFurud = furud.spouse || ZERO;
      var nonSpouseSum = fsub(sumFurud, spouseFurud);
      if (fcmp(nonSpouseSum, ZERO) > 0) {
        raddScale = fdiv(fsub(ONE, spouseFurud), nonSpouseSum);
        Object.keys(furud).forEach(function (k) { if (k !== 'spouse') furud[k] = fmul(furud[k], raddScale); });
        steps.push({ text: "Harta masih tersisa dan tidak ada ahli waris asabah, maka sisa dibagikan kembali secara proporsional kepada ahli waris bagian tetap, kecuali pasangan (radd).", dalil: 'KHI Pasal 193' });
      }
    }

    return finalize(furud, asabah, childUnit, { awlScale: awlScale, raddScale: raddScale });

    // ---------- Finalisasi ----------
    function finalize(furudMap, asabahMap, unit, scales) {
      // Bagian per kelompok HIDUP = furud (proporsional bila gabungan dgn virtual)
      // + asabah. Bagian virtual anak meninggal dihitung terpisah.
      var liveShares = {}; // key -> fraction
      Object.keys(g).forEach(function (k) {
        var share = ZERO;
        if (k === 'daughters' && furudMap.daughters) {
          share = fadd(share, fmul(furudMap.daughters, F(daughters, dDaughters)));
        } else if (furudMap[k]) {
          share = fadd(share, furudMap[k]);
        }
        if (asabahMap[k]) share = fadd(share, asabahMap[k]);
        liveShares[k] = share;
      });

      // Bagian virtual tiap anak yang meninggal.
      var virtShares = []; // {kind:'son'|'daughter', idx, share, kids}
      deadSons.forEach(function (d, i) {
        var sh = ZERO;
        if (hasSons && fcmp(unit, ZERO) > 0) sh = fmul(unit, F(2, 1)); // 2 unit asabah
        virtShares.push({ kind: 'son', idx: i, share: sh, kids: d });
      });
      deadDaughters.forEach(function (d, i) {
        var sh = ZERO;
        if (hasSons && fcmp(unit, ZERO) > 0) {
          sh = unit; // 1 unit asabah
        } else if (furudMap.daughters) {
          sh = fdiv(furudMap.daughters, F(dDaughters, 1)); // furud per anak perempuan
        }
        virtShares.push({ kind: 'daughter', idx: i, share: sh, kids: d });
      });

      // Bangun daftar hasil (hidup + pengganti) dengan pecahan.
      var entries = []; // {key,label,count,share,note,dalil,isSub}
      var order = ['spouse', 'sons', 'daughters', 'father', 'mother', 'grandfather', 'grandmothers', 'fullBrothers', 'fullSisters', 'patBrothers', 'patSisters', 'utSiblings'];
      order.forEach(function (k) {
        if (!g[k]) return;
        entries.push({ key: k, label: g[k].label, count: g[k].count, share: liveShares[k] || ZERO, note: g[k].note || '', dalil: dalilFor(k), isSub: false });
      });
      virtShares.forEach(function (v) {
        if (fcmp(v.share, ZERO) <= 0) return;
        var parts = v.kids.boys * 2 + v.kids.girls;
        if (parts === 0) return;
        var u = fdiv(v.share, F(parts, 1));
        var parentLabel = v.kind === 'son' ? 'anak laki-laki' : 'anak perempuan';
        if (v.kids.boys > 0) {
          entries.push({ key: 'gc-' + v.kind + '-' + v.idx + '-b', label: 'Cucu laki-laki', count: v.kids.boys, share: fmul(u, F(2 * v.kids.boys, 1)),
            note: 'Ahli waris pengganti (KHI Pasal 185): menerima bagian ' + parentLabel + ' yang meninggal, dibagi 2:1.',
            dalil: 'KHI Pasal 185', isSub: true, parentLabel: parentLabel });
        }
        if (v.kids.girls > 0) {
          entries.push({ key: 'gc-' + v.kind + '-' + v.idx + '-g', label: 'Cucu perempuan', count: v.kids.girls, share: fmul(u, F(v.kids.girls, 1)),
            note: 'Ahli waris pengganti (KHI Pasal 185): menerima bagian ' + parentLabel + ' yang meninggal, dibagi 2:1.',
            dalil: 'KHI Pasal 185', isSub: true, parentLabel: parentLabel });
        }
      });

      // Rupiah: floor per entri, lalu selisih (0..n Rp) ke bagian terbesar
      // sampai total persis = harta bersih.
      var items = entries.map(function (e) {
        var exact = fnum(e.share) * net;
        return { e: e, exact: exact, amount: Math.floor(exact + 1e-9) };
      });
      var sumAmt = 0;
      items.forEach(function (it) { sumAmt += it.amount; });
      var diff = net - sumAmt;
      // Bila bagian-bagian berjumlah tepat 1, selisih hanya 0..n Rupiah.
      // Batasi distribusi ke n putaran supaya bug logika tidak berubah
      // menjadi loop jutaan iterasi; checkOk di bawah akan menangkapnya.
      items.sort(function (a, b) { return b.exact - a.exact; });
      var i = 0, guard = 0;
      while (diff > 0 && items.length > 0 && guard < items.length) { items[i % items.length].amount += 1; diff -= 1; i++; guard++; }
      i = 0; guard = 0;
      while (diff < 0 && items.length > 0 && guard < items.length) { items[i % items.length].amount -= 1; diff += 1; i++; guard++; }
      // Urutan tampil: hidup dulu (sesuai order), lalu pengganti.
      items.sort(function (a, b) {
        var ai = order.indexOf(a.e.key), bi = order.indexOf(b.e.key);
        if (a.e.isSub && !b.e.isSub) return 1;
        if (!a.e.isSub && b.e.isSub) return -1;
        if (a.e.isSub && b.e.isSub) return a.e.key.localeCompare(b.e.key);
        return ai - bi;
      });

      var results = items.filter(function (it) { return !it.e.isSub; }).map(function (it) { return toResult(it); });
      var subResults = items.filter(function (it) { return it.e.isSub; }).map(function (it) { return toResult(it); });
      function toResult(it) {
        var e = it.e;
        var perPerson = e.count > 0 ? Math.floor(it.amount / e.count) : 0;
        return { key: e.key, label: e.label, count: e.count, share: e.share, shareStr: fstr(e.share),
          shareWord: FRACTION_WORDS[fstr(e.share)] || '', percent: +(fnum(e.share) * 100).toFixed(2),
          perPerson: perPerson, total: it.amount, note: e.note, parentLabel: e.parentLabel || '' };
      }

      items.forEach(function (it) {
        var r = it.e.isSub ? subResults.filter(function (x) { return x.key === it.e.key; })[0] : results.filter(function (x) { return x.key === it.e.key; })[0];
        if (!r) return;
        steps.push({ text: r.label + ' (' + r.count + ' orang): bagian ' + r.shareStr + (r.shareWord ? ' (' + r.shareWord + ')' : '') + ' — Rp ' + fmtRp(r.total) + ' total, Rp ' + fmtRp(r.perPerson) + ' per orang. ' + r.note, dalil: it.e.dalil });
      });

      var grandTotal = 0;
      results.forEach(function (r) { grandTotal += r.total; });
      subResults.forEach(function (r) { grandTotal += r.total; });

      return {
        gross: total, jointAmount: jointAmount, funeral: funeral, debt: debt,
        bequest: bequest, bequestMax: bequestMax, net: net,
        results: results, subResults: subResults,
        excluded: excluded, steps: steps, flags: flags,
        totalDistributed: grandTotal, checkOk: grandTotal === net
      };
    }
  }

  var api = { compute: compute, F: F, fadd: fadd, fsub: fsub, fmul: fmul, fdiv: fdiv, fcmp: fcmp, fnum: fnum, fstr: fstr, fmtRp: fmtRp };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.WarisEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
