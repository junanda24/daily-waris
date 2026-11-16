// Tes engine faraid WARIS! — jalankan: node faraid.test.js
var E = require('./faraid.js');
var assert = require('assert');

var passed = 0, failed = 0;
function check(name, input, expected) {
  // expected: {label: total} per ahli waris (+ 'BERSIH': net) — toleransi ±2 Rp
  var out = E.compute(input);
  try {
    assert(!out.error, 'error tak terduga: ' + out.error);
    assert(out.checkOk, 'checkOk false; total=' + out.totalDistributed + ' net=' + out.net);
    var got = {};
    out.results.concat(out.subResults).forEach(function (r) { got[r.label] = (got[r.label] || 0) + r.total; });
    Object.keys(expected).forEach(function (k) {
      if (k === 'BERSIH') { assert(Math.abs(out.net - expected[k]) <= 2, 'net ' + out.net + ' != ' + expected[k]); return; }
      assert(k in got, 'ahli waris hilang: ' + k + ' (ada: ' + Object.keys(got).join(', ') + ')');
      assert(Math.abs(got[k] - expected[k]) <= 2, k + ': ' + got[k] + ' != ' + expected[k]);
    });
    var sum = 0; Object.keys(got).forEach(function (k) { sum += got[k]; });
    assert(Math.abs(sum - out.net) <= 2, 'jumlah ' + sum + ' != net ' + out.net);
    passed++;
    console.log('OK  ' + name);
  } catch (e) {
    failed++;
    console.log('FAIL ' + name + ' — ' + e.message);
    console.log('     out:', JSON.stringify(out, null, 1).slice(0, 600));
  }
}

var M = 1000000;
function base(o) {
  return Object.assign({ gender: 'L', spouseCount: 0, sons: 0, daughters: 0,
    father: false, mother: false, grandfather: false, grandmotherM: false, grandmotherF: false,
    fullBrothers: 0, fullSisters: 0, patBrothers: 0, patSisters: 0, utBrothers: 0, utSisters: 0,
    deadSons: [], deadDaughters: [], total: 0, funeral: 0, debt: 0, bequest: 0, jointProperty: false }, o);
}

// 1. Istri + 2 anakL + 1 anakP, 240jt
check('1 keluarga inti', base({ spouseCount: 1, sons: 2, daughters: 1, total: 240 * M }),
  { 'Istri': 30 * M, 'Anak laki-laki': 168 * M, 'Anak perempuan': 42 * M });
// 2. Gharawain
check('2 gharawain', base({ gender: 'P', spouseCount: 1, father: true, mother: true, total: 120 * M }),
  { 'Suami': 60 * M, 'Ayah': 40 * M, 'Ibu': 20 * M });
// 3. Radd: istri + ibu + 2 anakP
check('3 radd', base({ spouseCount: 1, mother: true, daughters: 2, total: 240 * M }),
  { 'Istri': 30 * M, 'Ibu': 42 * M, 'Anak perempuan': 168 * M });
// 4. Awl klasik
check('4 awl klasik', base({ spouseCount: 1, father: true, mother: true, daughters: 2, total: 270 * M }),
  { 'Istri': 30 * M, 'Ayah': 40 * M, 'Ibu': 40 * M, 'Anak perempuan': 160 * M });
// 5. 2 anakP + ayah
check('5 anakP + ayah', base({ daughters: 2, father: true, total: 180 * M }),
  { 'Anak perempuan': 120 * M, 'Ayah': 60 * M });
// 6. Suami + 1 anakP (radd)
check('6 suami + anakP', base({ gender: 'P', spouseCount: 1, daughters: 1, total: 120 * M }),
  { 'Suami': 30 * M, 'Anak perempuan': 90 * M });
// 7. Saudara kandung saja
check('7 sdr kandung', base({ fullBrothers: 1, fullSisters: 1, total: 90 * M }),
  { 'Saudara kandung laki-laki': 60 * M, 'Saudara kandung perempuan': 30 * M });
// 8. Ibu + 1 sdr seibu (radd)
check('8 ibu + seibu', base({ mother: true, utBrothers: 1, total: 120 * M }),
  { 'Ibu': 80 * M, 'Saudara seibu': 40 * M });
// 9. Gono-gini + wasiat
check('9 waterfall', base({ spouseCount: 1, sons: 1, total: 400 * M, funeral: 10 * M, debt: 30 * M, bequest: 20 * M, jointProperty: true }),
  { 'Istri': 17.5 * M, 'Anak laki-laki': 122.5 * M, 'BERSIH': 140 * M });
// 10. Pengganti KHI 185
check('10 pengganti', base({ daughters: 1, deadSons: [{ boys: 1, girls: 1 }], total: 150 * M }),
  { 'Anak perempuan': 50 * M, 'Cucu laki-laki': 66666667, 'Cucu perempuan': 33333333 });
// 11. Istri saja
check('11 istri saja', base({ spouseCount: 1, total: 100 * M }), { 'Istri': 100 * M });
// 12. Ayah saja
check('12 ayah saja', base({ father: true, total: 100 * M }), { 'Ayah': 100 * M });
// 13. 1 anakP saja (radd)
check('13 anakP saja', base({ daughters: 1, total: 100 * M }), { 'Anak perempuan': 100 * M });
// 14. Kakek + ibu
check('14 kakek + ibu', base({ grandfather: true, mother: true, total: 120 * M }),
  { 'Ibu': 40 * M, 'Kakek': 80 * M });
// 15. Istri + ayah + 1 anakP
check('15 istri+ayah+anakP', base({ spouseCount: 1, father: true, daughters: 1, total: 240 * M }),
  { 'Istri': 30 * M, 'Anak perempuan': 120 * M, 'Ayah': 90 * M });
// 16. Wasiat > 1/3 dicap
check('16 wasiat dicap', base({ spouseCount: 1, sons: 1, total: 90 * M, bequest: 40 * M }),
  { 'BERSIH': 60 * M, 'Istri': 7.5 * M, 'Anak laki-laki': 52.5 * M });
// 17. Awl istri+ibu+sdrP (13/12)
check('17 awl 13/12', base({ spouseCount: 1, mother: true, fullSisters: 1, total: 240 * M }),
  { 'Istri': 55384615, 'Ibu': 73846154, 'Saudara kandung perempuan': 110769231 });
// 18. Hanya anak meninggal + cucu (pengganti saja)
check('18 pengganti saja', base({ deadSons: [{ boys: 1, girls: 0 }], total: 90 * M }),
  { 'Cucu laki-laki': 90 * M });
// 19. Anak perempuan meninggal + ibu (radd via virtual)
check('19 pengganti + ibu', base({ mother: true, deadDaughters: [{ boys: 0, girls: 2 }], total: 120 * M }),
  { 'Ibu': 30 * M, 'Cucu perempuan': 90 * M });
// 20. Suami + ibu + 2 sdr seibu, tanpa anak (ibu 1/6 karena 2 sdr)
check('20 ibu 1/6 krn sdr', base({ gender: 'P', spouseCount: 1, mother: true, utBrothers: 2, total: 120 * M }),
  { 'Suami': 60 * M, 'Ibu': 20 * M, 'Saudara seibu': 40 * M });

console.log('\n' + passed + ' lolos, ' + failed + ' gagal');
process.exit(failed ? 1 : 0);
