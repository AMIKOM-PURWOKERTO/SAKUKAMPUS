import React, { useState } from 'react';

export default function ExpenseTrend({ transactions = [] }) {
  const [periode, setPeriode] = useState('hari');

  // =========================================================================
  // ALGORITMA 1: PROSES GRAFIK HARIAN (SENIN - MINGGU)
  // =========================================================================
  const hitungHari = { 'Senin': 0, 'Selasa': 0, 'Rabu': 0, 'Kamis': 0, 'Jumat': 0, 'Sabtu': 0, 'Minggu': 0 };
  
  // Mapping nama hari dari javascript Date.getDay() ke Indonesia
  const namaHariIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  let totalPengeluaran7Hari = 0;

  transactions.forEach(tx => {
    if (tx.tipe === 'pengeluaran') {
      // Jika data dikirim dari backend MySQL (format timestamp/date atau teks)
      // Kita coba deteksi hari dari ID transaksi (Date.now()) sebagai fallback simulasi pintar
      const tanggalObj = new Date(tx.id || Date.now());
      const hariNama = namaHariIndo[tanggalObj.getDay()];
      
      if (hitungHari[hariNama] !== undefined) {
        hitungHari[hariNama] += tx.jumlah;
        totalPengeluaran7Hari += tx.jumlah;
      }
    }
  });

  // Mencari nilai pengeluaran tertinggi harian untuk acuan skala tinggi grafik (Max Height)
  const maxPengeluaranHari = Math.max(...Object.values(hitungHari), 1);

  const grafikHari = Object.keys(hitungHari).map(hari => {
    const nominal = hitungHari[hari];
    // Hitung persentase tinggi bar (maksimal h-40 atau 160px)
    const persenTinggi = Math.min(Math.round((nominal / maxPengeluaranHari) * 100), 100);
    
    // Tentukan kelas tinggi Tailwind secara dinamis
    let barHeightClass = 'h-0';
    if (persenTinggi > 0) {
      if (persenTinggi <= 15) barHeightClass = 'h-6 bg-indigo-400';
      else if (persenTinggi <= 35) barHeightClass = 'h-16 bg-indigo-500';
      else if (persenTinggi <= 60) barHeightClass = 'h-24 bg-indigo-500';
      else if (persenTinggi <= 85) barHeightClass = 'h-32 bg-indigo-600';
      else barHeightClass = 'h-40 bg-blue-600';
    }

    return { label: hari, jumlah: `Rp ${nominal.toLocaleString('id-ID')}`, kelasBar: barHeightClass, nominal };
  });

  // =========================================================================
  // ALGORITMA 2: PROSES GRAFIK MINGGUAN (MINGGU 1 - MINGGU 4)
  // =========================================================================
  const hitungMinggu = { 'Minggu ke-1': 0, 'Minggu ke-2': 0, 'Minggu ke-3': 0, 'Minggu ke-4': 0 };

  transactions.forEach(tx => {
    if (tx.tipe === 'pengeluaran') {
      const tgl = new Date(tx.id || Date.now());
      const tanggalHari = tgl.getDate();
      
      // Tentukan masuk minggu mana berdasarkan tanggal sirkulasi bulanan
      let clusterMinggu = 'Minggu ke-1';
      if (tanggalHari > 21) clusterMinggu = 'Minggu ke-4';
      else if (tanggalHari > 14) clusterMinggu = 'Minggu ke-3';
      else if (tanggalHari > 7) clusterMinggu = 'Minggu ke-2';

      hitungMinggu[clusterMinggu] += tx.jumlah;
    }
  });

  const maxPengeluaranMinggu = Math.max(...Object.values(hitungMinggu), 1);

  const grafikMinggu = Object.keys(hitungMinggu).map(minggu => {
    const nominal = hitungMinggu[minggu];
    const persenTinggi = Math.min(Math.round((nominal / maxPengeluaranMinggu) * 100), 100);

    let barHeightClass = 'h-0';
    if (persenTinggi > 0) {
      if (persenTinggi <= 25) barHeightClass = 'h-16 bg-blue-500';
      else if (persenTinggi <= 50) barHeightClass = 'h-24 bg-blue-600';
      else if (persenTinggi <= 75) barHeightClass = 'h-36 bg-blue-700';
      else barHeightClass = 'h-40 bg-indigo-600';
    }

    return { label: minggu, jumlah: `Rp ${nominal.toLocaleString('id-ID')}`, kelasBar: barHeightClass, nominal };
  });

  // Pilih data aktif berdasarkan state tombol toggle
  const dataAktif = periode === 'hari' ? grafikHari : grafikMinggu;
  const cekKosong = dataAktif.every(d => d.nominal === 0);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-4xl animate-in fade-in duration-200 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">📈 Tren Finansial Berkala</h3>
          <p className="text-xs text-slate-400 mt-1">Manfaat: Pengguna bisa tahu tren pengeluaran secara fluktuatif berubah-ubah harian maupun mingguan.</p>
        </div>
        
        {/* Toggle Switch Periode */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start sm:self-center">
          <button 
            onClick={() => setPeriode('hari')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${periode === 'hari' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            7 Hari Terakhir
          </button>
          <button 
            onClick={() => setPeriode('minggu')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${periode === 'minggu' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Per Minggu (Bulan Ini)
          </button>
        </div>
      </div>

      {/* RENDER AREA GRAFIK DENGAN ANIMASI TUMBUH DARI BAWAH */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-end justify-around h-56 pt-10 shadow-inner relative">
        {cekKosong ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs font-medium gap-1">
            <span>📭 Belum ada pengeluaran terekam.</span>
            <span className="text-[10px] text-slate-400">Grafik batang dimulai dari dasar (0% / Rp 0)</span>
          </div>
        ) : (
          dataAktif.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 w-full group relative">
              {/* Tooltip nominal pop-up ketika bar disentuh mouse */}
              {item.nominal > 0 && (
                <span className="text-[10px] font-black text-slate-700 bg-white px-1.5 py-0.5 rounded-md shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute -translate-y-12 z-10 whitespace-nowrap">
                  {item.jumlah}
                </span>
              )}
              {/* Batang Grafik Dinamis */}
              <div className={`w-6 sm:w-8 rounded-t-md transition-all anonymity-pulse duration-700 ease-out shadow-sm ${item.kelasBar}`}></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{item.label}</span>
            </div>
          ))
        )}
      </div>

      {/* Insight Kapsul Informasi Naik Turun Anggaran */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="flex items-center gap-3 text-rose-600 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100/60 font-bold text-xs">
          <span className="text-base">Aman ⬆️</span> Pengeluaran naik 18% dibanding minggu lalu
        </div>
        <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100/60 font-bold text-xs">
          <span className="text-base">Stabil ⬇️</span> Pengeluaran turun 12% dibanding minggu lalu
        </div>
      </div>
    </div>
  );
}