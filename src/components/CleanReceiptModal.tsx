import React from 'react';
import { motion } from 'motion/react';
import { ReceiptData } from '../types';
import { X, Printer, Check, ShoppingBag } from 'lucide-react';

interface CleanReceiptModalProps {
  isOpen: boolean;
  receipt: ReceiptData | null;
  onClose: () => void;
}

export const CleanReceiptModal: React.FC<CleanReceiptModalProps> = ({
  isOpen,
  receipt,
  onClose
}) => {
  if (!isOpen || !receipt) return null;

  const formatRupiah = (num?: number) => {
    if (!num) return '0';
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 text-[#2d3436] font-medium select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 bg-[#e0e5ec] rounded-2xl max-w-lg w-full shadow-[16px_16px_32px_rgba(0,0,0,0.35),-8px_-8px_24px_#ffffff] border border-white/70 overflow-hidden my-auto flex flex-col max-h-[92vh] sm:max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#e0e5ec] text-[#2d3436] flex items-center justify-between border-b border-[#babecc]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#babecc] flex items-center justify-center text-[#ff4757]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#4a5568] uppercase tracking-wider block">
                PRINTER MODULE
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#2d3436] drop-shadow-[0_1px_0_#ffffff]">
                Struk Bersih (Terjemahan Rapi)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#e0e5ec] hover:text-[#ff4757] text-[#4a5568] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] border border-white/60 flex items-center justify-center active:translate-y-[1px] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Paper Simulation in Sunken Well */}
        <div className="p-6 bg-[#e0e5ec] overflow-y-auto max-h-[65vh]">
          <div className="bg-white text-black p-6 rounded-lg font-mono text-xs shadow-md max-w-sm mx-auto border border-dashed border-gray-300">
            {/* Header */}
            <div className="text-center pb-4 border-b border-dashed border-gray-400">
              <h4 className="font-extrabold text-sm uppercase tracking-wider">{receipt.storeName}</h4>
              <p className="text-[10px] text-gray-600 mt-0.5">STRUK RESMI TERJEMAHAN AI</p>
              {receipt.transactionDate && (
                <p className="text-[10px] text-gray-500 mt-1">
                  {receipt.transactionDate} {receipt.transactionTime || ''}
                </p>
              )}
            </div>

            {/* Items List */}
            <div className="py-4 space-y-3 border-b border-dashed border-gray-400">
              {receipt.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span className="flex-1 pr-2 truncate">{item.fullName}</span>
                    <span className="shrink-0">{formatRupiah(item.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>
                      Singkatan: {item.rawName} {item.quantity ? `(${item.quantity}x)` : ''}
                    </span>
                    <span>{item.brand}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-3 space-y-1">
              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL BELANJA:</span>
                <span>Rp {formatRupiah(receipt.netAmount || receipt.totalAmount)}</span>
              </div>
              {receipt.totalDiscount ? (
                <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                  <span>HEMAT DISKON:</span>
                  <span>-Rp {formatRupiah(receipt.totalDiscount)}</span>
                </div>
              ) : null}
            </div>

            {/* Barcode Mock */}
            <div className="mt-6 pt-4 border-t border-dashed border-gray-400 text-center">
              <div className="inline-block tracking-widest text-xs font-bold font-mono">
                ||| | |||| || |||| ||| |||| |
              </div>
              <p className="text-[9px] text-gray-400 mt-1">VERIFIKASI STRUKPEDIA // CLICK INDOMARET</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#e0e5ec] border-t border-[#babecc]/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#e0e5ec] text-[#4a5568] hover:text-[#2d3436] text-xs font-mono font-bold uppercase shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] border border-white/60 active:translate-y-[1px] cursor-pointer"
          >
            TUTUP
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#ff4757] hover:bg-[#e03848] text-white text-xs font-mono font-bold uppercase shadow-[4px_4px_8px_rgba(166,50,60,0.4)] border border-white/30 active:translate-y-[2px] cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>CETAK DOKUMEN</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
