/**
 * attributeMatcher.ts
 * Modul pemeriksaan atribut produk ritel & minimarket yang tegas dan presisi.
 * 
 * Aturan pemeriksaan:
 * 1. Normalisasi satuan: 1 liter = 1000 ml; 1 kg = 1000 gram.
 * 2. Gram TIDAK SAMA DENGAN mililiter (kecuali air, tapi dilarang disamakan dalam ritel FMCG).
 * 3. Ukuran 650 ml TIDAK BOLEH dinyatakan cocok dengan 750 ml.
 * 4. Refill, Botol, Kaleng, Sachet, Box/Dus, dan Multipak harus dibedakan.
 * 5. Jumlah pesanan transaksi (quantity) dipisahkan dari isi per pak (itemsPerPack / multipak).
 * 6. Perbedaan varian yang jelas menggugurkan kecocokan otomatis.
 * 7. Atribut penting yang belum tersedia menghasilkan status PERLU_KONFIRMASI.
 * 8. Validasi digit pemeriksa barcode GTIN (GTIN-8, GTIN-12, GTIN-13, GTIN-14).
 */

export type ProductStatus = 'COCOK_KATALOG' | 'PERLU_KONFIRMASI' | 'KONFLIK_ATRIBUT' | 'BELUM_DITEMUKAN';

export interface NormalizedSize {
  rawValue: number | null;
  rawUnit: string;
  normalizedValue: number | null;
  baseUnit: 'ml' | 'g' | 'pcs' | 'pack' | 'unknown';
}

export interface ExtractedAttributes {
  brand: string;
  category: string;
  variant: string;
  netSize: NormalizedSize;
  packaging: string;
  itemsPerPack: number | null;
  quantity: number;
}

export interface AttributeMatchResult {
  status: ProductStatus;
  isSizeMatch: boolean;
  isVariantMatch: boolean;
  isPackagingMatch: boolean;
  isBrandMatch: boolean;
  notes: string[];
  matchedAttributes: string[];
  conflictingAttributes: string[];
  unknownAttributes: string[];
}

/**
 * Normalisasi volume / berat ke basis baku:
 * - liter -> ml (1 L = 1000 ml)
 * - kg -> gram (1 kg = 1000 g)
 * - gram dan ml adalah entitas terpisah yang tidak setara
 */
export function normalizeUnitAndSize(value: number | null, unitStr: string): NormalizedSize {
  if (value === null || isNaN(value) || value <= 0) {
    return {
      rawValue: null,
      rawUnit: unitStr || '',
      normalizedValue: null,
      baseUnit: 'unknown'
    };
  }

  const u = (unitStr || '').toLowerCase().trim();

  // Volume
  if (u === 'l' || u === 'liter' || u === 'lt') {
    return {
      rawValue: value,
      rawUnit: unitStr,
      normalizedValue: value * 1000,
      baseUnit: 'ml'
    };
  }
  if (u === 'ml' || u === 'mili' || u === 'mililiter' || u === 'cc') {
    return {
      rawValue: value,
      rawUnit: unitStr,
      normalizedValue: value,
      baseUnit: 'ml'
    };
  }

  // Berat
  if (u === 'kg' || u === 'kilogram') {
    return {
      rawValue: value,
      rawUnit: unitStr,
      normalizedValue: value * 1000,
      baseUnit: 'g'
    };
  }
  if (u === 'g' || u === 'gr' || u === 'gram') {
    return {
      rawValue: value,
      rawUnit: unitStr,
      normalizedValue: value,
      baseUnit: 'g'
    };
  }

  // Kemasan hitungan
  if (u === 'pcs' || u === 'pc' || u === 'biji' || u === 'butir' || u === 'buah') {
    return {
      rawValue: value,
      rawUnit: unitStr,
      normalizedValue: value,
      baseUnit: 'pcs'
    };
  }
  if (u === 's' || u === 'sachet' || u === 'sct' || u === 'lembar' || u === 'lbr') {
    return {
      rawValue: value,
      rawUnit: unitStr,
      normalizedValue: value,
      baseUnit: 'pcs'
    };
  }
  if (u === 'pack' || u === 'pck' || u === 'box' || u === 'dus') {
    return {
      rawValue: value,
      rawUnit: unitStr,
      normalizedValue: value,
      baseUnit: 'pack'
    };
  }

  return {
    rawValue: value,
    rawUnit: unitStr,
    normalizedValue: value,
    baseUnit: 'unknown'
  };
}

