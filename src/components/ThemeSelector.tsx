import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Check, Sparkles, X, Eye } from 'lucide-react';

export type AppTheme = 'light' | 'midnight' | 'forest' | 'mocha' | 'cobalt' | 'amethyst';

export interface ThemeDefinition {
  id: AppTheme;
  name: string;
  category: 'light' | 'dark';
  colorHex: string;
  panelHex: string;
  accentHex: string;
  tag: string;
  description: string;
  eyeCareBadge: string;
}

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: 'midnight',
    name: 'Obsidian Midnight',
    category: 'dark',
    colorHex: '#0b0f19',
    panelHex: '#131b2e',
    accentHex: '#ff4757',
    tag: 'OLED Black',
    description: 'Hitam pekat tanpa radiasi cahaya bocor, kontras tinggi dan sangat hemat baterai.',
    eyeCareBadge: 'Ramah Retina'
  },
  {
    id: 'forest',
    name: 'Emerald Pine',
    category: 'dark',
    colorHex: '#071510',
    panelHex: '#0e221b',
    accentHex: '#10b981',
    tag: 'Natural Pine',
    description: 'Nuansa hijau hutan cemara menyejukkan saraf mata saat membaca struk panjang.',
    eyeCareBadge: 'Anti-Mata Lelah'
  },
  {
    id: 'mocha',
    name: 'Mocha Espresso',
    category: 'dark',
    colorHex: '#140e0b',
    panelHex: '#1f1612',
    accentHex: '#f59e0b',
    tag: 'Warm Sepia',
    description: 'Tone kopi hangat & kayu arang, memfilter cahaya biru tajam di malam hari.',
    eyeCareBadge: 'Filter Blue Light'
  },
  {
    id: 'cobalt',
    name: 'Cobalt Ocean',
    category: 'dark',
    colorHex: '#091122',
    panelHex: '#101f3b',
    accentHex: '#0ea5e9',
    tag: 'Deep Tech',
    description: 'Biru samudra malam yang modern, teks tampak sangat tajam dan fokus.',
    eyeCareBadge: 'Ketajaman Tinggi'
  },
  {
    id: 'amethyst',
    name: 'Amethyst Twilight',
    category: 'dark',
    colorHex: '#110b1a',
    panelHex: '#1c122a',
    accentHex: '#a855f7',
    tag: 'Velvet Plum',
    description: 'Ungu senja lembut berkelas dengan saturasi rendah yang menenangkan pikiran.',
    eyeCareBadge: 'Relaksasi Mata'
  },
  {
    id: 'light',
    name: 'Industrial Retro',
    category: 'light',
    colorHex: '#e0e5ec',
    panelHex: '#f0f2f5',
    accentHex: '#ff4757',
    tag: 'Classic Gray',
    description: 'Tampilan mesin kasir fisik minimarket klasik dengan bayangan neumorfik taktil.',
    eyeCareBadge: 'Mode Siang'
  }
];

interface ThemeSelectorModalProps {
  isOpen: boolean;
  activeTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  activeTheme,
  onSelectTheme,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-[var(--text-main)] select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Industrial Theme Selector Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-xl rounded-2xl bg-[var(--panel-color)] shadow-[var(--shadow-floating)] border border-[var(--card-border)] overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-shadow)]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] flex items-center justify-center text-[var(--accent)]">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] block">
                TAMPILAN &amp; KENYAMANAN MATA
              </span>
              <h3 className="text-base sm:text-lg font-heading font-extrabold text-[var(--text-main)]">
                Pilih Variasi Dark Mode &amp; Tema
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] hover:text-[var(--accent)] flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Pill */}
        <div className="px-5 pt-3 pb-1">
          <p className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
            5 Palet Gelap dirancang khusus dengan luminansi rendah agar mata tidak cepat lelah saat memeriksa struk.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto">
          {THEME_DEFINITIONS.map((th) => {
            const isSelected = activeTheme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => {
                  onSelectTheme(th.id);
                  onClose();
                }}
                className={`group relative text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[var(--recessed-color)] border-[var(--accent)] shadow-[var(--shadow-pressed)] ring-2 ring-[var(--accent)]/40'
                    : 'bg-[var(--panel-color)] border-[var(--card-border)] shadow-[var(--shadow-card)] hover:border-[var(--accent)]/60 hover:scale-[1.02]'
                }`}
              >
                {/* Top bar: color swatch + tag */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shadow-md shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: th.colorHex }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: th.accentHex }}
                      />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-sm block text-[var(--text-main)]">
                        {th.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full border border-[var(--accent)]/30">
                      <Check className="w-3 h-3" />
                      Aktif
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-[11px] text-[var(--text-muted)] font-mono leading-relaxed mb-3">
                  {th.description}
                </p>

                {/* Badges footer */}
                <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-[var(--card-border)]/60">
                  <span className="text-[var(--text-muted)] font-bold">
                    {th.tag}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-white font-bold"
                    style={{ backgroundColor: th.accentHex }}
                  >
                    {th.eyeCareBadge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--recessed-color)] border-t border-[var(--card-border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>Tema tersimpan otomatis di perangkat</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--accent)] text-white font-bold hover:brightness-110 transition-all cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </motion.div>
    </div>
  );
};
