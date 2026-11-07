import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, ScanLine, Sparkles, Check, Loader2 } from 'lucide-react';

interface AnalysisProgressBarProps {
  loadingMessage?: string;
}

type StageKey = 'uploading' | 'ocr' | 'ai';

interface StageConfig {
  id: StageKey;
  stepNumber: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  minProgress: number;
  maxProgress: number;
}

const STAGES: StageConfig[] = [
  {
    id: 'uploading',
    stepNumber: 1,
    label: 'UPLOADING',
    sublabel: 'Unggah & Pra-pemrosesan Citra Struk',
    icon: Upload,
    minProgress: 0,
    maxProgress: 32
  },
  {
    id: 'ocr',
    stepNumber: 2,
    label: 'OCR DETECTION',
    sublabel: 'Membaca Matriks Dot & Kode Kasir',
    icon: ScanLine,
    minProgress: 33,
    maxProgress: 68
  },
  {
    id: 'ai',
    stepNumber: 3,
    label: 'KLIK INDOMARET AI',
    sublabel: 'Mencocokkan Database Katalog Resmi & Fresh',
    icon: Sparkles,
    minProgress: 69,
    maxProgress: 96
  }
];

const STAGE_INSIGHTS = [
  'Mengidentifikasi format struk belanja minimarket...',
  'Menyesuaikan kontras & mendeteksi matriks dot struk kasir...',
  'Mengekstrak deretan teks, singkatan nama barang, dan harga...',
  'Mencocokkan singkatan kata dengan database katalog ritel resmi...',
  'Menganalisis varian rasa, gramasi kemasan, dan kategori item...',
  'Menyusun struktur struk bersih dan rekomendasi riset produk...'
];

export const AnalysisProgressBar: React.FC<AnalysisProgressBarProps> = ({
  loadingMessage
}) => {
  const [progress, setProgress] = useState(12);
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setProgress(28);
    }, 400);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 32) return prev + Math.floor(Math.random() * 4 + 2);
        if (prev < 65) return prev + Math.floor(Math.random() * 3 + 1);
        if (prev < 92) return prev + Math.floor(Math.random() * 2 + 1);
        return prev;
      });
    }, 500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const insightInterval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % STAGE_INSIGHTS.length);
    }, 2600);

    return () => clearInterval(insightInterval);
  }, []);

  const getCurrentStage = (): StageConfig => {
    if (progress <= 32) return STAGES[0];
    if (progress <= 68) return STAGES[1];
    return STAGES[2];
  };

  const currentStage = getCurrentStage();

  const getStageStatus = (stage: StageConfig) => {
    if (progress > stage.maxProgress) return 'completed';
    if (progress >= stage.minProgress && progress <= stage.maxProgress) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-2xl mx-auto select-none">
      {/* Industrial Instrument Gauge Panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--panel-color)] rounded-2xl p-6 shadow-[var(--shadow-card)] border border-[var(--card-border)]"
      >
        {/* Hardware Status Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-3 h-3 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] block animate-pulse"></span>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] tracking-widest uppercase block">
                ANALYZER INSTRUMENT // STAGE 0{currentStage.stepNumber}
              </span>
              <h4 className="font-heading font-black text-sm sm:text-base text-[var(--text-main)] tracking-tight">
                {loadingMessage || currentStage.sublabel}
              </h4>
            </div>
          </div>

          {/* Digital Percentage Readout */}
          <div className="bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] px-3.5 py-1.5 rounded-xl border border-[var(--card-border)]">
            <span className="font-mono font-bold text-base sm:text-lg text-[var(--accent)]">
              {Math.min(99, progress)}%
            </span>
          </div>
        </div>

        {/* 3-Stage Mechanical Stepper with Smooth Transitions */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
          {STAGES.map((stage) => {
            const status = getStageStatus(stage);
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-xl transition-all duration-300 flex flex-col items-center text-center ${
                  status === 'active'
                    ? 'bg-[var(--recessed-color)] shadow-[var(--shadow-pressed)] border border-[var(--accent)]/50'
                    : status === 'completed'
                    ? 'bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)]'
                    : 'bg-[var(--panel-color)] opacity-50 border border-transparent'
                }`}
              >
                {/* Stage Dial Icon */}
                <div
                  className={`w-8 h-8 rounded-full mb-1.5 flex items-center justify-center transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-[#22c55e] text-white shadow-[0_0_8px_#22c55e]'
                      : status === 'active'
                      ? 'bg-[var(--accent)] text-white shadow-[0_0_8px_var(--accent)] animate-pulse'
                      : 'bg-[var(--panel-color)] text-[var(--text-muted)] shadow-[var(--shadow-card)]'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : status === 'active' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                    status === 'active'
                      ? 'text-[var(--accent)]'
                      : status === 'completed'
                      ? 'text-[#22c55e]'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Recessed Gauge Track with Smooth Spring Motion & Scanning Beam */}
        <div className="relative w-full h-3 rounded-full bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] overflow-hidden p-0.5 mb-4">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] relative overflow-hidden"
            initial={{ width: '8%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Scanning light shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-20"
              animate={{ x: ['-100%', '300%'] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
            />
          </motion.div>
        </div>

        {/* Live Insight CRT Terminal Ticker */}
        <div className="relative rounded-xl p-3 bg-[var(--tech-screen-bg)] border-2 border-[var(--card-border)] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]"></div>
          <div className="relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping"></span>
            <AnimatePresence mode="wait">
              <motion.p
                key={insightIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-mono text-[#22c55e] tracking-tight truncate"
              >
                LOG: {STAGE_INSIGHTS[insightIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
