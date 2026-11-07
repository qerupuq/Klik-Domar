/**
 * testAuditRules.ts
 * Pengujian logika untuk memverifikasi temuan audit StrukPedia.
 */

if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, val: string) => store.set(key, val),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] || null,
    length: 0
  } as any;
}

import { 
  normalizeUnitAndSize, 
  normalizePackaging, 
  checkAttributeMatch, 
  extractAttributesFromText,
  validateGtinChecksum 
} from '../src/lib/attributeMatcher';
import { findCatalogCandidates } from '../src/lib/personalCatalog';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ GAGAL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ LULUS: ${message}`);
  }
}

console.log('=== MEMULAI PENGUJIAN LOGIKA AUDIT STRUKPEDIA ===\n');

// 1. Normalisasi Satuan: 1 Liter = 1000 ml, 1 kg = 1000 g
const literNorm = normalizeUnitAndSize(1, 'L');
assert(literNorm.normalizedValue === 1000 && literNorm.baseUnit === 'ml', '1 Liter ternormalisasi menjadi 1000 ml');

const kgNorm = normalizeUnitAndSize(1, 'kg');
assert(kgNorm.normalizedValue === 1000 && kgNorm.baseUnit === 'g', '1 kg ternormalisasi menjadi 1000 g');

// 2. Gram TIDAK SAMA dengan Mililiter
const gNorm = normalizeUnitAndSize(500, 'g');
const mlNorm = normalizeUnitAndSize(500, 'ml');
assert(gNorm.baseUnit !== mlNorm.baseUnit, 'Gram dan Mililiter memiliki basis satuan yang berbeda');

// 3. Ukuran 650 ml ditolak sebagai pasangan 750 ml
const source650 = extractAttributesFromText('SUNSILK SHP BLACK SHINE 650ML');
const candidate750 = {
  name: 'Sunsilk Shampoo Black Shine 750ml',
  brand: 'Sunsilk',
  variant: 'Black Shine',
  netSize: 750,
  unit: 'ml',
  packaging: 'Botol'
};
const match650vs750 = checkAttributeMatch(source650, candidate750);
assert(match650vs750.status === 'KONFLIK_ATRIBUT', '650 ml ditolak sebagai pasangan 750 ml (status: KONFLIK_ATRIBUT)');
assert(!match650vs750.isSizeMatch, 'Deteksi ukuran tidak cocok antara 650ml dan 750ml');

// 4. Refill tidak identik dengan Botol
const sourceRefill = extractAttributesFromText('SANIA MNYK GRNG REFILL 2L');
const candidateBotol = {
  name: 'Sania Minyak Goreng Botol 2L',
  brand: 'Sania',
  netSize: 2,
  unit: 'L',
  packaging: 'Botol'
};
const matchRefillVsBotol = checkAttributeMatch(sourceRefill, candidateBotol);
assert(matchRefillVsBotol.status === 'KONFLIK_ATRIBUT', 'Refill vs Botol menghasilkan status KONFLIK_ATRIBUT');
assert(!matchRefillVsBotol.isPackagingMatch, 'Bentuk kemasan Refill dan Botol terdeteksi berbeda');

// 5. Normalisasi ukuran yang cocok (2L vs 2000ml)
const candidate2000ml = {
  name: 'Sania Minyak Goreng Refill 2000ml',
  brand: 'Sania',
  netSize: 2000,
  unit: 'ml',
  packaging: 'Refill Pouch'
};
const match2Lvs2000ml = checkAttributeMatch(sourceRefill, candidate2000ml);
assert(match2Lvs2000ml.status === 'COCOK_KATALOG', '2L cocok dengan 2000ml dalam kemasan Refill');

// 6. Validasi Digit Pemeriksa Barcode GTIN (GS1 standard)
// Contoh barcode GTIN-13 valid resmi GS1: 6291041500213
const validGtin13 = validateGtinChecksum('6291041500213');
assert(validGtin13.isValid && validGtin13.format === 'GTIN-13', 'Barcode 6291041500213 memiliki checksum GTIN-13 yang valid');

// Contoh barcode dengan digit pemeriksa rusak
const invalidChecksumGtin = validateGtinChecksum('6291041500219');
assert(!invalidChecksumGtin.isValid, 'Barcode dengan digit pemeriksa salah berhasil ditolak');

// Contoh barcode dengan panjang tidak standar
const invalidLen = validateGtinChecksum('12345');
assert(!invalidLen.isValid && invalidLen.format === 'INVALID', 'Barcode panjang tidak standar (5 digit) berhasil ditolak');

// 7. Perbedaan varian menggugurkan kecocokan otomatis
const sourceVanilla = extractAttributesFromText('GLICO HAKU VANILLA CRISPY CHOCO 100ML');
const candidateMatcha = {
  name: 'Glico Haku Matcha 100ml',
  brand: 'Glico',
  variant: 'Matcha',
  netSize: 100,
  unit: 'ml'
};
const matchVanillaVsMatcha = checkAttributeMatch(sourceVanilla, candidateMatcha);
assert(matchVanillaVsMatcha.status === 'KONFLIK_ATRIBUT', 'Perbedaan varian Vanilla vs Matcha menghasilkan status KONFLIK_ATRIBUT');

// 8. Alias ambigu menghasilkan status PERLU_KONFIRMASI dan tidak memilih otomatis
// Contoh: kata "HAKU" memiliki 2 kandidat (Vanilla & Matcha) di katalog
const { candidates: hakuCandidates, finalStatus: hakuStatus, isAmbiguous: hakuAmbiguous } = findCatalogCandidates('HAKU');
assert(hakuCandidates.length >= 2, 'Pencarian HAKU menemukan beberapa kandidat layak');
assert(hakuAmbiguous === true, 'Pencarian ambigu terdeteksi sebagai isAmbiguous=true');
assert(hakuStatus === 'PERLU_KONFIRMASI', 'Alias dengan lebih dari 1 kandidat menghasilkan status PERLU_KONFIRMASI');

console.log('\n=== SELURUH PENGUJIAN LOGIKA AUDIT BERHASIL DENGAN SEMPURNA! ===');
