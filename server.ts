import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { validateGtinChecksum } from './src/lib/attributeMatcher';

// Muat .env.local terlebih dahulu lalu .env, tanpa menimpa Secrets yang sudah ada di container
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = 3000;

// Middleware for parsing JSON (up to 25MB for receipt photo uploads)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Lazy initializer for Gemini client to prevent crashes if key is missing initially
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[StrukPedia] GEMINI_API_KEY belum disetel. Permintaan yang memerlukan AI akan mengembalikan pesan panduan konfigurasi.');
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiClient;
}

/**
 * Pembersihan kata kunci pencarian ritel:
 * Mempertahankan kata pembeda produk: merek, varian, ukuran/volume/berat, dan bentuk kemasan.
 * TIDAK memotong paksa menjadi 4 kata dan TIDAK membuang isi kurung.
 */
export function cleanRetailSearchTerm(term: string): string {
  if (!term) return '';
  // Ganti kurung dengan spasi agar teks di dalam kurung (misal ukuran/kemasan) tetap terbawa
  let clean = term.replace(/[()[\]{}]/g, ' ');
  // Hapus karakter liar tanpa membuang desimal angka
  clean = clean.replace(/[/\\|•–—_+*~]/g, ' ');
  // Hapus kata sifat marketing yang bising, jangan hapus varian atau bentuk kemasan
  clean = clean.replace(/\b(promo|diskon|termurah|terbaru|bermutu|paling|asli|resmi|original\s*product)\b/gi, ' ');
  clean = clean.replace(/\s+/g, ' ').trim();
  return clean || term;
}

/**
 * Pedoman Sistem Ekstraksi Struk Belanja Indonesia
 * Mengikuti aturan ketat:
 * 1. Jangan memaksakan identitas yang tidak terlihat (misal: "MNYK GRNG 2L" tanpa merek tetap brand: "", JANGAN ditebak "Sania").
 * 2. Jangan mengarang gramasi buah/sayur jika tidak tertulis di struk.
 * 3. Informasi yang tidak terlihat harus tetap kosong ("" atau null).
 * 4. Jangan mengarang barcode palsu atau nomor izin edar BPOM/halal.
 * 5. Angka tanpa satuan tidak boleh otomatis dianggap gram atau mililiter.
 * 6. Jumlah pesanan transaksi (quantity) dipisahkan dari isi per pak.
 * 7. Tambahkan bounding box koordinat (yMin, xMin, yMax, xMax dalam rasio 0-1000) untuk baris item jika di-supply foto struk. Jika input hanya teks, kembalikan null.
 */
