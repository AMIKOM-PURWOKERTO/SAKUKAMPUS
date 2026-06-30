import React, { useState } from 'react';

export default function AiSmartInput({ onTambahBanyakTransaksi }) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasilAnalisis, setHasilAnalisis] = useState(null);

  // =========================================================================
  // 🎙️ FITUR NYATA 1: VOICE SPEECH RECORDING (SUARA TO TEKS)
  // =========================================================================
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("❌ Browser Anda tidak mendukung sensor perekam suara Web Speech API. Gunakan Google Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; 
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      
      recognition.onresult = (event) => {
        const textHasilSuara = event.results[0][0].transcript;
        setInputText((prev) => prev + " " + textHasilSuara);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  };

  // =========================================================================
  // 🤖 FITUR SIMULASI 2 & 3: PENCATATAN MASSAL + PEMBERSIH TYPO & SLANG
  // =========================================================================
  const prosesAnalisisDummyAI = () => {
    if (!inputText.trim()) {
      alert("Masukkan cerita transaksi kamu terlebih dahulu!");
      return;
    }

    setIsLoading(true);

    // Simulasi loading jeda berpikir illy selama 1.5 detik
    setTimeout(() => {
      const textLower = inputText.toLowerCase();
      let mockData = [];

      // illy ENGINE SIMULASI: Mendeteksi kata kunci, mencuci typo (mkn -> Makanan), dan memisahkan data
      if (textLower.includes('padang') || textLower.includes('nasi') || textLower.includes('mkn') || textLower.includes('jajan')) {
        mockData.push({
          deskripsi: "Nasi Padang & Es Teh (Cleaned by illy ✨)",
          jumlah: 25000,
          kategori: "Makanan & Jajan",
          tipe: "pengeluaran"
        });
      }
      
      if (textLower.includes('bensin') || textLower.includes('bnsn') || textLower.includes('pertalite') || textLower.includes('ojek')) {
        mockData.push({
          deskripsi: "Bensin Pertalite Motor (Cleaned by illy ✨)",
          jumlah: 20000,
          kategori: "Transportasi",
          tipe: "pengeluaran"
        });
      }

      if (textLower.includes('canva') || textLower.includes('buku') || textLower.includes('tugas') || textLower.includes('maket')) {
        mockData.push({
          deskripsi: "Patungan Canva Pro Kelompok (Cleaned by illy ✨)",
          jumlah: 35000,
          kategori: "Kebutuhan Kuliah / Buku",
          tipe: "pengeluaran"
        });
      }

      if (textLower.includes('transfer') || textLower.includes('ortu') || textLower.includes('dikasih') || textLower.includes('kiriman')) {
        mockData.push({
          deskripsi: "Uang Saku Bulanan Ortu (Cleaned by illy ✨)",
          jumlah: 1500000,
          kategori: "Pemasukan Ortu / Beasiswa",
          tipe: "pemasukan"
        });
      }

      // Jika teks terlalu acak, kasih fallback cerdas dari illy
      if (mockData.length === 0) {
        mockData.push({
          deskripsi: inputText.length > 30 ? inputText.substring(0, 30) + "..." : inputText,
          jumlah: 50000,
          kategori: "Lain-lain",
          tipe: "pengeluaran"
        });
      }

      setHasilAnalisis(mockData);
      setIsLoading(false);
    }, 1500);
  };

  const simpanKeDatabaseUtama = () => {
    if (hasilAnalisis) {
      onTambahBanyakTransaksi(hasilAnalisis);
      alert(`🎉 illy berhasil mengekstrak ${hasilAnalisis.length} transaksi dan memasukkannya ke ringkasan finansial!`);
      setInputText('');
      setHasilAnalisis(null);
    }
  };

  return (
    <div className="max-w-3xl bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-in fade-in duration-200 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Fitur Premium Proyek</span>
        <h3 className="text-lg font-black text-slate-800 mt-2 flex items-center gap-2">🤖 Pahami Bahasa Alami Bersama illy AI</h3>
        <p className="text-xs text-slate-400 mt-1">Gunakan kenyamanan input paragraf bercerita. illy akan mencuci singkatan gaul (*slang*), menebak kategori, dan mengelompokkan anggaran otomatis.</p>
      </div>

      {/* TEXTAREA INPUT + TOMBOL MIC SUARA */}
      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Contoh menyapa illy: 'illy, tadi aku mkn naskun 25rb sama isi bnsn 20rb ya...'"
          className="w-full min-h-30 bg-slate-50 border border-slate-200 rounded-2xl p-4 pr-14 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:bg-white transition-all"
        />
        
        {/* Tombol Mikrofon Sensor Suara */}
        <button 
          onClick={handleVoiceInput}
          title="Catat pakai perintah suara bersama illy"
          className={`absolute right-4 bottom-5 w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isListening ? 'bg-red-500 text-white animate-pulse border-red-400' : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200 shadow-sm'}`}
        >
          {isListening ? '🛑' : '🎙️'}
        </button>
      </div>

      {/* TOMBOL PEMICU EKSTRAKSI AI */}
      <button
        onClick={prosesAnalisisDummyAI}
        disabled={isLoading}
        className="w-full bg-slate-900 hover:bg-cyan-950 hover:text-cyan-400 text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>illy sedang menstrukturkan data & mencuci kata gaul...</span>
          </>
        ) : (
          <span>✨ Ekstrak & Rapikan Teks bersama illy</span>
        )}
      </button>

      {/* HASIL EKSTRAKSI EKSTRA PINTAR */}
      {hasilAnalisis && (
        <div className="bg-cyan-50/50 border border-cyan-100 p-5 rounded-2xl space-y-4 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-cyan-800 flex items-center gap-1.5">🔍 Hasil Analisis & Pembersihan Teks illy:</h4>
            <span className="text-[10px] font-bold text-cyan-600 bg-white px-2 py-0.5 rounded-md border border-cyan-100 shadow-sm">Status: Berhasil Terurai</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-cyan-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                  <th className="p-3">Deskripsi Hasil Cuci illy</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Tipe</th>
                  <th className="p-3 text-right">Nominal Angka</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium text-slate-600 divide-y divide-slate-50">
                {hasilAnalisis.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-800">{tx.deskripsi}</td>
                    <td className="p-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">{tx.kategori}</span></td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${tx.tipe === 'pengeluaran' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {tx.tipe}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-700">Rp {tx.jumlah.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 pt-1">
            <button 
              onClick={simpanKeDatabaseUtama}
              className="flex-1 bg-linear-to-r from-cyan-600 to-blue-600 text-white font-black text-xs py-3 rounded-xl shadow-md shadow-cyan-600/10 hover:brightness-110 active:scale-[0.99] transition-all"
            >
              ✅ Data Benar, Masukkan Ke Buku SakuKampus
            </button>
            <button 
              onClick={() => setHasilAnalisis(null)}
              className="px-4 bg-white hover:bg-slate-50 border text-slate-500 font-bold text-xs py-3 rounded-xl"
            >
              Ulangi Teks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}