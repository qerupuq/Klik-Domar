import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  BookOpen, 
  Search, 
  ArrowRight
} from 'lucide-react';
import { RECEIPT_DICTIONARY, COMMON_CATEGORIES } from '../data/abbreviationDictionary';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickTestAbbreviation: (abbr: string) => void;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  isOpen,
  onClose,
  onQuickTestAbbreviation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');

  if (!isOpen) return null;

  const filteredItems = RECEIPT_DICTIONARY.filter((item) => {
    const matchesSearch = 
      item.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.expanded.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exampleInReceipt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'Semua Kategori' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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

      {/* Industrial Chassis Dialog */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 bg-[var(--panel-color)] rounded-2xl max-w-4xl w-full shadow-[var(--shadow-floating)] border border-[var(--card-border)] overflow-hidden my-auto flex flex-col max-h-[92vh] sm:max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[var(--panel-color)] border-b border-[var(--card-border)] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] flex items-center justify-center text-[var(--accent)] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--accent)] font-mono tracking-wider block">
                REFERENCE MODULE // RETAIL LEXICON
              </span>
              <h2 className="text-lg sm:text-xl font-heading font-black text-[var(--text-main)]">
                Kamus Singkatan Struk Ritel Indonesia
              </h2>
            </div>
          </div>

          <button
            id="close-dictionary-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[var(--recessed-color)] hover:text-[var(--accent)] text-[var(--text-muted)] shadow-[var(--shadow-card)] border border-[var(--card-border)] flex items-center justify-center active:translate-y-[1px] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-5 bg-[var(--panel-color)] border-b border-[var(--card-border)] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="dictionary-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari singkatan kasir (cth: MNYK, GRNG, BTRSCOTCH, CKL, BUAH, SYR)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] text-xs sm:text-sm font-mono text-[var(--text-main)] placeholder-[var(--text-muted)]/60 focus:outline-hidden focus:border-[var(--accent)] border border-[var(--card-border)]"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('Semua Kategori')}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'Semua Kategori'
                  ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-card)] border border-white/20'
                  : 'bg-[var(--panel-color)] text-[var(--text-muted)] shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[var(--text-main)]'
              }`}
            >
              Semua Kategori
            </button>
            {COMMON_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-card)] border border-white/20'
                    : 'bg-[var(--panel-color)] text-[var(--text-muted)] shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[var(--text-main)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dictionary Items Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] bg-[var(--panel-color)] space-y-3">
          <div className="text-xs font-mono text-[var(--text-muted)] mb-2">
            Menampilkan <strong>{filteredItems.length}</strong> singkatan terverifikasi
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-mono font-bold text-[var(--text-main)]">Tidak ada singkatan yang cocok</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--panel-color)] p-4 rounded-xl shadow-[var(--shadow-card)] border border-[var(--card-border)] flex flex-col justify-between hover:border-[var(--accent)]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono font-bold text-xs text-[var(--accent)] bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] px-2 py-0.5 rounded">
                        {item.abbreviation}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--recessed-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>

                    <h4 className="font-heading font-black text-sm text-[var(--text-main)] mb-1">
                      {item.expanded}
                    </h4>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3 font-medium">
                      {item.explanation}
                    </p>

                    {item.exampleInReceipt && (
                      <div className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] p-2 rounded-lg mb-3">
                        Contoh: <span className="font-bold text-[var(--text-main)]">{item.exampleInReceipt}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onQuickTestAbbreviation(item.exampleInReceipt || item.abbreviation);
                    }}
                    className="inline-flex items-center justify-center gap-1 w-full py-1.5 rounded-lg bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] text-[11px] font-mono font-bold uppercase shadow-[var(--shadow-card)] border border-[var(--card-border)] active:translate-y-[1px] cursor-pointer"
                  >
                    <span>Uji Singkatan Ini</span>
                    <ArrowRight className="w-3 h-3 text-[var(--accent)]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--panel-color)] border-t border-[var(--card-border)] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Database Klik Indomaret &amp; Retail POS Standard
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--accent)] hover:brightness-110 text-white text-xs font-mono font-bold uppercase shadow-[var(--shadow-card)] border border-white/20 active:translate-y-[1px] cursor-pointer"
          >
            TUTUP
          </button>
        </div>
      </motion.div>
    </div>
  );
};
