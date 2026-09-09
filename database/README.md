# 🏸 Panduan Database MariaDB & MySQL — BAZNAS Badminton Club (BBC)

Website BAZNAS Badminton Club menggunakan backend **PHP REST API** dan **Database MariaDB** (atau MySQL) untuk menyimpan data pemain, jadwal, berita/artikel, galeri momen, pengurus, serta konfigurasi banner hero secara realtime dari CMS.

MariaDB adalah sistem database relasional open-source berkecepatan tinggi yang sepenuhnya kompatibel (binary drop-in replacement) dengan protokol MySQL, sehingga dapat diakses menggunakan driver standar PHP PDO (`pdo_mysql`).

---

## 🚀 Pilihan 1: Deploy di Vercel (Produksi / Cloud)

Untuk menjalankan API PHP dan Database MariaDB di Vercel:

### 1. Penyedia MariaDB Cloud Gratis / Handal
Anda dapat menggunakan penyedia database MariaDB cloud berikut:
- **[Aiven for MariaDB](https://aiven.io/)** (Free tier tersedia, fully managed MariaDB).
- **[Railway.app](https://railway.app/)** (One-click MariaDB template provision).
- **[Clever Cloud](https://www.clever-cloud.com/)** (Add-on MariaDB gratis).
- **[MariaDB SkySQL](https://mariadb.com/products/skysql/)** (Cloud resmi dari MariaDB Corporation).
- **Hosting cPanel / DirectAdmin / VPS** (Mayoritas hosting modern menggunakan MariaDB secara default; cukup aktifkan fitur *Remote MySQL/MariaDB* untuk mengizinkan IP Vercel atau `%`).
- *(Alternatif)* **[TiDB Cloud](https://tidbcloud.com/)** / **PlanetScale** juga dapat digunakan dengan skema yang sama.

### 2. Atur Environment Variables di Vercel
Masuk ke Dashboard Vercel → Pilih Proyek `bbc-website` → **Settings** → **Environment Variables**:

| Variable | Contoh Nilai | Keterangan |
|---|---|---|
| `DB_HOST` | `mariadb-xxx.aivencloud.com` | Host server MariaDB |
| `DB_PORT` | `3306` (atau port custom provider) | Port MariaDB |
| `DB_NAME` | `bbc_database` | Nama database |
| `DB_USER` | `avnadmin` atau `root` | Username database |
| `DB_PASS` | `PasswordAnda` | Password database |
| `DB_SSL` | `true` | Set `true` untuk koneksi cloud ber-SSL |

### 3. Eksekusi Schema & Seeding Awal
Setelah environment variables disetel di Vercel:
1. Jalankan isi file [`database/schema.sql`](schema.sql) melalui SQL Console / phpMyAdmin di dashboard MariaDB cloud Anda.
2. Atau langsung buka URL: `https://domain-anda.vercel.app/api/seed.php` di browser untuk membuat tabel otomatis dan memigrasikan seluruh data awal dari JSON!

---

## 💻 Pilihan 2: Menjalankan Secara Lokal (XAMPP / Laragon)

> **Catatan:** XAMPP dan Laragon versi terbaru secara default sudah menggunakan **MariaDB** sebagai database engine bawaan (bukan Oracle MySQL).

### 1. Buat Database Lokal
1. Nyalakan service Apache & MySQL/MariaDB di control panel XAMPP atau Laragon.
2. Buka **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Buat database baru bernama `bbc_database` dengan collation `utf8mb4_unicode_ci`.
4. Buka tab **Import** dan pilih file [`database/schema.sql`](schema.sql), lalu klik **Go**.

### 2. Migrasi Data JSON Awal
Buka browser dan akses:
`http://localhost/bbc-website/api/seed.php`
Data pemain, jadwal, artikel, galeri, pengurus, dan hero akan otomatis terisi ke database MariaDB Anda.

### 3. Tes Koneksi API
Akses:
`http://localhost/bbc-website/api/health.php`
Endpoint ini akan otomatis mendeteksi:
```json
{
  "success": true,
  "status": "healthy",
  "engine": "MariaDB",
  "is_mariadb": true,
  "db_version": "10.11.x-MariaDB"
}
```
Jika status `healthy`, API PHP dan MariaDB sudah aktif dan siap digunakan!