/**
 * Normalisasi bentuk kemasan untuk perbandingan tegas
 */
export function normalizePackaging(pkg: string): string {
  if (!pkg) return '';
  const lower = pkg.toLowerCase().trim();
  if (lower.includes('refill') || lower.includes('pouch') || lower.includes('isi ulang') || lower.includes('ref')) {
    return 'Refill Pouch';
  }
  if (lower.includes('botol') || lower.includes('btl') || lower.includes('bottle')) {
    return 'Botol';
  }
  if (lower.includes('kaleng') || lower.includes('can') || lower.includes('klg')) {
    return 'Kaleng';
  }
  if (lower.includes('box') || lower.includes('kotak') || lower.includes('dus') || lower.includes('karton')) {
    return 'Box / Dus';
  }
  if (lower.includes('sachet') || lower.includes('sct') || lower.includes('bag')) {
    return 'Sachet';
  }
  if (lower.includes('cup') || lower.includes('gelas')) {
    return 'Cup';
  }
  if (lower.includes('tube') || lower.includes('tub')) {
    return 'Tube';
  }
  if (lower.includes('pack') || lower.includes('mika') || lower.includes('tray') || lower.includes('wrapping')) {
    return 'Pack';
  }
  return pkg.trim();
}

/**
 * Ekstraksi atribut dari teks singkatan atau nama produk tanpa menebak-nebak
 */
export function extractAttributesFromText(text: string): ExtractedAttributes {
  if (!text) {
    return {
      brand: '',
      category: '',
      variant: '',
      netSize: { rawValue: null, rawUnit: '', normalizedValue: null, baseUnit: 'unknown' },
      packaging: '',
      itemsPerPack: null,
      quantity: 1
    };
  }

  const clean = text.trim();

  // 1. Ekstraksi ukuran dengan satuan yang jelas (misal: 650ml, 2L, 500g, 1kg, 10s, 3pcs)
  // Tidak menebak angka tanpa satuan sebagai gram/ml
  let netSize: NormalizedSize = { rawValue: null, rawUnit: '', normalizedValue: null, baseUnit: 'unknown' };
  let itemsPerPack: number | null = null;

  // Cek multipak / isi per pak seperti "10s", "10 sachet", "isi 3", "3 pcs", "3s"
  const packMatch = clean.match(/\b(\d+)\s*(?:s|sachet|sct|pcs|pc|lembar|lbr)\b/i);
  if (packMatch) {
    itemsPerPack = parseInt(packMatch[1], 10);
  }

  // Cek volume / berat dengan satuan eksplisit
  const sizeMatch = clean.match(/(\d+(?:[.,]\d+)?)\s*(liter|lt|l|ml|cc|kg|kilogram|gram|gr|g)\b/i);
  if (sizeMatch) {
    const val = parseFloat(sizeMatch[1].replace(',', '.'));
    const unit = sizeMatch[2];
    netSize = normalizeUnitAndSize(val, unit);
  }

  // 2. Ekstraksi kemasan
  let packaging = '';
  if (/\b(refill|ref|pouch|pch|isi\s*ulang)\b/i.test(clean)) {
    packaging = 'Refill Pouch';
  } else if (/\b(botol|btl|bottle)\b/i.test(clean)) {
    packaging = 'Botol';
  } else if (/\b(kaleng|klg|can)\b/i.test(clean)) {
    packaging = 'Kaleng';
  } else if (/\b(sachet|sct)\b/i.test(clean)) {
    packaging = 'Sachet';
  } else if (/\b(box|kotak|dus)\b/i.test(clean)) {
    packaging = 'Box / Dus';
  } else if (/\b(cup)\b/i.test(clean)) {
    packaging = 'Cup';
  } else if (/\b(tube)\b/i.test(clean)) {
    packaging = 'Tube';
  }

  // 3. Ekstraksi varian dari kata kunci umum
  let variant = '';
  const variantKeywords = [
    'vanilla', 'crispy choco', 'choco', 'chocolate', 'cokelat', 'coklat',
    'matcha', 'strawberry', 'melon', 'butterscotch', 'mangga', 'avocado',
    'lime', 'lemon', 'lavender', 'anti dandruff', 'black shine', 'strong',
    'swiss choco', 'sweet floral', 'original'
  ];
  const lowerText = clean.toLowerCase();
  for (const v of variantKeywords) {
    if (lowerText.includes(v)) {
      variant = v;
      break;
    }
  }

  return {
    brand: '', // Merek tidak ditebak di sini, hanya diisi jika diverifikasi
    category: '',
    variant,
    netSize,
    packaging,
    itemsPerPack,
    quantity: 1
  };
}

