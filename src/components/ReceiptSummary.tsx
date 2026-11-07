import React, { useState } from 'react';
import { ReceiptData } from '../types';
import { 
  Calendar, 
  Store, 
  CreditCard, 
  Share2, 
  Download, 
  Check, 
  Printer, 
  Layers, 
  TrendingDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReceiptSummaryProps {
  receipt: ReceiptData;
  onPrintCleanReceipt: () => void;
}

export const ReceiptSummary: React.FC<ReceiptSummaryProps> = ({
  receipt,
  onPrintCleanReceipt
}) => {
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const formatRupiah = (num?: number) => {
    if (!num) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  // Group items by category for breakdown
  const categoryCounts: Record<string, number> = {};
  receipt.items.forEach((item) => {
    const cat = item.category || 'Lain-lain';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const handleShareWhatsApp = () => {
    let text = `🛒 *REKAP TRANSLATE STRUK BELANJA*\n`;
    text += `🏪 *Toko:* ${receipt.storeName}\n`;
    if (receipt.transactionDate) text += `📅 *Tanggal:* ${receipt.transactionDate}\n`;
    text += `📦 *Total Item:* ${receipt.items.length} Produk\n`;
    text += `💰 *Total Belanja:* ${formatRupiah(receipt.netAmount || receipt.totalAmount)}\n`;
    if (receipt.totalDiscount) text += `🎉 *Hemat Diskon:* ${formatRupiah(receipt.totalDiscount)}\n`;
    text += `\n*Daftar Produk Asli Terjemahan:*\n`;

    receipt.items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.fullName}*\n`;
      text += `   ↳ Singkatan: \`${item.rawName}\` | Qty: ${item.quantity || 1} | ${item.totalPrice ? formatRupiah(item.totalPrice) : ''}\n`;
    });

    text += `\n_Diterjemahkan & Riset via StrukPedia AI_`;

    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleExportCSV = () => {
    let csv = 'No,Singkatan Asli,Nama Resmi Produk,Merk,Kategori,Ukuran Kemasan,Qty,Harga Satuan (IDR),Subtotal (IDR),Diskon/Hemat (IDR)\n';
    receipt.items.forEach((item, idx) => {
      const escape = (str: string = '') => `"${str.replace(/"/g, '""')}"`;
      csv += `${idx + 1},${escape(item.rawName)},${escape(item.fullName)},${escape(item.brand)},${escape(item.category)},${escape(item.unitSize)},${item.quantity || 1},${item.unitPrice || ''},${item.totalPrice || ''},${item.discountOrVoucher || 0}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Struk_${receipt.storeName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative bg-[var(--panel-color)] rounded-2xl p-5 sm:p-7 shadow-[var(--shadow-card)] border border-[var(--card-border)] mb-6 text-[var(--text-main)] font-medium overflow-hidden select-none">
      {/* Corner Screws */}
      <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-[var(--recessed-color)] shadow-[inset_1px_1px_1.5px_var(--border-light),1px_1px_1.5px_rgba(0,0,0,0.2)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[var(--border-dark)] transform rotate-45"></div>
      </div>
      <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[var(--recessed-color)] shadow-[inset_1px_1px_1.5px_var(--border-light),1px_1px_1.5px_rgba(0,0,0,0.2)] flex items-center justify-center">
        <div className="w-1.5 h-0.5 bg-[var(--border-dark)] transform -rotate-30"></div>
      </div>

      {/* Top Banner: Store Info & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[var(--card-border)] pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] text-[var(--accent)] flex items-center gap-1.5 uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              {receipt.storeName || 'MINIMARKET'}
            </span>
            {receipt.orderNumber && (
              <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] px-2.5 py-1 rounded-md">
                REF: #{receipt.orderNumber}
              </span>
            )}
            {receipt.customerName && (
              <span className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] px-2.5 py-1 rounded-md">
                CUST: {receipt.customerName}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)]">
            Rekap Terjemahan {receipt.items.length} Produk Struk Belanja
          </h2>

          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mt-1.5 flex-wrap font-mono">
            {receipt.transactionDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                {receipt.transactionDate} {receipt.transactionTime ? `• ${receipt.transactionTime}` : ''}
              </span>
            )}
            {receipt.paymentMethod && (
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                PAY: {receipt.paymentMethod}
              </span>
            )}
          </div>
        </div>

        {/* Digital Financial Readout Modules */}
        <div className="flex items-center gap-3 bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] p-3.5 rounded-xl border border-[var(--card-border)] self-start lg:self-auto">
          <div className="px-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-muted)] block">
              TOTAL TRANSAKSI
            </span>
            <span className="font-mono font-bold text-lg sm:text-xl text-[var(--text-main)] tracking-tight">
              {formatRupiah(receipt.netAmount || receipt.totalAmount)}
            </span>
          </div>

          {receipt.totalDiscount && receipt.totalDiscount > 0 ? (
            <div className="border-l border-[var(--card-border)] pl-4 pr-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#22c55e] flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                TOTAL HEMAT
              </span>
              <span className="font-mono font-bold text-base sm:text-lg text-[#22c55e] tracking-tight">
                {formatRupiah(receipt.totalDiscount)}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Categories & Actions Bar */}
      <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category distribution */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono font-bold text-[var(--text-muted)] mr-1 flex items-center gap-1 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
            KATEGORI:
          </span>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <span
              key={cat}
              className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--panel-color)] shadow-[var(--shadow-card)] border border-[var(--card-border)] text-[var(--text-muted)]"
            >
              {cat} ({count})
            </span>
          ))}
        </div>

        {/* Action Export Buttons (Physical Keys) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="share-whatsapp-btn"
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[var(--shadow-card)] border border-white/30 active:translate-y-[2px] transition-all cursor-pointer"
          >
            {copiedWhatsApp ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedWhatsApp ? 'TERSALIN!' : 'SHARE WA'}</span>
          </button>

          <button
            id="download-csv-btn"
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-main)] text-xs font-mono font-bold uppercase tracking-wider shadow-[var(--shadow-card)] border border-[var(--card-border)] active:translate-y-[2px] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>EXPORT CSV</span>
          </button>

          <button
            id="print-receipt-btn"
            type="button"
            onClick={onPrintCleanReceipt}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] hover:brightness-110 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[var(--shadow-card)] border border-white/30 active:translate-y-[2px] transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>CETAK STRUK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
