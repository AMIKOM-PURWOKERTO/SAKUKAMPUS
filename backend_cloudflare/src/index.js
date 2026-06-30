import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware CORS
app.use('/api/*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Route Utama (Root) agar URL Worker tidak blank putih
app.get('/', (c) => {
  return c.text('✅ SakuKampus Backend API is running successfully!');
});

// 1. API untuk mengambil data Profil User (id_user = 1)
app.get('/api/user', async (c) => {
  try {
    const db = c.env.DB;
    const user = await db.prepare('SELECT * FROM users WHERE id_user = 1').first();
    if (!user) return c.json({ message: 'User tidak ditemukan' }, 404);
    return c.json(user);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 2. API untuk mengambil semua data Transaksi (id_user = 1)
app.get('/api/transaksi', async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db.prepare(
      'SELECT id_transaksi, id_user, tanggal, deskripsi, kategori, jumlah, tipe FROM transaksi WHERE id_user = 1 ORDER BY id_transaksi DESC'
    ).all();
    return c.json(results);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 3. API untuk Menyimpan Transaksi Baru
app.post('/api/transaksi', async (c) => {
  try {
    const { tanggal, deskripsi, kategori, jumlah, tipe } = await c.req.json();
    
    if (!tanggal || !deskripsi || !kategori || !jumlah || !tipe) {
      return c.text('❌ Gagal: Data transaksi tidak lengkap!', 400);
    }

    const db = c.env.DB;
    await db.prepare(
      'INSERT INTO transaksi (id_user, tanggal, deskripsi, kategori, jumlah, tipe) VALUES (1, ?, ?, ?, ?, ?)'
    ).bind(tanggal, deskripsi, kategori, jumlah, tipe).run();
    
    return c.json({ message: '🚀 Sukses: Transaksi berhasil disimpan!' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 4. API untuk Menghapus Catatan Transaksi
app.delete('/api/transaksi/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    await db.prepare('DELETE FROM transaksi WHERE id_transaksi = ?').bind(id).run();
    return c.json({ message: '🗑️ Sukses: Transaksi berhasil dihapus!' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 5. API untuk mengambil data Langganan
app.get('/api/langganan', async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db.prepare('SELECT * FROM langganan WHERE id_user = 1').all();
    return c.json(results);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 6. API untuk mengambil semua data Catatan Kuliah
app.get('/api/catatan', async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db.prepare('SELECT * FROM catatan_kuliah WHERE id_user = 1 ORDER BY id_catatan DESC').all();
    return c.json(results);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 7. API Mengubah Status Aktif Langganan
app.put('/api/langganan/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { status_aktif } = await c.req.json();
    const db = c.env.DB;
    await db.prepare('UPDATE langganan SET status_aktif = ? WHERE id_langganan = ?').bind(status_aktif, id).run();
    return c.json({ message: 'Status langganan berhasil diperbarui!' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// 8. API Membuat Catatan Kuliah Baru
app.post('/api/catatan', async (c) => {
  try {
    const { mata_kuliah, judul_catatan, isi_catatan, tanggal_dibuat } = await c.req.json();
    const db = c.env.DB;
    await db.prepare(
      'INSERT INTO catatan_kuliah (id_user, mata_kuliah, judul_catatan, isi_catatan, tanggal_dibuat) VALUES (1, ?, ?, ?, ?)'
    ).bind(mata_kuliah, judul_catatan, isi_catatan, tanggal_dibuat).run();
    return c.json({ message: 'Catatan berhasil ditambahkan!' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;
