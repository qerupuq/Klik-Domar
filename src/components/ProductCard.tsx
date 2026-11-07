import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReceiptItem, ProductCandidate } from '../types';
import { 
  Sparkles, 
  ExternalLink, 
  ShoppingBag, 
  Maximize2, 
  Check, 
  Copy, 
  Package, 
  Search, 
  ChevronDown,
  Edit3,
  Barcode,
  Layers,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  XCircle,
  BookmarkPlus,
  Image as ImageIcon,
  Globe,
  Eye
} from 'lucide-react';
import { getProductFlatTheme, getProductVisual, buildECommerceLinks } from '../data/productImages';
import { validateGtinChecksum } from '../lib/attributeMatcher';
import { savePersonalCatalogItem, getPersonalCatalog } from '../lib/personalCatalog';
import { getRealProductPhoto } from '../lib/productPhotoService';

interface ProductCardProps {
  item: ReceiptItem;
  index: number;
  searchKeyword?: string;
  onOpenDetail: (item: ReceiptItem) => void;
  onZoomImage?: (imageUrl: string, title: string) => void;
  onUpdateItem?: (updatedItem: ReceiptItem) => void;
  onClickHighlight?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  item,
  index,
  searchKeyword,
  onOpenDetail,
  onZoomImage,
  onUpdateItem,
  onClickHighlight
}) => {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  
  // State interaksi audit
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedNameInput, setEditedNameInput] = useState(item.correctedName || item.fullName);
  const [isComparingCandidates, setIsComparingCandidates] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [isEditingBarcode, setIsEditingBarcode] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState(item.barcode || '');
  const [barcodeError, setBarcodeError] = useState<string | null>(null);
  const [savedAsAliasMsg, setSavedAsAliasMsg] = useState(false);

  // Layered Photo System State
  const [realPhotoUrl, setRealPhotoUrl] = useState<string | null>(null);
  const [isFetchingRealPhoto, setIsFetchingRealPhoto] = useState<boolean>(false);
  const [realPhotoFailed, setRealPhotoFailed] = useState<boolean>(false);
  const [userPhotoFailed, setUserPhotoFailed] = useState<boolean>(false);

  // Fetch real product photo from Open Food Facts if barcode exists
  useEffect(() => {
    setRealPhotoUrl(null);
    setRealPhotoFailed(false);
    setUserPhotoFailed(false);
    setImageLoaded(false);
    setImageError(false);

    if (!item.barcode) return;

    let isMounted = true;
    setIsFetchingRealPhoto(true);

    getRealProductPhoto(item.barcode)
      .then((res) => {
        if (isMounted) {
          if (res && res.imageUrl) {
            setRealPhotoUrl(res.imageUrl);
          } else {
            setRealPhotoFailed(true);
          }
          setIsFetchingRealPhoto(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRealPhotoFailed(true);
          setIsFetchingRealPhoto(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [item.barcode]);

  // Lookup user-uploaded photo from personal catalog
  const userUploadedPhoto = useMemo(() => {
    if (userPhotoFailed) return null;
    const catalog = getPersonalCatalog();
    const found = catalog.find((c) =>
      (item.barcode && c.barcode === item.barcode) ||
      c.name.toLowerCase() === item.fullName.toLowerCase() ||
      c.receiptAliases.some((a) => a.toLowerCase() === item.rawName.toLowerCase())
    );
    return found?.imageUrl || null;
  }, [item.barcode, item.fullName, item.rawName, userPhotoFailed]);

  // Tutup menu Google jika klik di luar
  useEffect(() => {
    if (!searchMenuOpen) return;
    const handleOutsideClick = () => setSearchMenuOpen(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [searchMenuOpen]);

  const flatTheme = useMemo(
    () => getProductFlatTheme(item.fullName || item.rawName, item.category, item.packaging),
    [item.fullName, item.rawName, item.category, item.packaging]
  );
  const visual = useMemo(
    () => getProductVisual(item.fullName || item.rawName, item.category, item.packaging),
    [item.fullName, item.rawName, item.category, item.packaging]
  );

  // Determine active display image and source metadata
  const activePhoto = useMemo(() => {
    if (realPhotoUrl && !realPhotoFailed) {
      return {
        url: realPhotoUrl,
        source: 'real_openfoodfacts' as const,
        badgeText: 'Foto Referensi',
        badgeClass: 'bg-emerald-600 text-white border-emerald-400/40 shadow-xs',
        isIllustration: false
      };
    }
    if (userUploadedPhoto && !userPhotoFailed) {
      return {
        url: userUploadedPhoto,
        source: 'user_uploaded' as const,
        badgeText: 'Foto Anda',
        badgeClass: 'bg-indigo-600 text-white border-indigo-400/40 shadow-xs',
        isIllustration: false
      };
    }
    return {
      url: visual.imageUrl,
      source: 'illustration' as const,
      badgeText: 'Ilustrasi',
      badgeClass: 'bg-black/60 text-white/90 border-white/20',
      isIllustration: true
    };
  }, [realPhotoUrl, realPhotoFailed, userUploadedPhoto, userPhotoFailed, visual.imageUrl]);
  const links = useMemo(
    () => buildECommerceLinks(item.fullName),
    [item.fullName]
  );
  const klikIndomaretUrl = useMemo(
    () => links.find((l) => l.platform === 'KlikIndomaret')?.url || `https://www.klikindomaret.com/search/?key=${encodeURIComponent(item.fullName)}`,
    [links, item.fullName]
  );
  const googleWebUrl = useMemo(
    () => links.find((l) => l.platform === 'Google')?.url || `https://www.google.com/search?q=${encodeURIComponent(item.fullName)}+klikindomaret`,
    [links, item.fullName]
  );
  const googleImageUrl = useMemo(
    () => links.find((l) => l.platform === 'GoogleImages')?.url || `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(item.fullName)}+klikindomaret`,
    [links, item.fullName]
  );
  const alfagiftUrl = useMemo(
    () => links.find((l) => l.platform === 'Alfagift')?.url || `https://alfagift.id/s?q=${encodeURIComponent(item.fullName)}`,
    [links, item.fullName]
  );
  const tokopediaUrl = useMemo(
    () => links.find((l) => l.platform === 'Tokopedia')?.url || `https://www.tokopedia.com/search?q=${encodeURIComponent(item.fullName)}`,
    [links, item.fullName]
  );

  const isSearchMatch = useMemo(() => {
    if (!searchKeyword || !searchKeyword.trim()) return false;
    const q = searchKeyword.toLowerCase().trim();
    return (
      item.fullName.toLowerCase().includes(q) ||
      item.rawName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.brand && item.brand.toLowerCase().includes(q))
    );
  }, [searchKeyword, item]);

  const formatRupiah = (num?: number) => {
    if (!num) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const handleCopyAbbr = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.rawName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onZoomImage && visual.imageUrl) {
      onZoomImage(visual.imageUrl, item.fullName);
    }
  };

  const handleSaveEditedName = () => {
    if (!editedNameInput.trim()) return;
    const updated: ReceiptItem = {
      ...item,
      correctedName: editedNameInput.trim(),
      fullName: editedNameInput.trim(),
      isAiInterpretation: false,
      status: 'COCOK_KATALOG',
      statusNote: 'Dikonfirmasi secara manual oleh pengguna'
    };
    setIsEditingName(false);
    if (onUpdateItem) onUpdateItem(updated);
  };

  const handleSelectCandidate = (candidate: ProductCandidate) => {
    const updated: ReceiptItem = {
      ...item,
      fullName: candidate.name,
      brand: candidate.brand || item.brand,
      variant: candidate.variant || item.variant,
      unitSize: candidate.unitSize || item.unitSize,
      packaging: candidate.packaging || item.packaging,
      barcode: candidate.barcode || item.barcode,
      selectedCandidateId: candidate.id,
      status: 'COCOK_KATALOG',
      statusNote: `Dikonfirmasi dari kandidat: ${candidate.name}`,
      isAiInterpretation: false,
      evidence: {
        rawLine: item.rawLine,
        matchedAttributes: candidate.matchedAttributes,
        conflictingAttributes: candidate.conflictingAttributes,
        unknownAttributes: candidate.unknownAttributes,
        sourceOrigin: 'Konfirmasi Pengguna',
        productUrl: candidate.productUrl
      }
    };
    setIsComparingCandidates(false);
    if (onUpdateItem) onUpdateItem(updated);
  };

  const handleSaveBarcode = () => {
    setBarcodeError(null);
    const clean = barcodeInput.trim();
    if (!clean) {
      const updated: ReceiptItem = { ...item, barcode: undefined };
      setIsEditingBarcode(false);
      if (onUpdateItem) onUpdateItem(updated);
      return;
    }

    const validation = validateGtinChecksum(clean);
    if (!validation.isValid) {
      setBarcodeError(validation.reason || 'Digit pemeriksa barcode GTIN tidak valid.');
      return;
    }

    const updated: ReceiptItem = {
      ...item,
      barcode: clean
    };
    setIsEditingBarcode(false);
    if (onUpdateItem) onUpdateItem(updated);
  };

  const handleSaveToPersonalCatalog = () => {
    const catalog = getPersonalCatalog();
    const existing = catalog.find(x => x.name.toLowerCase() === item.fullName.toLowerCase());
    
    if (existing) {
      if (!existing.receiptAliases.includes(item.rawName)) {
        existing.receiptAliases.push(item.rawName);
        savePersonalCatalogItem(existing);
      }
    } else {
      savePersonalCatalogItem({
        id: `user-${Date.now()}`,
        name: item.fullName,
        brand: item.brand || '',
        variant: item.variant || '',
        netSize: null,
        unit: '',
        packaging: item.packaging || '',
        receiptAliases: [item.rawName],
        barcode: item.barcode,
        productUrl: klikIndomaretUrl,
        confirmedByUser: true,
        verifiedAt: new Date().toISOString(),
        notes: `Dikonfirmasi dari struk: ${item.rawLine}`
      });
    }

    setSavedAsAliasMsg(true);
    setTimeout(() => setSavedAsAliasMsg(false), 2500);
  };

  // Status Badge Rendering
  const renderStatusBadge = () => {
    switch (item.status) {
      case 'COCOK_KATALOG':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>COCOK KATALOG</span>
          </span>
        );
      case 'PERLU_KONFIRMASI':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <HelpCircle className="w-3 h-3" />
            <span>PERLU KONFIRMASI</span>
          </span>
        );
      case 'KONFLIK_ATRIBUT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>KONFLIK ATRIBUT</span>
          </span>
        );
      case 'BELUM_DITEMUKAN':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30">
            <XCircle className="w-3 h-3" />
            <span>BELUM DITEMUKAN</span>
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.24, delay: Math.min(index * 0.035, 0.35), ease: [0.16, 1, 0.3, 1] }}
      className={`relative group bg-[var(--panel-color)] rounded-2xl p-4 sm:p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-floating)] border transition-all duration-300 select-none overflow-hidden ${
        isSearchMatch ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/30' : 'border-[var(--card-border)]'
      }`}
    >
      {/* Physical Screws */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[var(--recessed-color)] shadow-[inset_0.8px_0.8px_1.5px_var(--border-light),1px_1px_1.5px_rgba(0,0,0,0.3)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[var(--border-dark)] transform -rotate-45"></div>
      </div>
      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[var(--recessed-color)] shadow-[inset_0.8px_0.8px_1.5px_var(--border-light),1px_1px_1.5px_rgba(0,0,0,0.3)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[var(--border-dark)] transform rotate-12"></div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Left: Optical Product Housing with Clear Type Labels */}
        <div className="relative w-full sm:w-28 h-28 shrink-0 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] p-2.5 flex flex-col items-center justify-center overflow-hidden group/img">
          {isFetchingRealPhoto ? (
            <div className="w-full h-full flex flex-col items-center justify-center animate-pulse gap-1 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin mb-1" />
              <span className="text-[8px] font-mono font-bold text-[var(--text-muted)] uppercase">
                Mencari Foto...
              </span>
            </div>
          ) : !imageError && activePhoto.url ? (
            <>
              <div
                className="absolute inset-0 rounded-xl transition-opacity duration-300"
                style={{ background: activePhoto.isIllustration ? flatTheme.bgGradient : 'transparent' }}
              />
              <motion.img
                key={activePhoto.url}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                src={activePhoto.url}
                alt={item.fullName}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  if (activePhoto.source === 'real_openfoodfacts') {
                    setRealPhotoFailed(true);
                  } else if (activePhoto.source === 'user_uploaded') {
                    setUserPhotoFailed(true);
                  } else {
                    setImageError(true);
                  }
                }}
                className={`w-full h-full object-contain relative z-10 drop-shadow-sm transition-transform duration-300 group-hover/img:scale-105 ${
                  activePhoto.isIllustration ? 'p-1' : ''
                }`}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onZoomImage && activePhoto.url) {
                    onZoomImage(activePhoto.url, item.fullName);
                  }
                }}
                className="absolute bottom-1 right-1 z-20 p-1 rounded bg-[var(--panel-color)]/90 shadow-[var(--shadow-card)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                title="Perbesar Gambaran Produk"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2">
              <Package className="w-7 h-7 text-[var(--accent)] mb-1 opacity-75" />
              <span className="text-[9px] font-mono font-bold text-[var(--text-muted)] uppercase">
                {item.category.split(' ')[0]}
              </span>
            </div>
          )}

          {/* Label status/sumber foto produk */}
          {!isFetchingRealPhoto && (
            <span
              className={`absolute top-1 left-1 z-20 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded backdrop-blur-xs border ${activePhoto.badgeClass}`}
            >
              {activePhoto.badgeText}
            </span>
          )}

          {/* Tombol Langsung Google Images pada Kotak Foto */}
          <a
            href={googleImageUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-1 left-1 z-20 px-1.5 py-0.5 rounded bg-[var(--panel-color)]/90 hover:bg-[var(--accent)] hover:text-white shadow-[var(--shadow-card)] text-[var(--text-muted)] transition-all cursor-pointer flex items-center gap-1 text-[8px] font-mono font-bold border border-[var(--card-border)]"
            title="Cari foto kemasan asli di Google Images"
          >
            <ImageIcon className="w-2.5 h-2.5 text-[var(--accent)] group-hover/img:text-white" />
            <span>FOTO</span>
          </a>
        </div>

        {/* Center: Content */}
        <div className="flex-1 min-w-0 w-full">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-[var(--accent)] bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] px-2 py-0.5 rounded uppercase tracking-wider">
                ITEM #{String(index + 1).padStart(2, '0')}
              </span>

              {/* Status Badge */}
              {renderStatusBadge()}

              {/* Raw Abbreviation Tag */}
              <button
                type="button"
                onClick={handleCopyAbbr}
                className="group/copy flex items-center gap-1 text-[11px] font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] px-2 py-0.5 rounded transition-all cursor-pointer"
                title="Salin kode singkatan struk"
              >
                <span>STRUK: {item.rawName}</span>
                {copied ? (
                  <Check className="w-3 h-3 text-[#22c55e]" />
                ) : (
                  <Copy className="w-3 h-3 opacity-50 group-hover/copy:opacity-100" />
                )}
              </button>

              {item.boundingBox && onClickHighlight && (
                <button
                  type="button"
                  onClick={() => onClickHighlight(item.id)}
                  className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-white bg-[var(--accent)] hover:brightness-110 shadow-[var(--shadow-card)] border border-[var(--accent)] px-2 py-0.5 rounded transition-all cursor-pointer"
                  title="Sorot teks ini pada foto struk asli"
                >
                  <Eye className="w-3 h-3" />
                  <span>LIHAT FOTO</span>
                </button>
              )}

              {item.isAiInterpretation && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Tafsiran AI
                </span>
              )}
            </div>

            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] bg-[var(--recessed-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] px-2 py-0.5 rounded">
              {item.category}
            </span>
          </div>

          {/* Product Name with In-Place Correction Form */}
          {isEditingName ? (
            <div className="my-2 p-2.5 rounded-xl bg-[var(--recessed-color)] border border-[var(--accent)] space-y-2">
              <div className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase">
                Koreksi Nama Produk Manual:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editedNameInput}
                  onChange={(e) => setEditedNameInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--panel-color)] text-xs font-mono text-[var(--text-main)] border border-[var(--card-border)] focus:outline-hidden focus:border-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={handleSaveEditedName}
                  className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-mono font-bold uppercase shadow-sm cursor-pointer"
                >
                  SIMPAN
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-2 py-1.5 rounded-lg bg-[var(--panel-color)] text-[var(--text-muted)] text-xs font-mono border border-[var(--card-border)] cursor-pointer"
                >
                  BATAL
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[var(--text-main)] leading-snug">
                {item.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="p-1.5 rounded-lg hover:bg-[var(--recessed-color)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors cursor-pointer shrink-0"
                title="Koreksi nama produk ini"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Stamped Attributes: Pisahkan Qty Pesanan dengan Isi Per Pak */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-[var(--text-muted)] font-mono mb-3">
            {item.brand && (
              <span className="bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] px-2 py-0.5 rounded font-bold">
                BRAND: {item.brand}
              </span>
            )}
            {item.unitSize && (
              <span className="bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] px-2 py-0.5 rounded font-bold">
                UKURAN: {item.unitSize}
              </span>
            )}
            {item.itemsPerPack && (
              <span className="bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] px-2 py-0.5 rounded font-bold text-[var(--accent)]">
                ISI: {item.itemsPerPack} /pak
              </span>
            )}
            {item.quantity && (
              <span className="text-[var(--text-main)] font-bold">
                PESANAN: {item.quantity} pcs
              </span>
            )}
            {item.barcode && (
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <Barcode className="w-3 h-3" />
                <span>GTIN: {item.barcode}</span>
              </span>
            )}
          </div>

          {/* Candidates Bar (Maksimal 3 kandidat pembanding) */}
          {item.candidates && item.candidates.length > 1 && (
            <div className="mb-3 p-2 rounded-xl bg-[var(--recessed-color)] border border-[var(--card-border)] text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-500 uppercase flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>Ditemukan {item.candidates.length} Kandidat Produk</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsComparingCandidates(!isComparingCandidates)}
                  className="text-[10px] text-[var(--accent)] font-bold hover:underline cursor-pointer"
                >
                  {isComparingCandidates ? 'Tutup Pilihan' : 'Pilih Kandidat yang Tepat'}
                </button>
              </div>

              {isComparingCandidates && (
                <div className="mt-2 space-y-1.5">
                  {item.candidates.map((cand) => (
                    <div
                      key={cand.id}
                      onClick={() => handleSelectCandidate(cand)}
                      className={`p-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        item.fullName === cand.name
                          ? 'bg-[var(--panel-color)] border-[var(--accent)] text-[var(--accent)] font-bold'
                          : 'bg-[var(--panel-color)] border-[var(--card-border)] text-[var(--text-main)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs truncate">{cand.name}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {cand.brand ? `Brand: ${cand.brand} | ` : ''}
                          {cand.unitSize ? `Ukuran: ${cand.unitSize} | ` : ''}
                          {cand.packaging || ''}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--accent)] text-white shrink-0">
                        PILIH
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Barcode Input Toggle Form */}
          {isEditingBarcode && (
            <div className="mb-3 p-2.5 rounded-xl bg-[var(--recessed-color)] border border-[var(--card-border)] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-main)]">Masukkan Barcode Produk (EAN-13 / UPC-A):</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Contoh: 8992753112213"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--panel-color)] border border-[var(--card-border)] text-[var(--text-main)]"
                />
                <button
                  type="button"
                  onClick={handleSaveBarcode}
                  className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white font-bold cursor-pointer"
                >
                  VALIDASI &amp; SIMPAN
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBarcode(false)}
                  className="px-2 py-1.5 rounded-lg bg-[var(--panel-color)] text-[var(--text-muted)] cursor-pointer"
                >
                  BATAL
                </button>
              </div>
              {barcodeError && (
                <div className="text-rose-500 text-[11px] font-bold">
                  {barcodeError}
                </div>
              )}
            </div>
          )}

          {/* Bukti Pencocokan (Evidence) Accordion */}
          {showEvidence && (
            <div className="mb-3 p-3 rounded-xl bg-[var(--recessed-color)] border border-[var(--card-border)] text-xs font-mono space-y-2">
              <div className="font-bold text-[var(--accent)] uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bukti Pencocokan Atribut:</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Teks Asli Baris:</span>{' '}
                <span className="font-bold text-[var(--text-main)]">{item.rawLine}</span>
              </div>
              {item.evidence?.matchedAttributes && item.evidence.matchedAttributes.length > 0 && (
                <div>
                  <span className="text-emerald-500 font-bold">Atribut Cocok:</span>{' '}
                  <span>{item.evidence.matchedAttributes.join(', ')}</span>
                </div>
              )}
              {item.evidence?.conflictingAttributes && item.evidence.conflictingAttributes.length > 0 && (
                <div>
                  <span className="text-rose-500 font-bold">Atribut Konflik:</span>{' '}
                  <span>{item.evidence.conflictingAttributes.join(', ')}</span>
                </div>
              )}
              {item.evidence?.unknownAttributes && item.evidence.unknownAttributes.length > 0 && (
                <div>
                  <span className="text-amber-500 font-bold">Atribut Belum Terverifikasi:</span>{' '}
                  <span>{item.evidence.unknownAttributes.join(', ')}</span>
                </div>
              )}
              <div className="text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--card-border)]">
                Asal Sumber: {item.evidence?.sourceOrigin || (item.isAiInterpretation ? 'Penafsiran AI' : 'Katalog')}
              </div>
            </div>
          )}

          {/* Bottom Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--card-border)]">
            {/* Price Readout */}
            <div>
              <span className="text-[9px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                SUBTOTAL
              </span>
              <span className="font-mono font-bold text-base sm:text-lg text-[var(--text-main)] tracking-tight">
                {formatRupiah(item.totalPrice)}
              </span>
              {item.quantity && item.quantity > 1 && item.unitPrice ? (
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  @{formatRupiah(item.unitPrice)}/pc
                </span>
              ) : null}
            </div>

            {/* Functional Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Evidence Toggle Button */}
              <button
                type="button"
                onClick={() => setShowEvidence(!showEvidence)}
                className="px-2.5 py-2 rounded-xl bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] text-xs font-mono font-bold uppercase shadow-[var(--shadow-card)] border border-[var(--card-border)] transition-all cursor-pointer"
                title="Lihat bukti pencocokan atribut"
              >
                BUKTI
              </button>

              {/* Barcode Form Toggle */}
              <button
                type="button"
                onClick={() => setIsEditingBarcode(!isEditingBarcode)}
                className="px-2.5 py-2 rounded-xl bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] text-xs font-mono font-bold uppercase shadow-[var(--shadow-card)] border border-[var(--card-border)] transition-all cursor-pointer"
                title="Input atau ubah barcode produk"
              >
                <Barcode className="w-3.5 h-3.5 inline mr-1" />
                BARCODE
              </button>

              {/* Jadikan Alias Katalog */}
              <button
                type="button"
                onClick={handleSaveToPersonalCatalog}
                className="px-2.5 py-2 rounded-xl bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] text-xs font-mono font-bold uppercase shadow-[var(--shadow-card)] border border-[var(--card-border)] transition-all cursor-pointer"
                title="Simpan nama & singkatan ini ke Katalog Pribadi"
              >
                <BookmarkPlus className="w-3.5 h-3.5 inline mr-1" />
                {savedAsAliasMsg ? 'TERSIMPAN!' : 'ALIAS'}
              </button>

              {/* Menu Google Images & Pencarian Google */}
              <div className="relative">
                <button
                  id={`google-menu-btn-${index}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchMenuOpen(!searchMenuOpen);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase shadow-[var(--shadow-card)] border transition-all cursor-pointer ${
                    searchMenuOpen
                      ? 'bg-[var(--accent)] text-white border-white/20'
                      : 'bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] border-[var(--card-border)] active:translate-y-[1px]'
                  }`}
                  title="Menu Pencarian Google & Google Images"
                >
                  <Search className="w-3.5 h-3.5 text-[var(--accent)] group-hover:text-white" />
                  <span>GOOGLE</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${searchMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {searchMenuOpen && (
                  <div
                    className="absolute bottom-full mb-2 right-0 z-40 w-64 rounded-xl bg-[var(--panel-color)] shadow-[var(--shadow-floating)] border border-[var(--card-border)] p-2 space-y-1 font-mono text-xs animate-in fade-in zoom-in-95 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-[var(--text-muted)] uppercase border-b border-[var(--card-border)] mb-1 flex items-center justify-between">
                      <span>PENCARIAN GOOGLE</span>
                      <span className="text-[9px] text-[var(--accent)] font-normal truncate max-w-[120px]">{item.fullName}</span>
                    </div>

                    {/* Google Images */}
                    <a
                      id={`google-images-link-${index}`}
                      href={googleImageUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={() => setSearchMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--recessed-color)] text-[var(--text-main)] hover:text-[var(--accent)] transition-colors group/item"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[var(--recessed-color)] flex items-center justify-center text-[var(--accent)] group-hover/item:bg-[var(--accent)] group-hover/item:text-white transition-colors shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-bold flex items-center justify-between">
                          <span>Google Images</span>
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">Lihat foto kemasan asli resmi</div>
                      </div>
                    </a>

                    {/* Pencarian Google Web */}
                    <a
                      id={`google-web-link-${index}`}
                      href={googleWebUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={() => setSearchMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--recessed-color)] text-[var(--text-main)] hover:text-[var(--accent)] transition-colors group/item"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[var(--recessed-color)] flex items-center justify-center text-[var(--accent)] group-hover/item:bg-[var(--accent)] group-hover/item:text-white transition-colors shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-bold flex items-center justify-between">
                          <span>Pencarian Google</span>
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">Info harga, varian &amp; ulasan</div>
                      </div>
                    </a>

                    {/* Klik Indomaret */}
                    <a
                      id={`google-menu-indomaret-${index}`}
                      href={klikIndomaretUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      onClick={() => setSearchMenuOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--recessed-color)] text-[var(--text-main)] hover:text-[var(--accent)] transition-colors group/item"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[var(--recessed-color)] flex items-center justify-center text-[#0055b8] group-hover/item:bg-[#0055b8] group-hover/item:text-white transition-colors shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-bold flex items-center justify-between">
                          <span>Klik Indomaret</span>
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">Cek stok &amp; harga resmi toko</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Klik Indomaret Link */}
              <a
                id={`klikindomaret-btn-${index}`}
                href={klikIndomaretUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] text-xs font-mono font-bold uppercase shadow-[var(--shadow-card)] border border-[var(--card-border)] active:translate-y-[2px] transition-all cursor-pointer"
                title="Buka di Klik Indomaret"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span className="hidden xs:inline">KLIK INDOMARET</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              {/* Deep Research Trigger */}
              <button
                id={`deep-research-btn-${index}`}
                type="button"
                onClick={() => onOpenDetail(item)}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[var(--accent)] hover:brightness-110 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[var(--shadow-card)] border border-white/25 active:translate-y-[2px] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>RISET</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
