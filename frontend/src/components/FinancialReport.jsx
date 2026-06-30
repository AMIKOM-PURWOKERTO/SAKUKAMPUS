import React from 'react';

export default function FinancialReport({ transactions, onHapusTransaksi }) {
  
  const handleDownload = (format) => {
    alert(`Sistem sedang memproses cetak laporan keuangan dalam format .${format}\nFile "Laporan_SakuKampus_Juni_2026.${format}" siap diunduh!`);
  };

  // REVISI BARU: Fungsi pembantu untuk memicu hapus semua data secara beruntun
  const handleHapusSemua = () => {
    if (transactions.length === 0) {
      alert("Riwayat transaksi kamu memang sudah kosong kok! 😊");
      return;
    }

    if (confirm("⚠️ PERINGATAN CRITICAL!\nApakah Anda yakin ingin MENGHAPUS SEMUA RIWAYAT TRANSAKSI sekaligus?\n\nSaldo utama Anda akan otomatis dikalkulasikan kembali ke awal.")) {
      // Loop beruntun untuk menghapus semua transaksi yang ada di list saat ini
      // Kita jalankan fungsi hapus bawaan satu per satu dari data paling atas
      transactions.forEach(tx => {
        onHapusTransaksi(tx.id, tx.jumlah, tx.tipe);
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
      
      {/* Bagian Atas: Tombol Aksi Download */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Ekspor Data Finansial</h3>
          <p className="text-xs text-slate-400 mt-0.5">Unduh rekapitulasi data untuk keperluan arsip pribadi atau beasiswa.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => handleDownload('csv')}
            className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
          >
            📄 Export CSV
          </button>
          <button 
            onClick={() => handleDownload('xlsx')}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-blue-600/10"
          >
            📊 Download Excel
          </button>
        </div>
      </div>

      {/* Bagian Bawah: Tabel Riwayat Transaksi Moderen */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* REVISI TERBARU: HEADER TABEL KINI MENAMPILKAN TOMBOL HAPUS SEMUA DI KANAN */}
        <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white">
          <h4 className="font-bold text-slate-800 text-base">Riwayat Transaksi Terakhir</h4>
          
          {/* TOMBOL REVISI: HAPUS SEMUA RIWAYAT */}
          <button
            onClick={handleHapusSemua}
            className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            🗑️ Hapus Semua Riwayat
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="py-4 px-6">Tanggal</th>
                <th className="py-4 px-6">Deskripsi</th>
                <th className="py-4 px-6">Kategori</th>
                <th className="py-4 px-6 text-right">Jumlah</th>
                <th className="py-4 px-6 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-400 font-normal">{tx.tanggal}</td>
                    <td className="py-4 px-6 text-slate-800">{tx.deskripsi}</td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-600">
                        {tx.kategori}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-right font-bold ${tx.tipe === 'pemasukan' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {tx.tipe === 'pemasukan' ? '+' : '-'} Rp {tx.jumlah.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => onHapusTransaksi(tx.id, tx.jumlah, tx.tipe)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-xl text-xs border border-rose-100 transition-colors"
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 font-medium bg-slate-50/20">
                    📭 Riwayat transaksi kosong. Semua data telah dibersihkan!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}