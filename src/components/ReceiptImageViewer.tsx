import React, { useState, useEffect } from 'react';
import { Eye, RotateCw, ZoomIn, ZoomOut, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import { ReceiptItem } from '../types';

interface ReceiptImageViewerProps {
  imageUrl?: string;
  rawText?: string;
  storeName?: string;
  highlightedItemId?: string | null;
  items?: ReceiptItem[];
}

export const ReceiptImageViewer: React.FC<ReceiptImageViewerProps> = ({
  imageUrl,
  rawText,
  highlightedItemId,
  items = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Auto-expand when an item is highlighted
  useEffect(() => {
    if (highlightedItemId && imageUrl) {
      setIsExpanded(true);
    }
  }, [highlightedItemId, imageUrl]);

  if (!imageUrl && !rawText) return null;

  const activeItem = items.find(i => i.id === highlightedItemId);
  const bbox = activeItem?.boundingBox;

  return (
    <div className="bg-[var(--panel-color)] rounded-2xl shadow-[var(--shadow-card)] border border-[var(--card-border)] overflow-hidden mb-6 text-[var(--text-main)] font-medium select-none">
      {/* Toggle Header (Industrial Switch Bar) */}
      <button
        id="toggle-receipt-preview-btn"
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 bg-[var(--panel-color)] hover:brightness-95 transition-[filter] flex items-center justify-between text-left cursor-pointer border-b border-[var(--card-border)]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] flex items-center justify-center text-[var(--accent)]">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-main)] block">
              INSPEKTOR CITRA // {imageUrl ? 'FOTO STRUK FISIK' : 'RAW OCR BUFFER'}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block">
              {isExpanded ? 'Klik untuk melipat terminal inspeksi struk' : 'Bandingkan langsung foto struk asli dengan hasil riset AI'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white bg-[var(--accent)] px-3 py-1.5 rounded-lg shadow-[var(--shadow-card)] border border-white/20">
          <span>{isExpanded ? 'TUTUP' : 'BUKA INSPEKTOR'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 sm:p-7 bg-[var(--panel-color)]">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Image viewer if available */}
            {imageUrl && (
              <div className="flex-1 w-full flex flex-col items-center">
                {/* Control toolbar (Tactile Mechanical Dials) */}
                <div className="flex items-center gap-2 mb-3 bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] p-1.5 rounded-xl self-center border border-[var(--card-border)]">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(0.7, prev - 0.2))}
                    className="p-1.5 bg-[var(--panel-color)] hover:text-[var(--accent)] rounded-lg text-[var(--text-muted)] shadow-[var(--shadow-card)] active:translate-y-[1px] cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono font-bold text-[var(--text-main)] px-2">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.2))}
                    className="p-1.5 bg-[var(--panel-color)] hover:text-[var(--accent)] rounded-lg text-[var(--text-muted)] shadow-[var(--shadow-card)] active:translate-y-[1px] cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-[var(--card-border)] mx-1" />
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="p-1.5 bg-[var(--panel-color)] hover:text-[var(--accent)] rounded-lg text-[var(--text-muted)] shadow-[var(--shadow-card)] active:translate-y-[1px] cursor-pointer"
                    title="Putar Gambar 90 Derajat"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      setRotation(0);
                    }}
                    className="text-[11px] font-mono font-bold px-2 py-1 bg-[var(--panel-color)] text-[var(--text-muted)] hover:text-[var(--accent)] shadow-[var(--shadow-card)] rounded-lg active:translate-y-[1px] cursor-pointer"
                  >
                    RESET
                  </button>
                </div>

                {/* CRT Screen Display Container */}
                <div id="section-photo" className="relative w-full max-h-[520px] overflow-auto rounded-xl p-4 flex items-center justify-center border-4 border-[var(--border-dark)] bg-[#14181a] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.05)]">
                  {/* Scanline layer */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]"></div>

                  <div 
                    className="relative inline-block z-10"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s ease-out'
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="Foto Struk Asli"
                      className="max-w-full max-h-[480px] object-contain rounded drop-shadow-md block"
                    />
                    
                    {/* Bounding Box Highlight Overlay */}
                    {bbox && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1, boxShadow: '0 0 15px var(--accent)' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute border-2 border-[var(--accent)] bg-[var(--accent)]/30 rounded-sm pointer-events-none z-20"
                        style={{
                          top: `${(bbox.yMin / 1000) * 100}%`,
                          left: `${(bbox.xMin / 1000) * 100}%`,
                          height: `${((bbox.yMax - bbox.yMin) / 1000) * 100}%`,
                          width: `${((bbox.xMax - bbox.xMin) / 1000) * 100}%`
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Raw OCR text panel */}
            {rawText && (
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-main)]">
                      RAW OCR TEXT STREAM:
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {rawText.split('\n').length} BARIS
                  </span>
                </div>

                {/* CRT Terminal Screen */}
                <div className="relative rounded-xl p-4 border-4 border-[var(--border-dark)] bg-[#14181a] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8)] overflow-hidden">
                  {/* Scanline pattern */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]"></div>

                  <pre className="relative z-10 font-mono text-xs text-[#22c55e] whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto selection:bg-[#22c55e] selection:text-black">
                    {rawText}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
