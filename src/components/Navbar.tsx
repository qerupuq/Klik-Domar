import React from 'react';
import { 
  ReceiptText, 
  BookOpen, 
  RotateCcw, 
  History,
  Palette,
  Database
} from 'lucide-react';
import { AppTheme, THEME_DEFINITIONS } from './ThemeSelector';

interface NavbarProps {
  onOpenDictionary: () => void;
  onOpenHistory?: () => void;
  onOpenCatalog?: () => void;
  onOpenThemeSelector?: () => void;
  activeTheme?: AppTheme;
  onReset: () => void;
  hasActiveReceipt: boolean;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDictionary,
  onOpenHistory,
  onOpenCatalog,
  onOpenThemeSelector,
  activeTheme = 'midnight',
  onReset,
  hasActiveReceipt,
  isLoading = false
}) => {
  const currentThemeDef = THEME_DEFINITIONS.find((t) => t.id === activeTheme) || THEME_DEFINITIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-[var(--panel-color)] border-b border-[var(--card-border)] shadow-[0_4px_16px_rgba(0,0,0,0.1)] text-[var(--text-main)] font-medium select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Machine Brand Plate / Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onReset} 
            id="brand-logo-btn"
            role="button"
            tabIndex={0}
          >
            {/* Tactile Key Icon Housing with Corner Screws effect */}
            <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] flex items-center justify-center text-[var(--accent)] shrink-0 transition-transform ${
              isLoading ? 'animate-pulse' : 'group-hover:scale-105'
            }`}>
              <ReceiptText className="w-5 h-5 text-[var(--accent)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]" />
              {/* Corner Screw Highlights */}
              <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-[var(--border-dark)] shadow-[0.5px_0.5px_0_var(--border-light)]"></div>
              <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[var(--border-dark)] shadow-[0.5px_0.5px_0_var(--border-light)]"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-[var(--text-main)]">
                  STRUK<span className="text-[var(--accent)]">PEDIA</span>
                </span>
                {/* Hardware Spec Stamped Tag */}
                <span className="hidden sm:inline-block text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] text-[var(--text-muted)] border border-[var(--card-border)]">
                  INDOMARET FRESH
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {/* LED Status Indicator */}
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]' : 'bg-[#22c55e] shadow-[0_0_8px_#22c55e]'} animate-pulse`}></span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {isLoading ? 'PROC. ACTIVE' : 'KLIK INDOMARET • READY'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons (Tactile Industrial Keys) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* 5 Dark Modes & Theme Switcher Button */}
            {onOpenThemeSelector && (
              <button
                id="theme-selector-btn"
                type="button"
                onClick={onOpenThemeSelector}
                className="flex items-center justify-center h-10 sm:h-11 px-3 sm:px-3.5 gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--panel-color)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[var(--accent)] active:translate-y-[2px] active:shadow-[var(--shadow-pressed)] transition-all cursor-pointer group"
                title={`Ganti Tema & Dark Mode (${currentThemeDef.name})`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shadow-xs shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: currentThemeDef.colorHex }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: currentThemeDef.accentHex }}
                  />
                </div>
                <Palette className="w-3.5 h-3.5 text-[var(--accent)] group-hover:rotate-45 transition-transform" />
                <span className="hidden lg:inline text-[11px]">{currentThemeDef.name}</span>
                <span className="hidden sm:inline lg:hidden text-[11px]">Tema</span>
              </button>
            )}

            {/* Katalog Pribadi */}
            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                className="flex items-center justify-center h-10 sm:h-11 px-3 sm:px-3.5 gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--panel-color)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[var(--accent)] active:translate-y-[2px] active:shadow-[var(--shadow-pressed)] transition-all cursor-pointer"
                title="Buka Katalog Pribadi & Kamus Alias"
              >
                <Database className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span className="hidden md:inline">Katalog</span>
              </button>
            )}

            {/* Riwayat Struk */}
            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="flex items-center justify-center h-10 sm:h-11 px-3 sm:px-3.5 gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--panel-color)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[var(--accent)] active:translate-y-[2px] active:shadow-[var(--shadow-pressed)] transition-all cursor-pointer"
                title="Buka Riwayat Scan Struk"
              >
                <History className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span className="hidden md:inline">Riwayat</span>
              </button>
            )}

            {/* Kamus Singkatan Physical Key */}
            <button
              id="open-dictionary-btn"
              type="button"
              onClick={onOpenDictionary}
              className="flex items-center justify-center h-10 sm:h-11 px-3 sm:px-3.5 gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)] bg-[var(--panel-color)] rounded-xl shadow-[var(--shadow-card)] border border-[var(--card-border)] hover:text-[var(--accent)] active:translate-y-[2px] active:shadow-[var(--shadow-pressed)] transition-all cursor-pointer"
              title="Buka Kamus Singkatan Kasir"
            >
              <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="hidden md:inline">Kamus Singkatan</span>
              <span className="hidden sm:inline md:hidden">Kamus</span>
            </button>

            {/* Reset / Upload Baru Key */}
            {hasActiveReceipt && (
              <button
                id="reset-scanner-btn"
                type="button"
                onClick={onReset}
                className="inline-flex items-center justify-center h-10 sm:h-11 px-3.5 sm:px-4 gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[var(--accent)] hover:brightness-110 rounded-xl shadow-[var(--shadow-card)] border border-white/25 active:translate-y-[2px] active:shadow-[var(--shadow-pressed)] transition-all cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Scan Baru</span>
                <span className="xs:hidden">Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
