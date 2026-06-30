import React from 'react';

export default function Sidebar({ activeMenu, setActiveMenu, onLogout }) {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none">

      <div>
        {/* Logo Aplikasi */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md">
            <img
              src="https://uangsaku.smkn1bawang.sch.id/assets/img/app/logo/logo_300.png"
              alt="Logo"
              className="h-6 w-6 object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-white tracking-wide">SakuKampus</h2>
            <p className="text-xs text-slate-500 font-medium">v1.0 Proyek Full-Stack</p>
          </div>
        </div>

        {/* Menu Navigasi Interaktif dengan Fungsi Klik Terhubung */}
        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-4 px-4 py-3 font-semibold rounded-xl transition-all duration-200 text-left ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <span>🏠</span> Beranda / Dashboard
          </button>

          <button
            onClick={() => setActiveMenu('catat')}
            className={`w-full flex items-center gap-4 px-4 py-3 font-semibold rounded-xl transition-all duration-200 text-left ${activeMenu === 'catat' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <span>💸</span> Catat Pengeluaran
          </button>

          <button
            onClick={() => setActiveMenu('tracker')}
            className={`w-full flex items-center gap-4 px-4 py-3 font-semibold rounded-xl transition-all duration-200 text-left ${activeMenu === 'tracker' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <span>📅</span> Subscription Tracker
          </button>

          <button
            onClick={() => setActiveMenu('laporan')}
            className={`w-full flex items-center gap-4 px-4 py-3 font-semibold rounded-xl transition-all duration-200 text-left ${activeMenu === 'laporan' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <span>📊</span> Laporan Keuangan
          </button>
        </nav>
      </div>

      {/* Bagian Profil & Tombol Keluar */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center font-bold text-white text-sm border border-slate-600">
            M
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">Mahasiswa Kece</p>
            <p className="text-xs text-slate-500 truncate">mahasiswa@kampus.id</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm border border-slate-700/50"
        >
          🚪 Keluar / Logout
        </button>
      </div>

    </div>
  );
}