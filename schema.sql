-- 1. Tabel Utama: users (Disesuaikan untuk SQLite/D1)
CREATE TABLE IF NOT EXISTS users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_lengkap TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    nomor_hp TEXT DEFAULT '-',
    tanggal_lahir TEXT DEFAULT '-',
    jenis_kelamin TEXT DEFAULT 'Laki-laki',
    user_id_unik TEXT DEFAULT '-',
    saldo_utama REAL DEFAULT 0.00,
    tanggal_daftar DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel: transaksi
CREATE TABLE IF NOT EXISTS transaksi (
    id_transaksi INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    tipe TEXT NOT NULL, -- 'pemasukan' atau 'pengeluaran'
    jumlah REAL NOT NULL,
    kategori TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    tanggal TEXT NOT NULL, 
    dibuat_pada DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- 3. Tabel: langganan
CREATE TABLE IF NOT EXISTS langganan (
    id_langganan INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    nama_layanan TEXT NOT NULL,
    jenis_layanan TEXT NOT NULL, 
    harga REAL NOT NULL,
    tanggal_jatuh_tempo TEXT NOT NULL, 
    status_aktif INTEGER DEFAULT 0, -- 0 atau 1 (sebagai boolean)
    tipe_data TEXT DEFAULT 'kustom', -- 'katalog' atau 'kustom'
    dibuat_pada DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- 4. Tabel: catatan_kuliah
CREATE TABLE IF NOT EXISTS catatan_kuliah (
    id_catatan INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    mata_kuliah TEXT NOT NULL,
    judul_catatan TEXT NOT NULL,
    isi_catatan TEXT NOT NULL,
    tanggal_dibuat TEXT NOT NULL,
    diperbarui_pada DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

-- Trigger untuk update `diperbarui_pada` pada tabel catatan_kuliah
CREATE TRIGGER IF NOT EXISTS update_catatan_kuliah_timestamp
AFTER UPDATE ON catatan_kuliah
FOR EACH ROW
BEGIN
    UPDATE catatan_kuliah SET diperbarui_pada = CURRENT_TIMESTAMP WHERE id_catatan = OLD.id_catatan;
END;

-- Mengisi data profil user pertama
INSERT INTO users (id_user, nama_lengkap, email, nomor_hp, tanggal_lahir, jenis_kelamin, user_id_unik, saldo_utama) 
VALUES (1, 'Septiyan Willy L.', 'mahasiswa@kampus.id', '08123456789', '11 September 2007', 'Laki-laki', 'SK-20070911', 1500000.00);

-- Mengisi data sampel transaksi keuangan
INSERT INTO transaksi (id_user, tipe, jumlah, kategori, deskripsi, tanggal)
VALUES 
(1, 'pemasukan', 1500000.00, 'Pemasukan Ortu / Beasiswa', 'Transferan bulanan dari orang tua', '27 Juni 2026'),
(1, 'pengeluaran', 25000.00, 'Makanan & Jajan', 'Nasi Padang + Es Teh siang hari', '27 Juni 2026');

-- Mengisi katalog aplikasi langganan
INSERT INTO langganan (id_user, nama_layanan, jenis_layanan, harga, tanggal_jatuh_tempo, status_aktif, tipe_data)
VALUES 
(1, 'Spotify Premium', 'Aplikasi / Apk', 55000.00, '15 Juli 2026', 0, 'katalog'),
(1, 'Netflix Student', 'Aplikasi / Apk', 120000.00, '20 Juni 2026', 0, 'katalog'),
(1, 'Canva Pro Kelompok', 'Kebutuhan Kuliah', 35000.00, '02 Juli 2026', 0, 'katalog');

-- Mengisi data sampel catatan kuliah
INSERT INTO catatan_kuliah (id_user, mata_kuliah, judul_catatan, isi_catatan, tanggal_dibuat)
VALUES 
(1, 'Rekayasa Perangkat Lunak', 'Pemahaman Dasar ERD', 'Mempelajari cara menghubungkan entitas menggunakan Primary Key.', '24 Juni 2026'),
(1, 'Sistem Basis Data', 'Tugas Normalisasi 1NF-3NF', 'Deadline pengumpulan tugas normalisasi database toko online.', '26 Juni 2026');