const RECEIPT_PROMPT_SYSTEM = `Anda adalah Asisten Ekstraksi Data Struk Belanja Indonesia & Ritel FMCG (Klik Indomaret, Alfamart, Super Indo, dsb.).
Tugas Anda adalah membaca gambar struk atau teks struk dengan akurat dan mengekstrak data transaksi tanpa mengarang atribut yang tidak ada.

PEDOMAN MUTLAK KEJUJURAN DATA & INTEGRITAS ATRIBUT:
1. JANGAN MEMAKSAKAN IDENTITAS:
   - Jika pada struk tertulis "MNYK GRNG 2L" tanpa tulisan merek tertentu, biarkan merek (brand) bernilai string kosong "" atau "Tidak Tertera". JANGAN menebak menjadi "Sania", "Bimoli", atau lainnya!
   - Jika pada struk tertulis "PISANG CAVENDISH FRESH" tanpa berat/gramasi angka, biarkan unitSize bernilai "" atau null. JANGAN mengarang berat seperti "Pack 500g" jika tidak tertulis di struk!
   - Angka tanpa satuan jelas tidak boleh sembarangan dianggap gram atau mililiter.
2. JANGAN MENGARANG BARCODE:
   - Barcode HANYA diisi jika angka barcode tercetak jelas pada struk fisik. Jika tidak ada barcode tercetak, kosongkan (jangan buat barcode tiruan/estimasi).
3. PISAHKAN JUMLAH PESANAN (quantity) DENGAN ISI PER PAK (itemsPerPack):
   - Contoh: "G/DAY BTRSCOTCH 10S" -> itemsPerPack: 10 (sachet), quantity: jumlah beli di transaksi (misal: 1).
4. PERTAHANKAN TEKS ASLI:
   - rawLine: Teks asli baris tersebut persis seperti di struk.
   - rawName: Singkatan produk pada struk.
   - fullName: Penafsiran nama produk berdasarkan kata kunci yang terbaca.
   - isAiInterpretation: SELALU set true karena ini hasil penafsiran model AI, bukan verifikasi resmi.
5. KOORDINAT BOUNDING BOX:
   - Jika input dilengkapi dengan GAMBAR STRUK (multimodal), ekstrak koordinat area teks baris tersebut pada gambar dan masukkan ke field "boundingBox".
   - Format boundingBox: { "yMin": 0-1000, "xMin": 0-1000, "yMax": 0-1000, "xMax": 0-1000 } skala ternormalisasi. JANGAN mengarang koordinat.
   - Jika input murni teks manual (tanpa gambar), field boundingBox HARUS bernilai null.

Format Keluaran: JSON murni sesuai skema berikut:
{
  "storeName": "Nama Toko / Minimarket jika terbaca di struk, atau Kosongkan",
  "storeLocation": "Alamat / Cabang toko jika terbaca, atau Kosongkan",
  "transactionDate": "YYYY-MM-DD atau Kosongkan",
  "transactionTime": "HH:mm atau Kosongkan",
  "orderNumber": "Nomor Struk / Bon jika ada, atau Kosongkan",
  "customerName": "Nama Pelanggan jika ada, atau Kosongkan",
  "paymentMethod": "Metode Pembayaran (Tunai, QRIS, Kartu, dsb) jika ada",
  "totalAmount": 100000,
  "totalDiscount": 0,
  "netAmount": 100000,
  "items": [
    {
      "id": "item-1",
      "rawLine": "Teks baris asli struk",
      "rawName": "Singkatan nama produk asli pada struk",
      "fullName": "Penafsiran nama produk berdasarkan singkatan yang terbaca",
      "brand": "Merek jika tertulis jelas di struk, atau kosongkan \"\"",
      "category": "Kategori produk umum (Sembako, Makanan & Snack, Minuman, Perawatan & Skincare, Kebutuhan Rumah, Buah & Sayuran Segar, Bayi & Anak)",
      "variant": "Varian rasa atau spesifikasi yang terbaca di struk, atau kosongkan \"\"",
      "unitSize": "Ukuran isi yang tertulis di struk (misal: 2L, 650ml, 10s) jika tertera, atau kosongkan \"\"",
      "packaging": "Bentuk kemasan yang terbaca (Refill Pouch, Botol, Kaleng, Sachet, dsb) jika tertera, atau kosongkan \"\"",
      "itemsPerPack": null,
      "quantity": 1,
      "unitPrice": 35000,
      "totalPrice": 35000,
      "discountOrVoucher": 0,
      "status": "PERLU_KONFIRMASI",
      "isAiInterpretation": true,
      "boundingBox": { "yMin": 200, "xMin": 100, "yMax": 250, "xMax": 800 },
      "abbreviationBreakdown": [
        { "abbr": "KODE", "meaning": "Arti kata", "type": "category" }
      ],
      "packagingDescription": "Deskripsi bentuk kemasan yang terbaca atau umum",
      "productDescription": "Keterangan produk",
      "searchKeywords": "Kata kunci pencarian pembeda produk"
    }
  ]
}`;

// Helper to sleep for retry delay
const waitMs = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Model candidate sequence following AI Studio guidelines.
 * 'gemini-3.1-flash-lite' provides ultra-fast latency (~3s) and dedicated high-availability
 * capacity free from the temporary 503 high demand spikes affecting 3.8.
 * 'gemini-3.8-flash' and 'gemini-flash-latest' serve as robust secondary failover models.
 */
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

// Circuit-breaker map: menyimpan waktu cooldown untuk model yang sedang mengalami 503 High Demand
const modelCooldownMap = new Map<string, number>();
const COOLDOWN_DURATION_MS = 90 * 1000; // 90 detik jeda otomatis untuk model yang sedang overload

