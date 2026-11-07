import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, FileText, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { AnalysisProgressBar } from './AnalysisProgressBar';

interface ReceiptUploaderProps {
  onAnalyzeImage: (base64: string, mimeType: string, previewUrl: string) => void;
  onAnalyzeText: (text: string) => void;
  onSelectSample: (sampleId: string) => void;
  isLoading: boolean;
  loadingMessage: string;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({
  onAnalyzeImage,
  onAnalyzeText,
  isLoading,
  loadingMessage
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'text'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WEBP)');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const MAX_SIZE = 1200;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0, width, height);
      const webpBase64 = canvas.toDataURL('image/webp', 0.8);
      onAnalyzeImage(webpBase64, 'image/webp', previewUrl);
    };
    img.src = previewUrl;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan di browser.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/webp', 0.8);
      stopCamera();
      onAnalyzeImage(base64, 'image/webp', base64);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onAnalyzeText(textInput);
  };

  const tabOptions = [
    { id: 'upload' as const, label: 'FILE UPLOAD', icon: Upload },
    { id: 'camera' as const, label: 'CAMERA OPTIC', icon: Camera },
    { id: 'text' as const, label: 'TEXT CONSOLE', icon: FileText }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* Bolted Industrial Instrument Chassis */}
      <div className="relative bg-[#e0e5ec] rounded-2xl shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] border border-white/60 p-6 sm:p-8 overflow-hidden">
        {/* Physical Corner Screws (4 corners) */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#ffffff,1px_1px_2px_#babecc] flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-[#a3b1c6] transform -rotate-45"></div>
        </div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#ffffff,1px_1px_2px_#babecc] flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-[#a3b1c6] transform rotate-12"></div>
        </div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#ffffff,1px_1px_2px_#babecc] flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-[#a3b1c6] transform rotate-30"></div>
        </div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#ffffff,1px_1px_2px_#babecc] flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-[#a3b1c6] transform -rotate-60"></div>
        </div>

        {/* Chassis Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#babecc]/50">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff4757] shadow-[0_0_8px_#ff4757] animate-pulse"></div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#4a5568] drop-shadow-[0_1px_0_#ffffff] block">
                CHASSIS BAY // INPUT TERMINAL
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#2d3436] tracking-tight drop-shadow-[0_1px_0_#ffffff]">
                Scan &amp; Decoding Citra Struk
              </h2>
            </div>
          </div>

          {/* Right Ventilation Slots & Mode Toggle */}
          <div className="flex items-center gap-4 self-start sm:self-auto">
            {/* 3 Physical Vent Slots */}
            <div className="hidden sm:flex items-center gap-1.5 px-2">
              <div className="w-1 h-5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),inset_-1px_-1px_1px_#ffffff]"></div>
              <div className="w-1 h-5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),inset_-1px_-1px_1px_#ffffff]"></div>
              <div className="w-1 h-5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),inset_-1px_-1px_1px_#ffffff]"></div>
            </div>

            {/* Recessed Mechanical Mode Switcher */}
            <div className="bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] p-1 rounded-xl flex items-center gap-1">
              {tabOptions.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}-btn`}
                    type="button"
                    onClick={() => {
                      if (tab.id !== 'camera') stopCamera();
                      if (tab.id === 'camera') startCamera();
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold tracking-wider transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#ff4757] text-white shadow-[2px_2px_5px_rgba(166,50,60,0.4),-2px_-2px_5px_rgba(255,100,110,0.4)] border border-white/20'
                        : 'text-[#4a5568] hover:text-[#2d3436] active:translate-y-[1px]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Body View */}
        <div className="pt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="py-6 flex flex-col items-center justify-center text-center"
              >
                <AnalysisProgressBar loadingMessage={loadingMessage} />
              </motion.div>
            ) : activeTab === 'upload' ? (
              <motion.div
                key="tab-upload"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {/* Recessed Dropzone Well */}
                <div
                  id="dropzone-area"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-[#e0e5ec] ${
                    dragOver
                      ? 'shadow-[inset_6px_6px_12px_#babecc,inset_-6px_-6px_12px_#ffffff,0_0_0_2px_#ff4757]'
                      : 'shadow-[inset_5px_5px_10px_#babecc,inset_-5px_-5px_10px_#ffffff] hover:shadow-[inset_7px_7px_14px_#babecc,inset_-7px_-7px_14px_#ffffff]'
                  }`}
                >
                  <input
                    id="receipt-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Recessed Tactile Socket for Lens Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#e0e5ec] shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] border border-white/60 flex items-center justify-center text-[#ff4757] transition-transform hover:scale-105">
                    <ImageIcon className="w-7 h-7 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" />
                  </div>

                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#2d3436] mb-1.5 drop-shadow-[0_1px_0_#ffffff]">
                    Letakkan Foto Struk Belanja Disini
                  </h3>
                  <p className="text-xs text-[#4a5568] font-mono mb-5 drop-shadow-[0_1px_0_#ffffff]">
                    SUPPORTED FORMAT: JPG, PNG, WEBP // MAX RESOLUTION 1200PX
                  </p>

                  <button
                    id="select-file-btn"
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff4757] hover:bg-[#e03848] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[4px_4px_8px_rgba(166,50,60,0.4),-4px_-4px_8px_rgba(255,100,110,0.4)] border border-white/30 active:translate-y-[2px] active:shadow-[inset_4px_4px_8px_rgba(130,30,40,0.5),inset_-4px_-4px_8px_rgba(255,120,130,0.3)] transition-all cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    <span>PILIH FILE DARI PERANGKAT</span>
                  </button>
                </div>
              </motion.div>
            ) : activeTab === 'camera' ? (
              <motion.div
                key="tab-camera"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                {cameraError ? (
                  <div className="p-6 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] rounded-2xl text-center max-w-md border border-[#ff4757]/40">
                    <AlertCircle className="w-8 h-8 text-[#ff4757] mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#2d3436] mb-3">{cameraError}</p>
                    <button
                      id="retry-camera-btn"
                      onClick={startCamera}
                      className="px-4 py-2 bg-[#ff4757] text-white text-xs font-mono font-bold rounded-lg shadow-md cursor-pointer hover:bg-[#e03848]"
                    >
                      COBA IZIN ULANG KAMERA
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-lg flex flex-col items-center">
                    {/* CRT Style Optic Viewport */}
                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(255,255,255,0.05)] border-4 border-[#2d3436] bg-[#14181a]">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Scanlines & Crosshair Overlay */}
                      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px]"></div>
                      <div className="absolute inset-4 border-2 border-dashed border-[#ff4757]/70 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                        <span className="text-[10px] font-mono font-bold text-white bg-[#ff4757] px-2 py-0.5 rounded self-start">
                          OPTIC // ALIGN RECEIPT
                        </span>
                        <span className="text-[10px] font-mono font-bold text-white/80 bg-black/60 px-2 py-0.5 rounded self-center">
                          Posisikan struk tegak &amp; jelas
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-5">
                      <button
                        id="capture-photo-btn"
                        type="button"
                        onClick={capturePhoto}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff4757] hover:bg-[#e03848] text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_8px_rgba(166,50,60,0.4),-4px_-4px_8px_rgba(255,100,110,0.4)] border border-white/30 active:translate-y-[2px] active:shadow-[inset_4px_4px_8px_rgba(130,30,40,0.5),inset_-4px_-4px_8px_rgba(255,120,130,0.3)] transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>AMBIL FOTO STRUK</span>
                      </button>
                      <button
                        id="cancel-camera-btn"
                        type="button"
                        onClick={() => {
                          stopCamera();
                          setActiveTab('upload');
                        }}
                        className="px-4 py-3 rounded-xl bg-[#e0e5ec] text-[#4a5568] hover:text-[#2d3436] font-mono font-bold text-xs uppercase shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] border border-white/50 active:translate-y-[2px] transition-all cursor-pointer"
                      >
                        TUTUP
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="tab-text"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleTextSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="receipt-raw-text" className="block text-[11px] font-mono font-bold text-[#4a5568] uppercase tracking-wider mb-2 drop-shadow-[0_1px_0_#ffffff]">
                      INPUT BUFFER // SALIN BARIS SINGKATAN STRUK (SATU PER BARIS):
                    </label>
                    <textarea
                      id="receipt-raw-text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={`G/DAY BTRSCOTCH 10S
ANLENE ACTFT CKL 560
SANIA M/GR REF 1000
RINSO P.BRZE BTL 650
WALLS MATCHA STW 350
MR.BREAD TAWAR TEBAL`}
                      rows={6}
                      className="w-full rounded-xl p-4 text-xs sm:text-sm font-mono bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] text-[#2d3436] placeholder-[#4a5568]/60 focus:outline-hidden focus:shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff,0_0_0_2px_#ff4757] border-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-[11px] font-mono text-[#4a5568] drop-shadow-[0_1px_0_#ffffff]">
                      DATA ENTRY: Salin langsung dari deretan teks struk belanja fisik atau digital.
                    </p>
                    <button
                      id="submit-text-btn"
                      type="submit"
                      disabled={!textInput.trim()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ff4757] hover:bg-[#e03848] disabled:opacity-40 text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_8px_rgba(166,50,60,0.4),-4px_-4px_8px_rgba(255,100,110,0.4)] border border-white/30 active:translate-y-[2px] active:shadow-[inset_4px_4px_8px_rgba(130,30,40,0.5),inset_-4px_-4px_8px_rgba(255,120,130,0.3)] transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>DECODE SINGKATAN</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
