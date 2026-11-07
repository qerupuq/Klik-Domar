/**
 * personalCatalog.ts
 * Penyimpanan dan pengelolaan Katalog Pribadi (Personal Catalog) lokal.
 * 
 * Sesuai arahan audit:
 * - Sediakan sistem katalog pribadi melalui formulir, impor, dan ekspor.
 * - Simpan: nama, merek, varian, ukuran isi bersih, satuan, kemasan, alias singkatan struk, barcode opsional, URL Klik Indomaret resmi, URL gambar opsional, waktu konfirmasi.
 * - Beri label tegas bahwa data ini "Dikonfirmasi Pengguna", bukan diverifikasi otomatis.
 * - Berfungsi 100% offline tanpa ketergantungan API key.
 * - Jika satu alias memiliki beberapa kandidat layak, jangan memilih otomatis (berikan opsi konfirmasi).
 */

import { 
  extractAttributesFromText, 
  checkAttributeMatch, 
  ProductStatus, 
  validateGtinChecksum 
} from './attributeMatcher';

export interface PersonalCatalogItem {
  id: string;
  name: string;
  brand: string;
  variant: string;
  netSize: number | null;
  unit: string;
  packaging: string;
  receiptAliases: string[];
  barcode?: string;
  productUrl?: string; // Tautan resmi Klik Indomaret
  imageUrl?: string;
  confirmedByUser: boolean;
  verifiedAt: string;
  notes?: string;
}

export interface ProductCandidate {
  id: string;
  name: string;
  brand: string;
  variant: string;
  unitSize: string;
  packaging: string;
  barcode?: string;
  productUrl?: string;
  imageUrl?: string;
  source: 'personal_catalog' | 'user_alias' | 'ai_inference';
  confirmedByUser: boolean;
  matchStatus: ProductStatus;
  notes: string[];
  matchedAttributes: string[];
  conflictingAttributes: string[];
  unknownAttributes: string[];
}

const CATALOG_STORAGE_KEY = 'strukpedia_personal_catalog_v2';

// Seed awal contoh untuk memudahkan pengguna melihat format, dengan penandaan jelas
const INITIAL_SEED_CATALOG: PersonalCatalogItem[] = [
  {
    id: 'seed-sania-2l',
    name: 'Sania Minyak Goreng Pouch 2L',
    brand: 'Sania',
    variant: 'Minyak Goreng Sawit',
    netSize: 2,
    unit: 'L',
    packaging: 'Refill Pouch',
    receiptAliases: ['SANIA MNYK GRNG 2L', 'SANIA 2L', 'SANIA REFILL 2L'],
    barcode: '8992753112213',
    productUrl: 'https://www.klikindomaret.com/search/?key=sania+minyak+goreng+2l',
    confirmedByUser: true,
    verifiedAt: '2026-03-01T10:00:00.000Z',
    notes: 'Katalog terkonfirmasi struk minimarket'
  },
  {
    id: 'seed-haku-vanilla',
    name: 'Glico Wings Haku Vanilla & Crispy Choco Cone 100ml',
    brand: 'Glico Wings',
    variant: 'Vanilla & Crispy Choco',
    netSize: 100,
    unit: 'ml',
    packaging: 'Cone',
    receiptAliases: ['GW HAKU VAN&C. CHO 100', 'HAKU VANILLA 100ML'],
    barcode: '8998866200234',
    productUrl: 'https://www.klikindomaret.com/search/?key=glico+haku+vanilla+crispy+choco',
    confirmedByUser: true,
    verifiedAt: '2026-03-01T10:00:00.000Z',
    notes: 'Es krim cone renyah'
  },
  {
    id: 'seed-haku-matcha',
    name: 'Glico Wings Haku Matcha Cone 100ml',
    brand: 'Glico Wings',
    variant: 'Matcha',
    netSize: 100,
    unit: 'ml',
    packaging: 'Cone',
    receiptAliases: ['GW HAKU MATCHA 100', 'HAKU MATCHA CONE 100ML'],
    productUrl: 'https://www.klikindomaret.com/search/?key=glico+haku+matcha',
    confirmedByUser: true,
    verifiedAt: '2026-03-01T10:00:00.000Z',
    notes: 'Varian matcha terpisah dari vanilla'
  },
  {
    id: 'seed-sunsilk-black-650',
    name: 'Sunsilk Shampoo Black Shine Refill 650ml',
    brand: 'Sunsilk',
    variant: 'Black Shine',
    netSize: 650,
    unit: 'ml',
    packaging: 'Refill Pouch',
    receiptAliases: ['SUNSILK SHP BLACK SHINE 650', 'SUNSILK 650 REFILL'],
    productUrl: 'https://www.klikindomaret.com/search/?key=sunsilk+black+shine+650ml',
    confirmedByUser: true,
    verifiedAt: '2026-03-01T10:00:00.000Z',
    notes: 'Khusus ukuran 650ml (bukan 750ml)'
  },
  {
    id: 'seed-goodday-butterscotch',
    name: 'Good Day Kopi Instan 3 in 1 Butterscotch 10 x 20g',
    brand: 'Good Day',
    variant: 'Butterscotch',
    netSize: 200,
    unit: 'g',
    packaging: 'Bag / Renceng',
    receiptAliases: ['G/DAY BTRSCOTCH 10S', 'GOOD DAY BUTTERSCOTCH 10'],
    productUrl: 'https://www.klikindomaret.com/search/?key=good+day+butterscotch+10',
    confirmedByUser: true,
    verifiedAt: '2026-03-01T10:00:00.000Z',
    notes: 'Kopi instan rasa karamel butterscotch isi 10 sachet'
  }
];

