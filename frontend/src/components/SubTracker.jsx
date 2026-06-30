import React, { useState, useEffect } from 'react';

export default function SubTracker() {
  // 1. STATE KATALOG BAWAAN ADMIN
  const [katalogApps, setKatalogApps] = useState([
    { id: 1, nama: 'Spotify Premium', harga: 55000, tgl: '15 Juni 2026', ikon: '🎵', warna: 'bg-emerald-500', aktif: false, jenis: 'katalog' },
    { id: 2, nama: 'Netflix Student', harga: 120000, tgl: '20 Juni 2026', ikon: '🍿', warna: 'bg-rose-600', aktif: false, jenis: 'katalog' },
    { id: 3, nama: 'Canva Pro Kelompok', harga: 35000, tgl: '02 Juli 2026', ikon: '🎨', warna: 'bg-indigo-500', aktif: false, jenis: 'katalog' }
  ]);

  // 2. STATE UNTUK FORM MODAL INPUT BARU
  const [showModal, setShowModal] = useState(false);
  const [inputNama, setInputNama] = useState('');
  const [inputHarga, setInputHarga] = useState('');
  const [inputTgl, setInputTgl] = useState('');
  const [inputJenis, setInputJenis] = useState('Aplikasi / Apk');

  // Load data gabungan saat pertama kali komponen dibuka
  useEffect(() => {
    const dataTersimpan = localStorage.getItem('sakukampus_subs');
    if (dataTersimpan) {
      setKatalogApps(JSON.parse(dataTersimpan));
    }
  }, []);

  // Fungsi menyimpan perubahan status ke LocalStorage & memicu update saldo di App.jsx
  const simpanDanTrigger = (dataBaru) => {
    setKatalogApps(dataBaru);
    localStorage.setItem('sakukampus_subs', JSON.stringify(dataBaru));
    window.dispatchEvent(new Event('storage_subs_changed'));
  };

  // Sakelar Aktif/Matikan untuk katalog admin maupun kustom
  const toggleLangganan = (id) => {
    const updateApps = katalogApps.map(app => {
      if (app.id === id) {
        return { ...app, aktif: !app.aktif };
      }
      return app;
    });
    simpanDanTrigger(updateApps);
  };

  // Fungsi menghapus aplikasi kustom buatan sendiri
  const hapusLanggananKustom = (id) => {
    if (confirm("Apakah Anda yakin ingin mematikan dan menghapus layanan langganan kustom ini?")) {
      const updateApps = katalogApps.filter(app => app.id !== id);
      simpanDanTrigger(updateApps);
    }
  };

  // Fungsi mengeksekusi penambahan aplikasi/website baru
  const handleTambahBaru = (e) => {
    e.preventDefault();
    if (!inputNama || !inputHarga || !inputTgl) {
      alert("Mohon lengkapi seluruh kolom spesifikasi langganan!");
      return;
    }

    // OTOMATISASI IKON ELEGAN: Memilih emoji berdasarkan Jenis Layanan tanpa merepotkan user
    let ikonOtomatis = '📱';
    if (inputJenis === 'Website Premium') ikonOtomatis = '🌐';
    else if (inputJenis === 'Kebutuhan Kuliah') ikonOtomatis = '🎓';
    else if (inputJenis === 'Hiburan / Games') ikonOtomatis = '🎮';

    const itemBaru = {
      id: Date.now(),
      nama: `${inputNama} (${inputJenis})`,
      harga: parseInt(inputHarga),
      tgl: inputTgl,
      ikon: ikonOtomatis, // Terpasang otomatis
      warna: 'bg-cyan-600',
      aktif: true,
      jenis: 'kustom'
    };

    const gabunganBaru = [...katalogApps, itemBaru];
    simpanDanTrigger(gabunganBaru);

    // Reset Form & Tutup Modal
    setInputNama('');
    setInputHarga('');
    setInputTgl('');
    setShowModal(false);
  };

  // Kalkulasi total biaya bulanan secara real-time
  const totalBebanAktif = katalogApps.reduce((total, app) => app.aktif ? total + app.harga : total, 0);
  const jumlahAplikasiAktif = katalogApps.filter(app => app.aktif).length;

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200">
      
      {/* BARIS ATAS: TOMBOL TAMBAH & FORM CARI */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Cari langganan aplikasi..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm shadow-blue-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
        >
          <span>➕</span> Tambah Langganan Baru
        </button>
      </div>

      {/* CARD TRACKER HEADER */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Total Beban Langganan / Bulan</p>
          <h2 className="text-3xl font-black mt-1 font-mono">Rp {totalBebanAktif.toLocaleString('id-ID')}</h2>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold self-start sm:self-center border border-white/10">
          ⚙️ {jumlahAplikasiAktif} Layanan Aktif
        </div>
      </div>

      {/* STRUKTUR DUA PANEL KATALOG */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Katalog Rekomendasi Aplikasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {katalogApps.map((app) => (
            <div 
              key={app.id} 
              className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                app.aktif 
                  ? 'bg-white border-blue-200 shadow-sm ring-2 ring-blue-500/10' 
                  : 'bg-slate-50/70 border-slate-200/60 opacity-75'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${app.warna} rounded-xl flex items-center justify-center text-xl text-white shadow-sm`}>
                  {app.ikon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                    {app.nama}
                    {app.aktif && <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">Aktif</span>}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Jatuh Tempo: <span className="font-semibold">{app.tgl}</span></p>
                  <p className="text-xs font-black text-blue-600 mt-1 font-mono">Rp {app.harga.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleLangganan(app.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-[0.96] ${
                    app.aktif
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100/80 border border-rose-200/50'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/10'
                  }`}
                >
                  {app.aktif ? '🔴 Matikan' : '🟢 Aktifkan'}
                </button>
                {app.jenis === 'kustom' && (
                  <button 
                    onClick={() => hapusLanggananKustom(app.id)}
                    className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-xl border border-slate-200/40 text-xs"
                    title="Hapus"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POP-UP INTERAKTIF: VERSION SANGAT SIMPEL & ELEGAN */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleTambahBaru} className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">🚀 Daftarkan Layanan Berlangganan Baru</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs">✕</button>
            </div>

            <div className="space-y-3 font-sans">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400">Jenis Layanan</label>
                <select 
                  value={inputJenis} 
                  onChange={(e) => setInputJenis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mt-1 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Aplikasi / Apk">Aplikasi / Apk 📱</option>
                  <option value="Website Premium">Website / Web Premium 🌐</option>
                  <option value="Kebutuhan Kuliah">Kebutuhan Kuliah 🎓</option>
                  <option value="Hiburan / Games">Hiburan / Games 🎮</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400">Nama Aplikasi / Website</label>
                <input 
                  type="text" 
                  value={inputNama}
                  onChange={(e) => setInputNama(e.target.value)}
                  placeholder="Contoh: Adobe Creative Cloud, Claude Pro" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mt-1 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Biaya / Bulan (Rp)</label>
                  <input 
                    type="number" 
                    value={inputHarga}
                    onChange={(e) => setInputHarga(e.target.value)}
                    placeholder="Contoh: 45000" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mt-1 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Jatuh Tempo</label>
                  <input 
                    type="text" 
                    value={inputTgl}
                    onChange={(e) => setInputTgl(e.target.value)}
                    placeholder="Contoh: 05 Agustus" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mt-1 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-blue-500/10">
                🚀 Daftarkan & Potong Saldo Beranda
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3 rounded-xl text-xs">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}