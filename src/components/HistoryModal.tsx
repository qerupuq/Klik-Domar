import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, History, Loader2, Trash2, Calendar, DollarSign, Cloud, HardDrive, LogIn, RefreshCw, Check } from 'lucide-react';
import { ReceiptData } from '../types';
import { auth, loginWithGoogle } from '../lib/firebase';
import { getUserReceipts, deleteReceipt, saveReceiptToHistory } from '../lib/receiptService';

const STORAGE_KEY = 'strukpedia_local_history_v2';

export const getLocalReceipts = (): ReceiptData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca riwayat struk lokal:", e);
    return [];
  }
};

/**
 * Menyimpan struk ke penyimpanan lokal dengan perbaikan audit:
 * 1. Tidak menghapus struk lain jika nomor pesanan (orderNumber) kosong/tidak ada.
 * 2. Menghapus string base64 raksasa dan URL blob sementara agar tidak memenuhi kuota localStorage atau rusak.
 */
export const saveLocalReceipt = (receipt: ReceiptData) => {
  try {
    const current = getLocalReceipts();
    
    // Buat salinan aman tanpa base64 gambar raksasa atau blob URL sementara
    let safeImagePreviewUrl: string | undefined = receipt.imagePreviewUrl;
    if (safeImagePreviewUrl && (safeImagePreviewUrl.startsWith('data:image') || safeImagePreviewUrl.startsWith('blob:'))) {
      safeImagePreviewUrl = undefined;
    }

    const cleanReceiptToSave: ReceiptData = {
      ...receipt,
      imagePreviewUrl: safeImagePreviewUrl
    };

    // Filter duplikasi yang aman:
    // Struk tanpa nomor pesanan TIDAK boleh saling menghapus
    const filtered = current.filter(r => {
      // Jika id sama persis, timpa
      if (r.id === cleanReceiptToSave.id) return false;
      
      // Jika kedua struk sama-sama memiliki orderNumber yang tidak kosong dan sama, timpa
      const hasBothOrderNumbers = 
        r.orderNumber && r.orderNumber.trim() && 
        cleanReceiptToSave.orderNumber && cleanReceiptToSave.orderNumber.trim();
      
      if (hasBothOrderNumbers && r.orderNumber?.trim() === cleanReceiptToSave.orderNumber?.trim()) {
        return false;
      }

      return true;
    });

    const updated = [cleanReceiptToSave, ...filtered].slice(0, 30); // simpan hingga 30 struk terbaru
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Gagal menyimpan riwayat struk lokal:", e);
  }
};