export function getPersonalCatalog(): PersonalCatalogItem[] {
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) {
      // Inisialisasi seed contoh
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(INITIAL_SEED_CATALOG));
      return INITIAL_SEED_CATALOG;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    console.error('Gagal membaca katalog pribadi:', e);
    return [];
  }
}

export function savePersonalCatalogItem(item: PersonalCatalogItem): void {
  try {
    const list = getPersonalCatalog();
    const existingIndex = list.findIndex((x) => x.id === item.id);
    if (existingIndex >= 0) {
      list[existingIndex] = item;
    } else {
      list.unshift(item);
    }
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Gagal menyimpan item katalog pribadi:', e);
  }
}

export function deletePersonalCatalogItem(id: string): void {
  try {
    const list = getPersonalCatalog().filter((x) => x.id !== id);
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Gagal menghapus item katalog pribadi:', e);
  }
}

export function exportCatalogToJson(): string {
  const list = getPersonalCatalog();
  return JSON.stringify({
    title: 'StrukPedia - Ekspor Katalog Pribadi',
    exportedAt: new Date().toISOString(),
    totalItems: list.length,
    items: list
  }, null, 2);
}

export function importCatalogFromJson(jsonString: string): { imported: number; errors: string[] } {
  const errors: string[] = [];
  try {
    const parsed = JSON.parse(jsonString);
    const incomingItems = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.items) ? parsed.items : null);
    if (!incomingItems) {
      return { imported: 0, errors: ['Format file JSON tidak valid (harus array atau objek memuat properti items).'] };
    }

    const currentList = getPersonalCatalog();
    let count = 0;

    for (const rawItem of incomingItems) {
      if (!rawItem.name) {
        errors.push(`Item terlewati karena tidak memiliki nama produk.`);
        continue;
      }
      const newItem: PersonalCatalogItem = {
        id: rawItem.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: String(rawItem.name).trim(),
        brand: rawItem.brand ? String(rawItem.brand).trim() : '',
        variant: rawItem.variant ? String(rawItem.variant).trim() : '',
        netSize: typeof rawItem.netSize === 'number' ? rawItem.netSize : null,
        unit: rawItem.unit ? String(rawItem.unit).trim() : '',
        packaging: rawItem.packaging ? String(rawItem.packaging).trim() : '',
        receiptAliases: Array.isArray(rawItem.receiptAliases) ? rawItem.receiptAliases.map(String) : [],
        barcode: rawItem.barcode ? String(rawItem.barcode).trim() : undefined,
        productUrl: rawItem.productUrl ? String(rawItem.productUrl).trim() : undefined,
        imageUrl: rawItem.imageUrl ? String(rawItem.imageUrl).trim() : undefined,
        confirmedByUser: true,
        verifiedAt: rawItem.verifiedAt || new Date().toISOString(),
        notes: rawItem.notes ? String(rawItem.notes).trim() : undefined
      };

      const existingIndex = currentList.findIndex((x) => x.id === newItem.id);
      if (existingIndex >= 0) {
        currentList[existingIndex] = newItem;
      } else {
        currentList.push(newItem);
      }
      count++;
    }

    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(currentList));
    return { imported: count, errors };
  } catch (err: any) {
    return { imported: 0, errors: [`Gagal membaca JSON: ${err.message}`] };
  }
}

/**
 * Temukan kandidat produk dari Katalog Pribadi (maksimal 3 kandidat).
 * Menghindari memilih otomatis bila alias ambigu / terdapat beberapa kandidat layak.
 */