function getOrderedCandidateModels(): string[] {
  const now = Date.now();
  const available: string[] = [];
  const inCooldown: string[] = [];

  for (const m of CANDIDATE_MODELS) {
    const cooldownUntil = modelCooldownMap.get(m) || 0;
    if (now > cooldownUntil) {
      available.push(m);
    } else {
      inCooldown.push(m);
    }
  }

  return available.length > 0 ? [...available, ...inCooldown] : [...CANDIDATE_MODELS];
}

/**
 * Panggilan Gemini API dengan failover multi-model tangguh & penanganan 503 High Demand.
 * Menjamin ketersediaan ekstraksi struk belanja minimarket tanpa gangguan.
 */
async function generateWithGemini(
  ai: GoogleGenAI,
  contents: any,
  mimeTypeJson = true,
  enableSearch = false
): Promise<string> {
  let lastError: any = null;
  const orderedModels = getOrderedCandidateModels();

  for (let modelIndex = 0; modelIndex < orderedModels.length; modelIndex++) {
    const model = orderedModels[modelIndex];
    const isLastModel = modelIndex === orderedModels.length - 1;

    const baseConfig: any = {
      temperature: 0.1
    };
    if (mimeTypeJson) {
      baseConfig.responseMimeType = 'application/json';
    }

    // Maksimal 2 percobaan per model jika error non-503
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const config = { ...baseConfig };
        if (enableSearch) {
          config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
          model,
          contents,
          config
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          // Bersihkan status cooldown jika model berhasil merespons
          modelCooldownMap.delete(model);
          if (modelIndex > 0) {
            console.log(`[Gemini API] Berhasil memproses data menggunakan model cadangan aktif: ${model}`);
          }
          return text;
        }
      } catch (err: any) {
        lastError = err;
        const errMessage = err?.message || String(err);
        const isHighDemand = errMessage.includes('503') ||
                             errMessage.includes('UNAVAILABLE') ||
                             errMessage.toLowerCase().includes('high demand') ||
                             errMessage.toLowerCase().includes('spikes in demand');
        const isQuotaExceeded = errMessage.includes('429') ||
                                errMessage.includes('RESOURCE_EXHAUSTED') ||
                                errMessage.toLowerCase().includes('quota');

        // Jika kuota googleSearch grounding habis, matikan search tool dan ulangi segera
        if (enableSearch && isQuotaExceeded) {
          console.log(`[Gemini API] Kuota Google Search grounding tidak tersedia pada kunci API ini. Beralih ke analisis internal...`);
          enableSearch = false;
          continue;
        }

        // Jika 503 High Demand, tandai model ke cooldown dan LANGSUNG alihkan ke model berikutnya tanpa buang waktu mencoba ulang
        if (isHighDemand) {
          modelCooldownMap.set(model, Date.now() + COOLDOWN_DURATION_MS);
          if (!isLastModel) {
            const nextModel = orderedModels[modelIndex + 1];
            console.log(`[Gemini API] Model ${model} sedang mengalami lonjakan beban (503 High Demand). Segera mengalihkan ke model cadangan: ${nextModel}...`);
            break; // Keluar dari percobaan model ini dan segera jalankan model berikutnya
          }
        }

        // Untuk error sementara lainnya (misal timeout koneksi), jeda singkat sebelum mencoba ulang
        if (attempt < 2 && !isHighDemand) {
          await waitMs(600 * attempt);
        } else if (!isLastModel) {
          break; // Pindah ke model berikutnya jika percobaan habis
        }
      }
    }
  }

  throw lastError || new Error('Gagal mendapatkan respons dari semua model Gemini yang tersedia.');
}

// Helper to reliably extract JSON from model responses
function extractJson(text: string): any {
  if (!text) throw new Error('Respon AI kosong.');
  const cleanText = text.trim();
  
  try {
    return JSON.parse(cleanText);
  } catch {}

  const stripped = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(stripped);
  } catch {}

  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {}
  }

  throw new Error('Gagal memproses hasil decoding AI ke format JSON.');
}

