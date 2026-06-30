import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

export default function MainDashboard({ saldo, totalPengeluaran }) {
  // 1. STATE UNTUK MENGONTROL MODAL/POP-UP E-WALLET
  const [showModal, setShowModal] = useState(false);
  const canvasRef = useRef(null);
  const [step, setStep] = useState(1); // Step 1: Tanya Ya/Tidak, Step 2: Munculkan QR

  const totalAnggaranAwal = 1500000;
  const persentaseSisa = Math.max(0, Math.min(100, Math.round((saldo / totalAnggaranAwal) * 100)));

  // Fungsi menutup modal dan reset state ke awal
  const handleCloseModal = () => {
    setShowModal(false);
    setStep(1);
  };

  // Generate QR Code ketika step 2 ditampilkan
  useEffect(() => {
    if (step === 2 && canvasRef.current) {
      // QR Code untuk QRIS payment
      const qrisData = '00020126360014ID.CO.BRI.WWW0119240085280812345670215406251435802170303UME5204291153033605802IDd62200610A0000000051000800072d050000570374436105802IDdEF041511085280812345678D000D0000000000000000000000000FFF20520000000000000000000000000000F6031E060D20200815123456780D20200815123456780D2020081512345678FFF630f081c82b0c1a09d8f0e6b2c5a3d7e4f';
      
      QRCode.toCanvas(canvasRef.current, qrisData, {
        width: 150,
        margin: 1,
        color: {
          dark: '#1e293b',
          light: '#f8fafc',
        },
      }).catch((err) => console.error('Error generating QR Code:', err));
    }
  }, [step, showModal]);

  return (
    <div className="space-y-6 relative">
      
      {/* Banner Kondisi Keuangan */}
      <div className="bg-amber-500 p-5 rounded-2xl text-white shadow-sm flex justify-between items-center">
        <div>
          <h4 className="font-bold text-lg">Kondisi Keuangan: Perlu Perhatian / Evaluasi</h4>
          <p className="text-sm opacity-90 mt-1">Sisa saldo Anda adalah {persentaseSisa}% dari total anggaran bulan ini.</p>
        </div>
        <div className="w-1/3 bg-white/20 h-3 rounded-full overflow-hidden">
          <div className="bg-white h-full transition-all duration-500" style={{ width: `${persentaseSisa}%` }}></div>
        </div>
      </div>

      {/* Grid 3 Kotak Utama Atas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KOTAK 1: SISA UANG + TOOLS TOP UP (ALA E-WALLET) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sisa Uang Bulan Ini</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">Rp {saldo.toLocaleString('id-ID')}</h3>
            <p className="text-xs text-slate-400 mt-1">Dari total Rp 1.500.000</p>
          </div>
          
          {/* TOMBOL ISI SALDO BARU */}
          <button 
            onClick={() => setShowModal(true)}
            className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-blue-200"
          >
            ➕ Isi Saldo / Top Up
          </button>
        </div>

        {/* KOTAK 2: PENGELUARAN MINGGU INI */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pengeluaran Minggu Ini</p>
          <h3 className="text-2xl font-black text-slate-800 mt-2">Rp {totalPengeluaran.toLocaleString('id-ID')}</h3>
          <p className="text-xs text-blue-500 font-medium mt-1">▲ Transaksi Real-time Aktif</p>
        </div>

        {/* KOTAK 3: PREDIKSI UANG HABIS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prediksi Uang Habis</p>
          <h3 className="text-2xl font-black text-rose-600 mt-2">22 Juni 2026</h3>
          <p className="text-xs text-slate-400 mt-1">Berdasarkan rata-rata belanja 7 hari terakhir.</p>
        </div>

      </div>

      {/* Bagian Bawah: Analisis Tulisan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-4">Analisis Nilai Pengeluaran</h4>
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-900 leading-relaxed">
            "Akumulasi pengeluaran Anda pada kategori 'Hiburan/Kopi' minggu ini telah terpantau sistem. Tetap batasi jajan harian agar target tabungan kuliah akhir semestermu aman!"
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h4 className="font-bold text-slate-800">Subscription & Tagihan Bulanan</h4>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl text-sm">
            <span>🎵 Spotify Premium</span>
            <span className="font-bold text-slate-700">Rp 55.000</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl text-sm">
            <span>🏠 Tagihan Kosan</span>
            <span className="font-bold text-slate-700">Rp 800.000</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SYSTEM MODAL INTERAKTIF TOP UP E-WALLET (POP-UP)                          */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
            
            {step === 1 ? (
              // STEP 1: PERTANYAAN AWAL
              <>
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">💳</div>
                <h3 className="font-black text-slate-800 text-lg">Top Up Dompet Digital</h3>
                <p className="text-sm text-slate-500 mt-2">Apakah Anda ingin menambah saldo SakuKampus saat ini?</p>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button 
                    onClick={handleCloseModal}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-sm transition-all"
                  >
                    Tidak
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-600/20"
                  >
                    Ya, Ingin
                  </button>
                </div>
              </>
            ) : (
              // STEP 2: TAMPILKAN NOMOR REKENING & KODE QR SIMULASI
              <>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Metode Instant</span>
                  <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
                </div>
                
                <h4 className="font-bold text-slate-800 text-sm text-left mb-1">Pilihan 1: Virtual Account</h4>
                <div className="bg-slate-50 p-3 rounded-xl text-left border border-slate-100 mb-4">
                  <p className="text-xs text-slate-400 font-medium">No. Rekening Permata (SakuKampus)</p>
                  <p className="text-base font-black text-slate-800 tracking-wider mt-0.5 select-all">8528 0812 3456 7890</p>
                </div>

                <h4 className="font-bold text-slate-800 text-sm text-left mb-2">Pilihan 2: Scan QRIS</h4>
                {/* KODE QR ASLI MENGGUNAKAN LIBRARY QRCODE */}
                <div className="w-36 h-36 bg-white mx-auto rounded-xl p-3 border-2 border-slate-200 flex items-center justify-center shadow-md relative mb-2">
                  <canvas
                    ref={canvasRef}
                    className="rounded-lg"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium mb-5">Berlaku untuk semua e-wallet & m-banking</p>

                <button 
                  onClick={handleCloseModal}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition-all"
                >
                  Selesai / Tutup
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}