/**
 * Pemeriksaan atribut tegas antara data baris struk dan kandidat produk katalog
 */
export function checkAttributeMatch(
  source: ExtractedAttributes,
  candidate: {
    name: string;
    brand?: string;
    variant?: string;
    netSize?: number | null;
    unit?: string;
    packaging?: string;
    itemsPerPack?: number | null;
  }
): AttributeMatchResult {
  const matchedAttributes: string[] = [];
  const conflictingAttributes: string[] = [];
  const unknownAttributes: string[] = [];
  const notes: string[] = [];

  // 1. Pemeriksaan Ukuran (Size & Unit)
  let isSizeMatch = true;
  const candidateNormSize = candidate.netSize !== undefined && candidate.netSize !== null
    ? normalizeUnitAndSize(candidate.netSize, candidate.unit || '')
    : { rawValue: null, rawUnit: '', normalizedValue: null, baseUnit: 'unknown' as const };

  if (source.netSize.normalizedValue !== null && candidateNormSize.normalizedValue !== null) {
    // Keduanya memiliki ukuran terdefinisi
    if (source.netSize.baseUnit !== candidateNormSize.baseUnit) {
      // Satuan dasar beda (misal: gram vs ml) -> KONFLIK
      isSizeMatch = false;
      conflictingAttributes.push(`Satuan berbeda: ${source.netSize.rawUnit} (struk) vs ${candidate.unit} (katalog)`);
      notes.push(`Satuan tidak kompatibel (${source.netSize.baseUnit} vs ${candidateNormSize.baseUnit}). Gram tidak setara ml.`);
    } else if (Math.abs(source.netSize.normalizedValue - candidateNormSize.normalizedValue) > 1) {
      // Nilai numerik berbeda (misal: 650 ml vs 750 ml) -> KONFLIK
      isSizeMatch = false;
      conflictingAttributes.push(`Ukuran beda: ${source.netSize.rawValue}${source.netSize.rawUnit} vs ${candidate.netSize}${candidate.unit}`);
      notes.push(`Ukuran berbeda (${source.netSize.rawValue}${source.netSize.rawUnit} vs ${candidate.netSize}${candidate.unit}). Tidak boleh dipaksakan cocok.`);
    } else {
      matchedAttributes.push(`Ukuran cocok: ${source.netSize.normalizedValue} ${source.netSize.baseUnit}`);
    }
  } else if (source.netSize.normalizedValue !== null || candidateNormSize.normalizedValue !== null) {
    // Salah satu tidak memiliki ukuran
    unknownAttributes.push('Ukuran salah satu belum terverifikasi');
    notes.push('Ukuran belum lengkap pada salah satu catatan.');
  }

  // 2. Pemeriksaan Kemasan (Packaging)
  let isPackagingMatch = true;
  const sourcePkgNorm = normalizePackaging(source.packaging);
  const candPkgNorm = normalizePackaging(candidate.packaging || '');

  if (sourcePkgNorm && candPkgNorm) {
    if (sourcePkgNorm.toLowerCase() !== candPkgNorm.toLowerCase()) {
      isPackagingMatch = false;
      conflictingAttributes.push(`Kemasan beda: ${sourcePkgNorm} vs ${candPkgNorm}`);
      notes.push(`Kemasan berbeda (${sourcePkgNorm} vs ${candPkgNorm}). Contoh: Refill tidak identik dengan Botol.`);
    } else {
      matchedAttributes.push(`Kemasan cocok: ${sourcePkgNorm}`);
    }
  } else if (sourcePkgNorm || candPkgNorm) {
    unknownAttributes.push('Bentuk kemasan belum terkonfirmasi lengkap');
  }

  // 3. Pemeriksaan Varian
  let isVariantMatch = true;
  if (source.variant && candidate.variant) {
    const sVar = source.variant.toLowerCase();
    const cVar = candidate.variant.toLowerCase();
    if (!sVar.includes(cVar) && !cVar.includes(sVar)) {
      isVariantMatch = false;
      conflictingAttributes.push(`Varian beda: ${source.variant} vs ${candidate.variant}`);
      notes.push(`Varian berbeda (${source.variant} vs ${candidate.variant}).`);
    } else {
      matchedAttributes.push(`Varian cocok: ${candidate.variant}`);
    }
  } else if (source.variant || candidate.variant) {
    unknownAttributes.push('Varian belum lengkap di kedua belah pihak');
  }

  // 4. Pemeriksaan Merek (Brand)
  let isBrandMatch = true;
  if (source.brand && candidate.brand) {
    if (source.brand.toLowerCase() !== candidate.brand.toLowerCase()) {
      isBrandMatch = false;
      conflictingAttributes.push(`Merk beda: ${source.brand} vs ${candidate.brand}`);
    } else {
      matchedAttributes.push(`Merk cocok: ${candidate.brand}`);
    }
  }

  // 5. Penentuan Status Akhir
  let status: ProductStatus = 'COCOK_KATALOG';
  if (conflictingAttributes.length > 0) {
    status = 'KONFLIK_ATRIBUT';
  } else if (unknownAttributes.length > 0 || !isSizeMatch || !isPackagingMatch || !isVariantMatch) {
    status = 'PERLU_KONFIRMASI';
  }

  return {
    status,
    isSizeMatch,
    isVariantMatch,
    isPackagingMatch,
    isBrandMatch,
    notes,
    matchedAttributes,
    conflictingAttributes,
    unknownAttributes
  };
}

