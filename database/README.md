# 🏸 Panduan Database MySQL — BAZNAS Badminton Club (BBC)

Website BAZNAS Badminton Club kini menggunakan backend **PHP REST API** dan **Database MySQL** untuk menyimpan data pemain, jadwal, berita/artikel, galeri momen, pengurus, serta konfigurasi banner hero secara realtime dari CMS.

---

## 🚀 Pilihan 1: Deploy di Vercel (Produksi / Cloud)

Untuk menjalankan API PHP dan Database MySQL di Vercel:

### 1. Buat Database MySQL Cloud Gratis
Anda dapat menggunakan penyedia MySQL cloud gratis / serverless, antara lain:
- **[TiDB Cloud Serverless](https://tidbcloud.com/)** (Rekomendasi: Gratis 5GB, kompatibel penuh dengan MySQL 8.0, latensi sangat rendah, support Vercel).
- **[Aiven for MySQL](https://aiven.io/)** (Free tier tersedia).
- **[Railway.app](https://railway.app/)** (One-click MySQL provision).
- **Hosting cPanel / VPS Anda sendiri** (aktifkan fitur *Remote MySQL*).

### 2. Atur Environment Variables di Vercel
Masuk ke Dashboard Vercel → Pilih Proyek `bbc-website` → **Settings** → **Environment Variables**:

| Variable | Contoh Nilai | Keterangan |
|---|---|---|
| `DB_HOST` | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` | Host server database |
| `DB_PORT` | `4000` atau `3306` | Port MySQL |
| `DB_NAME` | `bbc_database` | Nama database |
| `DB_USER` | `xxxxxx.root` | Username MySQL |
| `DB_PASS` | `PasswordAnda` | Password database |
| `DB_SSL` | `true` | Set `true` untuk TiDB / Aiven / cloud SSL |

### 3. Eksekusi Schema & Seeding Awal
Setelah environment variables disetel dan redeploy selesai:
1. Jalankan isi file [`database/schema.sql`](schema.sql) melalui SQL Console di dashboard database cloud Anda.
2. Atau cukup buka URL: `https://domain-anda.vercel.app/api/seed.php` di browser untuk otomatis membuat tabel dan memigrasikan seluruh data awal dari JSON!

---

## 💻 Pilihan 2: Menjalankan Secara Lokal (XAMPP / Laragon / Docker)

### 1. Buat Database Lokal
1. Buka **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Buat database baru bernama `bbc_database` dengan collation `utf8mb4_unicode_ci`.
3. Buka tab **Import** dan pilih file [`database/schema.sql`](schema.sql), lalu klik **Go**.

### 2. Migrasi Data JSON Awal
Buka browser dan akses:
`http://localhost/bbc-website/api/seed.php`
Data pemain, jadwal, artikel, galeri, pengurus, dan hero akan otomatis terisi ke database MySQL Anda.

### 3. Tes Koneksi API
Akses:
`http://localhost/bbc-website/api/health.php`
Jika status `healthy`, API PHP dan MySQL sudah siap digunakan!