function classifyError(err: any): { code: string; message: string; status: number } {
  const msg = err?.message || String(err);
  if (!process.env.GEMINI_API_KEY) {
    return {
      code: 'KEY_MISSING',
      message: 'GEMINI_API_KEY belum dikonfigurasi di server. Silakan atur di menu Settings.',
      status: 401
    };
  }
  if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.toLowerCase().includes('high demand') || msg.toLowerCase().includes('spikes in demand')) {
    return {
      code: 'MODEL_HIGH_DEMAND',
      message: 'Layanan AI sedang mengalami lonjakan beban sementara (High Demand 503). Sistem telah mengaktifkan model cadangan, silakan coba beberapa detik lagi jika masih dalam proses antrian.',
      status: 503
    };
  }
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.toLowerCase().includes('quota')) {
    return {
      code: 'QUOTA_EXCEEDED',
      message: 'Batas kuota harian API tercapai atau server sedang sibuk (Rate Limit). Silakan coba lagi beberapa saat.',
      status: 429
    };
  }
  if (msg.includes('ETIMEDOUT') || msg.includes('timeout') || msg.includes('DEADLINE_EXCEEDED')) {
    return {
      code: 'TIMEOUT',
      message: 'Koneksi ke server AI mengalami tenggat waktu (timeout). Silakan periksa jaringan dan coba lagi.',
      status: 504
    };
  }
  if (msg.includes('Gagal memproses') || msg.includes('JSON')) {
    return {
      code: 'INVALID_FORMAT',
      message: 'Format keluaran analisis struk tidak valid. Coba ulangi dengan foto yang lebih terang atau teks lebih jelas.',
      status: 502
    };
  }
  return {
    code: 'ANALYSIS_ERROR',
    message: msg || 'Terjadi kesalahan saat memproses data struk.',
    status: 500
  };
}

// API Route: Analyze receipt from base64 image or raw text
app.post('/api/receipt/analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', rawText } = req.body;

    if (!imageBase64 && !rawText) {
      return res.status(400).json({ error: 'Harap sediakan gambar struk atau teks singkatan struk.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(401).json({
        code: 'KEY_MISSING',
        error: 'GEMINI_API_KEY belum dikonfigurasi di lingkungan server.'
      });
    }

    const ai = getGeminiClient();
    let responseContentText = '';

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

      const contents = [
        {
          role: 'user',
          parts: [
            { text: RECEIPT_PROMPT_SYSTEM + '\n\nSilakan baca gambar foto struk ini secara teliti. Ekstrak baris produk belanja, simpan baris asli di rawLine, dan berikan interpretasi singkatan kasir. Jangan mengarang merek atau gramasi jika tidak terlihat. Kembalikan JSON valid sesuai skema.' },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType
              }
            }
          ]
        }
      ];

      responseContentText = await generateWithGemini(ai, contents, true);
    } else {
      const contents = [
        {
          role: 'user',
          parts: [
            { text: RECEIPT_PROMPT_SYSTEM + `\n\nEkstrak dan terjemahkan daftar baris struk berikut tanpa mengarang atribut yang tidak ada:\n\n${rawText}\n\nKembalikan JSON valid sesuai skema.` }
          ]
        }
      ];

      responseContentText = await generateWithGemini(ai, contents, true);
    }

    let parsedData = extractJson(responseContentText);

    parsedData.id = parsedData.id || `receipt-${Date.now()}`;
    parsedData.analyzedAt = new Date().toISOString();

    if (Array.isArray(parsedData.items)) {
      parsedData.items = parsedData.items.map((item: any, idx: number) => {
        const rawLine = item.rawLine || item.rawName || `Baris ${idx + 1}`;
        const rawName = item.rawName || rawLine;
        const brand = item.brand || '';
        const searchKw = cleanRetailSearchTerm(item.fullName || rawName);

        return {
          id: item.id || `item-${Date.now()}-${idx}`,
          rawLine,
          rawName,
          fullName: item.fullName || rawName,
          brand,
          category: item.category || 'Produk Ritel',
          variant: item.variant || '',
          unitSize: item.unitSize || '',
          packaging: item.packaging || '',
          itemsPerPack: item.itemsPerPack || null,
          quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
          unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : undefined,
          totalPrice: typeof item.totalPrice === 'number' ? item.totalPrice : undefined,
          discountOrVoucher: typeof item.discountOrVoucher === 'number' ? item.discountOrVoucher : 0,
          status: 'PERLU_KONFIRMASI' as const,
          statusNote: 'Hasil penafsiran AI - belum dikonfirmasi dengan katalog',
          isAiInterpretation: true,
          abbreviationBreakdown: Array.isArray(item.abbreviationBreakdown) ? item.abbreviationBreakdown : [],
          packagingDescription: item.packagingDescription || '',
          productDescription: item.productDescription || '',
          searchKeywords: searchKw,
          evidence: {
            rawLine,
            matchedAttributes: [],
            conflictingAttributes: [],
            unknownAttributes: ['Perlu konfirmasi dengan katalog pribadi atau kemasan asli'],
            sourceOrigin: 'Penafsiran AI (Belum Terverifikasi)' as const,
            productUrl: `https://www.klikindomaret.com/search/?key=${encodeURIComponent(searchKw)}`
          }
        };
      });
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error in /api/receipt/analyze:', error);
    const errClass = classifyError(error);
    return res.status(errClass.status).json({
      code: errClass.code,
      error: errClass.message,
      details: String(error)
    });
  }
});

