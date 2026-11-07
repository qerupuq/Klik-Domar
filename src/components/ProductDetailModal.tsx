import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ReceiptItem, DeepResearchInfo } from '../types';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  ExternalLink, 
  ShoppingBag, 
  Search, 
  Layers,
  AlertCircle,
  Info,
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import { getProductFlatTheme, buildECommerceLinks } from '../data/productImages';

interface ProductDetailModalProps {
  item: ReceiptItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose
}) => {
  const [researchData, setResearchData] = useState<DeepResearchInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const flatTheme = item ? getProductFlatTheme(item.fullName || item.rawName, item.category) : null;

  useEffect(() => {
    if (!item) {
      setResearchData(null);
      setError(null);
      return;
    }

    // Gunakan AbortController untuk membatalkan permintaan lama jika item berubah atau modal ditutup
    const abortController = new AbortController();

    const fetchDeepResearch = async () => {
      setIsLoading(true);
      setError(null);
      setResearchData(null);

      try {
        const response = await fetch('/api/receipt/deep-research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: item.fullName,
            rawAbbr: item.rawName,
            brand: item.brand
          }),
          signal: abortController.signal
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          throw new Error(errJson.error || `Gagal memuat riset produk (${response.status})`);
        }

        const resJson = await response.json();
        if (resJson.success && resJson.data) {
          setResearchData(resJson.data);
        } else {
          throw new Error(resJson.error || 'Format data riset produk tidak valid.');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Permintaan dibatalkan karena komponen unmount atau item berubah, abaikan
          return;
        }
        console.warn('API Deep Research error:', err);
        // Sesuai arahan audit: HAPUS data pengganti buatan (BPOM, produsen, halal palsu).
        // Tampilkan pesan kendala yang jujur.
        setError(err.message || 'Layanan riset produk sedang tidak dapat dijangkau. Anda tetap dapat memeriksa langsung katalog resmi melalui tautan di bawah.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeepResearch();

    return () => {
      abortController.abort();
    };
  }, [item]);

  if (!item) return null;

  // Dapatkan tautan toko resmi dan cari berdasarkan identitas platform, bukan posisi array
  const allStoreLinks = buildECommerceLinks(item.fullName);
  const klikIndomaretLink = allStoreLinks.find(l => l.platform === 'KlikIndomaret')?.url || `https://www.klikindomaret.com/search/?key=${encodeURIComponent(item.fullName)}`;
  const alfagiftLink = allStoreLinks.find(l => l.platform === 'Alfagift')?.url || `https://alfagift.id/s?q=${encodeURIComponent(item.fullName)}`;
  const tokopediaLink = allStoreLinks.find(l => l.platform === 'Tokopedia')?.url || `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(item.fullName)}`;
  const googleImagesLink = allStoreLinks.find(l => l.platform === 'GoogleImages')?.url || `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(item.fullName)}+kemasan`;
  const googleSearchLink = allStoreLinks.find(l => l.platform === 'Google')?.url || `https://www.google.com/search?q=${encodeURIComponent(item.fullName)}+klikindomaret`;

  const formatRupiah = (num?: number) => {
    if (!num) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 text-[var(--text-main)] select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Industrial Modal Chassis */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 bg-[var(--panel-color)] rounded-2xl max-w-2xl w-full shadow-[var(--shadow-floating)] border border-[var(--card-border)] overflow-hidden my-auto flex flex-col max-h-[92vh] sm:max-h-[85vh]"
      >
        {/* Corner Rivets */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-[var(--recessed-color)] shadow-[inset_1px_1px_1.5px_var(--border-light),1px_1px_1.5px_rgba(0,0,0,0.3)] flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-[var(--border-dark)] transform rotate-45"></div>
        </div>
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[var(--recessed-color)] shadow-[inset_1px_1px_1.5px_var(--border-light),1px_1px_1.5px_rgba(0,0,0,0.3)] flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-[var(--border-dark)] transform -rotate-45"></div>
        </div>

        {/* Modal Header */}
        <div className="bg-[var(--panel-color)] p-5 sm:p-6 border-b border-[var(--card-border)] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] flex items-center justify-center text-[var(--accent)] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[var(--accent)] text-white font-mono">
                  RISET KATALOG RITEL
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] px-2 py-0.5 rounded">
                  KODE STRUK: {item.rawName}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-heading font-black text-[var(--text-main)] mt-1">
                {item.fullName}
              </h2>
            </div>
          </div>

          <button
            id="close-deep-research-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[var(--recessed-color)] hover:text-[var(--accent)] text-[var(--text-muted)] shadow-[var(--shadow-card)] border border-[var(--card-border)] flex items-center justify-center active:translate-y-[1px] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full border-3 border-[var(--accent)] border-t-transparent animate-spin mb-4" />
              <p className="text-sm font-mono font-bold text-[var(--text-main)]">MENGHUBUNGI SUMBER RISET RITEL...</p>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-1">Memeriksa acuan resmi Klik Indomaret &amp; web retail Indonesia...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-600 dark:text-amber-400 mb-1">PEMBERITAHUAN RISET:</div>
                  <p className="text-[var(--text-muted)] leading-relaxed">{error}</p>
                </div>
              </div>

              {/* Tampilkan data barang transaksi nyata */}
              <div className="bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] rounded-xl p-4 border border-[var(--card-border)] space-y-2">
                <div className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase">
                  Data Terbaca dari Struk:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div><span className="text-[var(--text-muted)]">Baris Asli:</span> <span className="font-bold text-[var(--text-main)]">{item.rawLine}</span></div>
                  <div><span className="text-[var(--text-muted)]">Merek:</span> <span className="font-bold text-[var(--text-main)]">{item.brand || 'Tidak Tertera'}</span></div>
                  <div><span className="text-[var(--text-muted)]">Ukuran:</span> <span className="font-bold text-[var(--text-main)]">{item.unitSize || 'Tidak Tertera'}</span></div>
                  <div><span className="text-[var(--text-muted)]">Harga Satuan:</span> <span className="font-bold text-[var(--text-main)]">{formatRupiah(item.unitPrice)}</span></div>
                  <div><span className="text-[var(--text-muted)]">Jumlah Pesanan:</span> <span className="font-bold text-[var(--text-main)]">{item.quantity} pcs</span></div>
                  <div><span className="text-[var(--text-muted)]">Subtotal:</span> <span className="font-bold text-[var(--text-main)]">{formatRupiah(item.totalPrice)}</span></div>
                </div>
              </div>
            </div>
          ) : researchData ? (
            <>
              {/* Product Visual & Overview */}
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-stretch">
                <div 
                  className="shrink-0 w-full sm:w-44 aspect-square rounded-2xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] p-3 flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <img 
                    src={(!imageError && researchData.productImageUrl) ? researchData.productImageUrl : (flatTheme?.svgDataUri || '')} 
                    alt={researchData.productName}
                    className="w-full h-full object-contain drop-shadow-sm select-none"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                  {/* Label jujur bahwa ini ilustrasi kategori jika bukan foto nyata */}
                  <span className="absolute bottom-2 left-2 right-2 text-center text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--panel-color)] shadow-[var(--shadow-card)] text-[var(--text-muted)] border border-[var(--card-border)] truncate">
                    {(!imageError && researchData.productImageUrl) ? 'Foto Produk Web' : 'Ilustrasi Kategori (Bukan Foto Asli)'}
                  </span>
                </div>

                <div className="flex-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] p-4 rounded-xl flex flex-col justify-center font-medium">
                  <p>{researchData.description}</p>
                  {researchData.isAiGeneratedWarning && (
                    <div className="mt-2 text-[10px] font-mono text-[var(--text-muted)] opacity-80 flex items-center gap-1">
                      <Info className="w-3 h-3 text-[var(--accent)]" />
                      <span>Riset bersumber dari acuan web ritel terbuka Klik Indomaret.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Overview Triplet */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[var(--panel-color)] shadow-[var(--shadow-card)] p-3.5 rounded-xl border border-[var(--card-border)]">
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Building2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>PABRIK / PRODUSEN</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-[var(--text-main)] mt-1 truncate">
                    {researchData.manufacturer || researchData.brand || 'Belum Terverifikasi'}
                  </div>
                </div>

                <div className="bg-[var(--panel-color)] shadow-[var(--shadow-card)] p-3.5 rounded-xl border border-[var(--card-border)]">
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
                    <span>STATUS LEGALITAS</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#22c55e] mt-1 truncate">
                    {researchData.bpomCategory || 'Periksa Kemasan Asli'}
                  </div>
                </div>

                <div className="bg-[var(--panel-color)] shadow-[var(--shadow-card)] p-3.5 rounded-xl border border-[var(--card-border)]">
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1 font-mono">
                    <DollarSign className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>ESTIMASI PASARAN</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-[var(--text-main)] mt-1">
                    {researchData.marketPriceRangeIdr?.min && researchData.marketPriceRangeIdr?.max
                      ? `${formatRupiah(researchData.marketPriceRangeIdr.min)} - ${formatRupiah(researchData.marketPriceRangeIdr.max)}`
                      : 'Lihat Katalog Toko'}
                  </div>
                </div>
              </div>

              {/* Acronym Breakdown */}
              {item.abbreviationBreakdown && item.abbreviationBreakdown.length > 0 && (
                <div className="bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] rounded-xl p-3.5 border border-[var(--card-border)]">
                  <div className="text-xs font-mono font-bold text-[var(--text-muted)] mb-2 flex items-center gap-1.5 uppercase">
                    <Layers className="w-4 h-4 text-[var(--accent)]" />
                    <span>Pengecekan Kode Singkatan Struk:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.abbreviationBreakdown.map((tok, i) => (
                      <div key={i} className="flex items-center text-xs bg-[var(--panel-color)] shadow-[var(--shadow-card)] rounded-lg p-2 border border-[var(--card-border)]">
                        <span className="font-mono font-bold text-[var(--accent)] mr-2 bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] px-2 py-0.5 rounded text-[11px] border border-[var(--card-border)]">
                          {tok.abbr}
                        </span>
                        <span className="text-[var(--text-main)] font-medium text-xs truncate">{tok.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Ingredients jika ada */}
              {researchData.keyIngredients && researchData.keyIngredients.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 font-mono">
                    KOMPOSISI &amp; FORMULA:
                  </h4>
                  <ul className="space-y-1.5">
                    {researchData.keyIngredients.map((ing, idx) => (
                      <li key={idx} className="text-xs text-[var(--text-muted)] flex items-start gap-2 bg-[var(--panel-color)] shadow-[var(--shadow-card)] p-2.5 rounded-lg border border-[var(--card-border)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : null}

          {/* Verification & E-commerce Links: Dipilih berdasarkan Platform ID, bukan posisi array */}
          <div>
            <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 font-mono">
              TAUTAN ACUAN RESMI &amp; KATALOG RITEL:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              <a
                id="deep-modal-google-images"
                href={googleImagesLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[var(--accent)] active:translate-y-[1px] transition-all text-xs font-mono font-bold text-[var(--text-main)] cursor-pointer group"
              >
                <ImageIcon className="w-5 h-5 text-[var(--accent)] mb-1 group-hover:scale-110 transition-transform" />
                <span>Google Images</span>
                <span className="text-[8px] text-[var(--text-muted)]">Foto Kemasan Asli</span>
              </a>

              <a
                id="deep-modal-google-search"
                href={googleSearchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[var(--accent)] active:translate-y-[1px] transition-all text-xs font-mono font-bold text-[var(--text-main)] cursor-pointer group"
              >
                <Globe className="w-5 h-5 text-[var(--accent)] mb-1 group-hover:scale-110 transition-transform" />
                <span>Pencarian Google</span>
                <span className="text-[8px] text-[var(--text-muted)]">Web, Varian &amp; Info</span>
              </a>

              <a
                id="deep-modal-klikindomaret"
                href={klikIndomaretLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[#0055b8] active:translate-y-[1px] transition-all text-xs font-mono font-bold text-[var(--text-main)] cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 text-[#0055b8] mb-1 group-hover:scale-110 transition-transform" />
                <span>KlikIndomaret</span>
                <span className="text-[8px] text-[var(--text-muted)]">Acuan Toko Utama</span>
              </a>

              <a
                id="deep-modal-alfagift"
                href={alfagiftLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-red-500 active:translate-y-[1px] transition-all text-xs font-mono font-bold text-[var(--text-main)] cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 text-red-500 mb-1 group-hover:scale-110 transition-transform" />
                <span>Alfagift</span>
                <span className="text-[8px] text-[var(--text-muted)]">Katalog Minimarket</span>
              </a>

              <a
                id="deep-modal-tokopedia"
                href={tokopediaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[#22c55e] active:translate-y-[1px] transition-all text-xs font-mono font-bold text-[var(--text-main)] cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 text-[#22c55e] mb-1 group-hover:scale-110 transition-transform" />
                <span>Tokopedia</span>
                <span className="text-[8px] text-[var(--text-muted)]">Cek Pasar Online</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[var(--panel-color)] border-t border-[var(--card-border)] flex items-center justify-end">
          <button
            id="close-deep-modal-btn"
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[var(--shadow-card)] border border-white/20 active:translate-y-[2px] cursor-pointer"
          >
            SELESAI
          </button>
        </div>
      </motion.div>
    </div>
  );
};
