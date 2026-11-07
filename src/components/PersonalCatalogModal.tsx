import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Database, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Search, 
  Barcode, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { 
  PersonalCatalogItem, 
  getPersonalCatalog, 
  savePersonalCatalogItem, 
  deletePersonalCatalogItem,
  exportCatalogToJson,
  importCatalogFromJson
} from '../lib/personalCatalog';
import { validateGtinChecksum } from '../lib/attributeMatcher';

interface PersonalCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalCatalogModal: React.FC<PersonalCatalogModalProps> = ({
  isOpen,
  onClose
}) => {
  const [items, setItems] = useState<PersonalCatalogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formVariant, setFormVariant] = useState('');
  const [formNetSize, setFormNetSize] = useState('');
  const [formUnit, setFormUnit] = useState('ml');
  const [formPackaging, setFormPackaging] = useState('Refill Pouch');
  const [formAliases, setFormAliases] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formProductUrl, setFormProductUrl] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshCatalog();
    }
  }, [isOpen]);

  const refreshCatalog = () => {
    const list = getPersonalCatalog();
    setItems(list);
  };

  const handleExport = () => {
    const jsonStr = exportCatalogToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strukpedia-katalog-pribadi-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice('Katalog berhasil diekspor ke file JSON.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importCatalogFromJson(content);
      if (result.errors.length > 0) {
        showNotice(`Impor selesai (${result.imported} item). Ada catatan: ${result.errors[0]}`);
      } else {
        showNotice(`Berhasil mengimpor ${result.imported} item produk ke katalog pribadi.`);
      }
      refreshCatalog();
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormBrand('');
    setFormVariant('');
    setFormNetSize('');
    setFormUnit('ml');
    setFormPackaging('Refill Pouch');
    setFormAliases('');
    setFormBarcode('');
    setFormProductUrl('');
    setFormImageUrl('');
    setFormError(null);
    setIsAdding(true);
  };

  const handleStartEdit = (item: PersonalCatalogItem) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormBrand(item.brand);
    setFormVariant(item.variant);
    setFormNetSize(item.netSize ? String(item.netSize) : '');
    setFormUnit(item.unit || 'ml');
    setFormPackaging(item.packaging || 'Refill Pouch');
    setFormAliases(item.receiptAliases.join(', '));
    setFormBarcode(item.barcode || '');
    setFormProductUrl(item.productUrl || '');
    setFormImageUrl(item.imageUrl || '');
    setFormError(null);
    setIsAdding(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Ukuran foto terlalu besar (maksimal 5MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      setFormImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Nama resmi produk wajib diisi.');
      return;
    }

    if (formBarcode.trim()) {
      const bcValidation = validateGtinChecksum(formBarcode.trim());
      if (!bcValidation.isValid) {
        setFormError(`Barcode tidak valid: ${bcValidation.reason}`);
        return;
      }
    }

    const aliasesArr = formAliases
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newItem: PersonalCatalogItem = {
      id: editingId || `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: formName.trim(),
      brand: formBrand.trim(),
      variant: formVariant.trim(),
      netSize: formNetSize ? parseFloat(formNetSize) : null,
      unit: formUnit,
      packaging: formPackaging,
      receiptAliases: aliasesArr,
      barcode: formBarcode.trim() || undefined,
      productUrl: formProductUrl.trim() || `https://www.klikindomaret.com/search/?key=${encodeURIComponent(formName.trim())}`,
      imageUrl: formImageUrl.trim() || undefined,
      confirmedByUser: true,
      verifiedAt: new Date().toISOString()
    };

    savePersonalCatalogItem(newItem);
    setIsAdding(false);
    refreshCatalog();
    showNotice(editingId ? 'Produk berhasil diperbarui.' : 'Produk baru berhasil disimpan ke Katalog Pribadi.');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus "${name}" dari Katalog Pribadi?`)) {
      deletePersonalCatalogItem(id);
      refreshCatalog();
      showNotice('Item berhasil dihapus dari katalog.');
    }
  };

  const filteredItems = items.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.variant.toLowerCase().includes(q) ||
      (item.barcode && item.barcode.includes(q)) ||
      item.receiptAliases.some(a => a.toLowerCase().includes(q))
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 text-[var(--text-main)] select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative z-10 bg-[var(--panel-color)] rounded-2xl max-w-3xl w-full shadow-[var(--shadow-floating)] border border-[var(--card-border)] overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[var(--panel-color)] border-b border-[var(--card-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--recessed-color)] shadow-[var(--shadow-recessed)] border border-[var(--card-border)] flex items-center justify-center text-[var(--accent)] shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[var(--accent)] font-mono tracking-wider">
                  OFFLINE-FIRST // DATA LOKAL PENGGUNA
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Dikonfirmasi Pengguna
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-heading font-black text-[var(--text-main)]">
                Katalog Pribadi &amp; Kamus Alias Struk
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

        {/* Action Bar */}
        <div className="p-4 bg-[var(--recessed-color)] border-b border-[var(--card-border)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk, merek, alias singkatan, atau barcode..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--panel-color)] text-xs font-mono text-[var(--text-main)] border border-[var(--card-border)] focus:outline-hidden focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 rounded-xl bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] border border-[var(--card-border)] text-xs font-mono font-bold uppercase shadow-sm cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>IMPOR JSON</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl bg-[var(--panel-color)] hover:text-[var(--accent)] text-[var(--text-muted)] border border-[var(--card-border)] text-xs font-mono font-bold uppercase shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EKSPOR JSON</span>
            </button>

            <button
              type="button"
              onClick={handleStartAdd}
              className="px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-mono font-bold uppercase shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>TAMBAH PRODUK</span>
            </button>
          </div>
        </div>

        {notification && (
          <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/30 text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] space-y-4">
          {/* Add / Edit Form Modal Inline */}
          {isAdding && (
            <form onSubmit={handleSaveForm} className="p-4 rounded-xl bg-[var(--panel-color)] border border-[var(--accent)] shadow-[var(--shadow-card)] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--card-border)]">
                <span className="font-bold text-[var(--accent)] uppercase">
                  {editingId ? 'Edit Produk Katalog Pribadi' : 'Tambah Produk Baru ke Katalog Pribadi'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Semua data berstatus Dikonfirmasi Pengguna
                </span>
              </div>

              {formError && (
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                    Nama Resmi Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Sania Minyak Goreng Sawit 2L"
                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                    Merek / Brand
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Contoh: Sania"
                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                    Varian Produk
                  </label>
                  <input
                    type="text"
                    value={formVariant}
                    onChange={(e) => setFormVariant(e.target.value)}
                    placeholder="Contoh: Sawit Jernih, Vanilla Choco"
                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--text-main)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                      Ukuran Isi Bersih
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formNetSize}
                      onChange={(e) => setFormNetSize(e.target.value)}
                      placeholder="Contoh: 2 atau 650"
                      className="w-full px-3 py-1.5 rounded-lg bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--text-main)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                      Satuan
                    </label>
                    <select
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--text-main)]"
                    >
                      <option value="ml">ml (Mililiter)</option>
                      <option value="L">L (Liter)</option>
                      <option value="g">g (Gram)</option>
                      <option value="kg">kg (Kilogram)</option>
                      <option value="pcs">pcs</option>
                      <option value="sachet">sachet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                    Bentuk Kemasan
                  </label>
                  <input
                    type="text"
                    value={formPackaging}
                    onChange={(e) => setFormPackaging(e.target.value)}
                    placeholder="Refill Pouch, Botol, Kaleng, Sachet, Cone"
                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                    Barcode GTIN (Opsional, EAN-13 / UPC)
                  </label>
                  <input
                    type="text"
                    value={formBarcode}
                    onChange={(e) => setFormBarcode(e.target.value)}
                    placeholder="Contoh: 8992753112213"
                    className="w-full px-3 py-1.5 rounded-lg bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                  Foto / Gambaran Produk (Upload Gambar)
                </label>
                <div className="flex items-center gap-3">
                  {formImageUrl ? (
                    <div className="relative w-12 h-12 rounded-lg border border-[var(--card-border)] bg-[var(--recessed-color)] overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={formImageUrl} alt="Preview Foto" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setFormImageUrl('')}
                        className="absolute top-0 right-0 bg-rose-500 text-white p-0.5 rounded-bl hover:bg-rose-600 cursor-pointer"
                        title="Hapus Foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}
                  <label className="px-3 py-1.5 rounded-lg bg-[var(--recessed-color)] hover:bg-[var(--card-border)] text-[var(--text-main)] border border-[var(--card-border)] text-[11px] font-mono cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>{formImageUrl ? 'Ganti Foto Produk' : 'Unggah Foto Produk (Opsional)'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                  Alias Singkatan Struk (Pisahkan dengan koma) *
                </label>
                <input
                  type="text"
                  value={formAliases}
                  onChange={(e) => setFormAliases(e.target.value)}
                  placeholder="SANIA MNYK GRNG 2L, SANIA 2L, SANIA REFILL 2L"
                  className="w-full px-3 py-1.5 rounded-lg bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--text-main)]"
                />
                <span className="text-[10px] text-[var(--text-muted)] block mt-1">
                  Jika singkatan ini ditemukan di struk berikutnya, aplikasi akan langsung mengenali produk ini.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--card-border)]">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg bg-[var(--recessed-color)] text-[var(--text-muted)] font-bold cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[var(--accent)] text-white font-bold cursor-pointer"
                >
                  SIMPAN KE KATALOG
                </button>
              </div>
            </form>
          )}

          {/* List of items */}
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[var(--text-muted)]">
              Tidak ada produk yang cocok di katalog pribadi. Klik "Tambah Produk" untuk mendaftarkan barang baru.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[var(--panel-color)] border border-[var(--card-border)] shadow-[var(--shadow-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-[var(--text-main)]">
                        {item.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Terkonfirmasi
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] flex-wrap">
                      {item.brand && <span>Brand: <strong className="text-[var(--text-main)]">{item.brand}</strong></span>}
                      {item.variant && <span>Varian: <strong className="text-[var(--text-main)]">{item.variant}</strong></span>}
                      {item.netSize && <span>Ukuran: <strong className="text-[var(--text-main)]">{item.netSize} {item.unit}</strong></span>}
                      {item.packaging && <span>Kemasan: <strong className="text-[var(--text-main)]">{item.packaging}</strong></span>}
                      {item.barcode && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Barcode className="w-3 h-3" />
                          <span>{item.barcode}</span>
                        </span>
                      )}
                    </div>

                    {item.receiptAliases.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-[var(--text-muted)]">Alias Struk:</span>
                        {item.receiptAliases.map((al, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--recessed-color)] border border-[var(--card-border)] text-[var(--accent)]"
                          >
                            {al}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {item.productUrl && (
                      <a
                        href={item.productUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-1.5 rounded-lg hover:bg-[var(--recessed-color)] text-[var(--text-muted)] hover:text-[var(--accent)] cursor-pointer"
                        title="Buka Klik Indomaret"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-[var(--recessed-color)] text-[var(--text-muted)] hover:text-[var(--accent)] cursor-pointer"
                      title="Edit produk"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
                      title="Hapus dari katalog"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--panel-color)] border-t border-[var(--card-border)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
          <span>Total {items.length} item terdaftar di Katalog Pribadi.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white font-bold uppercase cursor-pointer"
          >
            TUTUP
          </button>
        </div>
      </motion.div>
    </div>
  );
};
