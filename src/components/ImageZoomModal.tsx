import React from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink, Search } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  bgGradient?: string;
  onClose: () => void;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  imageUrl,
  title,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Industrial Chassis Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 bg-[#e0e5ec] rounded-2xl max-w-lg w-full overflow-hidden shadow-[16px_16px_32px_rgba(0,0,0,0.35),-8px_-8px_24px_#ffffff] border border-white/70 flex flex-col"
      >
        {/* Corner Rivets */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#ffffff,1px_1px_1.5px_#babecc] flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-[#a3b1c6] transform rotate-45"></div>
        </div>
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#ffffff,1px_1px_1.5px_#babecc] flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-[#a3b1c6] transform -rotate-45"></div>
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#babecc]/50 text-[#2d3436]">
          <div className="min-w-0 pr-4">
            <span className="text-[10px] uppercase font-bold text-[#ff4757] font-mono tracking-wider block">
              OPTICAL INSPECTION // PRODUCT PHOTO
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#2d3436] truncate drop-shadow-[0_1px_0_#ffffff]">
              {title}
            </h3>
          </div>

          <button
            id="close-image-zoom-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#e0e5ec] hover:text-[#ff4757] text-[#4a5568] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] border border-white/60 flex items-center justify-center active:translate-y-[1px] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recessed Image Housing */}
        <div className="p-6 flex items-center justify-center bg-[#e0e5ec]">
          <div className="w-full max-h-[380px] aspect-square rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] p-6 flex items-center justify-center border border-white/40">
            <img
              src={imageUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-md"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#e0e5ec] border-t border-[#babecc]/50 flex items-center justify-between">
          <a
            href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#4a5568] hover:text-[#ff4757] cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>GOOGLE IMAGES</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#ff4757] hover:bg-[#e03848] text-white text-xs font-mono font-bold uppercase shadow-[3px_3px_6px_rgba(166,50,60,0.4)] border border-white/20 active:translate-y-[1px] cursor-pointer"
          >
            TUTUP
          </button>
        </div>
      </motion.div>
    </div>
  );
};
