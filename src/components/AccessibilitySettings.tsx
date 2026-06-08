import React from 'react';
import { Sparkles, Eye, Volume2, Type } from 'lucide-react';

interface AccessibilitySettingsProps {
  textSize: number; // 1 = 100%, 1.2 = 120%, 1.4 = 140%
  setTextSize: (size: number) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (val: boolean) => void;
  screenReaderHelp: boolean;
  setScreenReaderHelp: (val: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilitySettings({
  textSize,
  setTextSize,
  highContrast,
  setHighContrast,
  dyslexicFont,
  setDyslexicFont,
  screenReaderHelp,
  setScreenReaderHelp,
  isOpen,
  onClose
}: AccessibilitySettingsProps) {
  if (!isOpen) return null;

  const speakSimulated = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech tidak didukung di browser ini.");
    }
  };

  return (
    <div id="accessibility-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/75 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-md rounded-none bg-[#FAF7F2] p-6 shadow-2xl transition-all dark:bg-[#0A0A0A] border ${
          highContrast ? 'border-gold border-2' : 'border-stone-300 dark:border-white/10'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="acc-title"
      >
        <div className="flex items-center justify-between border-b pb-4 dark:border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gold" />
            <h3 id="acc-title" className="text-xl font-serif italic text-stone-900 dark:text-white">
              Aksesibilitas & Alat Bantu
            </h3>
          </div>
          <button 
            type="button"
            className="rounded-none w-7 h-7 flex items-center justify-center bg-stone-200 dark:bg-stone-900 text-stone-650 cursor-pointer hover:bg-gold hover:text-black hover:dark:bg-gold transition-colors"
            onClick={onClose}
            aria-label="Tutup pengaturan aksesibilitas"
          >
            &times;
          </button>
        </div>

        <div className="space-y-6">
          {/* Text Size Multiplier */}
          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
              <Type className="h-3.5 w-3.5 text-gold" />
              Ukuran Teks: {Math.round(textSize * 100)}%
            </label>
            <div className="flex gap-2">
              <button
                key="normal-size"
                type="button"
                className={`flex-1 py-2 px-1 rounded-none border text-[9px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  textSize === 1 
                    ? 'border-gold bg-stone-900 text-[#d4af37] dark:bg-white dark:text-black dark:border-white' 
                    : 'border-stone-300 hover:bg-stone-100 dark:border-white/5 text-stone-750 dark:text-stone-300'
                }`}
                onClick={() => {
                  setTextSize(1);
                  speakSimulated("Ukuran teks diatur kembali ke normal");
                }}
              >
                Normal (100%)
              </button>
              <button
                key="medium-size"
                type="button"
                className={`flex-1 py-2 px-1 rounded-none border text-[9px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  textSize === 1.2 
                    ? 'border-gold bg-stone-900 text-[#d4af37] dark:bg-white dark:text-black dark:border-white' 
                    : 'border-stone-300 hover:bg-stone-100 dark:border-white/5 text-stone-750 dark:text-stone-300'
                }`}
                onClick={() => {
                  setTextSize(1.2);
                  speakSimulated("Ukuran teks diatur ke sedang");
                }}
              >
                Sedang (120%)
              </button>
              <button
                key="large-size"
                type="button"
                className={`flex-1 py-2 px-1 rounded-none border text-[9px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  textSize === 1.4 
                    ? 'border-gold bg-stone-900 text-[#d4af37] dark:bg-white dark:text-black dark:border-white' 
                    : 'border-stone-300 hover:bg-stone-100 dark:border-white/5 text-stone-750 dark:text-stone-300'
                }`}
                onClick={() => {
                  setTextSize(1.4);
                  speakSimulated("Ukuran teks diatur ke besar");
                }}
              >
                Besar (140%)
              </button>
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200">Mode Kontras Tinggi</h4>
              <p className="text-[11px] text-stone-500 font-light mt-0.5">Tingkatkan visibilitas garis batas dan teks</p>
            </div>
            <button
              type="button"
              id="high-contrast-toggle"
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                highContrast ? 'bg-gold' : 'bg-stone-300 dark:bg-stone-800'
              }`}
              onClick={() => {
                const nextVal = highContrast ? false : true;
                setHighContrast(nextVal);
                speakSimulated(nextVal ? "Kontras tinggi diaktifkan" : "Kontras tinggi dimatikan");
              }}
              role="switch"
              aria-checked={highContrast}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                highContrast ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Dyslexic Friendly Font Option */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200">Font Ramah Disleksia</h4>
              <p className="text-[11px] text-stone-500 font-light mt-0.5">Gunakan penekanan visual tebal di bagian bawah teks</p>
            </div>
            <button
              type="button"
              id="dyslexic-font-toggle"
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                dyslexicFont ? 'bg-gold' : 'bg-stone-300 dark:bg-stone-800'
              }`}
              onClick={() => {
                const nextVal = dyslexicFont ? false : true;
                setDyslexicFont(nextVal);
                speakSimulated(nextVal ? "Font ramah disleksia diaktifkan" : "Font standar diaktifkan");
              }}
              role="switch"
              aria-checked={dyslexicFont}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                dyslexicFont ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Text to Speech Instruction Trigger */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-850 dark:text-stone-200">Asisten Suara / Pembaca TTS</h4>
              <p className="text-[11px] text-stone-500 font-light mt-0.5">Suara bantuan pembacaan instan halaman Kos</p>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-none border border-stone-300 hover:bg-stone-100 dark:border-white/10 dark:hover:bg-stone-900 text-stone-800 dark:text-stone-200 text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer"
              onClick={() => {
                speakSimulated("Selamat datang di Indra Jaya Kos. Anda berada di menu Aksesibilitas. Semua halaman mendukung kontras tinggi dan ukuran teks dinamis.");
              }}
            >
              <Volume2 className="h-3 w-3 text-gold" />
              Tes Suara
            </button>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 dark:border-white/10 flex justify-end">
          <button
            type="button"
            className="bg-stone-900 text-white dark:bg-white dark:text-black font-semibold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-none hover:bg-gold dark:hover:bg-gold dark:hover:text-black transition-all cursor-pointer border border-transparent"
            onClick={onClose}
          >
            Terapkan & Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
export {};