export const deleteLocalReceipt = (id: string) => {
  try {
    const current = getLocalReceipts();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Gagal menghapus riwayat struk lokal:", e);
  }
};

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (receipt: ReceiptData) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSelectHistory }) => {
  const [localReceipts, setLocalReceipts] = useState<ReceiptData[]>([]);
  const [cloudReceipts, setCloudReceipts] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'cloud' | 'local'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, currentUser]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const local = getLocalReceipts();
      setLocalReceipts(local);

      if (currentUser) {
        const cloud = await getUserReceipts(currentUser.uid);
        setCloudReceipts(cloud);
      } else {
        setCloudReceipts([]);
      }
    } catch (e) {
      console.error('Gagal memuat riwayat:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncLocalToCloud = async () => {
    if (!currentUser || localReceipts.length === 0) return;
    setIsSyncing(true);
    try {
      for (const item of localReceipts) {
        // Cek apakah item sudah ada di cloud
        const alreadyInCloud = cloudReceipts.some(c => 
          (c.orderNumber && c.orderNumber === item.orderNumber) || c.id === item.id
        );
        if (!alreadyInCloud) {
          await saveReceiptToHistory(currentUser.uid, item);
        }
      }
      const refreshedCloud = await getUserReceipts(currentUser.uid);
      setCloudReceipts(refreshedCloud);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (e) {
      console.error('Gagal menyinkronkan ke cloud:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, receipt: ReceiptData) => {
    e.stopPropagation();
    // Hapus dari lokal jika ada
    deleteLocalReceipt(receipt.id);
    setLocalReceipts(prev => prev.filter(r => r.id !== receipt.id));

    // Hapus dari cloud jika user login dan struk tersimpan di cloud
    if (currentUser) {
      try {
        await deleteReceipt(receipt.id);
        setCloudReceipts(prev => prev.filter(r => r.id !== receipt.id));
      } catch (err) {
        console.warn('Gagal menghapus dari cloud Firestore:', err);
      }
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      loadHistory();
    } catch (err) {
      console.error('Login gagal:', err);
    }
  };

  const formatRupiah = (num?: number) => {
    if (!num) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  // Gabungkan daftar sesuai tab aktif
  const displayedReceipts = React.useMemo(() => {
    if (activeTab === 'local') return localReceipts;
    if (activeTab === 'cloud') return cloudReceipts;
    
    // Untuk tab 'all', gabungkan cloud dan local tanpa duplikasi
    const cloudIds = new Set(cloudReceipts.map(c => c.id));
    const combined = [...cloudReceipts];
    for (const loc of localReceipts) {
      if (!cloudIds.has(loc.id)) {
        combined.push(loc);
      }
    }
    return combined;
  }, [activeTab, localReceipts, cloudReceipts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 text-[var(--text-main)] select-none">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Industrial Dialog */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 bg-[var(--panel-color)] rounded-2xl max-w-xl w-full shadow-[var(--shadow-floating)] border border-[var(--card-border)] overflow-hidden my-auto flex flex-col max-h-[92vh] sm:max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[var(--panel-color)] border-b border-[var(--card-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] flex items-center justify-center text-[var(--accent)] shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[var(--accent)] font-mono tracking-wider block">
                MEMORI PENYIMPANAN // STRUK TERSIMPAN
              </span>
              <h2 className="text-lg font-heading font-black text-[var(--text-main)]">
                Riwayat Struk Belanja
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[var(--recessed-color)] hover:text-[var(--accent)] text-[var(--text-muted)] shadow-[var(--shadow-card)] border border-[var(--card-border)] flex items-center justify-center active:translate-y-[1px] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sync & Filter Bar */}
        <div className="px-5 py-3 bg-[var(--recessed-color)] border-b border-[var(--card-border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--panel-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--card-border)]'
              }`}
            >
              Semua ({displayedReceipts.length})
            </button>
            {currentUser && (
              <button
                onClick={() => setActiveTab('cloud')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  activeTab === 'cloud'
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--panel-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--card-border)]'
                }`}
              >
                <Cloud className="w-3 h-3" />
                Cloud ({cloudReceipts.length})
              </button>
            )}
            <button
              onClick={() => setActiveTab('local')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                activeTab === 'local'
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--panel-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--card-border)]'
              }`}
            >
              <HardDrive className="w-3 h-3" />
              Lokal ({localReceipts.length})
            </button>
          </div>

          {currentUser ? (
            localReceipts.length > 0 && (
              <button
                onClick={handleSyncLocalToCloud}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--panel-color)] border border-[var(--card-border)] hover:border-[var(--accent)] text-[var(--text-main)] hover:text-[var(--accent)] text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                title="Sinkronkan struk lokal ke Cloud Firestore"
              >
                {isSyncing ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : syncSuccess ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Cloud className="w-3 h-3" />
                )}
                <span>{isSyncing ? 'Menyinkronkan...' : syncSuccess ? 'Tersinkron!' : 'Sinkron ke Cloud'}</span>
              </button>
            )
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--accent)] text-white text-[11px] font-bold hover:brightness-110 cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              <span>Masuk Google</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[58vh] space-y-3 bg-[var(--bg-color)]/50">
          {loading ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin mb-2" />
              <p className="text-xs font-mono font-bold text-[var(--text-muted)]">MEMUAT RIWAYAT DARI PENYIMPANAN...</p>
            </div>
          ) : displayedReceipts.length === 0 ? (
            <div className="py-12 text-center">
              <History className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-mono font-bold text-[var(--text-main)]">Belum ada riwayat struk tersimpan</p>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-1">Struk yang dianalisis atau dibuka akan otomatis tersimpan di sini.</p>
              {!currentUser && (
                <div className="mt-4 p-3 rounded-xl bg-[var(--panel-color)] border border-[var(--card-border)] max-w-sm mx-auto">
                  <p className="text-[11px] text-[var(--text-muted)] mb-2">Masuk dengan akun Google Anda untuk menyimpan dan menyinkronkan struk belanja secara otomatis ke Cloud Firestore.</p>
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-mono font-bold rounded-lg hover:brightness-110 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Masuk dengan Google
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayedReceipts.map((receipt) => {
                const isCloudItem = cloudReceipts.some(c => c.id === receipt.id);
                return (
                  <div
                    key={receipt.id}
                    onClick={() => {
                      onSelectHistory(receipt);
                      onClose();
                    }}
                    className="p-4 rounded-xl bg-[var(--panel-color)] hover:border-[var(--accent)] border border-[var(--card-border)] shadow-[var(--shadow-card)] transition-all cursor-pointer group flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--accent)]">
                          {receipt.orderNumber ? `BON: ${receipt.orderNumber}` : 'STRUK TANPA BON'}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          {receipt.items?.length || 0} item
                        </span>
                        {isCloudItem ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <Cloud className="w-2.5 h-2.5" /> Cloud
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-500/10 text-[var(--text-muted)] border border-[var(--card-border)]">
                            <HardDrive className="w-2.5 h-2.5" /> Lokal
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading font-extrabold text-sm sm:text-base text-[var(--text-main)] truncate">
                        {receipt.storeName || 'Minimarket / Ritel'}
                      </h4>

                      <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-muted)] mt-1.5 flex-wrap">
                        {receipt.transactionDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{receipt.transactionDate}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-bold text-[var(--text-main)]">
                          <DollarSign className="w-3 h-3 text-[#22c55e]" />
                          <span>{formatRupiah(receipt.totalAmount || receipt.netAmount)}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, receipt)}
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
                      title="Hapus struk dari riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
