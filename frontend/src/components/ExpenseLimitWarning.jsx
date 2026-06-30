import React, { useState } from 'react';

export default function ExpenseLimitWarning({ transactions }) {
  // SIMULASI STATE: Mengontrol siklus hari (1, 2, atau 3 hari sekali)
  const [hariSiklus, setHariSiklus] = useState(1);

  // 1. HITUNG DATA AGREGASI BERDASARKAN TRANSAKSI YANG DIINPUT USER
  const rekapKategori = {};
  let totalUangKeluar = 0;

  transactions.forEach(tx => {
    if (tx.tipe === 'pengeluaran') {
      rekapKategori[tx.kategori] = (rekapKategori[tx.kategori] || 0) + tx.jumlah;
      totalUangKeluar += tx.jumlah;
    }
  });

  // Cari nama kategori yang nominal pengeluarannya paling tinggi (Max Value)
  let kategoriTerborosSaatIni = '';
  let nominalTerborosSaatIni = 0;

  Object.keys(rekapKategori).forEach(key => {
    if (rekapKategori[key] > nominalTerborosSaatIni) {
      nominalTerborosSaatIni = rekapKategori[key];
      kategoriTerborosSaatIni = key;
    }
  });

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-2xl animate-in fade-in duration-200 space-y-6">
      
      {/* Bagian Judul Atas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-4">
        <div>
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">🚨 Detektor Kategori Terboros (Siklus 3 Hari)</h3>
          <p className="text-xs text-slate-400 mt-1">
            Manfaat: Mengetahui kategori terboros yang dihitung berkala setiap 3 hari sekali agar tidak menimbulkan kepanikan harian pada pengguna.
          </p>
        </div>

        {/* CONTROLLER SIMULASI HARI KHUSUS DEMO DOSEN */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 shrink-0">
          {[1, 2, 3].map((hari) => (
            <button
              key={hari}
              type="button"
              onClick={() => setHariSiklus(hari)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${hariSiklus === hari ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Hari {hari}
            </button>
          ))}
        </div>
      </div>

      {/* CONDITIONAL RENDERING ALGORITMA (SESUAI REQUEST KAMU) */}
      {transactions.length === 0 ? (
        // KONDISI A: BARU LOGIN / BELUM ADA TRANSAKSI (OTOMATIS KOSONG)
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
          <span className="text-3xl">🔑</span>
          <h4 className="text-sm font-bold text-slate-700">Status Awal Login Terdeteksi</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Sistem detektor terboros masih **Kosong**. Silakan isi catatan pengeluaran harianmu terlebih dahulu agar algoritma pintar pembaca riwayat kami mulai bekerja.
          </p>
        </div>
      ) : hariSiklus < 3 ? (
        // KONDISI B: SUDAH INPUT TAPI BELUM JATUH TEMPO SIKLUS 3 HARI
        <div className="p-8 border border-amber-100 rounded-2xl text-center space-y-3 bg-amber-50/30">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-sm font-bold animate-pulse">
            ⏳
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest">Kalkulasi Ditangguhkan (Hari ke-{hariSiklus})</h4>
            <h2 className="text-base font-bold text-slate-700 mt-1">Sistem Sedang Mengumpulkan Data Riwayat</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Tenang, data belanjaanmu aman! Detektor terboros sengaja disembunyikan dan baru akan dikalkulasi otomatis pada **Hari ke-3** demi menjaga kenyamanan psikologis finansialmu.
          </p>
        </div>
      ) : (
        // KONDISI C: SUDAH HARI KE-3 & DATA OTOMATIS TERHITUNG MAKSIMAL BOROSNYA
        <div className="space-y-5 animate-in zoom-in-95 duration-150">
          <div className="bg-linear-to-b from-rose-50 to-rose-100/30 border border-rose-200/60 p-6 rounded-2xl text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <div>
              <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Kategori Terboros (Laporan 3 Harian)</h4>
              <h2 className="text-xl font-black text-slate-800 mt-1">{kategoriTerborosSaatIni || "Belum Terdeteksi"}</h2>
            </div>
            <div className="py-2">
              <p className="text-2xl font-black text-rose-700 tracking-wide">Rp {nominalTerborosSaatIni.toLocaleString('id-ID')}</p>
              <span className="text-[10px] font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md inline-block mt-1">
                (Hasil Evaluasi Siklus Transaksi Terkini)
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-500 leading-relaxed">
            📌 **Rekomendasi Tindakan Sistem**: Berdasarkan komparasi data 3 hari ini, pengeluaranmu didominasi oleh **{kategoriTerborosSaatIni}**. Jaga konsistensi belanja di sisa minggu ini agar anggaran kosanmu tetap aman!
          </div>
        </div>
      )}

    </div>
  );
}