export type ProductStatus = 'COCOK_KATALOG' | 'PERLU_KONFIRMASI' | 'KONFLIK_ATRIBUT' | 'BELUM_DITEMUKAN';

export interface AbbreviationToken {
  abbr: string;
  meaning: string;
  type?: 'brand' | 'category' | 'variant' | 'size' | 'packaging' | 'action';
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

export interface MatchingEvidence {
  rawLine: string;
  matchedAttributes: string[];
  conflictingAttributes: string[];
  unknownAttributes: string[];
  sourceOrigin: string;
  productUrl?: string;
  notes?: string[];
}

export interface ReceiptItem {
  id: string;
  rawLine: string; // Teks asli baris struk tanpa ubahan
  rawName: string; // Kode singkatan nama produk pada struk
  correctedName?: string; // Teks nama yang dikoreksi pengguna
  fullName: string; // Nama produk hasil pencocokan atau interpretasi
  brand: string;
  category: string;
  variant: string;
  unitSize: string;
  unit?: string;
  packaging?: string;
  itemsPerPack?: number | null; // Isi per pak (misal 10 sachet), terpisah dari quantity
  quantity: number; // Jumlah pesanan barang dalam transaksi
  unitPrice?: number;
  totalPrice?: number;
  discountOrVoucher?: number;
  confidenceScore?: number; // Skor kompatibilitas historis
  barcodeEstimate?: string;
  estimatedPriceRange?: { min: number; max: number } | string;
  status?: ProductStatus;
  statusNote?: string;
  isAiInterpretation?: boolean; // Menandai secara jujur jika nama ini tafsiran AI, belum diverifikasi resmi
  candidates?: ProductCandidate[]; // Hingga 3 kandidat untuk pembanding
  selectedCandidateId?: string;
  abbreviationBreakdown: AbbreviationToken[];
  packagingDescription: string;
  productDescription: string;
  imageUrl?: string;
  isRealPhoto?: boolean; // Menandai apakah gambar merupakan foto asli terverifikasi atau ilustrasi kategori
  photoSource?: 'real_openfoodfacts' | 'user_uploaded' | 'illustration';
  searchKeywords: string;
  barcode?: string; // Barcode terverifikasi saja (GTIN valid)
  evidence?: MatchingEvidence;
  boundingBox?: { yMin: number; xMin: number; yMax: number; xMax: number } | null;
}

export interface ReceiptData {
  id: string;
  storeName: string;
  storeLocation?: string;
  transactionDate?: string;
  transactionTime?: string;
  orderNumber?: string;
  customerName?: string;
  paymentMethod?: string;
  totalAmount?: number;
  totalDiscount?: number;
  netAmount?: number;
  items: ReceiptItem[];
  rawText?: string;
  imagePreviewUrl?: string;
  analyzedAt: string;
  transactionTimestamp?: number;
}

export interface DeepResearchInfo {
  productName: string;
  brand: string;
  manufacturer?: string;
  originCountry?: string;
  category: string;
  subCategory?: string;
  packagingType?: string;
  netWeightOrVolume?: string;
  description: string;
  keyIngredients?: string[];
  keyBenefitsOrUsage?: string[];
  bpomCategory?: string;
  shelfLife?: string;
  marketPriceRangeIdr?: {
    min: number;
    max: number;
    average?: number;
  };
  commonVariants?: string[];
  authenticitySigns?: string[];
  productImageUrl?: string;
  searchLinks: {
    title: string;
    url: string;
    platform: 'KlikIndomaret' | 'Alfagift' | 'Tokopedia' | 'Shopee' | 'Google' | 'GoogleImages' | string;
  }[];
  isAiGeneratedWarning?: boolean;
}

export interface DictionaryItem {
  abbreviation: string;
  expanded: string;
  category: 'Satuan & Ukuran' | 'Kemasan' | 'Perawatan & Skincare' | 'Makanan & Snack' | 'Minuman' | 'Kebutuhan Rumah' | 'Bayi & Anak' | 'Sembako' | 'Buah & Sayuran Segar' | 'Umum';
  exampleInReceipt: string;
  explanation: string;
}