/**
 * Validasi Format & Checksum Digit Barcode GTIN (GTIN-8, GTIN-12, GTIN-13, GTIN-14)
 * Berdasarkan standar resmi GS1 Check Digit Calculation (Modulo 10 dengan pembobotan 3 dan 1).
 */
export function validateGtinChecksum(barcode: string): {
  isValid: boolean;
  format: 'GTIN-8' | 'GTIN-12' | 'GTIN-13' | 'GTIN-14' | 'INVALID';
  reason?: string;
  expectedCheckDigit?: number;
  actualCheckDigit?: number;
} {
  if (!barcode) {
    return { isValid: false, format: 'INVALID', reason: 'Barcode kosong' };
  }

  const clean = barcode.trim();
  // Hanya boleh berisi digit angka 0-9
  if (!/^\d+$/.test(clean)) {
    return { isValid: false, format: 'INVALID', reason: 'Barcode hanya boleh memuat digit angka' };
  }

  const len = clean.length;
  let formatName: 'GTIN-8' | 'GTIN-12' | 'GTIN-13' | 'GTIN-14' | 'INVALID' = 'INVALID';
  if (len === 8) formatName = 'GTIN-8';
  else if (len === 12) formatName = 'GTIN-12';
  else if (len === 13) formatName = 'GTIN-13';
  else if (len === 14) formatName = 'GTIN-14';
  else {
    return {
      isValid: false,
      format: 'INVALID',
      reason: `Panjang barcode (${len} digit) tidak sesuai standar GS1 (8, 12, 13, atau 14 digit)`
    };
  }

  // Hitung check digit GS1 resmi:
  // Mulai dari digit kedua dari belakang menuju ke digit pertama (kanan ke kiri), bergantian bobot 3 dan 1.
  // Untuk digit terakhir (check digit di indeks len - 1), bandingkan dengan hasil (10 - (sum % 10)) % 10.
  const digits = clean.split('').map(d => parseInt(d, 10));
  const actualCheckDigit = digits[len - 1];

  let sum = 0;
  let multiplier = 3;
  for (let i = len - 2; i >= 0; i--) {
    sum += digits[i] * multiplier;
    multiplier = multiplier === 3 ? 1 : 3;
  }

  const expectedCheckDigit = (10 - (sum % 10)) % 10;

  if (actualCheckDigit !== expectedCheckDigit) {
    return {
      isValid: false,
      format: formatName,
      actualCheckDigit,
      expectedCheckDigit,
      reason: `Digit pemeriksa tidak valid (terbaca ${actualCheckDigit}, seharusnya ${expectedCheckDigit})`
    };
  }

  return {
    isValid: true,
    format: formatName,
    actualCheckDigit,
    expectedCheckDigit
  };
}
