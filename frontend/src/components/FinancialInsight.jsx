import React, { useState } from 'react';

export default function FinancialInsight() {
  // State untuk mengganti periode tren pengeluaran (Hari / Minggu) sesuai request kamu
  const [periode, setPeriode] = useState('minggu');

  // DATA REKAP PERSENTASE PENGELUARAN (Poin 1)
  const dataPersentase = [
    { kategori: '🍔 Makanan & Jajan', nominal: 675000, persen: 45, color: 'bg-amber-500' },
    { kategori: '🏠 Kosan & Token Listrik', nominal: 350000, persen: 23, color: 'bg-blue-500' },
    { kategori: '📚 Kebutuhan Kuliah / Buku', nominal: 225000, persen: 15, color: 'bg-violet-500' },
    { kategori: '☕ Hiburan & Kopi', nominal: 150000, persen: 10, color: 'bg-rose-500' },
    { kategori: '🚌 Transportasi / Bensin', nominal: 100000, persen: 7, color: 'bg-emerald-500' },
  ];

  // DATA SIMULASI TREN HARI vs MINGGU (Poin 2)
  const dataTren = {
    hari: [
      { label: 'Senin', jumlah: 'Rp 35.000' },
      { label: 'Selasa', jumlah: 'Rp 15.000' },
      { label: 'Rabu', jumlah: 'Rp 120.000' },
      { label: 'Kamis', jumlah: 'Rp 45.000' },
      { label: 'Jumat', jumlah: 'Rp 60.000' },
      { label: 'Sabtu', jumlah: 'Rp 150.000' },
      { label: 'Minggu', jumlah: 'Rp 80.000' },
    ],
    minggu: [
      { label: 'Minggu ke-1', jumlah: 'Rp 320.000' },
      { label: 'Minggu ke-2', jumlah: 'Rp 450.000' },
      { label: 'Minggu ke-3', jumlah: 'Rp 210.000' },
      { label: 'Minggu ke-4', jumlah: 'Rp 510.000' },
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl animate-in fade-in duration-200">
      
      {/* 📊 COLLUMN 1: PERSENTASE PENGELUARAN TERBESAR (POIN 1) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-base">📊 Persentase Pengeluaran Terbesar</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manfaat: Memantau ke mana aliran dana bulananmu paling banyak bergulir.</p>
        </div>

        <div className="space-y-3.5 pt-2">
          {dataPersentase.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>{item.kategori}</span>
                <span className="text-slate-800">Rp {item.nominal.toLocaleString('id-ID')} ({item.persen}%)</span>
              </div>
              {/* Progress Bar Dinamis */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${item.persen}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⚠️ COLLUMN 2: KATEGORI TERBOROS (POIN 3) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-slate-800 text-base">🚨 Detektor Kategori Terboros</h3>
          <p className="text-xs text-slate-400 mt-0.5">Sistem membandingkan grafik rasio konsumsi bulanan.</p>
        </div>

        {/* Kotak Warning Boros Sesuai Request */}
        <div className="my-4 bg-rose-50 border border-rose-100 p-5 rounded-2xl text-center space-y-2">
          <span className="text-3xl">⚠️</span>
          <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider">Kategori Terboros</h4>
          <h2 className="text-xl font-black text-rose-700">Makanan & Jajan</h2>
          <p className="text-base font-black text-slate-800">Rp 675.000</p>
          <p className="text-xs font-bold text-rose-600 bg-rose-100/50 inline-block px-2 py-0.5 rounded-md">(+22% dari bulan lalu)</p>
        </div>

        <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed">
          💡 Tips: Kurangi order makanan online di jam malam kuliah agar grafik ini turun di bulan depan!
        </p>
      </div>

      {/* 📈 COLLUMN 3: TREN PENGELUARAN INTERAKTIF (POIN 2) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-full space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">📈 Tren Aliran Dana Berkala</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manfaat: Melihat ritme kestabilan pengeluaran finansialmu.</p>
          </div>
          
          {/* Switch Button Periode */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start sm:self-center">
            <button 
              onClick={() => setPeriode('hari')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${periode === 'hari' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              7 Hari Terakhir
            </button>
            <button 
              onClick={() => setPeriode('minggu')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${periode === 'minggu' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Bulan Ini (Per Minggu)
            </button>
          </div>
        </div>

        {/* List Tampilan Tren */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 pt-2">
          {(periode === 'hari' ? dataTren.hari : dataTren.minggu).map((item, index) => (
            <div key={index} className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center shadow-inner">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-xs font-black text-slate-700 mt-1">{item.jumlah}</p>
            </div>
          ))}
        </div>

        {/* Insight Teks Bawah Sesuai Request */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row gap-4 justify-around text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-100/60 w-full sm:w-auto justify-center">
            <span>⬆️</span> Pengeluaran naik 18% dibanding minggu lalu
          </div>
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100/60 w-full sm:w-auto justify-center">
            <span>⬇️</span> Pengeluaran turun 12% dibanding minggu lalu
          </div>
        </div>

      </div>

    </div>
  );
}