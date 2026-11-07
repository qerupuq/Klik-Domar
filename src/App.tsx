import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ReceiptData, 
  ReceiptItem,
  ProductStatus
} from './types';
import { 
  SAMPLE_RECEIPTS 
} from './data/sampleReceipts';
import { 
  getSearchFlatIcon, 
  QUICK_SEARCH_PRESETS 
} from './data/productImages';
import { Navbar } from './components/Navbar';
import { ReceiptUploader } from './components/ReceiptUploader';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { DictionaryModal } from './components/DictionaryModal';
import { ImageZoomModal } from './components/ImageZoomModal';
import { ReceiptSummary } from './components/ReceiptSummary';
import { ReceiptImageViewer } from './components/ReceiptImageViewer';
import { CleanReceiptModal } from './components/CleanReceiptModal';
import { QuickAbbreviationTester } from './components/QuickAbbreviationTester';
import { ReceiptScrollSpy } from './components/ReceiptScrollSpy';
import { HistoryModal, saveLocalReceipt } from './components/HistoryModal';
import { AppTheme, ThemeSelectorModal } from './components/ThemeSelector';
import { PersonalCatalogModal } from './components/PersonalCatalogModal';
import { extractAttributesFromText, checkAttributeMatch } from './lib/attributeMatcher';
import { findCatalogCandidates } from './lib/personalCatalog';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { saveReceiptToHistory } from './lib/receiptService';
import { 
  Search, 
  RotateCcw, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  ShoppingBag,
  ArrowUp,
  X,
  Layers,
  Filter,
  ExternalLink,
  Image as ImageIcon,
  Globe
} from 'lucide-react';

