import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import MainDashboard from './components/MainDashboard';
import ExpenseForm from './components/ExpenseForm';
import SubTracker from './components/SubTracker';
import FinancialReport from './components/FinancialReport';
import ExpensePercentage from './components/ExpensePercentage';
import ExpenseTrend from './components/ExpenseTrend';
import ExpenseLimitWarning from './components/ExpenseLimitWarning';
import AiSmartInput from './components/AiSmartInput'; 

// URL KE PORT BACKEND CLOUDFLARE WORKER
// Gunakan worker production jika diakses dari Cloudflare Pages, atau localhost jika jalan di komputer lokal
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:8787/api'
  : 'https://backend-cloudflare.septiyanwilly14.workers.dev/api'; // Nama ini default dari Cloudflare, bisa diubah sesuai nama deploy Anda

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // STATE FINANSIAL UTAMA
  const [saldo, setSaldo] = useState(1500000); 
  const [totalPengeluaran, setTotalPengeluaran] = useState(0); 
  const [transactions, setTransactions] = useState([]);

  // STATE DATA PROFIL
  const [userProfile, setUserProfile] = useState({
    nama: 'Loading...',
    email: 'Loading...',
    noHp: '-',
    tanggalLahir: '-',
    jenisKelamin: 'Laki-laki',
    userId: '-',
    saldo_utama: 1500000
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false); // State pelacak modal isi saldo/top up
  const profileQrCanvasRef = useRef(null);

  const muatDataDariDatabase = async () => {
    try {
      // 1. Ambil Data Pengguna Terkini dari MySQL
      const responUser = await fetch(`${API_URL}/user`);
      let saldoDatabaseAsli = 1500000;
      if (responUser.ok) {
        const dataUser = await responUser.json();
        if (dataUser) {
          saldoDatabaseAsli = parseFloat(dataUser.saldo_utama) || 0;
          setUserProfile({
            nama: dataUser.nama_lengkap || 'User',
            email: dataUser.email || '-',
            noHp: dataUser.nomor_hp || '-',
            tanggalLahir: dataUser.tanggal_lahir || '-',
            jenisKelamin: dataUser.jenis_kelamin || 'Laki-laki',
            userId: dataUser.user_id_unik || '-',
            saldo_utama: saldoDatabaseAsli
          });
        }
      }

      // 2. Ambil Data Transaksi dari MySQL
      let kalkulasiPengeluaran = 0;
      const responTx = await fetch(`${API_URL}/transaksi`);
      if (responTx.ok) {
        const dataTx = await responTx.json();
        
        const dataDiformat = dataTx.map(tx => {
          const tglObj = new Date(tx.tanggal);
          const tglLokal = !isNaN(tglObj) 
            ? tglObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
            : tx.tanggal;

          return {
            ...tx,
            tanggal: tglLokal
          };
        });

        setTransactions(dataDiformat);

        dataTx.forEach(tx => {
          const nominalMurni = parseInt(tx.jumlah) || 0;
          if (tx.tipe === 'pengeluaran') {
            kalkulasiPengeluaran += nominalMurni;
          }
        });
        setTotalPengeluaran(kalkulasiPengeluaran);
      }

      // DOSEN MODE: Mengunci saldo langsung ke data field tabel users asli MySQL
      setSaldo(saldoDatabaseAsli);

    } catch (error) {
      console.error("❌ Gagal sinkronisasi data dengan server database:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await muatDataDariDatabase();
    };
    init();
  }, []);

  // Listener otomatis agar beranda langsung update ketika tombol aktifkan ditekan di SubTracker
  useEffect(() => {
    window.addEventListener('storage_subs_changed', muatDataDariDatabase);
    return () => window.removeEventListener('storage_subs_changed', muatDataDariDatabase);
  }, [transactions]);

  const handleTambahTransaksi = async (jumlah, tipe, deskripsi, kategori) => {
    const nominal = parseInt(jumlah) || 0;
    
    const hariIni = new Date();
    const tahun = hariIni.getFullYear();
    const bulan = String(hariIni.getMonth() + 1).padStart(2, '0'); 
    const tanggalMurni = String(hariIni.getDate()).padStart(2, '0');
    const tanggalFormatted = `${tahun}-${bulan}-${tanggalMurni}`; 

    const dataPayload = {
      tanggal: tanggalFormatted,
      deskripsi: deskripsi,
      kategori: kategori,
      jumlah: nominal,
      tipe: tipe
    };

    try {
      const respon = await fetch(`${API_URL}/transaksi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload)
      });
      if (respon.ok) {
        muatDataDariDatabase();
      } else {
        const errorText = await respon.text();
        console.error("❌ Server menolak menyimpan:", errorText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("❌ Gagal menyimpan transaksi ke database server!");
    }
  };

  // FUNGSI SIMULASI DUMMY AI UNTUK MEMASUKKAN BANYAK DATA SEKALIGUS
  const handleTambahBanyakTransaksiAI = (arrayTransaksi) => {
    const hariIni = new Date();
    const tahun = hariIni.getFullYear();
    const bulan = String(hariIni.getMonth() + 1).padStart(2, '0');
    const tanggalMurni = String(hariIni.getDate()).padStart(2, '0');
    const tanggalFormatted = `${tahun}-${bulan}-${tanggalMurni}`;

    const dataBaruDiformat = arrayTransaksi.map((tx, index) => ({
      id: Date.now() + index,
      tanggal: tanggalFormatted,
      deskripsi: tx.deskripsi,
      kategori: tx.kategori,
      jumlah: parseInt(tx.jumlah) || 0,
      tipe: tx.tipe
    }));

    const updateTx = [...dataBaruDiformat, ...transactions];
    setTransactions(updateTx);

    let kalkulasiPengeluaran = 0;
    updateTx.forEach(tx => {
      const nominal = parseInt(tx.jumlah) || 0;
      if (tx.tipe === 'pengeluaran') kalkulasiPengeluaran += nominal;
    });
    setTotalPengeluaran(kalkulasiPengeluaran);
  };

  const handleHapusTransaksi = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan riwayat transaksi ini?")) {
      try {
        const respon = await fetch(`${API_URL}/transaksi/${id}`, { method: 'DELETE' });
        if (respon.ok) {
          muatDataDariDatabase();
          alert("🗑️ Riwayat transaksi berhasil dihapus dari tabel MySQL!");
        }
      } catch (error) {
        console.error("Delete error:", error);
        setTransactions(transactions.filter(t => t.id_transaksi !== id));
      }
    }
  };

  // Generate Digital ID QR Code dengan user ID
  useEffect(() => {
    if (showProfileModal && profileQrCanvasRef.current && userProfile.userId && userProfile.userId !== '-') {
      // Encode user ID ke dalam QR Code
      const qrData = `SakuKampus|UserID:${userProfile.userId}|Email:${userProfile.email}|Name:${userProfile.nama}`;
      
      QRCode.toCanvas(profileQrCanvasRef.current, qrData, {
        width: 96,
        margin: 1,
        color: {
          dark: '#1e293b',
          light: '#ffffff',
        },
      }).catch((err) => console.error('Error generating Digital ID QR Code:', err));
    }
  }, [showProfileModal, userProfile.userId, userProfile.email, userProfile.nama]);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <div className="p-12 text-center text-slate-800 font-sans">Halaman Login Simulasi</div>;

  const dapatkanInisialUser = () => {
    if (userProfile && userProfile.nama && userProfile.nama !== 'Loading...') {
      return userProfile.nama.charAt(0).toUpperCase();
    }
    return '👤';
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      
      {/* SIDEBAR NAVIGATION (KIRI) */}
      <div className="w-64 min-h-screen bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold">💰</span>
            </div>
            <div>
              <h2 className="font-bold text-white tracking-wide">SakuKampus</h2>
              <p className="text-xs text-slate-500 font-medium">v1.0 Proyek Full-Stack</p>
            </div>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Menu Utama</p>
            <button onClick={() => setActiveMenu('dashboard')} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-left transition-colors ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'}`}>🏠 Beranda / Dashboard</button>
            <button onClick={() => setActiveMenu('catat')} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-left transition-colors ${activeMenu === 'catat' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'}`}>💸 Catat Pengeluaran</button>
            <button onClick={() => setActiveMenu('tracker')} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-left transition-colors ${activeMenu === 'tracker' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'}`}>📅 Subscription Tracker</button>
            <button onClick={() => setActiveMenu('laporan')} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-left transition-colors ${activeMenu === 'laporan' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'}`}>📊 Laporan Keuangan</button>
            
            <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analisis Data</p>
            <button onClick={() => setActiveMenu('rasio')} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-left transition-colors ${activeMenu === 'rasio' ? 'bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-violet-400'}`}>📊 Rasio Aliran Dana</button>
            <button onClick={() => setActiveMenu('tren')} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-left transition-colors ${activeMenu === 'tren' ? 'bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-md' : 'hover:bg-slate-800 text-indigo-400'}`}>📈 Tren Finansial Berkala</button>
            <button onClick={() => setActiveMenu('boros')} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-left transition-colors ${activeMenu === 'boros' ? 'bg-linear-to-r from-rose-600 to-orange-600 text-white shadow-md' : 'hover:bg-slate-800 text-rose-400'}`}>🚨 Kategori Terboros</button>
            
            <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Asisten Pintar AI</p>
            <button onClick={() => setActiveMenu('ai_catat')} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black rounded-xl text-left transition-all border border-cyan-500/20 ${activeMenu === 'ai_catat' ? 'bg-linear-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/10' : 'hover:bg-slate-800 text-cyan-400 bg-cyan-950/10'}`}>🤖 Catat Instan AI</button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/20">
          <div onClick={() => setShowProfileModal(true)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/30 cursor-pointer transition-all active:scale-[0.98] group">
            <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-black text-white text-sm shadow-md">
              {dapatkanInisialUser()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-white truncate">{userProfile.nama}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">Lihat Akun Detail ➜</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full bg-slate-800 hover:bg-red-950/60 hover:text-red-400 py-2.5 rounded-xl text-sm font-semibold text-center border border-slate-700/40">🚪 Keluar / Logout</button>
        </div>
      </div>

      {/* AREA KONTEN UTAMA (KANAN) */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {activeMenu === 'dashboard' && "Selamat Datang di SakuKampus 👋"}
              {activeMenu === 'catat' && "Tambah Catatan Transaksi"}
              {activeMenu === 'tracker' && "Subscription Tracker"}
              {activeMenu === 'laporan' && "Laporan Keuangan"}
              {activeMenu === 'rasio' && "Rasio Aliran Dana Terbesar 📊"}
              {activeMenu === 'tren' && "Tren Aliran Dana Berkala 📈"}
              {activeMenu === 'boros' && "Detektor Kategori Terboros 🚨"}
              {activeMenu === 'ai_catat' && "Catat Anggaran Menggunakan Asisten AI 🤖"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {activeMenu === 'dashboard' && "Sistem pemantau financial real-time mahasiswa."}
              {activeMenu === 'catat' && "Masukkan transaksi masuk atau keluar kuliahmu di sini."}
              {activeMenu === 'tracker' && "Kelola langganan aplikasi bulanan agar tidak overbudget."}
              {activeMenu === 'laporan' && "Lihat riwayat keseluruhan dan download laporan bulanan."}
              {activeMenu === 'rasio' && "Analisis persentase alokasi pengeluaran dana untuk melihat pengeluaran terbesar."}
              {activeMenu === 'tren' && "Analisis grafik tren pengeluaran finansial berkala harian dan mingguan."}
              {activeMenu === 'boros' && "Sistem deteksi otomatis ambang batas pengeluaran kategori paling boros bulan ini."}
              {activeMenu === 'ai_catat' && "Ketik paragraf cerita berantakan atau gunakan fitur voice recorder untuk mencatat masal secara instan."}
            </p>
          </div>

          <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 bg-white hover:bg-slate-100 p-1.5 pr-4 rounded-full border border-slate-200/80 shadow-sm transition-all active:scale-[0.97] group shrink-0">
            <div className="w-9 h-9 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-black text-white text-xs">
              {dapatkanInisialUser()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-700">{userProfile.nama}</p>
              <p className="text-[10px] text-slate-400 font-medium">Menu Akun</p>
            </div>
          </button>
        </div>

        {activeMenu === 'dashboard' && <MainDashboard saldo={saldo} totalPengeluaran={totalPengeluaran} onTopUpClick={() => setIsTopUpOpen(true)} />}
        {activeMenu === 'catat' && <ExpenseForm onTambahTransaksi={handleTambahTransaksi} />}
        {activeMenu === 'tracker' && <SubTracker />}
        {activeMenu === 'laporan' && <FinancialReport transactions={transactions} onHapusTransaksi={handleHapusTransaksi} />}
        {activeMenu === 'rasio' && <ExpensePercentage transactions={transactions} />}
        {activeMenu === 'tren' && <ExpenseTrend transactions={transactions} />}
        {activeMenu === 'boros' && <ExpenseLimitWarning transactions={transactions} />}
        {activeMenu === 'ai_catat' && <AiSmartInput onTambahBanyakTransaksi={handleTambahBanyakTransaksiAI} />}
      </div>

      {/* ==================== POP-UP DETAILS PROFIL + QR DIGITAL ID ==================== */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 transform transition-all">
            <div className="bg-linear-to-br from-slate-900 to-slate-800 p-8 text-center relative flex flex-col items-center">
              <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 text-white hover:bg-white/20 rounded-full text-xs transition-colors">✕</button>
              
              {/* Avatar Bulat */}
              <div className="w-20 h-20 bg-linear-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-black text-white text-3xl mb-3 shadow-lg border-4 border-slate-700/50">
                {dapatkanInisialUser()}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{userProfile.nama}</h3>
              <p className="text-xs text-blue-400 font-medium tracking-wide">{userProfile.email}</p>

              {/* QR Code Digital ID Pengguna dengan User ID */}
              <div className="mt-5 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-inner">
                <div className="bg-white p-2.5 rounded-xl flex items-center justify-center">
                  <canvas
                    ref={profileQrCanvasRef}
                    className="rounded-lg"
                  />
                </div>
                <p className="text-[9px] text-slate-300 font-mono mt-1.5 tracking-widest uppercase font-bold">Digital ID Verified</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/50 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">ID Akun Pengguna</p>
                <p className="text-xs font-black text-slate-800 font-mono">{userProfile.userId}</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/50 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Nomor HP</p>
                <p className="text-xs font-bold text-slate-700">{userProfile.noHp}</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/50 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tanggal Lahir</p>
                <p className="text-xs font-bold text-slate-700">{userProfile.tanggalLahir}</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/50 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Jenis Kelamin</p>
                <p className="text-xs font-bold text-slate-700">{userProfile.jenisKelamin}</p>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <button onClick={() => setShowProfileModal(false)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all text-sm active:scale-[0.99]">
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== POP-UP MODAL ISI SALDO / TOP UP DENGAN QRIS TAJAM ==================== */}
      {isTopUpOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">Metode Instant</span>
              <button onClick={() => setIsTopUpOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-bold">✕</button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Pilihan 1: Virtual Account</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 mb-1">No. Rekening Permata (SakuKampus-kaAKjak)</p>
                  <p className="text-xl font-mono font-bold text-slate-700 tracking-wider">8528 0812 3456 7890</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Pilihan 2: Scan QRIS</h4>
                <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  {/* QRIS Code SVG Tajam */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 mb-3">
                    <svg className="w-40 h-40 text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M0 0h30v30H0zm10 10v10h10V10zm60-10h30v30H70zm10 10v10h10V10zM0 70h30v30H0zm10 10v10h10V10zm55-5h10v10h-10zm10 10h10v10h-10zm-10 10h10v10h-10zm15-20h10v10h-10zm-5-15h10v10h-10zm20 5h15v15h-15zm-25 5h10v10h-10zm10-25h10v10h-10zM35 5h10v10H35zm15 10h10v10H50zm-15 20h10v10H35zm20 5h10v10H55zm-5 15h10v10H50zm-15 15h10v10H35zm20 10h10v10H55zm20-30h10v10H75z"/>
                      <rect x="42" y="42" width="16" height="16" rx="2" className="fill-blue-600"/>
                      <text x="50" y="52" textAnchor="middle" fill="white" className="text-[6px] font-sans font-black tracking-tighter">QRIS</text>
                    </svg>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold tracking-wide">Berlaku untuk semua e-wallet & m-banking</p>
                </div>
              </div>
            </div>

            <button onClick={() => setIsTopUpOpen(false)} className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-[0.98]">
              Selesai / Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}