// API Route: Deep Research a single product in detail with source metadata
app.post('/api/receipt/deep-research', async (req, res) => {
  try {
    const { productName, rawAbbr, brand } = req.body;
    if (!productName && !rawAbbr) {
      return res.status(400).json({ error: 'Nama produk atau singkatan diperlukan.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(401).json({
        code: 'KEY_MISSING',
        error: 'GEMINI_API_KEY belum dikonfigurasi di server.'
      });
    }

    const conciseQuery = cleanRetailSearchTerm(productName || rawAbbr);
    const encodedQuery = encodeURIComponent(conciseQuery);
    const ai = getGeminiClient();

    const prompt = `Anda adalah Asisten Riset Produk Ritel FMCG Minimarket Indonesia.
Target Produk: "${conciseQuery}" (Nama Singkatan Struk: "${productName || rawAbbr}", Merk: "${brand || ''}").

PEDOMAN RISET RESMI:
1. ACUAN UTAMA: Gunakan katalog Klik Indomaret (https://www.klikindomaret.com) sebagai standar penamaan produk resmi di Indonesia.
2. JANGAN MENGARANG: Jika izin edar BPOM, produsen resmi, atau komposisi tidak ditemukan dengan pasti dari pencarian resmi, kosongkan atau tulis "Belum diverifikasi", JANGAN MENGARANG nomor BPOM fiktif!
3. Cantumkan tautan pencarian resmi Klik Indomaret dan sumber relevan lainnya.

Kembalikan format JSON murni:
{
  "productName": "Nama Resmi Lengkap Sesuai Ritel",
  "brand": "Nama Merek / Brand Resmi",
  "manufacturer": "Pabrik / Produsen jika diketahui pasti, atau Kosongkan",
  "originCountry": "Indonesia / Asal Negara",
  "category": "Kategori Produk",
  "subCategory": "Sub Kategori Ritel",
  "packagingType": "Bentuk Kemasan (Refill Pouch, Botol, Kaleng, Sachet, Pack)",
  "netWeightOrVolume": "Berat / Volume Isi Bersih Resmi",
  "description": "Karakteristik dan deskripsi produk resmi",
  "keyIngredients": ["Komposisi jika diketahui"],
  "keyBenefitsOrUsage": ["Kegunaan / Manfaat"],
  "bpomCategory": "Status legalitas jika terverifikasi resmi",
  "shelfLife": "Masa simpan",
  "marketPriceRangeIdr": {
    "min": 10000,
    "max": 15000,
    "average": 12500
  },
  "commonVariants": ["Varian Lain yang Ada"],
  "authenticitySigns": ["Ciri kemasan resmi"],
  "productImageUrl": "",
  "searchLinks": [
    { "title": "Katalog Resmi Klik Indomaret (Acuan Utama)", "url": "https://www.klikindomaret.com/search/?key=${encodedQuery}", "platform": "KlikIndomaret" },
    { "title": "Google Search (Klik Indomaret)", "url": "https://www.google.com/search?q=${encodedQuery}+klikindomaret", "platform": "Google" },
    { "title": "Foto Kemasan Resmi Google Images", "url": "https://www.google.com/search?tbm=isch&q=${encodedQuery}+klikindomaret", "platform": "GoogleImages" },
    { "title": "Alfagift Ritel", "url": "https://alfagift.id/s?q=${encodedQuery}", "platform": "Alfagift" },
    { "title": "Tokopedia Grocery", "url": "https://www.tokopedia.com/search?st=product&q=${encodedQuery}", "platform": "Tokopedia" }
  ],
  "isAiGeneratedWarning": true
}`;

    // Menggunakan basis data pengetahuan FMCG terintegrasi tanpa search tool
    // untuk mencegah kegagalan kuota pencarian (429 RESOURCE_EXHAUSTED) pada kunci API standar
    const responseText = await generateWithGemini(ai, [{ role: 'user', parts: [{ text: prompt }] }], true, false);
    const data = extractJson(responseText);

    return res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in /api/receipt/deep-research:', error);
    const errClass = classifyError(error);
    return res.status(errClass.status).json({
      code: errClass.code,
      error: errClass.message,
      details: String(error)
    });
  }
});

