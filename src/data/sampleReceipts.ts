import { ReceiptData } from '../types';

export const SAMPLE_RECEIPTS: {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  store: string;
  sampleImage: string;
  rawReceiptText: string;
  decodedData: ReceiptData;
}[] = [
  {
    id: 'sample-indomaret-istore',
    title: 'Struk Draft I-Store Demetri (15 Item)',
    subtitle: 'Kopi Good Day, Susu Anlene, Minyak Sania, Roti Mr. Bread, dsb.',
    badge: 'Contoh Foto Struk 1',
    store: 'Indomaret I-Store',
    sampleImage: 'https://images.unsplash.com/photo-1554415707-9e49016a345e?w=800&auto=format&fit=crop&q=80',
    rawReceiptText: `DRAFT PESANAN I-STORE
16.08.26 - 10:11                          /0
--------------------------------------------
                       PESANAN PEMENUHAN
--------------------------------------------
G/DAY BTRSCOTCH 10S                 1
ANLENE ACTFT CKL 560                1
INDOMARET AIR/OK19LT                1
SANIA M/GR REF 1000                 4
LIFEBUOY SHP A/D 170                1
GRNR CLR.NAT COK PCK                1
FORMULA SG MAXI SF3S                1
PSODENT PG STRG 190G                1
GLW&LOVELY DRM.GL100                1
MARINA HBL AVCDO 190                1
LUX BW MGC ORCHD 825                1
LFEBUOY REF LIME 650                2
IDM P'LANTAI LAV 800                1
MR.BREAD TAWAR TEBAL                1
GW HAKU VAN&C. CHO 100              2
--------------------------------------------
NAMA       : Demetri warung
KDPESANAN  : A1G8DG3X4U`,
    decodedData: {
      id: 'rec-sample-1',
      storeName: 'Indomaret (I-Store Order)',
      storeLocation: 'Layanan Pemenuhan Pesanan Toko',
      transactionDate: '16 Agustus 2026',
      transactionTime: '10:11 WITA',
      orderNumber: 'A1G8DG3X4U',
      customerName: 'Demetri warung',
      paymentMethod: 'Pesanan I-Store / Tagihan Toko',
      totalAmount: 382500,
      totalDiscount: 0,
      netAmount: 382500,
      analyzedAt: '2026-08-16T10:11:00Z',
      items: [
        {
          id: 'item-1',
          rawLine: 'G/DAY BTRSCOTCH 10S   1',
          rawName: 'G/DAY BTRSCOTCH 10S',
          fullName: 'Good Day Kopi Instan 3-in-1 Rasa Butterscotch (10 x 20g)',
          brand: 'Good Day (PT Santos Jaya Abadi)',
          category: 'Minuman Kopi Instan',
          variant: 'Butterscotch (Mentega Karamel)',
          unitSize: '10 Sachet @ 20g',
          quantity: 1,
          unitPrice: 15500,
          totalPrice: 15500,
          searchKeywords: 'Good Day Butterscotch 10 sachet',
          confidenceScore: 99,
          barcodeEstimate: '8991002104523',
          packagingDescription: 'Kemasan bag plastik oranye-keemasan khas Good Day dengan gambar cangkir kopi berbusa karamel lezat.',
          productDescription: 'Kopi instan 3-in-1 dengan aroma manis gurih butterscotch yang creamy dan nikmat disajikan panas atau dingin.',
          estimatedPriceRange: { min: 14000, max: 17500 },
          abbreviationBreakdown: [
            { abbr: 'G/DAY', meaning: 'Good Day (Merk Kopi Instan)', type: 'brand' },
            { abbr: 'BTRSCOTCH', meaning: 'Butterscotch (Varian Rasa Mentega Karamel)', type: 'variant' },
            { abbr: '10S', meaning: '10 Sachet / Stick', type: 'size' }
          ]
        },
        {
          id: 'item-2',
          rawLine: 'ANLENE ACTFT CKL 560   1',
          rawName: 'ANLENE ACTFT CKL 560',
          fullName: 'Anlene Actifit Susu Bubuk Kalsium Dewasa Rasa Cokelat 560g',
          brand: 'Anlene (Fonterra Brands)',
          category: 'Susu Kalsium & Nutrisi Dewasa',
          variant: 'Actifit Cokelat',
          unitSize: 'Dus Box 560 Gram',
          quantity: 1,
          unitPrice: 78500,
          totalPrice: 78500,
          searchKeywords: 'Anlene Actifit Cokelat 560g',
          confidenceScore: 99,
          barcodeEstimate: '8993175537021',
          packagingDescription: 'Dus karton hijau khas Anlene dengan ilustrasi tulang & sendi aktif serta cangkir susu cokelat hangat.',
          productDescription: 'Susu berkalsium tinggi dengan formula MoveMax yang mengandung kalsium, kolagen, protein, dan vitamin untuk kesehatan tulang, sendi, dan otot.',
          estimatedPriceRange: { min: 75000, max: 85000 },
          abbreviationBreakdown: [
            { abbr: 'ANLENE', meaning: 'Anlene (Merk Susu Tulang Dewasa)', type: 'brand' },
            { abbr: 'ACTFT', meaning: 'Actifit (Varian Kalsium Usia 19-50)', type: 'variant' },
            { abbr: 'CKL', meaning: 'Cokelat (Rasa Cokelat)', type: 'variant' },
            { abbr: '560', meaning: '560 Gram (Berat Bersih)', type: 'size' }
          ]
        },
        {
          id: 'item-3',
          rawLine: 'INDOMARET AIR/OK19LT   1',
          rawName: 'INDOMARET AIR/OK19LT',
          fullName: 'Indomaret Air Minum Dalam Kemasan (AMDK) Galon 19 Liter',
          brand: 'Indomaret (Private Label)',
          category: 'Air Mineral & Galon',
          variant: 'Air Mineral Higienis',
          unitSize: 'Galon 19 Liter',
          quantity: 1,
          unitPrice: 19000,
          totalPrice: 19000,
          searchKeywords: 'Indomaret Air Galon 19L',
          confidenceScore: 98,
          barcodeEstimate: '8998866100192',
          packagingDescription: 'Galon air warna biru transparan berlogo Indomaret dengan segel tutup biru higienis.',
          productDescription: 'Air mineral alami diproses secara higienis melalui filtrasi modern untuk kesegaran seluruh keluarga.',
          estimatedPriceRange: { min: 18000, max: 21000 },
          abbreviationBreakdown: [
            { abbr: 'INDOMARET', meaning: 'Indomaret (Merk Toko)', type: 'brand' },
            { abbr: 'AIR/OK', meaning: 'Air Minum Berkualitas (Oasis/Kemasan)', type: 'category' },
            { abbr: '19LT', meaning: '19 Liter (Kapasitas Galon)', type: 'size' }
          ]
        },
        {
          id: 'item-4',
          rawLine: 'SANIA M/GR REF 1000   4',
          rawName: 'SANIA M/GR REF 1000',
          fullName: 'Sania Minyak Goreng Kelapa Sawit Refill Pouch 1000ml (1 Liter)',
          brand: 'Sania (Wilmar)',
          category: 'Sembako & Minyak Masak',
          variant: 'Minyak Kelapa Sawit Premium',
          unitSize: 'Pouch Refill 1000ml / 1 Liter',
          quantity: 4,
          unitPrice: 18500,
          totalPrice: 74000,
          searchKeywords: 'Sania Minyak Goreng Refill 1L',
          confidenceScore: 99,
          barcodeEstimate: '8998989110012',
          packagingDescription: 'Pouch plastik tebal berdiri bernuansa kuning emas dengan gambar gorengan renyah keemasan.',
          productDescription: 'Minyak goreng kelapa sawit bermutu tinggi yang difortifikasi Vitamin A dan E, menghasilkan masakan renyah dan tidak cepat gosong.',
          estimatedPriceRange: { min: 17500, max: 20000 },
          abbreviationBreakdown: [
            { abbr: 'SANIA', meaning: 'Sania (Merk Minyak Goreng)', type: 'brand' },
            { abbr: 'M/GR', meaning: 'Minyak Goreng', type: 'category' },
            { abbr: 'REF', meaning: 'Refill / Kemasan Pouch Isi Ulang', type: 'packaging' },
            { abbr: '1000', meaning: '1000 ml / 1 Liter', type: 'size' }
          ]
        },
        {
          id: 'item-5',
          rawLine: 'LIFEBUOY SHP A/D 170   1',
          rawName: 'LIFEBUOY SHP A/D 170',
          fullName: 'Lifebuoy Shampoo Anti-Dandruff (Anti Ketombe) 170ml',
          brand: 'Lifebuoy (Unilever)',
          category: 'Perawatan Rambut',
          variant: 'Anti Dandruff (Anti Ketombe)',
          unitSize: 'Botol 170ml',
          quantity: 1,
          unitPrice: 24500,
          totalPrice: 24500,
          searchKeywords: 'Lifebuoy Shampoo Anti Dandruff 170ml',
          confidenceScore: 99,
          barcodeEstimate: '8999999052614',
          packagingDescription: 'Botol warna biru muda cerah dengan logo merah Lifebuoy dan tutup botol flip-top praktis.',
          productDescription: 'Shampoo perawatan kulit kepala dengan kandungan Milk NutriStrong dan Active Zinc untuk mengatasi ketombe dan menutrisi akar rambut.',
          estimatedPriceRange: { min: 23000, max: 27000 },
          abbreviationBreakdown: [
            { abbr: 'LIFEBUOY', meaning: 'Lifebuoy (Merk Perawatan Unilever)', type: 'brand' },
            { abbr: 'SHP', meaning: 'Shampoo (Sampo Rambut)', type: 'category' },
            { abbr: 'A/D', meaning: 'Anti Dandruff (Formula Anti Ketombe)', type: 'variant' },
            { abbr: '170', meaning: '170 Mililiter', type: 'size' }
          ]
        },
        {
          id: 'item-6',
          rawLine: 'GRNR CLR.NAT COK PCK   1',
          rawName: 'GRNR CLR.NAT COK PCK',
          fullName: 'Garnier Color Naturals Pewarna Rambut Coklat Alami (Pack Sachet)',
          brand: 'Garnier (L\'Oreal)',
          category: 'Pewarna Rambut & Grooming',
          variant: 'Coklat Alami (Natural Brown #4)',
          unitSize: '1 Pack Sachet (Krim + Developer)',
          quantity: 1,
          unitPrice: 16500,
          totalPrice: 16500,
          searchKeywords: 'Garnier Color Naturals Coklat Sachet',
          confidenceScore: 99,
          barcodeEstimate: '8992304018231',
          packagingDescription: 'Bungkus sachet pack bernuansa hijau alami Garnier dengan foto model berambut coklat kilau lembut.',
          productDescription: 'Pewarna rambut tanpa amonia yang diperkaya 3 natural oils (Alpukat, Zaitun, Almond) untuk warna berkilau tahan hingga 8 minggu.',
          estimatedPriceRange: { min: 15000, max: 18000 },
          abbreviationBreakdown: [
            { abbr: 'GRNR', meaning: 'Garnier (Merk Perawatan L\'Oreal)', type: 'brand' },
            { abbr: 'CLR.NAT', meaning: 'Color Naturals (Seri Pewarna Alami)', type: 'variant' },
            { abbr: 'COK', meaning: 'Coklat / Natural Brown', type: 'variant' },
            { abbr: 'PCK', meaning: 'Pack / Kemasan Sachet Kit', type: 'packaging' }
          ]
        },
        {
          id: 'item-7',
          rawLine: 'FORMULA SG MAXI SF3S   1',
          rawName: 'FORMULA SG MAXI SF3S',
          fullName: 'Formula Sikat Gigi Maxi Soft Pack Isi 3 Batang',
          brand: 'Formula (Orang Tua Group)',
          category: 'Perawatan Mulut & Gigi',
          variant: 'Maxi Soft (Bulu Lembut)',
          unitSize: 'Kemasan Pack Isi 3 Pcs',
          quantity: 1,
          unitPrice: 18500,
          totalPrice: 18500,
          searchKeywords: 'Formula Sikat Gigi Maxi Soft 3s',
          confidenceScore: 98,
          barcodeEstimate: '8998866503412',
          packagingDescription: 'Blister pack mika transparan berisi 3 batang sikat gigi ergonomis aneka warna.',
          productDescription: 'Sikat gigi dengan konfigurasi bulu lembut yang mampu menjangkau sela-sela gigi terdalam tanpa melukai gusi.',
          estimatedPriceRange: { min: 17000, max: 21000 },
          abbreviationBreakdown: [
            { abbr: 'FORMULA', meaning: 'Formula (Merk Perawatan Gigi OT)', type: 'brand' },
            { abbr: 'SG', meaning: 'Sikat Gigi (Toothbrush)', type: 'category' },
            { abbr: 'MAXI', meaning: 'Maxi (Kepala Sikat Lebar)', type: 'variant' },
            { abbr: 'SF3S', meaning: 'Soft Bulu Lembut Isi 3 Sachet/Pcs', type: 'size' }
          ]
        },
        {
          id: 'item-8',
          rawLine: 'PSODENT PG STRG 190G   1',
          rawName: 'PSODENT PG STRG 190G',
          fullName: 'Pepsodent Pasta Gigi Pencegah Gigi Berlubang Kuat 190g',
          brand: 'Pepsodent (Unilever)',
          category: 'Perawatan Mulut & Gigi',
          variant: 'Pencegah Gigi Berlubang (Strong)',
          unitSize: 'Tube 190 Gram',
          quantity: 1,
          unitPrice: 15500,
          totalPrice: 15500,
          searchKeywords: 'Pepsodent Pencegah Gigi Berlubang 190g',
          confidenceScore: 99,
          barcodeEstimate: '8999999001018',
          packagingDescription: 'Kotak dus dan tube merah putih khas Pepsodent dengan gambar gigi putih berkilau kuat.',
          productDescription: 'Pasta gigi dengan Mikro Kalsium aktif dan Pro-Fluoride kompleks untuk memperbaiki lubang kecil tak kasat mata pada enamel gigi.',
          estimatedPriceRange: { min: 14500, max: 17500 },
          abbreviationBreakdown: [
            { abbr: 'PSODENT', meaning: 'Pepsodent (Merk Pasta Gigi Unilever)', type: 'brand' },
            { abbr: 'PG', meaning: 'Pasta Gigi (Toothpaste)', type: 'category' },
            { abbr: 'STRG', meaning: 'Strong / Perlindungan Maksimal', type: 'variant' },
            { abbr: '190G', meaning: '190 Gram (Ukuran Kemasan Besar)', type: 'size' }
          ]
        },
        {
          id: 'item-9',
          rawLine: 'GLW&LOVELY DRM.GL100   1',
          rawName: 'GLW&LOVELY DRM.GL100',
          fullName: 'Glow & Lovely DermaGlow Facial Foam / Krim Wajah 100g',
          brand: 'Glow & Lovely (Unilever)',
          category: 'Perawatan Wajah',
          variant: 'DermaGlow Brightening',
          unitSize: 'Tube 100 Gram',
          quantity: 1,
          unitPrice: 28500,
          totalPrice: 28500,
          searchKeywords: 'Glow & Lovely DermaGlow 100g',
          confidenceScore: 98,
          barcodeEstimate: '8999999518042',
          packagingDescription: 'Tube bernuansa pink lembut dan putih dengan tulisan Glow & Lovely keemasan.',
          productDescription: 'Pembersih wajah busa melimpah dengan teknologi multivitamin (B, C, E) untuk mengangkat kotoran, debu polusi, dan membuat wajah tampak glowing bercahaya.',
          estimatedPriceRange: { min: 26000, max: 32000 },
          abbreviationBreakdown: [
            { abbr: 'GLW&LOVELY', meaning: 'Glow & Lovely (Dulu Fair & Lovely)', type: 'brand' },
            { abbr: 'DRM.GL', meaning: 'DermaGlow (Formula Pencerah Kulit)', type: 'variant' },
            { abbr: '100', meaning: '100 Gram (Ukuran Tube)', type: 'size' }
          ]
        },
        {
          id: 'item-10',
          rawLine: 'MARINA HBL AVCDO 190   1',
          rawName: 'MARINA HBL AVCDO 190',
          fullName: 'Marina Natural Nutri Serum Hand & Body Lotion Avocado 190ml',
          brand: 'Marina (Tempo Scan)',
          category: 'Perawatan Tubuh',
          variant: 'Natural Nutri Serum Avocado (Alpukat & Vitamin E)',
          unitSize: 'Botol 190ml',
          quantity: 1,
          unitPrice: 13500,
          totalPrice: 13500,
          searchKeywords: 'Marina Hand Body Lotion Avocado 190ml',
          confidenceScore: 99,
          barcodeEstimate: '8993176110292',
          packagingDescription: 'Botol ramping warna hijau muda pastel berdesain lekuk khas Marina dengan gambar buah alpukat segar.',
          productDescription: 'Hand and body lotion kaya nutrisi alpukat, minyak zaitun, dan vitamin E untuk melembutkan kulit kering dan melindungi dari paparan sinar UV.',
          estimatedPriceRange: { min: 12000, max: 15500 },
          abbreviationBreakdown: [
            { abbr: 'MARINA', meaning: 'Marina (Merk Perawatan Kulit)', type: 'brand' },
            { abbr: 'HBL', meaning: 'Hand & Body Lotion', type: 'category' },
            { abbr: 'AVCDO', meaning: 'Avocado / Ekstrak Buah Alpukat', type: 'variant' },
            { abbr: '190', meaning: '190 Mililiter', type: 'size' }
          ]
        },
        {
          id: 'item-11',
          rawLine: 'LUX BW MGC ORCHD 825   1',
          rawName: 'LUX BW MGC ORCHD 825',
          fullName: 'Lux Botanicals Body Wash Sabun Cair Magical Orchid Refill 825ml',
          brand: 'Lux (Unilever)',
          category: 'Sabun Mandi Cair',
          variant: 'Magical Orchid (Anggrek Hitam & Minyak Juniper)',
          unitSize: 'Pouch Refill 825ml / 800ml',
          quantity: 1,
          unitPrice: 39500,
          totalPrice: 39500,
          searchKeywords: 'Lux Botanicals Magical Orchid Refill 825ml',
          confidenceScore: 99,
          barcodeEstimate: '8999999049218',
          packagingDescription: 'Pouch isi ulang ungu gelap mewah berhiaskan bunga anggrek hitam mekar eksotis.',
          productDescription: 'Sabun mandi cair wangi parfum mewah tahan lama hingga 8 jam dengan sentuhan floral fusion oil floral eksotis.',
          estimatedPriceRange: { min: 36000, max: 44000 },
          abbreviationBreakdown: [
            { abbr: 'LUX', meaning: 'Lux (Merk Sabun Kecantikan)', type: 'brand' },
            { abbr: 'BW', meaning: 'Body Wash (Sabun Mandi Cair)', type: 'category' },
            { abbr: 'MGC ORCHD', meaning: 'Magical Orchid (Varian Anggrek Hitam)', type: 'variant' },
            { abbr: '825', meaning: '825 Mililiter (Ukuran Jumbo Refill)', type: 'size' }
          ]
        },
        {
          id: 'item-12',
          rawLine: 'LFEBUOY REF LIME 650   2',
          rawName: 'LFEBUOY REF LIME 650',
          fullName: 'Lifebuoy Sabun Cair Cuci Tangan / Mandi Lemon Fresh Lime Refill 650ml',
          brand: 'Lifebuoy (Unilever)',
          category: 'Sabun Antibakterial',
          variant: 'Lemon Fresh Lime (Jeruk Lemon Nipis)',
          unitSize: 'Pouch Refill 650ml / 450ml',
          quantity: 2,
          unitPrice: 32000,
          totalPrice: 64000,
          searchKeywords: 'Lifebuoy Refill Lemon Lime 650ml',
          confidenceScore: 98,
          barcodeEstimate: '8999999512309',
          packagingDescription: 'Pouch isi ulang warna kuning kehijauan cerah dengan irisan jeruk lemon segar dan tameng antibakterial.',
          productDescription: 'Sabun cair pelindung dari kuman dengan ekstrak jeruk nipis segar alami yang efektif membersihkan dan menyegarkan kulit.',
          estimatedPriceRange: { min: 29000, max: 35000 },
          abbreviationBreakdown: [
            { abbr: 'LFEBUOY', meaning: 'Lifebuoy (Merk Sabun Kesehatan)', type: 'brand' },
            { abbr: 'REF', meaning: 'Refill / Kemasan Isi Ulang', type: 'packaging' },
            { abbr: 'LIME', meaning: 'Lemon Lime / Jeruk Nipis Segar', type: 'variant' },
            { abbr: '650', meaning: '650 Mililiter', type: 'size' }
          ]
        },
        {
          id: 'item-13',
          rawLine: 'IDM P\'LANTAI LAV 800   1',
          rawName: 'IDM P\'LANTAI LAV 800',
          fullName: 'Indomaret Pembersih Lantai Karbol Aroma Bunga Lavender Pouch 800ml',
          brand: 'Indomaret (Private Label)',
          category: 'Pembersih Rumah Tangga',
          variant: 'Aroma Bunga Lavender',
          unitSize: 'Pouch Refill 800ml',
          quantity: 1,
          unitPrice: 12500,
          totalPrice: 12500,
          searchKeywords: 'Indomaret Pembersih Lantai Lavender 800ml',
          confidenceScore: 99,
          barcodeEstimate: '8998866120800',
          packagingDescription: 'Pouch ungu dengan gambar lantai marmer mengkilap bersih dan tangkai bunga lavender.',
          productDescription: 'Cairan pembersih lantai konsentrat dengan daya kilap ekstra dan aroma lavender menenangkan yang efektif mengusir bau dan kuman.',
          estimatedPriceRange: { min: 11000, max: 14000 },
          abbreviationBreakdown: [
            { abbr: 'IDM', meaning: 'Indomaret (Private Label)', type: 'brand' },
            { abbr: 'P\'LANTAI', meaning: 'Pembersih Lantai Karbol', type: 'category' },
            { abbr: 'LAV', meaning: 'Lavender (Aroma Bunga Ungu)', type: 'variant' },
            { abbr: '800', meaning: '800 Mililiter', type: 'size' }
          ]
        },
        {
          id: 'item-14',
          rawLine: 'MR.BREAD TAWAR TEBAL   1',
          rawName: 'MR.BREAD TAWAR TEBAL',
          fullName: 'Mr. Bread Roti Tawar Potong Irisan Tebal (Toast Style)',
          brand: 'Mr. Bread (PT Indoroti Prima Cemerlang)',
          category: 'Roti & Bakery',
          variant: 'Tawar Potong Tebal (Thick Sliced)',
          unitSize: 'Bungkus Pack 1 Pcs',
          quantity: 1,
          unitPrice: 16000,
          totalPrice: 16000,
          searchKeywords: 'Mr Bread Roti Tawar Tebal',
          confidenceScore: 99,
          barcodeEstimate: '8997022010041',
          packagingDescription: 'Plastik pembungkus roti transparan dengan logo koki kumis lucu Mr. Bread dan klip penjepit kemasan.',
          productDescription: 'Roti tawar lembut dengan ketebalan ekstra, sangat nikmat dipanggang menjadi roti bakar crispy di luar dan lembut empuk di dalam.',
          estimatedPriceRange: { min: 15000, max: 18000 },
          abbreviationBreakdown: [
            { abbr: 'MR.BREAD', meaning: 'Mr. Bread (Merk Roti Indomaret)', type: 'brand' },
            { abbr: 'TAWAR', meaning: 'Roti Tawar (White Bread)', type: 'category' },
            { abbr: 'TEBAL', meaning: 'Irisan Potongan Tebal (Thick Slice Toast)', type: 'variant' }
          ]
        },
        {
          id: 'item-15',
          rawLine: 'GW HAKU VAN&C. CHO 100  2',
          rawName: 'GW HAKU VAN&C. CHO 100',
          fullName: 'Glico Wings Haku Vanilla & Crispy Choco Monaka 100 ml',
          brand: 'Glico Wings',
          category: 'Es Krim & Dessert',
          variant: 'Vanilla & Crispy Choco Monaka',
          unitSize: 'Kemasan Bungkus Monaka 100 ml',
          quantity: 2,
          unitPrice: 12500,
          totalPrice: 25000,
          searchKeywords: 'Glico Wings Haku Vanilla Crispy Choco Monaka 100ml',
          confidenceScore: 99,
          barcodeEstimate: '8997238120019',
          packagingDescription: 'Bungkus plastik oranye-keemasan khas Haku dengan gambar potongan wafel monaka renyah berisi es krim vanila dan lapisan cokelat garing.',
          productDescription: 'Es krim wafel monaka Jepang asli dari Glico Wings dengan isi es krim vanila susu lezat dan lapisan cokelat krispi renyah di tengahnya.',
          estimatedPriceRange: { min: 11000, max: 14000 },
          abbreviationBreakdown: [
            { abbr: 'GW', meaning: 'Glico Wings (Produsen Es Krim)', type: 'brand' },
            { abbr: 'HAKU', meaning: 'Haku (Seri Es Krim Premium Wafel & Monaka)', type: 'variant' },
            { abbr: 'VAN&C.CHO', meaning: 'Vanilla & Crispy Choco Monaka', type: 'variant' },
            { abbr: '100', meaning: '100 Mililiter (Ukuran Volume Bersih)', type: 'size' }
          ]
        }
      ]
    }
  },
  {
    id: 'sample-klikindomaret-pengosekan',
    title: 'Struk KlikIndomaret Fresh Pengosekan (11 Item)',
    subtitle: 'Rinso Perfume Breeze, Wall\'s Matcha, My Baby Telon & Cologne, dsb.',
    badge: 'Contoh Foto Struk 2 & 3',
    store: 'KlikIndomaret Fresh Pengosekan',
    sampleImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    rawReceiptText: `FRESH PENGOSEKAN
JL. RAYA PENGOSEKAN KEL MAS
KEC UBUD, KAB GIANYAR, 805
www.klikindomaret.com
14.08.26-19:46/4.4.2/T028-15335/SAIFU/02
--------------------------------------------
MY BB HR.LOT B&S 100    1  24000    24,000
                VOUCHER :          (12,000)
RINSO P.BRZE BTL 650    1  17500    17,500
                VOUCHER :          (3,000)
WALLS MATCHA STW 350    1  30000    30,000
                VOUCHER :         (10,100)
INDMLK SWS CHOC 260G    1   8700     8,700
                VOUCHER :            (500)
MY BABY COLG SF 100     1  24500    24,500
                VOUCHER :         (11,200)
NISSIN WFR CHO 110G     1   9500     9,500
MY BABY TELON PLS 90    1  24900    24,900
SNPRD FRT MG.PINE220    2  11900    23,800
                VOUCHER :          (6,000)
MARJAN MELON 460ML      1  27500    27,500
DEKA WFR BITE CHO 72    1   8500     8,500
CHCLTOS RCH MTCHA 54    1   9800     9,800
                VOUCHER :          (3,300)
FIESTA RCBTE CHS 400    1  47900    47,900
--------------------------------------------
TOTAL BELANJA :                    210,500
NON TUNAI     :                    210,500
ANDA HEMAT    :                     46,100
PPN : DPP= 211,907 PPN= 25,429
HARGA JUAL : 231,171
GoPay Rp 210,500
Nama : Sariherawati`,
    decodedData: {
      id: 'rec-sample-2',
      storeName: 'Indomaret Fresh Pengosekan',
      storeLocation: 'Jl. Raya Pengosekan, Kel. Mas, Kec. Ubud, Kab. Gianyar, Bali',
      transactionDate: '14 Agustus 2026',
      transactionTime: '19:46 WITA',
      orderNumber: 'T028-15335 / SAIFU-02',
      customerName: 'Sariherawati',
      paymentMethod: 'GoPay (Non-Tunai)',
      totalAmount: 266800,
      totalDiscount: 46100,
      netAmount: 210500,
      analyzedAt: '2026-08-14T19:46:00Z',
      items: [
        {
          id: 'item-201',
          rawLine: 'MY BB HR.LOT B&S 100   1  24000 (VOUCHER 12000)',
          rawName: 'MY BB HR.LOT B&S 100',
          fullName: 'My Baby Hair Lotion Black & Shiny (Kemiri & Seledri) 100ml',
          brand: 'My Baby (Tempo Scan)',
          category: 'Perawatan Bayi & Anak',
          variant: 'Black & Shiny (Penyubur Rambut Hitam)',
          unitSize: 'Botol 100ml',
          quantity: 1,
          unitPrice: 24000,
          totalPrice: 24000,
          discountOrVoucher: 12000,
          searchKeywords: 'My Baby Hair Lotion Black Shiny 100ml',
          confidenceScore: 99,
          barcodeEstimate: '8993176110901',
          packagingDescription: 'Botol kuning transparan dengan tutup putar oranye dan gambar bayi lucu berseri.',
          productDescription: 'Lotion perawatan rambut bayi dengan ekstrak kemiri dan seledri alami untuk menjaga rambut tetap tebal, hitam berkilau, harum dan lembut.',
          estimatedPriceRange: { min: 22000, max: 26000 },
          abbreviationBreakdown: [
            { abbr: 'MY BB', meaning: 'My Baby (Merk Perlengkapan Bayi)', type: 'brand' },
            { abbr: 'HR.LOT', meaning: 'Hair Lotion (Lotion Rambut Bayi)', type: 'category' },
            { abbr: 'B&S', meaning: 'Black & Shiny (Kemiri & Seledri)', type: 'variant' },
            { abbr: '100', meaning: '100 Mililiter', type: 'size' }
          ]
        },
        {
          id: 'item-202',
          rawLine: 'RINSO P.BRZE BTL 650   1  17500 (VOUCHER 3000)',
          rawName: 'RINSO P.BRZE BTL 650',
          fullName: 'Rinso Deterjen Cair Konsentrat Perfume Breeze Botol 650ml / 750ml',
          brand: 'Rinso (Unilever)',
          category: 'Deterjen & Kebutuhan Cuci',
          variant: 'Perfume Breeze (Wangi Parfum Mawar & Melati)',
          unitSize: 'Botol 650ml',
          quantity: 1,
          unitPrice: 17500,
          totalPrice: 17500,
          discountOrVoucher: 3000,
          searchKeywords: 'Rinso Perfume Breeze Botol 650ml',
          confidenceScore: 99,
          barcodeEstimate: '8999999058912',
          packagingDescription: 'Botol plastik biru muda dengan tutup merah dan label bunga mawar parfum semerbak.',
          productDescription: 'Deterjen cair konsentrat dengan teknologi SmartFoam yang cepat membilas dan aroma parfum mewah tahan hingga 21 hari.',
          estimatedPriceRange: { min: 16500, max: 19500 },
          abbreviationBreakdown: [
            { abbr: 'RINSO', meaning: 'Rinso (Merk Deterjen Pakaian)', type: 'brand' },
            { abbr: 'P.BRZE', meaning: 'Perfume Breeze (Varian Aroma Parfum)', type: 'variant' },
            { abbr: 'BTL', meaning: 'Botol (Kemasan Botol Plastik)', type: 'packaging' },
            { abbr: '650', meaning: '650 Mililiter', type: 'size' }
          ]
        },
        {
          id: 'item-203',
          rawLine: 'WALLS MATCHA STW 350   1  30000 (VOUCHER 10100)',
          rawName: 'WALLS MATCHA STW 350',
          fullName: 'Wall\'s Es Krim Rasa Matcha & Strawberry Swirl Pint Tub 350ml',
          brand: 'Wall\'s (Unilever)',
          category: 'Es Krim & Dessert',
          variant: 'Matcha Strawberry Swirl',
          unitSize: 'Cup Pint Tub 350ml',
          quantity: 1,
          unitPrice: 30000,
          totalPrice: 30000,
          discountOrVoucher: 10100,
          searchKeywords: 'Walls Matcha Strawberry 350ml pint',
          confidenceScore: 98,
          barcodeEstimate: '8999999519088',
          packagingDescription: 'Tub mangkuk pint hijau muda dengan gambar scoop es krim matcha hijau berpadu saus stroberi merah manis.',
          productDescription: 'Kombinasi sempurna antara rasa otentik teh hijau Jepang yang creamy dengan manis asam saus buah stroberi asli.',
          estimatedPriceRange: { min: 28000, max: 34000 },
          abbreviationBreakdown: [
            { abbr: 'WALLS', meaning: 'Wall\'s (Merk Es Krim Unilever)', type: 'brand' },
            { abbr: 'MATCHA', meaning: 'Matcha (Teh Hijau Jepang)', type: 'variant' },
            { abbr: 'STW', meaning: 'Strawberry (Buah Stroberi)', type: 'variant' },
            { abbr: '350', meaning: '350 Mililiter (Ukuran Pint Tub)', type: 'size' }
          ]
        },
        {
          id: 'item-204',
          rawLine: 'INDMLK SWS CHOC 260G   1  8700 (VOUCHER 500)',
          rawName: 'INDMLK SWS CHOC 260G',
          fullName: 'Indomilk Susu Kental Manis Swiss Choco Pouch 260g',
          brand: 'Indomilk (PT Indolakto)',
          category: 'Susu Kental Manis & Olahan',
          variant: 'Swiss Choco (Cokelat Swiss Pekat)',
          unitSize: 'Pouch 260 Gram',
          quantity: 1,
          unitPrice: 8700,
          totalPrice: 8700,
          discountOrVoucher: 500,
          searchKeywords: 'Indomilk Swiss Choco Pouch 260g',
          confidenceScore: 99,
          barcodeEstimate: '8993005110123',
          packagingDescription: 'Standing pouch cokelat tua berlabel Indomilk dengan gambar lelehan cokelat Swiss menggugah selera.',
          productDescription: 'Susu kental manis bernutrisi tinggi dengan cita rasa cokelat Swiss yang legit dan kental, cocok untuk olesan roti, martabak, maupun minuman.',
          estimatedPriceRange: { min: 8000, max: 9500 },
          abbreviationBreakdown: [
            { abbr: 'INDMLK', meaning: 'Indomilk (Merk Susu Olahan)', type: 'brand' },
            { abbr: 'SWS', meaning: 'Swiss (Gaya Cokelat Swiss)', type: 'variant' },
            { abbr: 'CHOC', meaning: 'Chocolate (Cokelat)', type: 'variant' },
            { abbr: '260G', meaning: '260 Gram', type: 'size' }
          ]
        },
        {
          id: 'item-205',
          rawLine: 'MY BABY COLG SF 100   1  24500 (VOUCHER 11200)',
          rawName: 'MY BABY COLG SF 100',
          fullName: 'My Baby Cologne Sweet Floral (Minyak Wangi Bayi) 100ml',
          brand: 'My Baby (Tempo Scan)',
          category: 'Perawatan Bayi & Anak',
          variant: 'Sweet Floral (Wangi Bunga Lembut)',
          unitSize: 'Botol 100ml',
          quantity: 1,
          unitPrice: 24500,
          totalPrice: 24500,
          discountOrVoucher: 11200,
          searchKeywords: 'My Baby Cologne Sweet Floral 100ml',
          confidenceScore: 98,
          barcodeEstimate: '8993176110826',
          packagingDescription: 'Botol pink manis berdesain ramah anak dengan aroma lembut menenangkan.',
          productDescription: 'Cologne khusus bayi dengan formula lembut bebas alkohol yang memberikan keharuman bunga segar dan tahan lama sepanjang hari.',
          estimatedPriceRange: { min: 23000, max: 27000 },
          abbreviationBreakdown: [
            { abbr: 'MY BABY', meaning: 'My Baby (Merk Produk Bayi)', type: 'brand' },
            { abbr: 'COLG', meaning: 'Cologne (Minyak Wangi Segar)', type: 'category' },
            { abbr: 'SF', meaning: 'Sweet Floral (Aroma Bunga Manis Lembut)', type: 'variant' },
            { abbr: '100', meaning: '100 Mililiter', type: 'size' }
          ]
        },
        {
          id: 'item-206',
          rawLine: 'NISSIN WFR CHO 110G   1  9500',
          rawName: 'NISSIN WFR CHO 110G',
          fullName: 'Nissin Wafer Chocolate Kotak Box 110g',
          brand: 'Nissin (Monde Nissin)',
          category: 'Wafer & Biskuit',
          variant: 'Chocolate (Cokelat Klasik)',
          unitSize: 'Dus Box 110 Gram',
          quantity: 1,
          unitPrice: 9500,
          totalPrice: 9500,
          searchKeywords: 'Nissin Wafer Chocolate 110g',
          confidenceScore: 99,
          barcodeEstimate: '8992775110034',
          packagingDescription: 'Kotak dus khas Nissin berwarna kuning oranye dengan foto wafer cokelat renyah berlapis krim.',
          productDescription: 'Wafer legendaris dengan lapisan wafer renyah dan krim cokelat manis gurih pas yang disukai semua generasi keluarga Indonesia.',
          estimatedPriceRange: { min: 9000, max: 11000 },
          abbreviationBreakdown: [
            { abbr: 'NISSIN', meaning: 'Nissin (Merk Biskuit & Wafer)', type: 'brand' },
            { abbr: 'WFR', meaning: 'Wafer (Kue Kering Berlapis)', type: 'category' },
            { abbr: 'CHO', meaning: 'Chocolate (Rasa Cokelat)', type: 'variant' },
            { abbr: '110G', meaning: '110 Gram', type: 'size' }
          ]
        },
        {
          id: 'item-207',
          rawLine: 'MY BABY TELON PLS 90   1  24900',
          rawName: 'MY BABY TELON PLS 90',
          fullName: 'My Baby Minyak Telon Plus Eucalyptus & Chamomile 90ml (8 Jam)',
          brand: 'My Baby (Tempo Scan)',
          category: 'Minyak Telon & Kesehatan Bayi',
          variant: 'Plus Eucalyptus Anti Nyamuk',
          unitSize: 'Botol 90ml',
          quantity: 1,
          unitPrice: 24900,
          totalPrice: 24900,
          searchKeywords: 'My Baby Minyak Telon Plus 90ml',
          confidenceScore: 99,
          barcodeEstimate: '8993176110186',
          packagingDescription: 'Botol hijau transparan dengan tutup fliptop hijau tua dan logo perlindungan 8 jam dari gigitan nyamuk.',
          productDescription: 'Minyak telon berkhasiat menghangatkan perut kembung bayi, melegakan pernapasan, serta terbukti klinis melindungi dari gigitan nyamuk aedes aegypti hingga 8 jam.',
          estimatedPriceRange: { min: 23500, max: 27500 },
          abbreviationBreakdown: [
            { abbr: 'MY BABY', meaning: 'My Baby (Merk Produk Bayi)', type: 'brand' },
            { abbr: 'TELON', meaning: 'Minyak Telon', type: 'category' },
            { abbr: 'PLS', meaning: 'Plus (Formula Tambahan Anti Nyamuk)', type: 'variant' },
            { abbr: '90', meaning: '90 Mililiter', type: 'size' }
          ]
        },
        {
          id: 'item-208',
          rawLine: 'SNPRD FRT MG.PINE220   2  11900 (VOUCHER 6000)',
          rawName: 'SNPRD FRT MG.PINE220',
          fullName: 'Sunpride Fruit Juice Minuman Jus Mangga & Nanas Botol 220ml',
          brand: 'Sunpride (PT Sewu Segar Nusantara)',
          category: 'Jus Buah Segar',
          variant: 'Mango Pineapple (Mangga Nanas)',
          unitSize: 'Botol 220ml',
          quantity: 2,
          unitPrice: 11900,
          totalPrice: 23800,
          discountOrVoucher: 6000,
          searchKeywords: 'Sunpride Fruit Juice Mango Pineapple 220ml',
          confidenceScore: 98,
          barcodeEstimate: '8993189110023',
          packagingDescription: 'Botol plastik oranye cerah dengan gambar buah mangga masak dan potongan buah nanas manis.',
          productDescription: 'Jus buah asli kaya vitamin C yang memadukan kelembutan manis mangga tropis dengan kesegaran asam manis nanas pilihan.',
          estimatedPriceRange: { min: 11000, max: 13500 },
          abbreviationBreakdown: [
            { abbr: 'SNPRD', meaning: 'Sunpride (Merk Buah & Jus)', type: 'brand' },
            { abbr: 'FRT', meaning: 'Fruit (Sari Buah Alami)', type: 'category' },
            { abbr: 'MG.PINE', meaning: 'Mango & Pineapple (Mangga Nanas)', type: 'variant' },
            { abbr: '220', meaning: '220 Mililiter', type: 'size' }
          ]
        },
        {
          id: 'item-209',
          rawLine: 'MARJAN MELON 460ML   1  27500',
          rawName: 'MARJAN MELON 460ML',
          fullName: 'Marjan Boudoin Sirup Kental Rasa Melon Botol Kaca 460ml',
          brand: 'Marjan (PT Suba Indah)',
          category: 'Sirup & Minuman Manis',
          variant: 'Boudoin Rasa Melon Manis Segar',
          unitSize: 'Botol Kaca 460ml',
          quantity: 1,
          unitPrice: 27500,
          totalPrice: 27500,
          searchKeywords: 'Marjan Boudoin Syrup Melon 460ml',
          confidenceScore: 99,
          barcodeEstimate: '8992765100018',
          packagingDescription: 'Botol kaca hijau elegan tinggi ramping dengan label hijau emas buah melon matang berair.',
          productDescription: 'Sirup mewah berbahan dasar 100% gula tebu murni tanpa pemanis buatan, memiliki aroma melon yang harum pekat untuk hidangan es buah atau minuman segar.',
          estimatedPriceRange: { min: 25000, max: 29500 },
          abbreviationBreakdown: [
            { abbr: 'MARJAN', meaning: 'Marjan (Merk Sirup Premium)', type: 'brand' },
            { abbr: 'MELON', meaning: 'Melon (Rasa Buah Melon)', type: 'variant' },
            { abbr: '460ML', meaning: '460 Mililiter (Ukuran Standar Botol Kaca)', type: 'size' }
          ]
        },
        {
          id: 'item-210',
          rawLine: 'DEKA WFR BITE CHO 72   1  8500',
          rawName: 'DEKA WFR BITE CHO 72',
          fullName: 'Deka Mini Wafer Roll Bite Size Choco Chocovannila Pouch 72g',
          brand: 'Deka (Dua Kelinci)',
          category: 'Wafer Roll & Snack',
          variant: 'Wafer Bite Choco (Cokelat)',
          unitSize: 'Pouch 72 Gram',
          quantity: 1,
          unitPrice: 8500,
          totalPrice: 8500,
          searchKeywords: 'Deka Wafer Roll Bite Choco 72g',
          confidenceScore: 99,
          barcodeEstimate: '8992775210921',
          packagingDescription: 'Pouch ziplock praktis warna coklat krem dengan gambar potongan roll wafer renyah isi krim coklat lumer.',
          productDescription: 'Wafer gulung mini bite size sekali suap dengan isian krim coklat lezat yang renyah dan tidak mudah tumpah.',
          estimatedPriceRange: { min: 7800, max: 9500 },
          abbreviationBreakdown: [
            { abbr: 'DEKA', meaning: 'Deka (Merk Wafer Dua Kelinci)', type: 'brand' },
            { abbr: 'WFR', meaning: 'Wafer (Wafer Roll Gulung)', type: 'category' },
            { abbr: 'BITE', meaning: 'Bite Size (Ukuran Mini Sekali Gigit)', type: 'variant' },
            { abbr: 'CHO 72', meaning: 'Choco (Cokelat) Berat 72 Gram', type: 'size' }
          ]
        },
        {
          id: 'item-211',
          rawLine: 'CHCLTOS RCH MTCHA 54   1  9800 (VOUCHER 3300)',
          rawName: 'CHCLTOS RCH MTCHA 54',
          fullName: 'Chocolatos Wafer Roll Stik Sweet Cheese / Rich Matcha Box 54g',
          brand: 'Chocolatos (Garudafood)',
          category: 'Wafer Roll & Cokelat',
          variant: 'Rich Matcha Green Tea',
          unitSize: 'Kotak Box 54 Gram',
          quantity: 1,
          unitPrice: 9800,
          totalPrice: 9800,
          discountOrVoucher: 3300,
          searchKeywords: 'Chocolatos Rich Matcha 54g box',
          confidenceScore: 98,
          barcodeEstimate: '8992775019012',
          packagingDescription: 'Kotak kardus warna hijau matcha pekat dengan stik wafer tebal berbalut krim matcha lumer.',
          productDescription: 'Wafer roll stik berongga tebal dengan filling krim matcha pekat dan creamy ala cafe Italia.',
          estimatedPriceRange: { min: 9000, max: 11000 },
          abbreviationBreakdown: [
            { abbr: 'CHCLTOS', meaning: 'Chocolatos (Merk Snack Garudafood)', type: 'brand' },
            { abbr: 'RCH MTCHA', meaning: 'Rich Matcha (Matcha Hijau Pekat)', type: 'variant' },
            { abbr: '54', meaning: '54 Gram', type: 'size' }
          ]
        },
        {
          id: 'item-212',
          rawLine: 'FIESTA RCBTE CHS 400   1  47900',
          rawName: 'FIESTA RCBTE CHS 400',
          fullName: 'Fiesta Crispy Rice Bite Cheese / Cheesy Chicken Nugget 400g',
          brand: 'Fiesta (CP Prima / Charoen Pokphand)',
          category: 'Makanan Beku & Nugget Ayam',
          variant: 'Rice Bite Cheese (Balutan Beras Krispi & Keju Leleh)',
          unitSize: 'Kemasan Frozen Pack 400 Gram',
          quantity: 1,
          unitPrice: 47900,
          totalPrice: 47900,
          searchKeywords: 'Fiesta Rice Bite Cheese 400g',
          confidenceScore: 99,
          barcodeEstimate: '8993189901402',
          packagingDescription: 'Kemasan plastik frozen oranye keemasan dengan gambar potongan nugget bertekstur butiran beras renyah dan lelehan keju mozarella gurih.',
          productDescription: 'Olahan daging ayam pilihan dibalut butiran beras renyah dengan lelehan keju gurih di dalamnya, sangat renyah dan lezat dinikmati saat hangat.',
          estimatedPriceRange: { min: 45000, max: 53000 },
          abbreviationBreakdown: [
            { abbr: 'FIESTA', meaning: 'Fiesta (Merk Makanan Beku Premium)', type: 'brand' },
            { abbr: 'RCBTE', meaning: 'Rice Bite (Balutan Beras Krispi)', type: 'variant' },
            { abbr: 'CHS', meaning: 'Cheese (Isian Keju Lezat)', type: 'variant' },
            { abbr: '400', meaning: '400 Gram (Ukuran Kemasan)', type: 'size' }
          ]
        }
      ]
    }
  },
  {
    id: 'sample-sembako-minyak-2l',
    title: 'Struk Belanja Sembako & Minyak Goreng 2 Liter',
    subtitle: 'Sania MNYK GRNG 2L, Bimoli Pouch 2L, Gulaku 1kg, Bango Kecap 520',
    badge: 'Contoh Sembako & Minyak 2L',
    store: 'Alfamart / Super Indo',
    sampleImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    rawReceiptText: `ALFAMART CEMPAKA PUTIH
02.08.26 - 16:30
--------------------------------------------
SANIA MNYK GRNG 2L      1  34500    34,500
BIMOLI MNYK GRNG PCH 2L 1  36900    36,900
GULAKU GLA PSR 1KG      2  17500    35,000
SEGITIGA BIRU TPG 1KG   1  14200    14,200
BANGO KCP MNS REF 520   1  24800    24,800
--------------------------------------------
TOTAL BELANJA :                    145,400
TUNAI         :                    150,000
KEMBALI       :                      4,600`,
    decodedData: {
      id: 'rec-sample-3',
      storeName: 'Alfamart Cempaka Putih',
      storeLocation: 'Jl. Cempaka Putih Raya No. 18, Jakarta Pusat',
      transactionDate: '02 Agustus 2026',
      transactionTime: '16:30 WIB',
      orderNumber: 'ALFA-781290-CP',
      customerName: 'Pelanggan Umum',
      paymentMethod: 'Tunai (Cash)',
      totalAmount: 145400,
      totalDiscount: 0,
      netAmount: 145400,
      analyzedAt: '2026-08-02T16:30:00Z',
      items: [
        {
          id: 'item-301',
          rawLine: 'SANIA MNYK GRNG 2L   1  34500',
          rawName: 'SANIA MNYK GRNG 2L',
          fullName: 'Sania Minyak Goreng Kelapa Sawit Pouch Refill 2 Liter (Isi Bersih 2000ml)',
          brand: 'Sania (Wilmar International)',
          category: 'Sembako & Minyak Masak',
          variant: 'Minyak Sawit Premium Fortifikasi Vitamin A & E',
          unitSize: 'Pouch Refill 2 Liter (2000ml)',
          quantity: 1,
          unitPrice: 34500,
          totalPrice: 34500,
          searchKeywords: 'Sania Minyak Goreng 2L Pouch Refill',
          confidenceScore: 99,
          barcodeEstimate: '8998989110029',
          packagingDescription: 'Kemasan standing pouch plastik fleksibel refill isi ulang 2 Liter warna kuning keemasan berkilau dengan pegangan sudut tuang praktis.',
          productDescription: 'Minyak goreng kelapa sawit bermutu tinggi yang difortifikasi Vitamin A dan E, tidak mudah beku, tahan panas tinggi, dan menghasilkan gorengan renyah bebas kolesterol jahat.',
          estimatedPriceRange: { min: 33000, max: 37500 },
          abbreviationBreakdown: [
            { abbr: 'SANIA', meaning: 'Sania (Merk Minyak Goreng Ternama)', type: 'brand' },
            { abbr: 'MNYK', meaning: 'Minyak (Minyak Goreng Nabati Kelapa Sawit)', type: 'category' },
            { abbr: 'GRNG', meaning: 'Goreng (Untuk Memasak & Menggoreng)', type: 'category' },
            { abbr: '2L', meaning: '2 Liter (Isi Bersih / Berat Asli 2000 ml)', type: 'size' }
          ]
        },
        {
          id: 'item-302',
          rawLine: 'BIMOLI MNYK GRNG PCH 2L   1  36900',
          rawName: 'BIMOLI MNYK GRNG PCH 2L',
          fullName: 'Bimoli Minyak Goreng Kelapa Sawit Klasik Refill Pouch 2 Liter',
          brand: 'Bimoli (PT Salim Ivomas Pratama / Indofood)',
          category: 'Sembako & Minyak Masak',
          variant: 'Klasik Sawit Emas (Golden Palm Oil)',
          unitSize: 'Standing Pouch 2 Liter',
          quantity: 1,
          unitPrice: 36900,
          totalPrice: 36900,
          searchKeywords: 'Bimoli Minyak Goreng Pouch 2L',
          confidenceScore: 99,
          barcodeEstimate: '8992775120014',
          packagingDescription: 'Standing pouch merah kuning ikonik Bimoli dengan logo pohon kelapa sawit dan jaminan kejernihan minyak emas.',
          productDescription: 'Dibuat dari 100% kelapa sawit pilihan terbaik melalui proses pemurnian multi-tahap sehingga menghasilkan minyak goreng yang jernih, tahan panas, dan stabil.',
          estimatedPriceRange: { min: 35000, max: 39000 },
          abbreviationBreakdown: [
            { abbr: 'BIMOLI', meaning: 'Bimoli (Merk Minyak Legendaris Indofood)', type: 'brand' },
            { abbr: 'MNYK', meaning: 'Minyak (Minyak Goreng)', type: 'category' },
            { abbr: 'GRNG', meaning: 'Goreng (Cooking Oil)', type: 'category' },
            { abbr: 'PCH', meaning: 'Pouch (Kemasan Kantong Berdiri)', type: 'packaging' },
            { abbr: '2L', meaning: '2 Liter (Volume Bersih 2000 ml)', type: 'size' }
          ]
        },
        {
          id: 'item-303',
          rawLine: 'GULAKU GLA PSR 1KG   2  17500',
          rawName: 'GULAKU GLA PSR 1KG',
          fullName: 'Gulaku Gula Pasir Tebu Kristal Putih Premium 1 Kilogram',
          brand: 'Gulaku (Sugar Group Companies)',
          category: 'Sembako & Bahan Dapur',
          variant: 'Premium Putih (Kemasan Hijau/Kuning)',
          unitSize: 'Bungkus Plastik 1 Kg (1000g)',
          quantity: 2,
          unitPrice: 17500,
          totalPrice: 35000,
          searchKeywords: 'Gulaku Gula Pasir Putih 1kg',
          confidenceScore: 99,
          barcodeEstimate: '8992775210082',
          packagingDescription: 'Bungkus plastik tebal higienis transparan dengan motif pita hijau ikonik Gulaku.',
          productDescription: 'Gula pasir kristal murni bermutu tinggi yang diproduksi dari tebu alami Indonesia dengan standar higienis modern tanpa bahan pemutih sintetis.',
          estimatedPriceRange: { min: 16500, max: 18500 },
          abbreviationBreakdown: [
            { abbr: 'GULAKU', meaning: 'Gulaku (Merk Gula Tebu)', type: 'brand' },
            { abbr: 'GLA', meaning: 'Gula (Gula Kristal Tebu)', type: 'category' },
            { abbr: 'PSR', meaning: 'Pasir (Gula Pasir)', type: 'variant' },
            { abbr: '1KG', meaning: '1 Kilogram (Berat Bersih 1000 Gram)', type: 'size' }
          ]
        },
        {
          id: 'item-304',
          rawLine: 'SEGITIGA BIRU TPG 1KG   1  14200',
          rawName: 'SEGITIGA BIRU TPG 1KG',
          fullName: 'Segitiga Biru Tepung Terigu Serbaguna Protein Sedang 1 Kilogram',
          brand: 'Segitiga Biru (Bogasari / Indofood)',
          category: 'Sembako & Bahan Dapur',
          variant: 'Serbaguna Protein Sedang',
          unitSize: 'Kemasan Pack 1 Kilogram',
          quantity: 1,
          unitPrice: 14200,
          totalPrice: 14200,
          searchKeywords: 'Segitiga Biru Tepung Terigu 1kg',
          confidenceScore: 99,
          barcodeEstimate: '8992775310011',
          packagingDescription: 'Bungkus plastik biru putih dengan logo segitiga biru legendaris Bogasari.',
          productDescription: 'Tepung terigu serbaguna berprotein sedang, sangat cocok untuk aneka adonan kue basah, martabak manis, bolu, pancake, gorengan, dan mie rumahan.',
          estimatedPriceRange: { min: 13500, max: 15500 },
          abbreviationBreakdown: [
            { abbr: 'SEGITIGA BIRU', meaning: 'Segitiga Biru (Merk Terigu Bogasari)', type: 'brand' },
            { abbr: 'TPG', meaning: 'Tepung (Tepung Terigu Gandum)', type: 'category' },
            { abbr: '1KG', meaning: '1 Kilogram (Berat Bersih 1000 Gram)', type: 'size' }
          ]
        },
        {
          id: 'item-305',
          rawLine: 'BANGO KCP MNS REF 520   1  24800',
          rawName: 'BANGO KCP MNS REF 520',
          fullName: 'Bango Kecap Manis Kedelai Hitam Mallika Refill Pouch 520ml',
          brand: 'Bango (Unilever)',
          category: 'Sembako & Kecap',
          variant: 'Kecap Manis Mallika Tradisional',
          unitSize: 'Pouch Refill 520ml',
          quantity: 1,
          unitPrice: 24800,
          totalPrice: 24800,
          searchKeywords: 'Bango Kecap Manis Refill 520ml',
          confidenceScore: 99,
          barcodeEstimate: '8999999014292',
          packagingDescription: 'Pouch hijau gelap khas Bango dengan ilustrasi burung bangau dan butiran kedelai hitam Mallika berkualitas tinggi.',
          productDescription: 'Kecap manis kental gurih alami yang dibuat dari 4 bahan pilihan: kedelai hitam Mallika, gula kelapa, garam, dan air tanpa pewarna buatan.',
          estimatedPriceRange: { min: 23500, max: 27000 },
          abbreviationBreakdown: [
            { abbr: 'BANGO', meaning: 'Bango (Merk Kecap Manis Legendaris)', type: 'brand' },
            { abbr: 'KCP', meaning: 'Kecap (Kecap Kedelai)', type: 'category' },
            { abbr: 'MNS', meaning: 'Manis (Kecap Manis Kental Gurih)', type: 'variant' },
            { abbr: 'REF', meaning: 'Refill / Pouch Isi Ulang', type: 'packaging' },
            { abbr: '520', meaning: '520 Mililiter (Ukuran Isi Bersih)', type: 'size' }
          ]
        }
      ]
    }
  },
  {
    id: 'sample-indomaret-fresh-produce',
    title: 'Struk Indomaret Fresh - Pesanan Buah & Sayur Segar (12 Item)',
    subtitle: 'Pisang Cavendish, Apel Fuji, Jeruk Siam, Wortel Berastagi, Kentang Dieng, Brokoli',
    badge: 'Indomaret Fresh Hub',
    store: 'Indomaret Fresh - Pesanan Klik Indomaret',
    sampleImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=80',
    rawReceiptText: `INDOMARET FRESH HUB
PESANAN ONLINE KLIK INDOMARET
--------------------------------------------
WAKTU ORDER: 16.08.26 - 08:30
NO. ORDER  : FRESH-IDM-9921
KASIR      : INDOMARET FRESH POS
--------------------------------------------
PISANG CAVENDISH FRESH       1      19.900
APEL FUJI WANGSHAN           1      32.500
JERUK SIAM MADU FRESH        1      24.000
ALPUKAT MENTEGA FRESH        1      34.900
SEMANGKA N.BIJI POTONG       1      18.500
NAGA MERAH FRESH             1      26.000
WORTEL BRSTGI BRSH 500       1      12.500
KENTANG TES DIENG 1KG        1      22.000
BROKOLI SEGAR INDM 250       1      14.500
TOMAT BUAH SEGAR 500G        1       9.500
JGNG MNS KUPAS 2S            1      11.000
CB RWT MRH FRESH 100G        1      11.900
--------------------------------------------
TOTAL BELANJA               12     237.200
BAYAR (I-SAKU / QRIS)              237.200
KEMBALIAN                                0
--------------------------------------------
LAYANAN FRESH DELIVERY KLIK INDOMARET`,
    decodedData: {
      id: 'rec-sample-fresh-1',
      storeName: 'Indomaret Fresh (Klik Indomaret Hub)',
      storeLocation: 'Gerai Indomaret Fresh Delivery Hub',
      transactionDate: '16 Agustus 2026',
      transactionTime: '08:30 WIB',
      orderNumber: 'FRESH-IDM-9921',
      customerName: 'Pelanggan Indomaret Fresh',
      paymentMethod: 'i.saku / QRIS Klik Indomaret',
      totalAmount: 237200,
      totalDiscount: 0,
      netAmount: 237200,
      analyzedAt: '2026-08-16T08:30:00Z',
      items: [
        {
          id: 'fresh-1',
          rawLine: 'PISANG CAVENDISH FRESH   1  19.900',
          rawName: 'PISANG CAVENDISH FRESH',
          fullName: 'Pisang Cavendish Sunpride / Indomaret Fresh Cluster Pack 500g',
          brand: 'Sunpride / Indomaret Fresh',
          category: 'Buah Segar Indomaret Fresh',
          variant: 'Cavendish Matang Higienis',
          unitSize: 'Cluster Pack 500g',
          quantity: 1,
          unitPrice: 19900,
          totalPrice: 19900,
          searchKeywords: 'Pisang Cavendish Sunpride',
          confidenceScore: 99,
          barcodeEstimate: '8997001201015',
          packagingDescription: 'Kemasan plastik wrapping higienis berlabel Indomaret Fresh Sunpride kualitas ekspor.',
          productDescription: 'Pisang Cavendish segar dengan kulit mulus bersih, daging buah manis pulen, kaya serat, kalsium, dan kalium.',
          estimatedPriceRange: { min: 18000, max: 23000 },
          abbreviationBreakdown: [
            { abbr: 'PISANG', meaning: 'Buah Pisang Segar', type: 'category' },
            { abbr: 'CAVENDISH', meaning: 'Varian Pisang Cavendish Sunpride', type: 'variant' },
            { abbr: 'FRESH', meaning: 'Kategori Buah Segar Indomaret Fresh', type: 'packaging' }
          ]
        },
        {
          id: 'fresh-2',
          rawLine: 'APEL FUJI WANGSHAN   1  32.500',
          rawName: 'APEL FUJI WANGSHAN',
          fullName: 'Apel Fuji Wangshan Segar Manis Renyah Pack 800g / 4 Pcs',
          brand: 'Wangshan / Indomaret Fresh',
          category: 'Buah Segar Indomaret Fresh',
          variant: 'Apel Fuji Manis Renyah',
          unitSize: 'Pack 800g (Isi 4)',
          quantity: 1,
          unitPrice: 32500,
          totalPrice: 32500,
          searchKeywords: 'Apel Fuji Wangshan',
          confidenceScore: 99,
          barcodeEstimate: '8997001201022',
          packagingDescription: 'Tray mika bening berlubang udara dengan segel kualitas Indomaret Fresh.',
          productDescription: 'Apel Fuji kualitas impor terpilih, bertekstur sangat garing, berair melimpah, dan rasa manis alami menyegarkan.',
          estimatedPriceRange: { min: 30000, max: 36000 },
          abbreviationBreakdown: [
            { abbr: 'APEL', meaning: 'Buah Apel Segar', type: 'category' },
            { abbr: 'FUJI', meaning: 'Varietas Apel Fuji Renyah Manis', type: 'variant' },
            { abbr: 'WANGSHAN', meaning: 'Asal Kebun Wangshan Kualitas Super', type: 'brand' }
          ]
        },
        {
          id: 'fresh-3',
          rawLine: 'JERUK SIAM MADU FRESH   1  24.000',
          rawName: 'JERUK SIAM MADU FRESH',
          fullName: 'Jeruk Siam Madu Segar Berair Manis Pack 1 Kilogram',
          brand: 'Indomaret Fresh',
          category: 'Buah Segar Indomaret Fresh',
          variant: 'Siam Madu Super Manis',
          unitSize: 'Jaring Pack 1kg',
          quantity: 1,
          unitPrice: 24000,
          totalPrice: 24000,
          searchKeywords: 'Jeruk Siam Madu',
          confidenceScore: 99,
          barcodeEstimate: '8997001201039',
          packagingDescription: 'Kemasan kantong jaring merah higienis dengan barcode label Indomaret Fresh.',
          productDescription: 'Jeruk siam madu pilihan berkulit tipis, bulir padat banyak air, rasa manis legit dan kaya vitamin C alami.',
          estimatedPriceRange: { min: 22000, max: 27000 },
          abbreviationBreakdown: [
            { abbr: 'JERUK', meaning: 'Buah Jeruk Segar', type: 'category' },
            { abbr: 'SIAM MADU', meaning: 'Jeruk Siam Rasa Manis Madu', type: 'variant' },
            { abbr: 'FRESH', meaning: 'Standar Mutu Buah Segar', type: 'packaging' }
          ]
        },
        {
          id: 'fresh-4',
          rawLine: 'ALPUKAT MENTEGA FRESH   1  34.900',
          rawName: 'ALPUKAT MENTEGA FRESH',
          fullName: 'Alpukat Mentega Super Lembut Pulen Pack 1 Kilogram',
          brand: 'Indomaret Fresh',
          category: 'Buah Segar Indomaret Fresh',
          variant: 'Alpukat Mentega Super',
          unitSize: 'Jaring Pack 1kg (3-4 Buah)',
          quantity: 1,
          unitPrice: 34900,
          totalPrice: 34900,
          searchKeywords: 'Alpukat Mentega Fresh',
          confidenceScore: 98,
          barcodeEstimate: '8997001201046',
          packagingDescription: 'Kantong jaring pelindung buah dengan label grade A.',
          productDescription: 'Alpukat mentega pilihan dengan daging tebal kuning mentega tanpa serat pahit, rasa pulen gurih dan creamy.',
          estimatedPriceRange: { min: 32000, max: 38000 },
          abbreviationBreakdown: [
            { abbr: 'ALPUKAT', meaning: 'Buah Alpukat Segar', type: 'category' },
            { abbr: 'MENTEGA', meaning: 'Daging Buah Kuning Lembut Mentega', type: 'variant' },
            { abbr: 'FRESH', meaning: 'Mutu Segar Berkualitas', type: 'packaging' }
          ]
        },
        {
          id: 'fresh-5',
          rawLine: 'SEMANGKA N.BIJI POTONG   1  18.500',
          rawName: 'SEMANGKA N.BIJI POTONG',
          fullName: 'Semangka Merah Tanpa Biji Potong Fresh Pack 1 Kilogram',
          brand: 'Indomaret Fresh',
          category: 'Buah Segar Indomaret Fresh',
          variant: 'Semangka Merah Non-Biji',
          unitSize: 'Potong Mika Wrapping 1kg',
          quantity: 1,
          unitPrice: 18500,
          totalPrice: 18500,
          searchKeywords: 'Semangka Non Biji Fresh',
          confidenceScore: 99,
          barcodeEstimate: '8997001201053',
          packagingDescription: 'Tray potongan higienis dibungkus plastik cling film kedap udara.',
          productDescription: 'Semangka merah tanpa biji bertekstur renyah garing dan berair melimpah, sangat segar disajikan dingin.',
          estimatedPriceRange: { min: 16000, max: 21000 },
          abbreviationBreakdown: [
            { abbr: 'SEMANGKA', meaning: 'Buah Semangka Merah', type: 'category' },
            { abbr: 'N.BIJI', meaning: 'Non Biji / Tanpa Biji', type: 'variant' },
            { abbr: 'POTONG', meaning: 'Potongan Siap Konsumsi Higienis', type: 'packaging' }
          ]
        },
        {
          id: 'fresh-6',
          rawLine: 'NAGA MERAH FRESH   1  26.000',
          rawName: 'NAGA MERAH FRESH',
          fullName: 'Buah Naga Merah Manis Segar Pilihan Pack 1 Kilogram',
          brand: 'Indomaret Fresh',
          category: 'Buah Segar Indomaret Fresh',
          variant: 'Daging Buah Merah Tua (Red Dragon Fruit)',
          unitSize: 'Pack 1kg (2 Buah)',
          quantity: 1,
          unitPrice: 26000,
          totalPrice: 26000,
          searchKeywords: 'Buah Naga Merah',
          confidenceScore: 99,
          barcodeEstimate: '8997001201060',
          packagingDescription: 'Jaring pelindung buah dengan label kematangan siap santap.',
          productDescription: 'Buah naga berdaging merah keunguan pekat kaya antosianin dan antioksidan, rasa manis segar berkhasiat.',
          estimatedPriceRange: { min: 23000, max: 29000 },
          abbreviationBreakdown: [
            { abbr: 'NAGA', meaning: 'Buah Naga (Dragon Fruit)', type: 'category' },
            { abbr: 'MERAH', meaning: 'Daging Merah Manis', type: 'variant' },
            { abbr: 'FRESH', meaning: 'Kualitas Segar Pilihan', type: 'packaging' }
          ]
        },
        {
          id: 'fresh-7',
          rawLine: 'WORTEL BRSTGI BRSH 500   1  12.500',
          rawName: 'WORTEL BRSTGI BRSH 500',
          fullName: 'Wortel Berastagi Cuci Bersih Super Pack 500 Gram',
          brand: 'Indomaret Fresh',
          category: 'Sayuran Segar Indomaret Fresh',
          variant: 'Wortel Berastagi Cuci Bersih',
          unitSize: 'Pack 500g',
          quantity: 1,
          unitPrice: 12500,
          totalPrice: 12500,
          searchKeywords: 'Wortel Berastagi 500g',
          confidenceScore: 99,
          barcodeEstimate: '8997001202012',
          packagingDescription: 'Kemasan plastik perforasi berlubang udara higienis warna oranye segar.',
          productDescription: 'Wortel kualitas Berastagi yang sudah dicuci bersih dari tanah, renyah manis dan kaya vitamin A untuk jus atau sop.',
          estimatedPriceRange: { min: 11000, max: 14500 },
          abbreviationBreakdown: [
            { abbr: 'WORTEL', meaning: 'Sayuran Wortel Segar', type: 'category' },
            { abbr: 'BRSTGI', meaning: 'Asal Berastagi Dataran Tinggi', type: 'variant' },
            { abbr: 'BRSH', meaning: 'Sudah Dicuci Bersih Higienis', type: 'packaging' },
            { abbr: '500', meaning: '500 Gram Berat Bersih', type: 'size' }
          ]
        },
        {
          id: 'fresh-8',
          rawLine: 'KENTANG TES DIENG 1KG   1  22.000',
          rawName: 'KENTANG TES DIENG 1KG',
          fullName: 'Kentang Tes Dieng Segar Mutu A Pack 1 Kilogram',
          brand: 'Indomaret Fresh',
          category: 'Sayuran Segar Indomaret Fresh',
          variant: 'Kentang Tes Dieng Grade A',
          unitSize: 'Kemasan Jaring 1kg',
          quantity: 1,
          unitPrice: 22000,
          totalPrice: 22000,
          searchKeywords: 'Kentang Tes Dieng 1kg',
          confidenceScore: 99,
          barcodeEstimate: '8997001202029',
          packagingDescription: 'Kantong jaring kuat dengan label asal dataran tinggi Dieng.',
          productDescription: 'Kentang Dieng padat berkadar air rendah, sangat cocok untuk perkedel, kentang goreng krispi, atau campuran sop keluarga.',
          estimatedPriceRange: { min: 20000, max: 25000 },
          abbreviationBreakdown: [
            { abbr: 'KENTANG', meaning: 'Umbi Kentang Segar', type: 'category' },
            { abbr: 'TES DIENG', meaning: 'Varietas Tes Dataran Tinggi Dieng Berkualitas', type: 'variant' },
            { abbr: '1KG', meaning: '1 Kilogram', type: 'size' }
          ]
        },
        {
          id: 'fresh-9',
          rawLine: 'BROKOLI SEGAR INDM 250   1  14.500',
          rawName: 'BROKOLI SEGAR INDM 250',
          fullName: 'Brokoli Hijau Segar Pilihan Indomaret Fresh Pack 250 Gram',
          brand: 'Indomaret Fresh',
          category: 'Sayuran Segar Indomaret Fresh',
          variant: 'Kuntum Brokoli Hijau Segar',
          unitSize: 'Pack Wrapping 250g',
          quantity: 1,
          unitPrice: 14500,
          totalPrice: 14500,
          searchKeywords: 'Brokoli Segar Indomaret',
          confidenceScore: 99,
          barcodeEstimate: '8997001202036',
          packagingDescription: 'Wrapping plastik ketat higienis menjaga kesegaran kuntum bunga brokoli.',
          productDescription: 'Kuntum brokoli hijau padat tanpa ulat, kaya sulforafan, serat dan antioksidan untuk tumisan sehat atau MPASI.',
          estimatedPriceRange: { min: 13000, max: 17000 },
          abbreviationBreakdown: [
            { abbr: 'BROKOLI', meaning: 'Sayuran Hijau Brokoli', type: 'category' },
            { abbr: 'SEGAR', meaning: 'Kualitas Segar Panen', type: 'variant' },
            { abbr: 'INDM', meaning: 'Pilihan Indomaret Fresh', type: 'brand' },
            { abbr: '250', meaning: '250 Gram', type: 'size' }
          ]
        },
        {
          id: 'fresh-10',
          rawLine: 'TOMAT BUAH SEGAR 500G   1  9.500',
          rawName: 'TOMAT BUAH SEGAR 500G',
          fullName: 'Tomat Merah Buah Segar Pilihan Pack 500 Gram',
          brand: 'Indomaret Fresh',
          category: 'Sayuran Segar Indomaret Fresh',
          variant: 'Tomat Merah Segar Pilihan',
          unitSize: 'Pack 500g',
          quantity: 1,
          unitPrice: 9500,
          totalPrice: 9500,
          searchKeywords: 'Tomat Buah Segar 500g',
          confidenceScore: 99,
          barcodeEstimate: '8997001202043',
          packagingDescription: 'Tray mika berventilasi dengan label mutu Indomaret Fresh.',
          productDescription: 'Tomat buah merah padat berkulit mulus kaya likopen, cocok untuk lalapan segar, jus tomat sehat, atau bumbu masakan.',
          estimatedPriceRange: { min: 8500, max: 11500 },
          abbreviationBreakdown: [
            { abbr: 'TOMAT', meaning: 'Sayuran / Buah Tomat', type: 'category' },
            { abbr: 'BUAH', meaning: 'Varian Tomat Buah Daging Tebal', type: 'variant' },
            { abbr: '500G', meaning: '500 Gram', type: 'size' }
          ]
        },
        {
          id: 'fresh-11',
          rawLine: 'JGNG MNS KUPAS 2S   1  11.000',
          rawName: 'JGNG MNS KUPAS 2S',
          fullName: 'Jagung Manis Segar Kupas Kulit Pack Isi 2 Pcs',
          brand: 'Indomaret Fresh',
          category: 'Sayuran Segar Indomaret Fresh',
          variant: 'Jagung Manis Pipil / Rebus',
          unitSize: 'Pack Isi 2 Tongkol',
          quantity: 1,
          unitPrice: 11000,
          totalPrice: 11000,
          searchKeywords: 'Jagung Manis Kupas Indomaret',
          confidenceScore: 99,
          barcodeEstimate: '8997001202050',
          packagingDescription: 'Tray styrofoam putih wrapped rapat isi 2 tongkol bersih.',
          productDescription: 'Tongkol jagung manis yang sudah dikupas kulit dan bersih dari rambut jagung, bulir kuning rapat dan manis renyah.',
          estimatedPriceRange: { min: 9500, max: 13000 },
          abbreviationBreakdown: [
            { abbr: 'JGNG', meaning: 'Jagung (Sayuran Jagung)', type: 'category' },
            { abbr: 'MNS', meaning: 'Manis (Varietas Jagung Manis)', type: 'variant' },
            { abbr: 'KUPAS', meaning: 'Sudah Dikupas Kulitnya Bersih', type: 'packaging' },
            { abbr: '2S', meaning: '2 Stick / Pcs Tongkol', type: 'size' }
          ]
        },
        {
          id: 'fresh-12',
          rawLine: 'CB RWT MRH FRESH 100G   1  11.900',
          rawName: 'CB RWT MRH FRESH 100G',
          fullName: 'Cabai Rawit Merah Segar Super Pedas Pack 100 Gram',
          brand: 'Indomaret Fresh',
          category: 'Sayuran Segar Indomaret Fresh',
          variant: 'Cabai Rawit Merah Super Pedas',
          unitSize: 'Pack Higienis 100g',
          quantity: 1,
          unitPrice: 11900,
          totalPrice: 11900,
          searchKeywords: 'Cabai Rawit Merah 100g',
          confidenceScore: 99,
          barcodeEstimate: '8997001202067',
          packagingDescription: 'Wadah mika kedap udara berlubang halus menjaga kesegaran tangkai cabai.',
          productDescription: 'Cabai rawit merah pedas pilihan segar dengan tangkai masih hijau segar, pedas menggigit untuk sambal mantap.',
          estimatedPriceRange: { min: 10000, max: 15000 },
          abbreviationBreakdown: [
            { abbr: 'CB', meaning: 'Cabai / Cabe', type: 'category' },
            { abbr: 'RWT', meaning: 'Rawit (Cabai Rawit Pedas)', type: 'variant' },
            { abbr: 'MRH', meaning: 'Merah Matang Pedas Maksimal', type: 'variant' },
            { abbr: '100G', meaning: '100 Gram', type: 'size' }
          ]
        }
      ]
    }
  }
];
