import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Info, Search, ExternalLink, Image as ImageIcon, Globe, ShoppingBag } from 'lucide-react';
import { ReceiptItem } from '../types';

interface QuickAbbreviationTesterProps {
  onAddDecodedItem?: (item: ReceiptItem) => void;
}

export const QuickAbbreviationTester: React.FC<QuickAbbreviationTesterProps> = ({
  onAddDecodedItem
}) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/receipt/quick-decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abbreviation: query.trim() })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        throw new Error(data.error || 'Gagal menerjemahkan singkatan.');
      }
    } catch (err: any) {
      console.error('Quick decode error:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses singkatan.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'GW HAKU VAN&C. CHO 100',
    'SANIA MNYK GRNG 2L',
    'G/DAY BTRSCOTCH 10S',
    'PISANG CAVENDISH FRESH',
    'SUNSILK SHP BLACK SHINE'
  ];

  return (
    <div className="relative bg-[var(--panel-color)] rounded-2xl p-5 sm:p-7 text-[var(--text-main)] shadow-[var(--shadow-card)] border border-[var(--card-border)] my-6 select-none">
      {/* Corner Screws */}
      <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-[var(--recessed-color)] shadow-[inset_1px_1px_1.5px_var(--border-light),1px_1px_1.5px_rgba(0,0,0,0.2)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[var(--border-dark)] transform rotate-45"></div>
      </div>
      <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[var(--recessed-color)] shadow-[inset_1px_1px_1.5px_var(--border-light),1px_1px_1.5px_rgba(0,0,0,0.2)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[var(--border-dark)] transform -rotate-45"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] text-[var(--accent)]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-heading font-bold text-[var(--text-main)] tracking-tight">
              Penerjemah Singkatan Kasir Cepat
            </h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
            Uji coba pemecahan kode singkatan struk kasir minimarket secara langsung.
          </p>
        </div>

        {/* Quick query sample keys */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] font-mono">CONTOH:</span>
          {sampleQueries.map((sq) => (
            <button
              key={sq}
              type="button"
              onClick={() => {
                setQuery(sq);
              }}
              className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] shadow-[var(--shadow-card)] active:translate-y-[1px] border border-[var(--card-border)] transition-all cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleTest} className="flex gap-3">
        <input
          id="quick-abbr-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik kode produk (contoh: PISANG CAVENDISH, SUNSILK SHP, SANIA MNYK)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] text-xs sm:text-sm font-mono text-[var(--text-main)] placeholder-[var(--text-muted)]/60 focus:outline-hidden focus:border-[var(--accent)] border border-[var(--card-border)]"
        />
        <button
          id="quick-abbr-submit-btn"
          type="submit"
          disabled={!query.trim() || isLoading}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 disabled:opacity-40 text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[var(--shadow-card)] border border-white/20 active:translate-y-[2px] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>TERJEMAHKAN</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-500">
          {error}
        </div>
      )}

      {/* Result module display if any */}
      {result && (
        <div className="mt-4 p-4 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
              {/* Tanpa persentase fiktif 95% */}
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
                HASIL INTERPRETASI SINGKATAN
              </span>
            </div>
            <h4 className="font-heading font-extrabold text-sm sm:text-base text-[var(--text-main)]">
              {result.fullName}
            </h4>
            <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)] mt-1 flex-wrap">
              <span>MEREK: {result.brand || 'Tidak Tertera'}</span>
              <span>UKURAN: {result.unitSize || 'Tidak Tertera'}</span>
              <span>KATEGORI: {result.category || 'Umum'}</span>
            </div>
            {result.abbreviationBreakdown && result.abbreviationBreakdown.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {result.abbreviationBreakdown.map((b: any, i: number) => (
                  <span key={i} className="text-[10px] font-mono bg-[var(--panel-color)] px-1.5 py-0.5 rounded border border-[var(--card-border)] text-[var(--text-muted)]">
                    <strong className="text-[var(--accent)]">{b.abbr}</strong>: {b.meaning}
                  </span>
                ))}
              </div>
            )}

            {/* Menu Tombol Cepat Google Images & Pencarian */}
            <div className="flex items-center gap-2 flex-wrap mt-3 pt-2 border-t border-[var(--card-border)]">
              <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                VERIFIKASI:
              </span>
              <a
                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(result.fullName)}+kemasan`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] text-[11px] font-mono font-bold shadow-[var(--shadow-card)] border border-[var(--card-border)] transition-all cursor-pointer"
                title="Buka foto kemasan produk di Google Images"
              >
                <ImageIcon className="w-3 h-3 text-[var(--accent)]" />
                <span>Google Images</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(result.fullName)}+klikindomaret`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] text-[11px] font-mono font-bold shadow-[var(--shadow-card)] border border-[var(--card-border)] transition-all cursor-pointer"
                title="Cari info & review produk di Google"
              >
                <Globe className="w-3 h-3 text-[var(--accent)]" />
                <span>Pencarian Google</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              <a
                href={`https://www.klikindomaret.com/search/?key=${encodeURIComponent(result.fullName)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] text-[11px] font-mono font-bold shadow-[var(--shadow-card)] border border-[var(--card-border)] transition-all cursor-pointer"
                title="Cari di Klik Indomaret"
              >
                <ShoppingBag className="w-3 h-3 text-[#0055b8]" />
                <span>Klik Indomaret</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </div>
          </div>
          {onAddDecodedItem && (
            <button
              type="button"
              onClick={() => {
                const newItem: ReceiptItem = {
                  id: `manual-${Date.now()}`,
                  rawLine: query.trim(),
                  rawName: result.rawName || query.trim(),
                  fullName: result.fullName,
                  brand: result.brand || '',
                  category: result.category || 'Produk Ritel',
                  variant: result.variant || '',
                  unitSize: result.unitSize || '',
                  quantity: 1,
                  status: 'PERLU_KONFIRMASI',
                  statusNote: 'Ditambahkan dari modul penerjemah cepat',
                  isAiInterpretation: true,
                  abbreviationBreakdown: result.abbreviationBreakdown || [],
                  packagingDescription: result.packagingDescription || '',
                  productDescription: result.productDescription || '',
                  searchKeywords: result.fullName
                };
                onAddDecodedItem(newItem);
              }}
              className="px-3.5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-mono font-bold uppercase shadow-md active:translate-y-[1px] cursor-pointer shrink-0"
            >
              TAMBAHKAN KE STRUK
            </button>
          )}
        </div>
      )}
    </div>
  );
};