// API Route: Quick translate single text line or query
app.post('/api/receipt/quick-decode', async (req, res) => {
  try {
    const { abbreviation } = req.body;
    if (!abbreviation) {
      return res.status(400).json({ error: 'Singkatan diperlukan.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(401).json({
        code: 'KEY_MISSING',
        error: 'GEMINI_API_KEY belum dikonfigurasi di server.'
      });
    }

    const ai = getGeminiClient();
    const prompt = `Terjemahkan singkatan struk belanja minimarket Indonesia berikut secara jujur: "${abbreviation}".
Jangan mengarang merek atau ukuran jika tidak tertulis.
Kembalikan JSON:
{
  "rawName": "${abbreviation}",
  "fullName": "Nama resmi lengkap produk",
  "brand": "Merek jika tertulis di singkatan, jika tidak kosongkan",
  "category": "Kategori",
  "variant": "Varian jika ada",
  "unitSize": "Ukuran jika ada",
  "abbreviationBreakdown": [
    { "abbr": "KATA1", "meaning": "Arti 1", "type": "brand" }
  ],
  "packagingDescription": "Bentuk kemasan",
  "productDescription": "Keterangan produk"
}`;

    const responseText = await generateWithGemini(ai, [{ role: 'user', parts: [{ text: prompt }] }], true);
    const data = extractJson(responseText);

    return res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in /api/receipt/quick-decode:', error);
    const errClass = classifyError(error);
    return res.status(errClass.status).json({
      code: errClass.code,
      error: errClass.message
    });
  }
});

// API Route: Validasi & Pencarian Barcode GTIN secara tegas
app.post('/api/receipt/barcode-lookup', (req, res) => {
  const { barcode } = req.body;
  if (!barcode) {
    return res.status(400).json({ error: 'Barcode diperlukan.' });
  }

  const validation = validateGtinChecksum(String(barcode));
  if (!validation.isValid) {
    return res.status(422).json({
      isValid: false,
      format: validation.format,
      error: validation.reason || 'Format atau digit pemeriksa barcode GTIN tidak valid.'
    });
  }

  return res.json({
    isValid: true,
    format: validation.format,
    barcode: String(barcode).trim(),
    actualCheckDigit: validation.actualCheckDigit,
    expectedCheckDigit: validation.expectedCheckDigit,
    message: `Barcode standar ${validation.format} valid. Silakan cocokkan dengan inventori Katalog Pribadi Anda.`
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'StrukPedia - Penerjemah Singkatan Struk',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Start Express server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StrukPedia Server running on http://localhost:${PORT}`);
  });
}

startServer();