export function App() {
  // Theme state: 5 eye-friendly dark modes ('midnight', 'forest', 'mocha', 'cobalt', 'amethyst') + 'light'
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('app-theme') as AppTheme | null;
    const validThemes: AppTheme[] = ['midnight', 'forest', 'mocha', 'cobalt', 'amethyst', 'light'];
    if (saved && validThemes.includes(saved)) return saved;
    return 'midnight'; // Default eye-friendly OLED black dark mode
  });
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  // User auth state with Firebase Auth
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Primary receipt state
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Viewer states
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const [selectedProductForResearch, setSelectedProductForResearch] = useState<ReceiptItem | null>(null);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string; bgGradient?: string } | null>(null);
  const [isCleanReceiptOpen, setIsCleanReceiptOpen] = useState(false);

  // Filter & Search states within decoded list
  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  // Smooth Back-to-Top button trigger
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pipeline pencocokan atribut dan katalog pribadi
  const enrichReceiptWithCatalog = useCallback((receipt: ReceiptData): ReceiptData => {
    const updatedItems = receipt.items.map((item) => {
      // 1. Ekstraksi atribut dari baris asli struk
      const extracted = extractAttributesFromText(item.rawLine || item.rawName);

      // 2. Cari kandidat di Katalog Pribadi pengguna
      const catalogResult = findCatalogCandidates(item.rawName, item.barcode);

      if (catalogResult.candidates.length > 0) {
        const topCandidate = catalogResult.candidates[0];
        const isConflict = topCandidate.conflictingAttributes.length > 0;
        const isAmbiguous = catalogResult.isAmbiguous;

        return {
          ...item,
          fullName: isConflict ? item.fullName : topCandidate.name,
          brand: item.brand || topCandidate.brand,
          variant: item.variant || topCandidate.variant,
          unitSize: item.unitSize || topCandidate.unitSize,
          packaging: item.packaging || topCandidate.packaging,
          candidates: catalogResult.candidates,
          status: (isConflict ? 'KONFLIK_ATRIBUT' : isAmbiguous ? 'PERLU_KONFIRMASI' : 'COCOK_KATALOG') as ProductStatus,
          statusNote: isConflict 
            ? `Perbedaan terdeteksi: ${topCandidate.conflictingAttributes.join(', ')}`
            : isAmbiguous 
            ? 'Ditemukan lebih dari 1 kandidat yang mirip. Silakan konfirmasi.'
            : 'Cocok dengan Katalog Pribadi yang telah dikonfirmasi',
          isAiInterpretation: false,
          evidence: {
            rawLine: item.rawLine,
            matchedAttributes: topCandidate.matchedAttributes,
            conflictingAttributes: topCandidate.conflictingAttributes,
            unknownAttributes: topCandidate.unknownAttributes,
            sourceOrigin: 'Katalog Pribadi Pengguna',
            productUrl: topCandidate.productUrl
          }
        };
      }

      // Jika belum ada di katalog pribadi, tandai secara jujur sebagai Penafsiran AI
      const rawSizeStr = extracted.netSize?.rawValue 
        ? `${extracted.netSize.rawValue}${extracted.netSize.rawUnit}` 
        : '';

      return {
        ...item,
        status: (item.status || 'PERLU_KONFIRMASI') as ProductStatus,
        isAiInterpretation: true,
        evidence: {
          rawLine: item.rawLine,
          matchedAttributes: rawSizeStr ? [`Ukuran: ${rawSizeStr}`] : [],
          conflictingAttributes: [],
          unknownAttributes: ['Perlu konfirmasi fisik kemasan'],
          sourceOrigin: 'Penafsiran AI (Belum Diverifikasi Katalog)'
        }
      };
    });

    return {
      ...receipt,
      items: updatedItems
    };
  }, []);

  // Helper untuk menyimpan ke penyimpanan lokal dan sinkron ke Firestore Cloud jika user login
  const persistReceipt = useCallback((receipt: ReceiptData) => {
    saveLocalReceipt(receipt);
    if (currentUser) {
      saveReceiptToHistory(currentUser.uid, receipt).catch((err) => {
        console.warn('Gagal menyinkronkan struk ke Cloud Firestore:', err);
      });
    }
  }, [currentUser]);

  const handleUpdateItem = useCallback((updatedItem: ReceiptItem) => {
    setActiveReceipt((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        items: prev.items.map((it) => (it.id === updatedItem.id ? updatedItem : it))
      };
      persistReceipt(updated);
      return updated;
    });
  }, [persistReceipt]);

  const handleHighlightItem = useCallback((id: string) => {
    setHighlightedItemId(id);
    const photoSection = document.getElementById('section-photo');
    if (photoSection) {
      photoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Detect matching Flaticon flat image for active search
  const detectedSearchIcon = useMemo(() => {
    return getSearchFlatIcon(searchKeyword);
  }, [searchKeyword]);

  // Handle image analysis from upload / camera
  const handleAnalyzeImage = async (base64: string, mimeType: string, previewUrl: string) => {
    // Bersihkan hasil lama terlebih dahulu
    setActiveReceipt(null);
    setSearchKeyword('');
    setFilterCategory('Semua');
    setIsLoading(true);
    setLoadingMessage('Menganalisis foto struk dengan Gemini AI Vision...');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/receipt/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Gagal membaca struk belanja.');
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const decoded = resData.data;
        decoded.imagePreviewUrl = previewUrl;
        const enriched = enrichReceiptWithCatalog(decoded);
        setActiveReceipt(enriched);
        persistReceipt(enriched);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else {
        throw new Error(resData.error || 'Hasil analisis struk kosong.');
      }
    } catch (err: any) {
      console.warn('API Analyze error:', err);
      setErrorMessage(err.message || 'Terjadi kendala saat menganalisis struk.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Handle raw text input
  const handleAnalyzeText = async (text: string) => {
    // Bersihkan hasil lama terlebih dahulu
    setActiveReceipt(null);
    setSearchKeyword('');
    setFilterCategory('Semua');
    setIsLoading(true);
    setLoadingMessage('Menerjemahkan singkatan struk & mencari produk...');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/receipt/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: text })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Gagal memproses teks struk.');
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const decoded = resData.data;
        decoded.rawText = text;
        const enriched = enrichReceiptWithCatalog(decoded);
        setActiveReceipt(enriched);
        persistReceipt(enriched);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses singkatan.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Handle instant selection of preloaded real receipt sample
  const handleSelectSample = (sampleId: string) => {
    setActiveReceipt(null);
    setSearchKeyword('');
    setFilterCategory('Semua');
    const sample = SAMPLE_RECEIPTS.find((s) => s.id === sampleId) || SAMPLE_RECEIPTS[0];
    const dataWithPreview: ReceiptData = {
      ...sample.decodedData,
      imagePreviewUrl: sample.sampleImage,
      rawText: sample.rawReceiptText
    };
    const enriched = enrichReceiptWithCatalog(dataWithPreview);
    setActiveReceipt(enriched);
    persistReceipt(enriched);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleReset = () => {
    setActiveReceipt(null);
    setSearchKeyword('');
    setFilterCategory('Semua');
    setErrorMessage(null);
  };

  // Stable callbacks for ProductCard memoization
  const handleOpenDetail = useCallback((prod: ReceiptItem) => {
    setSelectedProductForResearch(prod);
  }, []);

  const handleZoomImage = useCallback((url: string, title: string) => {
    setZoomImage({ url, title });
  }, []);

  // Filter and sort items with useMemo
  const filteredItems = useMemo(() => {
    if (!activeReceipt?.items) return [];
    return activeReceipt.items.filter((item) => {
      const matchesCategory =
        filterCategory === 'Semua' ||
        item.category.toLowerCase().includes(filterCategory.toLowerCase());
      const lowerSearch = searchKeyword.toLowerCase().trim();
      const matchesSearch =
        !lowerSearch ||
        item.fullName.toLowerCase().includes(lowerSearch) ||
        item.rawName.toLowerCase().includes(lowerSearch) ||
        item.brand.toLowerCase().includes(lowerSearch) ||
        item.category.toLowerCase().includes(lowerSearch) ||
        (item.variant && item.variant.toLowerCase().includes(lowerSearch));
      return matchesCategory && matchesSearch;
    });
  }, [activeReceipt?.items, filterCategory, searchKeyword]);

  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    if (sortBy === 'price-asc') return list.sort((a, b) => (a.unitPrice || 0) - (b.unitPrice || 0));
    if (sortBy === 'price-desc') return list.sort((a, b) => (b.unitPrice || 0) - (a.unitPrice || 0));
    if (sortBy === 'name') return list.sort((a, b) => a.fullName.localeCompare(b.fullName));
    return list;
  }, [filteredItems, sortBy]);

  // Extract unique categories from current receipt
  const receiptCategories = useMemo(() => {
    return activeReceipt
      ? ['Semua', ...Array.from(new Set(activeReceipt.items.map((i) => i.category.split(' ')[0])))]
      : ['Semua'];
  }, [activeReceipt]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--bg-color)] text-[var(--text-main)] transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
        activeTheme={theme}
        onReset={handleReset}
        hasActiveReceipt={!!activeReceipt}
        isLoading={isLoading}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--panel-color)] shadow-[var(--shadow-recessed)] border-l-4 border-[var(--accent)] text-[var(--text-main)] text-xs sm:text-sm flex items-start justify-between gap-3 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[var(--accent)] font-mono font-bold hover:underline cursor-pointer uppercase text-xs"
            >
              [TUTUP]
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!activeReceipt ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
            {/* Hero / Introduction */}
            <div className="text-center max-w-2xl mx-auto pt-2 pb-2 select-none">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] mb-3 text-xs font-mono font-bold text-[var(--text-muted)]">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e]"></span>
                <span>INSTRUMENT SYSTEM // PENERJEMAH STRUK RITEL</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-[var(--text-main)] tracking-tight">
                Pecahkan Singkatan Struk Belanja Jadi Nama &amp; Foto Produk Asli
              </h1>
              <p className="text-xs sm:text-sm font-mono text-[var(--text-muted)] mt-2 max-w-lg mx-auto leading-relaxed">
                Sistem analisis optik &amp; kecerdasan buatan untuk membaca, memvalidasi kemasan, dan mengekstrak katalog ritel resmi Klik Indomaret &amp; Indomaret Fresh.
              </p>
            </div>

            {/* Uploader Card */}
            <ReceiptUploader
              onAnalyzeImage={handleAnalyzeImage}
              onAnalyzeText={handleAnalyzeText}
              onSelectSample={handleSelectSample}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
            />

            {/* Live Quick Tester Bar */}
            <QuickAbbreviationTester />

            {/* Bento Grid Feature Highlights (Bolted Modules) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 select-none">
              {/* Feature 1 */}
              <div className="relative p-5 rounded-2xl bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)]">
                {/* Corner Rivet */}
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[var(--recessed-color)] shadow-[inset_0.5px_0.5px_1px_var(--border-light),0.5px_0.5px_1px_rgba(0,0,0,0.3)] flex items-center justify-center">
                  <div className="w-1 h-0.5 bg-[var(--border-dark)] transform rotate-45"></div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] text-[var(--accent)] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                  MODUL 01 // DATABASE
                </div>
                <h3 className="font-heading font-black text-sm sm:text-base text-[var(--text-main)] mb-1 tracking-tight">
                  Katalog Klik Indomaret &amp; Fresh
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                  Membedah setiap singkatan kode kasir menjadi nama produk resmi, merk dagang, dan isi bersih sesuai katalog ritel dan produk sayur/buah segar.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative p-5 rounded-2xl bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)]">
                {/* Corner Rivet */}
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[var(--recessed-color)] shadow-[inset_0.5px_0.5px_1px_var(--border-light),0.5px_0.5px_1px_rgba(0,0,0,0.3)] flex items-center justify-center">
                  <div className="w-1 h-0.5 bg-[var(--border-dark)] transform -rotate-45"></div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] text-[#22c55e] flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                  MODUL 02 // RESEARCH
                </div>
                <h3 className="font-heading font-black text-sm sm:text-base text-[var(--text-main)] mb-1 tracking-tight">
                  Deep Research Kemasan
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                  Verifikasi otomatis bentuk fisik kemasan, komposisi utama, nomor izin edar BPOM RI, dan rentang harga pasar dengan query terfokus.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative p-5 rounded-2xl bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)]">
                {/* Corner Rivet */}
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[var(--recessed-color)] shadow-[inset_0.5px_0.5px_1px_var(--border-light),0.5px_0.5px_1px_rgba(0,0,0,0.3)] flex items-center justify-center">
                  <div className="w-1.5 h-0.5 bg-[var(--border-dark)] transform rotate-45"></div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] text-[var(--accent)] flex items-center justify-center mb-3">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                  MODUL 03 // VERIFIKASI
                </div>
                <h3 className="font-heading font-black text-sm sm:text-base text-[var(--text-main)] mb-1 tracking-tight">
                  Flaticon Visual &amp; Akses Langsung
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                  Menyajikan ikon flat vector Flaticon beranimasi dan tautan verifikasi cepat langsung ke Klik Indomaret, Alfagift, dan Google Images.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* View 2: Decoded Receipt Results View */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 select-none"
          >
            {/* Top Back / Action bar */}
            <div className="flex items-center justify-between gap-3">
              <button
                id="back-to-upload-btn"
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-[var(--text-main)] bg-[var(--panel-color)] shadow-[var(--shadow-card)] hover:text-[var(--accent)] px-4 py-2.5 rounded-xl border border-[var(--card-border)] active:translate-y-[1px] cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4 text-[var(--accent)]" />
                <span>UPLOAD / SCAN STRUK LAIN</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="open-dict-from-feed-btn"
                  onClick={() => setIsDictionaryOpen(true)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-[var(--text-main)] bg-[var(--panel-color)] shadow-[var(--shadow-card)] hover:text-[var(--accent)] px-4 py-2.5 rounded-xl border border-[var(--card-border)] active:translate-y-[1px] cursor-pointer transition-all"
                >
                  <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                  <span className="hidden sm:inline">KAMUS SINGKATAN</span>
                </button>
              </div>
            </div>

            {/* Scroll-Spy Sticky Navigation Bar */}
            <ReceiptScrollSpy itemCount={activeReceipt.items.length} />

            {/* Section 1: Receipt Summary Banner & Metrics */}
            <div id="section-summary" className="scroll-mt-28">
              <ReceiptSummary
                receipt={activeReceipt}
                onPrintCleanReceipt={() => setIsCleanReceiptOpen(true)}
              />
            </div>

            {/* Section 2: Original Receipt Photo / OCR Inspector Accordion */}
            <div id="section-photo" className="scroll-mt-28">
              <ReceiptImageViewer
                imageUrl={activeReceipt.imagePreviewUrl}
                rawText={activeReceipt.rawText}
                storeName={activeReceipt.storeName}
                highlightedItemId={highlightedItemId}
                items={activeReceipt.items}
              />
            </div>

            {/* Section 3: Filter & Search Bar for Decoded Items with Flaticon Icons */}
            <div id="section-products" className="scroll-mt-28 space-y-4">
              <div className="bg-[var(--panel-color)] rounded-2xl border border-[var(--card-border)] p-4 shadow-[var(--shadow-card)] flex flex-col gap-3 text-[var(--text-main)]">
                {/* Search input + Flaticon Dynamic Icon */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-96">
                    {/* Left Icon: Dynamic Flaticon Flat Image or Standard Magnifier */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                      {detectedSearchIcon ? (
                        <motion.div
                          key={detectedSearchIcon.keyword}
                          initial={{ scale: 0, rotate: -15 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="w-7 h-7 rounded-lg bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] p-1 flex items-center justify-center"
                          title={`Kategori: ${detectedSearchIcon.title}`}
                        >
                          <img
                            src={detectedSearchIcon.svgDataUri}
                            alt={detectedSearchIcon.title}
                            className="w-full h-full object-contain"
                          />
                        </motion.div>
                      ) : (
                        <Search className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                    </div>

                    <input
                      id="search-decoded-input"
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Cari (shampo, buah, sayur, mie, kopi, susu, struk...)"
                      className={`w-full ${
                        detectedSearchIcon ? 'pl-12' : 'pl-10'
                      } pr-10 py-2.5 bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] rounded-xl text-xs sm:text-sm font-mono text-[var(--text-main)] placeholder-[var(--text-muted)]/60 focus:outline-hidden focus:border-[var(--accent)] transition-all`}
                    />

                    {/* Clear button if text present */}
                    {searchKeyword && (
                      <button
                        type="button"
                        onClick={() => setSearchKeyword('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--panel-color)] shadow-[var(--shadow-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                        title="Hapus pencarian"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Quick external search button for Google Images & Google Search */}
                  {searchKeyword.trim() && (
                    <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">CARI LUAR:</span>
                      <a
                        href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchKeyword)}+kemasan`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-main)] shadow-[var(--shadow-card)] border border-[var(--card-border)] transition-all cursor-pointer text-[11px]"
                        title={`Cari foto "${searchKeyword}" di Google Images`}
                      >
                        <ImageIcon className="w-3 h-3 text-[var(--accent)]" />
                        <span>Google Images</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(searchKeyword)}+klikindomaret`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-main)] shadow-[var(--shadow-card)] border border-[var(--card-border)] transition-all cursor-pointer text-[11px]"
                        title={`Cari info "${searchKeyword}" di Google`}
                      >
                        <Globe className="w-3 h-3 text-[var(--accent)]" />
                        <span>Pencarian Google</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                      </a>
                    </div>
                  )}

                  {/* Category Pills & Sorting */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end overflow-x-auto pb-1 no-scrollbar">
                    <div className="flex items-center gap-1.5">
                      {receiptCategories.slice(0, 5).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFilterCategory(cat)}
                          className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                            filterCategory === cat
                              ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-card)] border border-white/20'
                              : 'bg-[var(--panel-color)] text-[var(--text-muted)] shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[var(--text-main)]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <select
                        id="sort-products-select"
                        value={sortBy}
                        onChange={(e: any) => setSortBy(e.target.value)}
                        className="text-xs font-mono font-bold bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] rounded-lg px-3 py-1.5 text-[var(--text-main)] focus:outline-hidden cursor-pointer"
                      >
                        <option value="default">Urutan Struk</option>
                        <option value="name">Nama Produk</option>
                        <option value="price-desc">Harga Tertinggi</option>
                        <option value="price-asc">Harga Terendah</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Quick Flaticon Category Presets (Horizontal Scrollable Chips) */}
                <div className="pt-2 border-t border-[var(--card-border)]/60">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                    <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-[var(--accent)]" />
                      Filter Cepat:
                    </span>
                    {QUICK_SEARCH_PRESETS.map((preset) => {
                      const isSelected = searchKeyword.toLowerCase().trim() === preset.searchKeyword.toLowerCase();
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSearchKeyword('');
                            } else {
                              setSearchKeyword(preset.searchKeyword);
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                            isSelected
                              ? 'bg-[var(--accent)] text-white border-transparent shadow-[var(--shadow-pressed)] ring-2 ring-[var(--accent)]/30'
                              : 'bg-[var(--recessed-color)] text-[var(--text-muted)] border-[var(--card-border)] hover:text-[var(--text-main)] hover:border-[var(--accent)]/50 shadow-[var(--shadow-card)]'
                          }`}
                        >
                          <img
                            src={preset.iconUri}
                            alt={preset.label}
                            className="w-4 h-4 object-contain shrink-0"
                          />
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Category Search Banner if active */}
                {detectedSearchIcon && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--recessed-color)] border border-[var(--card-border)] shadow-[var(--shadow-recessed)] mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--panel-color)] shadow-[var(--shadow-card)] p-1.5 flex items-center justify-center border border-[var(--card-border)]">
                        <img
                          src={detectedSearchIcon.svgDataUri}
                          alt={detectedSearchIcon.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] block">
                          PENCARIAN KATEGORI KHUSUS
                        </span>
                        <h4 className="font-heading font-extrabold text-sm text-[var(--text-main)]">
                          {detectedSearchIcon.title} — {sortedItems.length} produk cocok di struk
                        </h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSearchKeyword('')}
                      className="text-xs font-mono font-bold text-[var(--accent)] hover:underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Decoded Product Cards List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1 font-mono">
                  <span>
                    Menampilkan <strong className="text-[var(--text-main)]">{sortedItems.length}</strong> dari {activeReceipt.items.length} produk
                  </span>
                  <span className="hidden sm:inline text-[var(--accent)] font-bold">
                    Klik <strong>&quot;Deep Riset Produk&quot;</strong> untuk rincian BPOM &amp; komposisi
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence initial={false}>
                    {sortedItems.length === 0 ? (
                      <motion.div
                        key="no-items-matched"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="py-12 text-center bg-[var(--panel-color)] shadow-[var(--shadow-recessed)] rounded-2xl p-8 border border-[var(--card-border)]"
                      >
                        {detectedSearchIcon ? (
                          <div className="w-16 h-16 mx-auto mb-3 p-2 rounded-2xl bg-[var(--recessed-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] flex items-center justify-center">
                            <img
                              src={detectedSearchIcon.svgDataUri}
                              alt={detectedSearchIcon.title}
                              className="w-12 h-12 object-contain"
                            />
                          </div>
                        ) : (
                          <Search className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                        )}
                        <p className="font-mono font-bold text-sm text-[var(--text-main)]">
                          Tidak ada produk yang cocok dengan kata kunci &quot;{searchKeyword}&quot;
                        </p>
                        <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
                          Coba gunakan filter cepat di atas atau klik reset untuk melihat seluruh struk.
                        </p>
                        {searchKeyword && (
                          <button
                            type="button"
                            onClick={() => setSearchKeyword('')}
                            className="mt-4 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-mono font-bold hover:brightness-110 shadow-[var(--shadow-card)] cursor-pointer"
                          >
                            Tampilkan Semua Produk
                          </button>
                        )}
                      </motion.div>
                    ) : (
                      sortedItems.map((item, idx) => (
                        <ProductCard
                          key={item.id || `${item.rawName}-${idx}`}
                          item={item}
                          index={idx}
                          searchKeyword={searchKeyword}
                          onOpenDetail={handleOpenDetail}
                          onZoomImage={handleZoomImage}
                          onUpdateItem={handleUpdateItem}
                          onClickHighlight={handleHighlightItem}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Quick Abbreviation Tester in Decoded view as well */}
            <QuickAbbreviationTester />
          </motion.div>
        )}
      </AnimatePresence>
      </main>

      {/* Floating Smooth Back-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-[var(--panel-color)] text-[var(--accent)] border border-[var(--card-border)] shadow-[var(--shadow-floating)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer group"
            title="Scroll ke Atas"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer (Industrial Nameplate) */}
      <footer className="mt-auto bg-[var(--panel-color)] border-t border-[var(--card-border)] py-6 text-center text-xs text-[var(--text-muted)] font-mono select-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e]"></span>
            <p>
              <strong className="text-[var(--text-main)] font-bold">StrukPedia</strong> — Decoder Struk Ritel &amp; Katalog Pribadi Offline-First.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)]">
            <span>Bantuan AI bersifat estimasi. Konfirmasi fisik struk dan kemasan selalu diutamakan.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ThemeSelectorModal
        isOpen={isThemeSelectorOpen}
        activeTheme={theme}
        onSelectTheme={(t) => setTheme(t)}
        onClose={() => setIsThemeSelectorOpen(false)}
      />

      <PersonalCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => {
          setIsCatalogOpen(false);
          if (activeReceipt) {
            setActiveReceipt(enrichReceiptWithCatalog(activeReceipt));
          }
        }}
      />

      <ProductDetailModal
        item={selectedProductForResearch}
        onClose={() => setSelectedProductForResearch(null)}
      />

      <DictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        onQuickTestAbbreviation={(abbr) => {
          handleAnalyzeText(abbr);
        }}
      />

      {zoomImage && (
        <ImageZoomModal
          isOpen={!!zoomImage}
          imageUrl={zoomImage.url}
          title={zoomImage.title}
          bgGradient={zoomImage.bgGradient}
          onClose={() => setZoomImage(null)}
        />
      )}

      <CleanReceiptModal
        isOpen={isCleanReceiptOpen}
        receipt={activeReceipt}
        onClose={() => setIsCleanReceiptOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectHistory={(receipt) => {
          setActiveReceipt(receipt);
          setErrorMessage(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
