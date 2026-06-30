const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// 1. API untuk mengambil data Profil User (id_user = 1)
app.get('/api/user', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE id_user = 1');
        if (rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. API untuk mengambil semua data Transaksi (id_user = 1)
// FIX: Mengembalikan kolom ke nama asli 'tipe' sesuai tabel database kamu
app.get('/api/transaksi', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id_transaksi, id_user, tanggal, deskripsi, kategori, jumlah, tipe FROM transaksi WHERE id_user = 1 ORDER BY id_transaksi DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. API untuk Menyimpan Transaksi Baru dari Web ke MySQL
// FIX: Mengubah nama kolom tujuan INSERT menjadi 'tipe' agar MySQL tidak protes lagi
app.post('/api/transaksi', async (req, res) => {
    const { tanggal, deskripsi, kategori, jumlah, tipe } = req.body;
    
    if (!tanggal || !deskripsi || !kategori || !jumlah || !tipe) {
        return res.status(400).send('❌ Gagal: Data transaksi tidak lengkap!');
    }

    try {
        await db.query(
            'INSERT INTO transaksi (id_user, tanggal, deskripsi, kategori, jumlah, tipe) VALUES (1, ?, ?, ?, ?, ?)',
            [tanggal, deskripsi, kategori, jumlah, tipe]
        );
        res.json({ message: '🚀 Sukses: Transaksi berhasil disimpan ke MySQL!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. API untuk Menghapus Catatan Transaksi dari MySQL
app.delete('/api/transaksi/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM transaksi WHERE id_transaksi = ?', [id]);
        res.json({ message: '🗑️ Sukses: Transaksi berhasil dihapus dari MySQL!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. API untuk mengambil data Langganan (Katalog & Aktif)
app.get('/api/langganan', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM langganan WHERE id_user = 1');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. API untuk mengambil semua data Catatan Kuliah
app.get('/api/catatan', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM catatan_kuliah WHERE id_user = 1 ORDER BY id_catatan DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. API Mengubah Status Aktif Langganan
app.put('/api/langganan/:id', async (req, res) => {
    const { id } = req.params;
    const { status_aktif } = req.body;
    try {
        await db.query('UPDATE langganan SET status_aktif = ? WHERE id_langganan = ?', [status_aktif, id]);
        res.json({ message: 'Status langganan berhasil diperbarui!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. API Membuat Catatan Kuliah Baru
app.post('/api/catatan', async (req, res) => {
    const { mata_kuliah, judul_catatan, isi_catatan, tanggal_dibuat } = req.body;
    try {
        await db.query(
            'INSERT INTO catatan_kuliah (id_user, mata_kuliah, judul_catatan, isi_catatan, tanggal_dibuat) VALUES (1, ?, ?, ?, ?)',
            [mata_kuliah, judul_catatan, isi_catatan, tanggal_dibuat]
        );
        res.json({ message: 'Catatan berhasil ditambahkan!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server backend berjalan segar di http://localhost:${PORT}`);
});