export function findCatalogCandidates(
  rawName: string,
  explicitBarcode?: string
): { candidates: ProductCandidate[]; finalStatus: ProductStatus; isAmbiguous: boolean } {
  const catalog = getPersonalCatalog();
  const sourceAttrs = extractAttributesFromText(rawName);
  const cleanRaw = rawName.toUpperCase().trim();

  // 1. Jika ada barcode terverifikasi, cari langsung
  if (explicitBarcode) {
    const cleanBc = explicitBarcode.trim();
    const bcValidation = validateGtinChecksum(cleanBc);
    if (bcValidation.isValid) {
      const bcMatch = catalog.find((item) => item.barcode === cleanBc);
      if (bcMatch) {
        const check = checkAttributeMatch(sourceAttrs, bcMatch);
        const cand: ProductCandidate = {
          id: bcMatch.id,
          name: bcMatch.name,
          brand: bcMatch.brand,
          variant: bcMatch.variant,
          unitSize: bcMatch.netSize ? `${bcMatch.netSize} ${bcMatch.unit}` : '',
          packaging: bcMatch.packaging,
          barcode: bcMatch.barcode,
          productUrl: bcMatch.productUrl,
          imageUrl: bcMatch.imageUrl,
          source: 'personal_catalog',
          confirmedByUser: true,
          matchStatus: check.status,
          notes: [`Cocok Barcode GTIN ${cleanBc}`, ...check.notes],
          matchedAttributes: check.matchedAttributes,
          conflictingAttributes: check.conflictingAttributes,
          unknownAttributes: check.unknownAttributes
        };
        return {
          candidates: [cand],
          finalStatus: check.status,
          isAmbiguous: false
        };
      }
    }
  }

  // 2. Pencarian berdasarkan Alias Singkatan Struk
  const aliasMatchedItems: PersonalCatalogItem[] = [];
  for (const item of catalog) {
    for (const alias of item.receiptAliases) {
      const cleanAlias = alias.toUpperCase().trim();
      if (cleanAlias === cleanRaw || cleanRaw.includes(cleanAlias) || cleanAlias.includes(cleanRaw)) {
        if (!aliasMatchedItems.some((x) => x.id === item.id)) {
          aliasMatchedItems.push(item);
        }
      }
    }
  }

  // Jika tidak ditemukan via alias persis, cari melalui kemiripan nama / kata kunci
  let matchedPool = aliasMatchedItems;
  if (matchedPool.length === 0) {
    const words = cleanRaw.split(/\s+/).filter((w) => w.length >= 3);
    for (const item of catalog) {
      const targetStr = `${item.name} ${item.brand} ${item.variant} ${item.receiptAliases.join(' ')}`.toUpperCase();
      const matchCount = words.filter((w) => targetStr.includes(w)).length;
      if (matchCount >= 2 || (words.length === 1 && matchCount === 1)) {
        if (!matchedPool.some((x) => x.id === item.id)) {
          matchedPool.push(item);
        }
      }
    }
  }

  if (matchedPool.length === 0) {
    return {
      candidates: [],
      finalStatus: 'BELUM_DITEMUKAN',
      isAmbiguous: false
    };
  }

  // Evaluasi atribut untuk setiap kandidat dan ambil maksimal 3 kandidat
  const scoredCandidates: ProductCandidate[] = matchedPool.slice(0, 3).map((item) => {
    const check = checkAttributeMatch(sourceAttrs, item);
    return {
      id: item.id,
      name: item.name,
      brand: item.brand,
      variant: item.variant,
      unitSize: item.netSize ? `${item.netSize} ${item.unit}` : '',
      packaging: item.packaging,
      barcode: item.barcode,
      productUrl: item.productUrl,
      imageUrl: item.imageUrl,
      source: 'personal_catalog',
      confirmedByUser: true,
      matchStatus: check.status,
      notes: check.notes,
      matchedAttributes: check.matchedAttributes,
      conflictingAttributes: check.conflictingAttributes,
      unknownAttributes: check.unknownAttributes
    };
  });

  // Aturan audit: Jika satu alias memiliki beberapa kandidat yang layak,
  // JANGAN memilih otomatis, set status PERLU_KONFIRMASI!
  const isAmbiguous = scoredCandidates.length > 1;
  let finalStatus: ProductStatus = scoredCandidates[0].matchStatus;
  if (isAmbiguous) {
    finalStatus = 'PERLU_KONFIRMASI';
  }

  return {
    candidates: scoredCandidates,
    finalStatus,
    isAmbiguous
  };
}
