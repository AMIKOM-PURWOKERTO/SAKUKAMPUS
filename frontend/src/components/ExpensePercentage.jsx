import React from 'react';

export default function ExpensePercentage({ transactions }) {
  
  // 1. BUAT WADAH REKAPITULASI DENGAN NOMINAL AWAL 0 RUPIAH
  const rekapKategori = {
    '🍔 Makanan & Jajan': { nominal: 0, color: 'bg-amber-500' },
    '🏠 Kosan & Token Listrik': { nominal: 0, color: 'bg-blue-500' },
    '📚 Kebutuhan Kuliah / Buku': { nominal: 0, color: 'bg-violet-500' },
    '☕ Hiburan & Kopi': { nominal: 0, color: 'bg-rose-500' },
    '🚌 Transportasi / Bensin': { nominal: 0, color: 'bg-emerald-500' },
  };

  // 2. HITUNG TOTAL BIYAYA PER KATEGORI DARI DAFTAR TRANSAKSI YANG AKTIF
  let totalUangKeluar = 0;
  
  transactions.forEach(tx => {
    if (tx.tipe === 'pengeluaran' && rekapKategori[tx.kategori]) {
      rekapKategori[tx.kategori].nominal += tx.jumlah;
      totalUangKeluar += tx.jumlah;
    }
  });

  // 3. GENERATE ARRAY BARU YANG SUDAH TERHITUNG PERSENTASENYA SECARA MATEMATIS
  const dataPersentase = Object.keys(rekapKategori).map(key => {
    const nominal = rekapKategori[key].nominal;
    // Rumus persentase: jika total uang keluar masih 0, maka persennya 0.
    const persen = totalUangKeluar > 0 ? Math.round((nominal / totalUangKeluar) * 100) : 0;
    
    return {
      kategori: key,
      nominal: nominal,
      persen: persen,
      color: rekapKategori[key].color
    };
  });

  // Urutkan dari persentase terbesar ke terkecil
  dataPersentase.sort((a, b) => b.persen - a.persen);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-3xl animate-in fade-in duration-200 space-y-6">
      <div>
        <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">📊 Rasio Aliran Dana Terbesar</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Sistem pembagi dinamis aktif. Riwayat transaksi saat ini: <span className="font-bold text-slate-700">{transactions.filter(t => t.tipe === 'pengeluaran').length} item pengeluaran</span> dengan total akumulasi dana <span className="font-bold text-blue-600">Rp {totalUangKeluar.toLocaleString('id-ID')}</span>.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {dataPersentase.map((item, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span className="text-slate-700">{item.kategori}</span>
              <span className="text-slate-900 font-extrabold">Rp {item.nominal.toLocaleString('id-ID')} ({item.persen}%)</span>
            </div>
            
            {/* PROGRESS BAR DINAMIS: AKAN BERGERAK MAJU KETIKA DIINPUT */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out`} 
                style={{ width: `${item.persen}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed font-medium">
        {totalUangKeluar > 0 ? (
          <span>💡 **Insight Real-time**: Sektor jajan terbesarmu saat ini dikuasai oleh **{dataPersentase[0].kategori}** dengan sumbangsih sebesar **{dataPersentase[0].persen}%** dari seluruh total pengeluaran tokomu.</span>
        ) : (
          <span>📌 **Sistem Siap**: Belum ada data pengeluaran yang terekam. Silakan masuk ke menu **Catat Pengeluaran** untuk menggerakkan grafik rasio aliran dana di atas dari 0%.</span>
        )}
      </div>
    </div>
  );
}