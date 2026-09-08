# 📋 CHANGELOG & LOG PERUBAHAN — BAZNAS BADMINTON CLUB (BBC)

Dokumen ini mencatat seluruh riwayat perubahan, pembaruan fitur, optimasi tampilan responsif, dan perbaikan logika sistem pada website **BAZNAS Badminton Club (BBC)** dan sistem **Content Management System (CMS)**.

---

## 📌 DAFTAR ISI RIWAYAT PERUBAHAN
1. [v2.13.0 — Fix Deploy Vercel (Invalid request: exportedAt) & Migrasi Data CMS ke data/*.json](#-v2130---fix-deploy-vercel-invalid-request-exportedat--migrasi-data-cms-ke-datajson)
2. [v2.12.0 — Favicon Logo BBC di Semua Halaman](#-v2120---favicon-logo-bbc-di-semua-halaman)
3. [v2.11.0 — Fix Data CMS Tidak Muncul di Vercel: Static JSON Sync + Export Deploy](#-v2110---fix-data-cms-tidak-muncul-di-vercel-static-json-sync--export-deploy)
4. [v2.10.0 — Pembaruan Foto Dummy Anime Amilat (Pemain & Pengurus Hijab) & Selector Kategori Pengurus](#-v2100---pembaruan-foto-dummy-anime-amilat-pemain--pengurus-hijab--selector-kategori-pengurus)
5. [v2.9.0 — Pembaruan Foto Dummy Anime Amilin (Pemain & Pengurus) & Fallback onerror](#-v290---pembaruan-foto-dummy-anime-amilin-pemain--pengurus--fallback-onerror)
6. [v2.8.0 — Penyembunyian Menu Navigasi & Seluruh Layout CMS Sebelum Login](#-v280---penyembunyian-menu-navigasi--seluruh-layout-cms-sebelum-login)
7. [v2.7.0 — Penyimpanan Data Kosong di CMS & Visibilitas Dinamis Section index.html](#-v270---penyimpanan-data-kosong-di-cms--visibilitas-dinamis-section-indexhtml)
8. [v2.6.0 — Penyeragaman Ukuran Box Navigasi, Single Burger Button & Header Clean](#-v260---penyeragaman-ukuran-box-navigasi-single-burger-button--header-clean)
9. [v2.5.0 — Sidebar Navigasi Samping Kiri Buka-Tutup (Collapsible) Desktop & Tablet](#-v250---sidebar-navigasi-samping-kiri-buka-tutup-collapsible-desktop--tablet)
10. [v2.4.0 — Perapian Dashboard Mobile & Penataan Modul CMS](#-v240---perapian-dashboard-mobile--penataan-modul-cms)
11. [v2.3.0 — Fitur Lazy Load Data (>10 Baris) & Penyesuaian Font Tab Menu](#-v230---fitur-lazy-load-data-10-baris--penyesuaian-font-tab-menu)
12. [v2.2.0 — Optimasi Tipografi dan Responsivitas Konten Form & Tabel CMS](#-v220---optimasi-tipografi-dan-responsivitas-konten-form--tabel-cms)
13. [v2.1.0 — Accordion Header Ringkas, Urutan Menu Prioritas & Hapus Label "Menu"](#-v210---accordion-header-ringkas-urutan-menu-prioritas--hapus-label-menu)
14. [v2.0.0 — Responsivitas Pusat Navigasi Modul & Status Sistem Mobile](#-v200---responsivitas-pusat-navigasi-modul--status-sistem-mobile)
15. [v1.9.0 — Pembersihan Header CMS (BBC ADMIN + Burger Button) & Navigasi Mobile](#-v190---pembersihan-header-cms-bbc-admin--burger-button--navigasi-mobile)

---

## 🚀 v2.13.0 — Fix Deploy Vercel (Invalid request: exportedAt) & Migrasi Data CMS ke data/*.json
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *Saat deploy ke Vercel muncul pesan error:*
> `"Invalid request: should NOT have additional property exportedAt. Please remove it."`

### 🔍 Analisis Akar Masalah
- File backup/export database dari CMS yang berisi property `"exportedAt"` tidak sengaja disimpan dengan nama `vercel.json` pada root directory repository.
- Vercel mendeteksi file `vercel.json` sebagai file konfigurasi deployment resmi Vercel. Karena formatnya adalah backup JSON database (berisi properti seperti `exportedAt`, `players`, `events`, `officials`, `gallery`, `hero`), Vercel menolak file tersebut dengan pesan error validasi schema.
- Selain itu, data CMS pengguna belum masuk ke file data statis `/data/*.json`, sehingga website di Vercel sebelumnya masih membaca data lama.

### 💡 Solusi & Implementasi Teknis
1. **Migrasi Seluruh Data CMS ke File Statis `/data/*.json` (v2):**
   - `data/players.json`: Diperbarui dengan 27 data pemain resmi yang telah diinput via CMS, versi di-upgrade ke `_version: 2`.
   - `data/events.json`: Diperbarui dengan 2 data event, `_version: 2`.
   - `data/officials.json`: Diperbarui dengan 6 pengurus BBC resmi, `_version: 2`.
   - `data/gallery.json`: Diperbarui dengan 4 momen dokumentasi beserta gambar upload & tag, `_version: 2`.
   - `data/articles.json`: Versi dinaikkan ke `_version: 2` untuk konsistensi sinkronisasi.
   - `data/hero.json`: Berkas baru dibuat untuk menyimpan konfigurasi kustomisasi hero section, `_version: 2`.
2. **Hapus File `vercel.json` yang Salah Tempat:**
   - Menghapus `vercel.json` dari root repositori agar Vercel mendeteksi proyek sebagai *Zero-Config Static Web Application*, sehingga build & deployment berjalan lancar 100% tanpa error skema.
3. **Integrasi Sinkronisasi Hero pada `js/data/store.js`:**
   - Menambahkan `HERO: 'bbc_json_ver_hero'` ke dalam `JSON_VERSION_KEYS`.
   - Menambahkan task `hero.json` ke dalam fungsi `initialize()` sehingga data hero ikut di-sync otomatis ke `localStorage` saat pengunjung membuka website.

### 📂 Berkas yang Dimodifikasi & Dihapus
| Berkas | Aksi | Keterangan |
|---|---|---|
| `vercel.json` | **Dihapus** | Menghapus file backup database yang keliru dinamai `vercel.json` |
| `data/players.json` | Diperbarui | 27 pemain hasil input CMS, `_version: 2` |
| `data/events.json` | Diperbarui | 2 jadwal acara hasil input CMS, `_version: 2` |
| `data/officials.json` | Diperbarui | 6 pengurus resmi BBC, `_version: 2` |
| `data/gallery.json` | Diperbarui | 4 momen galeri foto hasil input CMS, `_version: 2` |
| `data/articles.json` | Diperbarui | Upgrade `_version: 2` |
| `data/hero.json` | **Baru** | Menyimpan pengaturan hero section dari CMS, `_version: 2` |
| `js/data/store.js` | Diperbarui | Penambahan sinkronisasi `hero.json` di `initialize()` |
| `CHANGELOG.md` | Diperbarui | Pencatatan riwayat pembaruan v2.13.0 |

---

## 🎨 v2.12.0 — Favicon Logo BBC di Semua Halaman
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna
> *"favicon logo bbc" → "favicon gunakan logo.png pada folder bbc-website/assets/images/brand"*

### 💡 Solusi & Implementasi Teknis
- Menggunakan file [`assets/images/brand/logo.png`](file:///e:/Ikrom%20Docs/bbc-website/assets/images/brand/logo.png) (logo resmi BBC yang sudah ada) sebagai favicon di seluruh halaman website.
- Ditambahkan tag `<link rel="icon">`, `<link rel="apple-touch-icon">`, dan `<meta name="theme-color" content="#1B6B35">` di `<head>` semua halaman.

### 📂 Berkas yang Dimodifikasi
| Berkas | Perubahan |
|---|---|
| `index.html` | Tambah favicon → `assets/images/brand/logo.png` |
| `pages/players.html` | Tambah favicon tags |
| `pages/schedule.html` | Tambah favicon tags |
| `pages/news.html` | Tambah favicon tags |
| `pages/player-detail.html` | Tambah favicon tags |
| `pages/article-detail.html` | Tambah favicon tags |
| `pages/profile.html` | Tambah favicon tags |
| `pages/cms.html` | Tambah favicon tags |

---

## 🚀 v2.11.0 — Fix Data CMS Tidak Muncul di Vercel: Static JSON Sync + Export Deploy
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna
> *"project ini sudah di deploy ke vercel namun data2 yang diinputkan melalui CMS tidak muncul pada website, solusinya seperti apa?"*

### 🔍 Permasalahan
- Seluruh data CMS (pemain, jadwal, galeri, artikel, pengurus) disimpan di **`localStorage` browser** — bersifat per-device dan tidak pernah tersimpan di server.
- Data yang diinput admin hanya ada di browser admin lokal, sehingga ketika pengguna lain membuka website di Vercel, semua data tampak default/kosong.
- Tidak ada mekanisme untuk menyebarkan data CMS ke semua pengunjung website.

### 💡 Solusi & Implementasi Teknis
**Arsitektur baru: Static JSON Sync**
1. **Buat folder `data/` dengan 5 file JSON statis** yang ikut di-deploy ke Vercel sebagai sumber data publik:
   - `data/players.json` — data roster pemain
   - `data/events.json` — data jadwal/event (tanggal diubah dari dinamis ke statis agar konsisten)
   - `data/gallery.json` — data galeri momen
   - `data/articles.json` — data berita/artikel
   - `data/officials.json` — data pengurus BBC

2. **Tambah `initialize()` async di `store.js`** — fetch semua JSON saat halaman pertama dibuka menggunakan `Promise.all()`. Menggunakan sistem versioning (`_version` field) untuk hanya override localStorage jika JSON lebih baru. Termasuk `forceReloadFromJson()` dan `exportToJsonFiles()`.

3. **Modifikasi `BBC_onReady()` di `live-sync.js`** — dijadikan async-aware, memanggil `BBC_STORE.initialize()` sebelum `render()` pada **setiap halaman** tanpa perlu modifikasi halaman satu per satu. Re-render via CMS (tab yang sama) tetap langsung tanpa fetch JSON ulang.

4. **Tambah card "Deploy ke Vercel" di CMS Backup** — panduan 3 langkah visual beserta tombol **"📦 Export JSON Files (5 File)"** yang mengunduh semua file JSON sekaligus untuk di-commit ke GitHub.

**Alur kerja admin setelah implementasi:**
```
Edit via CMS → Klik "Export JSON Files" → Copy ke folder data/ di GitHub → Push → Vercel redeploy (±1 menit) → Data muncul untuk semua pengunjung ✅
```

### 📂 Berkas yang Dimodifikasi
| Berkas | Perubahan |
|---|---|
| `data/players.json` | **[NEW]** Static JSON seed pemain |
| `data/events.json` | **[NEW]** Static JSON seed jadwal (tanggal statis) |
| `data/gallery.json` | **[NEW]** Static JSON seed galeri |
| `data/articles.json` | **[NEW]** Static JSON seed artikel |
| `data/officials.json` | **[NEW]** Static JSON seed pengurus |
| `js/data/store.js` | Tambah `initialize()`, `forceReloadFromJson()`, `exportToJsonFiles()`, `getJsonBasePath()`, `JSON_VERSION_KEYS` |
| `js/data/live-sync.js` | `BBC_onReady()` kini async-aware, memanggil `initialize()` sebelum render |
| `pages/cms.html` | Tambah card "Deploy ke Vercel" dengan step-by-step guide & tombol export |
| `js/pages/cms.js` | Tambah handler `btn-export-json-files` |

---

## 🧕 v2.10.0 — Pembaruan Foto Dummy Anime Amilat (Pemain & Pengurus Hijab) & Selector Kategori Pengurus
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna
> *"buat dummy untuk player / pengurus amilat yang fotonya tidak ada atau tidak muncul dengan gambar berikut"*

### 🔍 Permasalahan
- Foto dummy amilat (pemain wanita dan pengurus wanita) sebelumnya masih memakai aset lama yang belum serasi dengan gaya ilustrasi anime amilin berjersey resmi BAZNAS.
- Pengguna ingin agar atlet amilat dan pengurus amilat yang tidak memiliki foto atau fotonya gagal dimuat (*broken image*) otomatis menampilkan gambar ilustrasi anime muslimah berhijab biru dan seragam olahraga BAZNAS yang telah diunggah.
- Selain itu, formulir pengurus di panel CMS sebelumnya mewajibkan input foto dan belum memiliki opsi kategori gender pengurus (Amilin vs Amilat), sehingga pengurus wanita baru tidak dapat langsung memanfaatkan avatar dummy amilat jika belum memiliki URL foto.

### 💡 Solusi & Implementasi Teknis
1. **Pembaruan Berkas Aset Gambar Dummy:**
   - Memperbarui file aset utama [assets/images/players/dummy-female.jpg](file:///e:/Ikrom%20Docs/bbc-website/assets/images/players/dummy-female.jpg) dengan gambar ilustrasi anime muslimah berhijab biru berjersey olahraga yang diunggah pengguna.
   - Karena kartu pemain di beranda, daftar roster amilat di halaman pemain, halaman detail atlet, dan tabel CMS membaca berkas ini, perubahan langsung aktif di seluruh website.
2. **Penambahan Selector Kategori Pengurus & Input Foto Opsional di CMS ([pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html) & [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)):**
   - Menambahkan field pemilihan kategori `<select id="official-gender">` dengan pilihan **Amilin (Laki-laki)** dan **Amilat (Perempuan)**.
   - Menjadikan kolom foto pengurus berstatus **opsional** sehingga admin dapat menambah data pengurus baru tanpa foto dan sistem otomatis menerapkan foto dummy amilin/amilat.
   - Menambahkan *live preview updater* yang otomatis mengganti pratinjau avatar dummy (amilin / amilat) saat kategori diubah atau saat file gambar dipilih.
3. **Penyimpanan Gender Pengurus di LocalStorage ([js/data/store.js](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js) & [js/data/officials.js](file:///e:/Ikrom%20Docs/bbc-website/js/data/officials.js)):**
   - Menambahkan dukungan properti `gender` pada fungsi `getOfficials()` dan `saveOfficial()`.
   - Melengkapi data seed default pengurus pada `officials.js` dengan nilai `gender: "male"` atau `gender: "female"`.
4. **Fallback & Penanganan onerror Halaman Profil Publik ([js/pages/profile.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/profile.js)):**
   - Mengutamakan pengecekan properti `o.gender === 'female'` sebelum deteksi nama, untuk memuat dummy amilat jika foto kosong atau gagal dimuat (`onerror="this.onerror=null; this.src='${dummyPhoto}';"`).

### 📂 Berkas yang Dimodifikasi
- [assets/images/players/dummy-female.jpg](file:///e:/Ikrom%20Docs/bbc-website/assets/images/players/dummy-female.jpg)
- [pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)
- [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)
- [js/pages/profile.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/profile.js)
- [js/data/store.js](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js)
- [js/data/officials.js](file:///e:/Ikrom%20Docs/bbc-website/js/data/officials.js)
- [CHANGELOG.md](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md)

---

## 🖼️ v2.9.0 — Pembaruan Foto Dummy Anime Amilin (Pemain & Pengurus) & Fallback onerror
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna
> *"buat dummy untuk player / pengurus amilin yang fotonya tidak ada atau tidak muncul dengan gambar berikut"*

### 🔍 Permasalahan
- Pengguna ingin agar foto dummy bawaan untuk pemain dan pengurus amilin (laki-laki) menggunakan ilustrasi anime berkacamata, behel gigi, dan seragam badminton biru-putih resmi BAZNAS.
- Sebelumnya pada bagian Pengurus (Officials), baik di halaman publik [pages/profile.html](file:///e:/Ikrom%20Docs/bbc-website/pages/profile.html) maupun di panel CMS [pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html), belum dilengkapi penanganan *error handler* (`onerror`) saat foto pengurus kosong atau gagal dimuat dari server/URL luar.

### 💡 Solusi & Implementasi Teknis
1. **Pembaruan Berkas Aset Gambar Dummy:**
   - Memperbarui file aset utama [assets/images/players/dummy-male.jpg](file:///e:/Ikrom%20Docs/bbc-website/assets/images/players/dummy-male.jpg) dengan gambar ilustrasi anime yang diunggah pengguna.
   - Karena seluruh komponen web (kartu pemain di beranda, daftar roster, detail atlet, dan tabel CMS) membaca path `assets/images/players/dummy-male.jpg`, seluruh tampilan otomatis ter-update serentak.
2. **Penanganan Fallback & onerror Pengurus di [js/pages/profile.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/profile.js):**
   - Menambahkan deteksi gender dan resolusi path `dummyPhoto` (`dummy-male.jpg` untuk amilin / `dummy-female.jpg` untuk amilat).
   - Menambahkan atribut `onerror="this.onerror=null; this.src='${dummyPhoto}';"` dan fallback `src="${photoUrl}"` pada kartu profil pengurus.
3. **Penanganan Fallback & onerror Pengurus di CMS [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js):**
   - Memperbarui fungsi `renderOfficialsTable()` agar thumbnail tabel akordeon dan kolom foto memiliki fallback ke `dummy-male.jpg` jika URL foto pengurus kosong atau broken (`onerror`).
   - Memperbarui fungsi `openEditOfficial()` agar kotak preview modal menampilkan dummy foto ini ketika foto belum diunggah atau tidak valid.

### 📂 Berkas yang Dimodifikasi
- [assets/images/players/dummy-male.jpg](file:///e:/Ikrom%20Docs/bbc-website/assets/images/players/dummy-male.jpg)
- [js/pages/profile.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/profile.js)
- [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)

---

## 🔒 v2.8.0 — Penyembunyian Menu Navigasi & Seluruh Layout CMS Sebelum Login
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna
> *"sembunyikan menu navigasi pada cms.html pada saat belum login"*

### 🔍 Permasalahan
- Sebelumnya pada `css/cms.css`, selector pelindung autentikasi `body.cms-auth-required` hanya menyembunyikan `.cms-topbar`, `.marquee-ticker`, `.cms-tabs-bar`, dan `.cms-panel`.
- Elemen sidebar navigasi samping (`.cms-sidebar`) serta pembungkus aplikasi (`.cms-app-wrapper`) belum dimasukkan ke dalam selector tersebut, sehingga menu navigasi samping masih tetap terlihat ketika pengguna belum melakukan login.

### 💡 Solusi & Implementasi Teknis
1. **Pembaruan Selector Guard di `css/cms.css`:**
   - Memperluas selector `body.cms-auth-required` untuk menyembunyikan seluruh elemen navigasi dan layout:
     ```css
     body.cms-auth-required .cms-app-wrapper,
     body.cms-auth-required .cms-sidebar,
     body.cms-auth-required .cms-sidebar-backdrop,
     body.cms-auth-required .cms-topbar,
     body.cms-auth-required .cms-main-wrapper,
     body.cms-auth-required .marquee-ticker,
     body.cms-auth-required .cms-tabs-bar,
     body.cms-auth-required .cms-panel {
       display: none !important;
       visibility: hidden !important;
       pointer-events: none !important;
     }
     ```
   - Saat pengguna belum terotentikasi, **hanya kartu login retro arcade (`.cms-auth-screen`) yang tampil** di tengah layar.
   - Menu navigasi, header, backdrop drawer, dan panel data benar-benar bersih dan tidak tampak.
2. **Pembersihan State Logout di `js/pages/cms.js`:**
   - Saat fungsi `setAuthenticated(false)` dipanggil, class `sidebar-open` pada pembungkus aplikasi dan `document.body.style.overflow` otomatis dibersihkan agar tidak meninggalkan *state* drawer yang terbuka.

### 📂 Berkas yang Dimodifikasi
- [css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)
- [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)

---

## 🚀 v2.7.0 — Penyimpanan Data Kosong di CMS & Visibilitas Dinamis Section index.html
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna
> *"buat jika tidak ada data berita, galeri dan jadwal maka tidak akan ditampilkan sectionnya pada index.html.*
> *saat ini jika dihapus seluruh data yang ada akan muncul kembali, buat agar tetap bisa menghapus data sampai kosong pada tiap2 fitur pada cms"*

### 🔍 Permasalahan
1. **Re-seeding Otomatis saat Data Dihapus Habis:**
   - Pada `js/data/store.js`, getter data (`getPlayers`, `getEvents`, `getGallery`, `getArticles`, `getOfficials`) menggunakan kondisi pengecekan `if (!data || !Array.isArray(data) || data.length === 0)`.
   - Saat admin menghapus semua baris data sehingga tersisa array kosong (`[]`), kondisi `data.length === 0` terpenuhi dan sistem otomatis mengisi ulang data bawaan (*seed*).
2. **Section Kosong Tetap Tampil di index.html:**
   - Ketika data Jadwal, Galeri, atau Berita kosong, section judul, badge, dan kontainer kosong tetap muncul di `index.html`.

### 💡 Solusi & Implementasi Teknis
1. **Perbaikan Logika `readStorage` & Getters di `js/data/store.js`:**
   - Mengubah `readStorage(key, fallback)` agar membedakan antara nilai yang belum pernah diset (`raw === null`) dengan array kosong yang sengaja disimpan (`[]`).
   - Mengubah kondisi inisialisasi pada seluruh fungsi getter menjadi:
     ```javascript
     if (data === null || !Array.isArray(data)) {
         data = seed;
         writeStorage(KEY, data);
     }
     ```
   - Array kosong (`[]`) kini dipertahankan sebagai status database yang valid. Admin dapat menghapus data hingga benar-benar kosong (`0 data`). Pengembalian ke data bawaan hanya dilakukan jika tombol *"Reset ke Data Awal"* ditekan secara sadar.
2. **Penambahan ID Section di `index.html`:**
   - Section Jadwal: `id="section-agenda"`
   - Section Berita: `id="section-news"`
   - Section Galeri: `id="section-gallery"`
   - Section POTM: `id="section-potm"`
3. **Visibilitas Dinamis di `js/pages/home.js`:**
   - Memeriksa panjang data (`eventList.length`, `galleryList.length`, `articleList.length`, `playerList.length`).
   - Jika panjang data `0`, section terkait diatur ke `display: none`.
   - Jika data tersedia kembali, section diatur ke `display: ''`.
   - Terintegrasi langsung dengan `BBC_LIVE` (`js/data/live-sync.js`), sehingga perubahan pada CMS langsung mengubah tampilan `index.html` secara *real-time* tanpa perlu me-refresh browser.

### 📂 Berkas yang Dimodifikasi
- [js/data/store.js](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js)
- [index.html](file:///e:/Ikrom%20Docs/bbc-website/index.html)
- [js/pages/home.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js)
- [tests/run-tests.js](file:///e:/Ikrom%20Docs/bbc-website/tests/run-tests.js)

---

## 🎨 v2.6.0 — Penyeragaman Ukuran Box Navigasi, Single Burger Button & Header Clean
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna
> *"terdapat 2 buka menu, hapus salah satu yang tidak sesuai, dan samakan ukuran box pada tiap menu di navigasi, dan buat header lebih clean tanpa banyak tulisan tidak perlu"*

### 🔍 Permasalahan
1. Terdapat dua tombol buka menu yang membingungkan: tombol burger di header dan tombol melayang (*floating pill*) di sisi kiri layar.
2. Ukuran tinggi box pada menu navigasi sidebar tidak rata karena sebagian menu memiliki counter badge sedangkan menu lain tidak.
3. Header desktop dipenuhi teks deskripsi panjang (*"CONTROL CENTER"*, *"V2.6"*, *"BAZNAS BADMINTON CLUB"*, *"LIVE DATABASE"*).

### 💡 Solusi & Implementasi Teknis
1. **Penghapusan Tombol Ganda:**
   - Menghapus elemen `#btn-sidebar-floating-toggle`.
   - Menjadikan tombol burger `#cms-burger-btn` di header sebagai satu-satunya pengendali toggle menu untuk Desktop, Tablet, dan Mobile.
2. **Dimensi Box Presisi & Seragam:**
   - Mengatur tinggi box seluruh 8 menu tab (`.cms-sidebar .cms-tab-btn`) secara mutlak: `height: 44px; min-height: 44px; max-height: 44px; box-sizing: border-box;`.
   - Menyeragamkan kontainer ujung kanan `.cms-tab-btn__end` pada semua menu sehingga panah navigasi `→` berada di kolom vertikal sejajar.
3. **Pembersihan Header Topbar:**
   - Menghapus label dan sub-teks yang tidak diperlukan.
   - Header kiri hanya menampilkan: `[ ☰ ]` + `[ 🏸 BBC ADMIN ]`.
   - Header kanan menampilkan: `[ 🌐 LIHAT WEBSITE ↗ ]` + `[ 🚪 KELUAR ]`.

### 📂 Berkas yang Dimodifikasi
- [pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)
- [css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)
- [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)

---

## 📂 v2.5.0 — Sidebar Navigasi Samping Kiri Buka-Tutup (Collapsible) Desktop & Tablet
**Tanggal:** 8 September 2026

### 📝 Permintaan Pengguna
> *"pada menu navigasi di cms.html device desktop dan device tab dibuat ada disamping sebelah kiri yang dapat dibuka tutup"*

### 💡 Solusi & Implementasi Teknis
1. **Layout Sidebar Kiri Adaptif:**
   - Memodifikasi struktur layout CMS menjadi sidebar kiri tetap (*fixed sidebar*) dengan panel konten fleksibel di sebelah kanan.
2. **Fitur Buka-Tutup (Collapse/Expand):**
   - Menambahkan class `.sidebar-collapsed` pada wrapper utama `#cms-app-wrapper`.
   - Saat ditutup: Lebar sidebar menyusut menjadi `0px` atau mode ringkas ikon, memberikan ruang kerja maksimal untuk tabel data.
   - Status buka-tutup disimpan ke `localStorage` (`bbc_cms_sidebar_collapsed`) sehingga preferensi pengguna tetap bertahan saat halaman direfresh.
3. **Transisi Halus:**
   - Menambahkan animasi CSS transisi `width 0.25s cubic-bezier(0.4, 0, 0.2, 1)`.

### 📂 Berkas yang Dimodifikasi
- [pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)
- [css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)
- [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)

---

## 📊 v2.4.0 — Perapian Dashboard Mobile & Penataan Modul CMS
**Tanggal:** 8 September 2026

### 📝 Permintaan Pengguna
> *"rapikan susunan dashboard pada mobile device, dan navigasi pada desktop device didalam file cms.html"*

### 💡 Solusi & Implementasi Teknis
1. **Tata Letak Kartu Statistik Responsif:**
   - Menyesuaikan grid statistik ringkasan dashboard (`.cms-stat-grid`) dari 4-5 kolom menjadi 2 kolom rapi pada layar mobile (<640px) dan 1 kolom pada layar ultra-kecil (<380px).
2. **Pusat Modul Cepat:**
   - Kartu akses cepat modul dirancang dengan padding proporsional, ikon terpusat, dan tombol aksi yang nyaman ditekan pada layar sentuh.

### 📂 Berkas yang Dimodifikasi
- [pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)
- [css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)

---

## ⚡ v2.3.0 — Fitur Lazy Load Data (>10 Baris) & Penyesuaian Font Tab Menu
**Tanggal:** 8 September 2026

### 📝 Permintaan Pengguna
> *"jika baris pemain, jadwal, berita melebihi 10, dibuat lazy load, besarkan sesuaikan lagi font pada isi tab menu besarkan sedikit lagi jangan terlalu kecil"*

### 💡 Solusi & Implementasi Teknis
1. **Implementasi Lazy Load Dinamis:**
   - Menetapkan limit awal tampilan sebanyak 10 item (`playersVisibleLimit = 10`, `eventsVisibleLimit = 10`, `articlesVisibleLimit = 10`).
   - Menambahkan sensor otomatis menggunakan browser `IntersectionObserver` pada baris bawah tabel (`.cms-lazyload-row`).
   - Menambahkan 2 tombol kendali manual:
     - `⬇ MUAT LEBIH BANYAK (+10)`
     - `⚡ TAMPILKAN SEMUA`
2. **Kalibrasi Ukuran Font Konten:**
   - Menyesuaikan font isi tabel, judul pemain, meta tanggal, dan form input agar berada di rentang ideal (`0.88rem` – `0.95rem`), tidak terlalu besar dan tidak terlalu kecil.

### 📂 Berkas yang Dimodifikasi
- [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)
- [css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)

---

## 🔤 v2.2.0 — Optimasi Tipografi dan Responsivitas Konten Form & Tabel CMS
**Tanggal:** 8 September 2026

### 📝 Permintaan Pengguna
> *"sesuaikan font pada setiap isi tab menu di cms.html buat lebih bagus untuk responsive mobile dan tab karena huruf masih terlihat besar2"*

### 💡 Solusi & Implementasi Teknis
1. **Penurunan Skala Tipografi untuk Tablet & Mobile:**
   - Menggunakan `clamp()` dan breakpoint `@media (max-width: 768px)` untuk memperkecil judul panel, form label, placeholder, dan sel data.
2. **Pencegahan Teks Terpotong / Overflow:**
   - Menambahkan pembungkus tabel fleksibel dengan *horizontal scrolling indicator* pada tabel lebar.

### 📂 Berkas yang Dimodifikasi
- [css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)

---

## 🗂️ v2.1.0 — Accordion Header Ringkas, Urutan Menu Prioritas & Hapus Label "Menu"
**Tanggal:** 8 September 2026

### 📝 Permintaan Pengguna
> *"Bagian menu pemain, jadwal, galeri, berita, pengurus dan hero media pada cms.html :*
> *1. buat tiap2 nama accordion agar tidak terlalu banyak scroll, sesuaikan fontnya untuk mobile dan tab device agar tidak terlalu besar.*
> *lalu urutkan pada menu navigasi berdasarkan yang paling penting, terakhir menu backup.*
> *hapus tulisan Menu pada navigasi mobile, cukupkan dengan burger bar, dan buat lebih keren headernya"*

### 💡 Solusi & Implementasi Teknis
1. **Accordion Baris Ringkas:**
   - Mengubah baris tabel mobile menjadi format akordeon yang dapat dilipat/dibuka.
   - Header ringkas hanya menampilkan thumbnail foto, nama/judul, badge status, dan tombol `DETAIL ▼`.
2. **Re-ordering Navigasi Menu Prioritas:**
   - Urutan menu diperbarui:
     1. 📊 Dashboard
     2. 👥 Pemain
     3. 📅 Jadwal
     4. 📸 Galeri
     5. 📰 Berita
     6. 🎬 Hero Media
     7. 👔 Pengurus
     8. ⚙️ Backup & Pengaturan
3. **Penyederhanaan Navigasi Mobile:**
   - Menghapus teks "Menu" dan menggantikannya dengan ikon burger modern beranimasi.

### 📂 Berkas yang Dimodifikasi
- [pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)
- [css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)
- [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)

---

## 📱 v2.0.0 — Responsivitas Pusat Navigasi Modul & Status Sistem Mobile
**Tanggal:** 8 September 2026

### 📝 Permintaan Pengguna
> *"cms.html, pada pusat navigasi modul, status sistem ke bawah tidak responsif pada mobile device, sesuaikan"*

### 💡 Solusi & Implementasi Teknis
1. **Penataan Ulang Grid Kartu Modul:**
   - Memperbaiki overflow dan flex-wrap pada kontainer status sistem dan modul navigasi di bawah dashboard.
2. **Penyelarasan Spasi & Margin:**
   - Mengurangi margin horizontal dan mengoptimalkan padding kartu agar pas pada layar ponsel (360px - 425px).

### 📂 Berkas yang Dimodifikasi
- [pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)
- [css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)

---

## 🏷️ v1.9.0 — Pembersihan Header CMS (BBC ADMIN + Burger Button) & Navigasi Mobile
**Tanggal:** 8 September 2026

### 📝 Permintaan Pengguna
> *"rapikan responsive mobile dan tab, dan rapikan navigasinya pada device mobile buat lebih clean pada bagian header cms.html cukup tuliskan BBC ADMIN dan burger button pada header"*

### 💡 Solusi & Implementasi Teknis
1. **Header Minimalis:**
   - Memangkas elemen header mobile yang berdesakan menjadi hanya logo teks `BBC ADMIN` dan tombol navigasi burger.
2. **Drawer Navigasi Mobile:**
   - Navigasi tab disembunyikan dalam drawer samping dengan backdrop gelap yang menutup saat salah satu menu dipilih.

### 📂 Berkas yang Dimodifikasi
- [pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)
- [css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)
- [js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)

---

## 🛠️ RINGKASAN ARSITEKTUR FILE UTAMA
- **[index.html](file:///e:/Ikrom%20Docs/bbc-website/index.html)**: Halaman landing utama publik BBC.
- **[pages/cms.html](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)**: Dashboard CMS pengelola konten terpadu.
- **[css/cms.css](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)**: Gaya visual, sistem grid responsif, sidebar, dan modal CMS.
- **[js/data/store.js](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js)**: Lapisan data store sentral (CRUD LocalStorage dengan isolasi seed).
- **[js/data/live-sync.js](file:///e:/Ikrom%20Docs/bbc-website/js/data/live-sync.js)**: Sinkronisasi siaran data lintas-tab (BroadcastChannel / storage event).
- **[js/pages/home.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js)**: Logika interaktif dan kontrol visibilitas dinamis section pada halaman depan.
- **[js/pages/cms.js](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)**: Logika interaktif CMS, auth hash, sidebar toggle, tabel akordeon, dan lazy loading.
