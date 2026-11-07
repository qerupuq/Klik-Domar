import { validateGtinChecksum } from './attributeMatcher';

export interface ProductPhotoResult {
  imageUrl: string;
  source: 'real_openfoodfacts';
}

// In-memory cache to prevent redundant Open Food Facts network requests
const photoCache = new Map<string, ProductPhotoResult | null>();

/**
 * Panggil API publik Open Food Facts untuk mencari foto produk asli berdasarkan GTIN/EAN Barcode.
 * Hanya dipanggil jika barcode terbukti valid berdasarkan checksum GS1.
 */
export async function getRealProductPhoto(barcode: string): Promise<ProductPhotoResult | null> {
  if (!barcode) return null;
  const cleanBarcode = barcode.trim();
  if (!cleanBarcode) return null;

  // 1. Validasi checksum GTIN GS1
  const validation = validateGtinChecksum(cleanBarcode);
  if (!validation.isValid) {
    return null;
  }

  // 2. Cek cache
  if (photoCache.has(cleanBarcode)) {
    return photoCache.get(cleanBarcode) || null;
  }

  // 3. Fetch dengan AbortController timeout 5 detik
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleanBarcode)}.json?fields=image_front_url,product_name`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'StrukPedia - Indonesian FMCG Receipt Decoder/1.0'
        }
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      photoCache.set(cleanBarcode, null);
      return null;
    }

    const data = await response.json();
    const imageUrl = data?.product?.image_front_url;

    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
      const result: ProductPhotoResult = {
        imageUrl: imageUrl.trim(),
        source: 'real_openfoodfacts'
      };
      photoCache.set(cleanBarcode, result);
      return result;
    }

    photoCache.set(cleanBarcode, null);
    return null;
  } catch (error) {
    clearTimeout(timeoutId);
    // Silent fallback jika timeout atau koneksi gagal
    photoCache.set(cleanBarcode, null);
    return null;
  }
}
