import React, { useState } from 'react';

export default function ExpenseForm({ onTambahTransaksi }) {
  const [deskripsi, setDeskripsi] = useState('');
  const [jumlahDisplay, setJumlahDisplay] = useState(''); 
  const [kategori, setKategori] = useState('🍔 Makanan & Jajan');

  const handleFormatRupiah = (e) => {
    const nilaiMentah = e.target.value.replace(/\D/g, ''); 
    if (nilaiMentah === '') {
      setJumlahDisplay('');
      return;
    }
    setJumlahDisplay(parseInt(nilaiMentah).toLocaleString('id-ID'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const angkaAsli = jumlahDisplay.replace(/\./g, '');

    if (!deskripsi || !angkaAsli) {
      alert("Tolong isi semua kolom formulir transaksi!");
      return;
    }

    // KIRIM DETAIL LENGKAP KE ENGINE PUSAT DI APP.JSX
    onTambahTransaksi(angkaAsli, 'pengeluaran', deskripsi, kategori);

    if (parseInt(angkaAsli) > 50000) {
      alert(`⚠️ Dompet Menipis!\nKamu mencatat pengeluaran besar senilai Rp ${parseInt(angkaAsli).toLocaleString('id-ID')}. Sisa saldomu otomatis berkurang!`);
    } else {
      alert("✅ Transaksi pengeluaran berhasil dicatat ke sistem!");
    }

    setDeskripsi('');
    setJumlahDisplay('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-xl animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jenis Transaksi</label>
          <div className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-rose-50 border border-rose-200 text-rose-600 flex items-center gap-2 select-none">
            💸 Uang Keluar (Mengurangi Saldo Utama)
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Transaksi / Deskripsi</label>
          <input 
            type="text" 
            placeholder="Contoh: Nasi Padang, Fotocopy Materi, Patungan Kas Kosan"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:outline-blue-500 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nominal Uang (Rupiah)</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-sm font-bold text-slate-400 select-none">Rp</span>
            <input 
              type="text" 
              placeholder="Masukkan angka, sistem otomatis memberi titik (e.g. 50.000)"
              value={jumlahDisplay}
              onChange={handleFormatRupiah}
              className="w-full bg-slate-50 border border-slate-200 p-3 pl-11 rounded-xl text-sm font-bold text-slate-800 focus:outline-blue-500 tracking-wide"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kategori Pengeluaran</label>
          <select 
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:outline-blue-500 font-medium text-slate-700"
          >
            <option>🍔 Makanan & Jajan</option>
            <option>🏠 Kosan & Token Listrik</option>
            <option>📚 Kebutuhan Kuliah / Buku</option>
            <option>☕ Hiburan & Kopi</option>
            <option>🚌 Transportasi / Bensin</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all active:scale-[0.99] mt-2">
          Simpan Transaksi Finansial 🚀
        </button>
      </form>
    </div>
  );
}