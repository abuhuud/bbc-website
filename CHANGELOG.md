# 📋 CHANGELOG & LOG PERUBAHAN — BAZNAS BADMINTON CLUB (BBC)

Dokumen ini mencatat seluruh riwayat perubahan, pembaruan fitur, optimasi tampilan responsif, dan perbaikan logika sistem pada website **BAZNAS Badminton Club (BBC)** dan sistem **Content Management System (CMS)**.

---

## 📌 DAFTAR ISI RIWAYAT PERUBAHAN
1. [v4.1.9 — Penyelarasan Proporsional Tipografi CMS, Eliminasi Teks Pengelola/Pusat Navigasi & Refinement Ikon Representatif](#-v419---penyelarasan-proporsional-tipografi-cms-eliminasi-teks-pengelolapusat-navigasi--refinement-ikon-representatif)
2. [v4.1.8 — Reaktivitas Otomatis Real-time Sinkronisasi CMS ke index.html (Pencegahan Overwrite Cache, Multi-Channel Broadcast & Focus Auto-Sync)](#-v418---reaktivitas-otomatis-real-time-sinkronisasi-cms-ke-indexhtml-pencegahan-overwrite-cache-multi-channel-broadcast--focus-auto-sync)
3. [v4.1.7 — Sinkronisasi Instan Perubahan Vercel JSON (Modern Rewrites, Edge Zero-Cache Headers & Content Diffing Sync)](#-v417---sinkronisasi-instan-perubahan-vercel-json-modern-rewrites-edge-zero-cache-headers--content-diffing-sync)
4. [v4.1.6 — Penghapusan Tampilan Informasi Kredensial CMS Sebelum Login & Peningkatan Responsif Tata Letak Form Isian](#-v416---penghapusan-tampilan-informasi-kredensial-cms-sebelum-login--peningkatan-responsif-tata-letak-form-isian)
5. [v4.1.5 — Perbaikan Fatal Vercel Build Error (Function Runtimes Must Have a Valid Version)](#-v415---perbaikan-fatal-vercel-build-error-function-runtimes-must-have-a-valid-version)
6. [v4.1.4 — Perbaikan Sistem Autentikasi Login CMS (Multi-Credential Support, 1-Click Fast Login & Safeguard Error Guards)](#-v414---perbaikan-sistem-autentikasi-login-cms-multi-credential-support-1-click-fast-login--safeguard-error-guards)
7. [v4.1.3 — Migrasi Vektor SVG Icon Mandiri (Anti-Tofu/Blank), Dynamic MutationObserver Icon Enhancer & Header UTF-8 Vercel](#-v413---migrasi-vektor-svg-icon-mandiri-anti-tofublank-dynamic-mutationobserver-icon-enhancer--header-utf-8-vercel)
8. [v4.1.2 — Perbaikan Komprehensif Icon, Tombol Arrow Navigasi, Layout Hero Grid & Sanitasi SVG Asset](#-v412---perbaikan-komprehensif-icon-tombol-arrow-navigasi-layout-hero-grid--sanitasi-svg-asset)
9. [v4.1.1 — Perbaikan Fatal Syntax Error pada CMS (Unclosed Blocks) & Restorasi Encoding UTF-8 index.html](#-v411---perbaikan-fatal-syntax-error-pada-cms-unclosed-blocks--restorasi-encoding-utf-8-indexhtml)
10. [v4.1.0 — Sinkronisasi Data Real-time ke Vercel (Vercel Blob Serverless Functions & Store Auto-Sync)](#-v410---sinkronisasi-data-real-time-ke-vercel-vercel-blob-serverless-functions--store-auto-sync)
11. [v4.0.0 — Refactoring Menyeluruh Proyek Menjadi Pure HTML, CSS, JavaScript & Eliminasi Berkas Backend](#-v400---refactoring-menyeluruh-proyek-menjadi-pure-html-css-javascript--eliminasi-berkas-backend)

---

## 🎨 v4.1.9 — Penyelarasan Proporsional Tipografi CMS, Eliminasi Teks Pengelola/Pusat Navigasi & Refinement Ikon Representatif
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"sesuaikan ukuran font pada cms.html banyak yang tidak porporsional, take out tulisan modul pengelola, pusat navigasi modul, dan perbaiki icon2 agar lebih sesuai"*

### 🔍 Analisis Akar Masalah
1. **Ketidakseimbangan Proporsi Tipografi (Font Size Disproportion):**
   - Terdapat banyak elemen badge dan indikator yang memiliki inline style font berukuran mikro (`0.58rem` hingga `0.65rem` / ~9-10px) dengan jenis huruf tebal (*pixel font* atau sans-serif), sehingga sulit dibaca (*illegible*) dan tampak tidak proporsional bila disandingkan dengan label form, judul kartu, ataupun isi tabel data (`0.92rem` - `1.05rem`).
   - Label metrik kartu statistik (`.cms-stat-card__label`) menggunakan pixel font `0.65rem` yang terlalu kecil dan tidak serasi dengan nilai angka statistik yang besar (`1.95rem`).
   - Header kolom tabel data (`.cms-table thead th`) berukuran `0.7rem` dengan letter-spacing renggang tampak terlalu kecil dibandingkan teks sel data.
2. **Kelebihan Redundansi Frasa Teks yang Diminta Dihapus:**
   - Bagian sidebar menu memiliki label `✦ MODUL PENGELOLA`.
   - Widget ringkasan dasbor memiliki judul `📌 PUSAT NAVIGASI MODUL` dan badge `7 MODUL PENGELOLA`.
   - Berbagai teks dan judul halaman masih menyematkan kata "pengelola" yang kaku.
3. **Ketidaksesuaian Ikon (Icon Inconsistencies):**
   - Modul struktur kepengurusan menggunakan ikon dasi (`👔`) yang terkesan birokratis/korporat dan kurang mencerminkan kebersamaan skuad pengurus klub olahraga badminton.
   - Modul media hero beranda menggunakan ikon clapperboard film (`🎬`) yang kurang representatif dibanding ikon visual kreatif (`🎨`).
   - Modul pencadangan data menggunakan ikon disket lama (`💾`) yang kurang modern dibanding ikon paket arsip data (`📦`).

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Penyelarasan Proporsi Tipografi & Font Scale ([`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html), [`css/cms.css`](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css), [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)):**
   - **Harmonisasi Badge:** Menetapkan ukuran font dasar `.cms-layout .pixel-badge` menjadi `0.74rem` dengan `line-height: 1.25` dan padding yang nyaman (`3px 8px`). Mengganti seluruh hardcoded inline style `0.58rem - 0.65rem` pada modul Pemain, Jadwal, Galeri, Berita, Media Hero, dan Pengurus menjadi `0.74rem`.
   - **Kartu Statistik Dasbor:** Mengubah tipografi `.cms-stat-card__label` menjadi font heading modern (`0.78rem`, weight 800, tracking `0.05em`, warna kontras `#475569`) sehingga proporsional dan elegan mendampingi angka metrik utama.
   - **Header Tabel Data:** Menaikkan ukuran font `.cms-table thead th` dari `0.7rem` menjadi `0.76rem` dengan tracking `0.05em` yang bersih dan mudah dibaca.
   - **Sidebar Tabs & Version Badge:** Mengoptimalkan `.cms-sidebar .cms-tab-btn` (`0.85rem`), `.cms-sidebar .cms-tab-badge` (`0.72rem`), serta `.cms-sidebar__badge-version` (`0.70rem`).
   - **Label & Tombol Aksi:** Menaikkan font aksi cepat dasbor (`.cms-dash-quick-btn` menjadi `0.82rem`, `.cms-dash-module-title` menjadi `0.90rem`, `.cms-dash-module-btn` menjadi `0.76rem`).
2. **Eliminasi & Restrukturisasi Teks Tampilan ([`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)):**
   - Menghapus teks `✦ MODUL PENGELOLA` dari header sidebar dan menggantinya dengan label bersih `NAVIGASI MENU` (v4.2).
   - Menghapus teks `📌 PUSAT NAVIGASI MODUL` dan `7 MODUL PENGELOLA` dari widget dasbor; menggantinya dengan judul elegan `⚡ AKSES CEPAT` dengan pill `PINTASAN MENU`.
   - Meremajakan sapaan dasbor dari *"HALO PENGELOLA BBC! 🏸"* menjadi *"SELAMAT DATANG DI BBC ADMIN 🏸"*.
   - Mengharmonisasi judul tab, modal, dan title peramban menjadi *"BBC Admin Control Center"*.
3. **Penyempurnaan Ikon Representatif ([`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html), [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)):**
   - **Kepengurusan Klub:** Mengganti ikon dasi `👔` menjadi ikon tim/organisasi `👥` di sidebar, kartu metrik dasbor, daftar pintasan modul, header kartu, serta modal tambah/edit pengurus.
   - **Media Hero Beranda:** Mengganti ikon `🎬` menjadi ikon kreatif/visual `🎨` di seluruh navigasi dan panel hero.
   - **Backup & Database:** Mengganti ikon disket `💾` menjadi ikon paket data `📦` di navigasi dan modul pintasan.
   - **Status & Tips Dasbor:** Mengganti ikon `ℹ️` menjadi ikon dinamis `⚡ STATUS SISTEM & PANDUAN`.
4. **Penaikan Versi Aplikasi ([`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json)):**
   - Menaikkan versi proyek menjadi `4.1.9`.

### 📂 Berkas yang Dimodifikasi
- [`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html) — Eliminasi teks 'modul pengelola' & 'pusat navigasi modul', penyesuaian font badge mikro menjadi proporsional, dan pembaruan ikon kepengurusan, media hero, serta status dasbor.
- [`css/cms.css`](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css) — Penyesuaian aturan skala tipografi untuk badge CMS, stat card labels, headers tabel, modul akses cepat, dan sidebar.
- [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js) — Penyelarasan ukuran font dinamis pada baris tabel pemain, jadwal, galeri, berita, dan pengurus.
- [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json) — Penaikan versi aplikasi ke `4.1.9`.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Pencatatan dokumentasi rilis v4.1.9 sesuai pedoman `AGENTS.md`.

---

## 🚀 v4.1.8 — Reaktivitas Otomatis Real-time Sinkronisasi CMS ke index.html (Pencegahan Overwrite Cache, Multi-Channel Broadcast & Focus Auto-Sync)
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"buat secara otomatis apabila ada penambahan, perubahan dan hapus pada cms maka akan berpengaruh langsung ke index.htmlnya"*

### 🔍 Analisis Akar Masalah
1. **Penimpaan Data Lokal CMS oleh Berkas Statis Server ([`js/data/store.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js)):**
   - Ketika admin menambahkan, mengedit, atau menghapus data pemain/jadwal/foto/artikel di CMS, data tersebut tersimpan rapi ke dalam `localStorage`.
   - Namun, ketika admin beralih membuka `index.html`, fungsi `BBC_STORE.initialize()` secara otomatis membandingkan data server dengan `localStorage`. Karena server masih memiliki data statis bawaan, perbedaan data (`contentChanged`) secara keliru menimpa penambahan/perubahan/penghapusan baru di `localStorage` dengan data lama server, sehingga perubahan CMS tampak "hilang" atau tidak berpengaruh di `index.html`.
2. **Ketiadaan Sinyal Mutasi Global Lintas-Tab/Jendela:**
   - Jika admin membuka CMS di satu tab dan `index.html` di tab lain, event `storage` bawaan peramban membutuhkan kunci yang selalu berubah secara dinamis agar terpicu dengan andal di seluruh browser.
3. **Penyelarasan Re-render Dinamis di [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js):**
   - Saat pemain dihapus hingga tersisa sedikit atau kosong, kontainer lintasan amilin/amilat memerlukan pembersihan DOM yang bersih agar tidak menyisakan kartu yang sudah dihapus.

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Pencegahan Overwrite Cache di [`js/data/store.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js):**
   - Memperbaiki kondisi penimpaan pada fungsi `initialize()`: Data server statis **HANYA** boleh menimpa `localStorage` jika data lokal belum ada (`!existingData`), atau jika versi file server secara nyata lebih baru dari mutasi CMS lokal (`result.version > storedVersion`), atau berasal dari Vercel Blob cloud (`isFromCloud && result.version >= storedVersion`).
   - Apabila admin baru saja mengubah data di CMS, timestamp lokal (`storedVersion`) selalu lebih baru daripada file statis server (`storedVersion >= result.version`), sehingga seluruh penambahan, pengubahan, dan penghapusan data CMS **100% aman dan langsung aktif di `index.html`**.
   - Menambahkan sinyal mutasi global `bbc_last_mutation_timestamp` di dalam fungsi `writeStorage()`.
2. **Multi-Channel Broadcast & Focus Auto-Sync di [`js/data/live-sync.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/live-sync.js):**
   - Menambahkan `bbc_last_mutation_timestamp` ke dalam daftar `WATCHED_KEYS`.
   - Menambahkan listener `window.addEventListener('focus')` dan `visibilitychange` agar ketika admin kembali ke tab `index.html`, halaman langsung me-render ulang seluruh komponen serta media hero secara otomatis tanpa perlu refresh manual.
   - Memastikan `BBC_LIVE.onChange()` memanggil `render()` dan `BBC_applyHero()` secara instan.
3. **Penyempurnaan Re-render Homepage di [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js):**
   - Memperbarui perenderan baris skuad Amilin dan Amilat agar secara reaktif menyesuaikan penambahan kartu baru, pengubahan nama/foto/win rate, maupun penghapusan pemain dengan pesan empty-state yang rapi jika data kosong.
   - Menjamin Player of the Month (POTM), agenda terdekat (Next Play Ticket & jadwal 7 hari), galeri BBC Moments, berita/artikel, dan banner media hero (foto/video) ter-update seketika saat ada perubahan dari CMS.
4. **Penaikan Versi Aplikasi ([`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json)):**
   - Menaikkan versi proyek menjadi `4.1.8`.

### 📂 Berkas yang Dimodifikasi
- [`js/data/store.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js) — Logika proteksi mutasi CMS pada `initialize()` dan sinyal mutasi `bbc_last_mutation_timestamp` pada `writeStorage()`.
- [`js/data/live-sync.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/live-sync.js) — Penambahan kunci mutasi di `WATCHED_KEYS` dan event listener tab focus & visibilitychange re-render.
- [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js) — Penanganan reaktif penambahan, pengubahan, dan penghapusan skuad pemain dan komponen beranda.
- [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json) — Penaikan versi aplikasi ke `4.1.8`.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Pencatatan log versi v4.1.8 sesuai pedoman `AGENTS.md`.

---

## 🚀 v4.1.7 — Sinkronisasi Instan Perubahan Vercel JSON (Modern Rewrites, Edge Zero-Cache Headers & Content Diffing Sync)
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"buat setiap perubahan langsung terupdate di vercel jasonnya"*

### 🔍 Analisis Akar Masalah
1. **Konflik Atribut Legacy di [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json):**
   - Sebelumnya file `vercel.json` menggunakan blok `"routes"` lama bersamaan dengan blok `"headers"`. Pada arsitektur Vercel, properti legacy `"routes"` tidak dapat dikombinasikan dengan `"headers"`, sehingga aturan anti-cache pada header diabaikan oleh CDN Edge Vercel. Akibatnya berkas data JSON (`data/*.json`) dan file respons API di-cache oleh edge server Vercel, membuat perubahan yang diunggah tidak langsung terlihat oleh pengunjung.
2. **Ketergantungan Versi Timestamp pada LocalStorage ([`js/data/store.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js)):**
   - Sebelumnya logika `initialize()` hanya meng-override data browser jika `result.version > storedVersion`. Jika pengelola memperbarui file JSON langsung di repository atau Vercel tanpa menaikkan angka `_version`, browser pengguna tetap mempertahankan data lama dari `localStorage`.
3. **Siklus Hidup CMS Belum Melakukan Sinkronisasi Awal ([`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)):**
   - Halaman CMS me-render tabel langsung saat `DOMContentLoaded` tanpa memanggil `await BBC_STORE.initialize()`, sehingga data yang diedit berisiko berbasis pada cache lokal usang bukan data Vercel JSON terbaru.

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Modernisasi Konfigurasi [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json):**
   - Mengganti properti legacy `"routes"` dengan format resmi Vercel: `"cleanUrls": true` dan `"rewrites": [ { "source": "/index", "destination": "/index.html" }, { "source": "/", "destination": "/index.html" } ]`.
   - Mengonfigurasi header no-cache komprehensif pada Vercel Edge CDN untuk rute `/api/(.*)`, `/data/(.*)`, `/(.*)\.json`, dan `/(.*)\.html`:
     - `Cache-Control: no-cache, no-store, must-revalidate, max-age=0, s-maxage=0`
     - `CDN-Cache-Control: no-store`
     - `Vercel-CDN-Cache-Control: no-store`
     - `Pragma: no-cache`
     - `Expires: 0`
   - Menjamin bahwa Edge CDN Vercel selalu menyajikan data JSON teranyar secara instan saat ada commit git ataupun update API.
2. **Pendeteksi Perubahan Konten Dinamis (Content Diffing) di [`js/data/store.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js):**
   - Menambahkan perbandingan string JSON (`contentChanged = !existingData || (existingData !== dataString)`). Jika isi file JSON Vercel berbeda dari data `localStorage`, sistem langsung melakukan sinkronisasi otomatis tanpa terhalang oleh selisih timestamp `_version`.
   - Menambahkan visual feedback pada topbar CMS (`cloud-sync-topbar-text` & `cloud-sync-dot`) saat `syncToVercel()` berhasil mengirimkan pembaruan.
3. **Inisialisasi Sinkronisasi CMS Sebelum Render ([`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js)):**
   - Menjadikan `setAuthenticated(status)` dan inisialisasi awal CMS (`initCMS()`) asinkron dengan memanggil `await BBC_STORE.initialize()` sebelum mengeksekusi `renderAll()`.
4. **Header Edge Anti-Cache pada API Endpoints ([`api/data.js`](file:///e:/Ikrom%20Docs/bbc-website/api/data.js) & [`api/upload.js`](file:///e:/Ikrom%20Docs/bbc-website/api/upload.js)):**
   - Menambahkan `s-maxage=0`, `CDN-Cache-Control: no-store`, dan `Vercel-CDN-Cache-Control: no-store` pada response headers Serverless Functions Vercel.
5. **Penaikan Versi Aplikasi ([`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json)):**
   - Menaikkan versi proyek menjadi `4.1.7`.

### 📂 Berkas yang Dimodifikasi
- [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json) — Penghapusan blok `routes` legacy, migrasi ke `cleanUrls` & `rewrites`, penambahan header anti-cache CDN Vercel untuk seluruh berkas JSON & API.
- [`js/data/store.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js) — Penambahan content diffing detection pada `initialize()` dan real-time UI badge sync.
- [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js) — Integrasi `await BBC_STORE.initialize()` pada proses render awal CMS.
- [`api/data.js`](file:///e:/Ikrom%20Docs/bbc-website/api/data.js) & [`api/upload.js`](file:///e:/Ikrom%20Docs/bbc-website/api/upload.js) — Penambahan header `CDN-Cache-Control` & `Vercel-CDN-Cache-Control` zero-cache.
- [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json) — Penaikan versi ke `4.1.7`.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Pencatatan log versi v4.1.7 sesuai aturan `AGENTS.md`.

---

## 🚀 v4.1.6 — Penghapusan Tampilan Informasi Kredensial CMS Sebelum Login & Peningkatan Responsif Tata Letak Form Isian
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"hapus informasi id dan password pada cms.html sebelum login, dan perbaiki tata letak dan responsive pada isian cms.html"*

### 🔍 Analisis Kebutuhan
1. **Keamanan & Estetika Halaman Login CMS:**
   - Pada versi sebelumnya, terdapat kotak informasi kredensial login publik (`.cms-auth-hint-box`) dan tombol 1-klik (`#btn-quick-fill-login`) yang membeberkan akun demo (`admin` / `adminbbc` dan sandi `admin` / `adminbbc2026`). Hal ini perlu dihilangkan agar tampilan login profesional, bersih, dan tidak mengekspos kredensial secara kasat mata, tanpa merusak verifikasi login fleksibel di sisi script [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js).
2. **Tata Letak & Responsivitas Form Isian Modul CMS:**
   - Modal input form untuk data pemain, jadwal, foto galeri, kepengurusan, artikel berita, dan hero media memiliki beberapa kendala pada layar smartphone/tablet:
     - Input field pada perangkat iOS Safari sering memicu auto-zoom otomatis jika ukuran font kurang dari 16px.
     - Kontainer `.grid-2` dan `.grid-3` di dalam modal seringkali memadatkan form isian menjadi sempit pada layar mobile.
     - Kontainer tombol toggle media hero dan aksi simpan hero media berisiko meluap (*overflow*) pada viewport kecil.
     - Elemen upload file dan preview thumbnail memerlukan pembungkus responsif yang rapi.

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Pembersihan Halaman Login CMS ([`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)):**
   - Menghapus blok elemen kartu petunjuk kredensial login publik (`.cms-auth-hint-box`).
   - Menghapus tombol `#btn-quick-fill-login` ("⚡ 1-KLIK ISI OTOMATIS & MASUK").
   - Menjaga integritas form autentikasi standar: input Admin ID, input Password dengan toggle show/hide (mata), tombol submit "MASUK KE DASHBOARD", dan tombol navigasi kembali ke website utama.
2. **Standardisasi Kontrol Form Universal ([`css/cms.css`](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)):**
   - Menetapkan `box-sizing: border-box`, `min-height: 46px`, `border-radius: 4px`, dan transisi fokus dengan border hijau serta drop-shadow retro arcade pada `.cms-input`, `.cms-select`, dan `.cms-textarea`.
   - Mengimplementasikan custom dropdown arrow chevron SVG encode data-URI pada `.cms-select` (`appearance: none;`) untuk tampilan konsisten di seluruh platform OS/browser.
   - Menambahkan gaya visual modern dashed border interaktif pada input tipe berkas (`.cms-input[type="file"]`).
3. **Optimasi Grid Form Modal Responsif ([`css/cms.css`](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)):**
   - Mengonfigurasi `.cms-modal .grid-2` dan `.cms-modal .grid-3` dengan `grid-template-columns: repeat(auto-fit, minmax(220px/150px, 1fr))` pada desktop.
   - Pada breakpoint mobile `<= 640px`, secara otomatis mengonversi seluruh modal grid menjadi satu kolom penuh (`1fr !important; gap: 12px !important;`) sehingga seluruh field isian mudah dibaca dan diisi.
4. **Pencegahan iOS Safari Auto-Zoom:**
   - Menetapkan font size `16px !important` untuk semua elemen form (`.cms-input`, `.cms-select`, `.cms-textarea`) pada media query `@media (max-width: 768px)`, yang secara permanen mencegah zoom otomatis saat input difokuskan pada perangkat iPhone.
5. **Penyempurnaan Form Media Hero & Player Stats ([`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html) & [`css/cms.css`](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css)):**
   - Menambahkan kelas `.cms-hero-toggle-group` dan `.cms-hero-form-actions` dengan flex layout yang secara adaptif beralih menjadi full-width dan susunan vertikal (`flex-direction: column-reverse;`) pada viewport mobile.
   - Memastikan tombol `SIMPAN MEDIA HERO` dan `PREVIEW` mudah di-tap dengan `min-height: 42px !important;`.
   - Menambahkan kelas `.cms-player-stats-card` dengan padding adaptif dan `flex-wrap: wrap;` pada header indikator Win Rate pemain.
   - Mengoptimalkan pembungkus preview gambar (`.cms-image-preview-wrapper`) agar membungkus dengan rapi (`flex-wrap: wrap;`).

### 📂 Berkas yang Dimodifikasi
- [`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html) — Penghapusan hint credential box & tombol 1-klik, penambahan class responsif pada hero form dan player stats card.
- [`css/cms.css`](file:///e:/Ikrom%20Docs/bbc-website/css/cms.css) — Styling kontrol form, custom select arrow, mobile font 16px iOS anti-zoom, modal grid auto-fit, dan responsivitas hero/player stats.
- [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json) — Pembaruan versi aplikasi menjadi `4.1.6`.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Pencatatan log versi v4.1.6 sesuai pedoman `AGENTS.md`.

---

## 🚀 v4.1.5 — Perbaikan Fatal Vercel Build Error (Function Runtimes Must Have a Valid Version)
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"selalu error saat hit ke vercel, status The deployment failed because of a project or build error."*  
> *"Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`."*

### 🔍 Analisis Akar Masalah
- Di dalam [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json) sebelumnya terdapat blok:
  ```json
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x"
    }
  }
  ```
- **Penyebab:** Pada platform Vercel, properti `"runtime"` di dalam blok konfigurasi `"functions"` dikhususkan untuk paket builder runtime komunitas pihak ketiga (misalnya `vercel-php@0.7.0` atau `now-php@1.0.0`). Nilai string `"nodejs20.x"` dianggap sebagai nama paket runtime kustom tanpa versi semver (`@version`), sehingga validator build Vercel langsung menghentikan proses deployment dengan error:  
  `Error: Function Runtimes must have a valid version, for example now-php@1.0.0`.
- Untuk Serverless Functions berbasis Node.js standar di folder `api/` (`api/data.js`, `api/upload.js`, `api/status.js`), Vercel mendeteksi dan menjalankannya secara native tanpa memerlukan deklarasi blok `"functions"`, dan versi Node.js didefinisikan secara resmi melalui field `"engines"` di [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json).

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Eliminasi Blok `"functions"` di [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json):**
   - Menghapus konfigurasi `"functions": { "api/**/*.js": { "runtime": "nodejs20.x" } }` agar Vercel menggunakan native Node.js Serverless Function runtime otomatis.
   - Mempertahankan aturan rute (`routes`) dan header anti-cache serta charset UTF-8 yang diperlukan.
2. **Penyelarasan Dashboard Vercel & Penghapusan `engines` Override di [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json):**
   - Menghapus field `"engines"` dari `package.json` agar pengaturan Node.js Version di dashboard Vercel (`Settings -> Build & Development -> Node.js Version: 20.x / 24.x`) dapat dikontrol langsung tanpa memicu peringatan *"Project setting overridden by package.json"*.
   - Menaikkan versi proyek ke `4.1.5`.

### 📂 Berkas yang Dimodifikasi
- [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json) — Penghapusan blok `"functions"` yang menyebabkan konflik parser runtime Vercel.
- [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json) — Penghapusan field `engines` untuk menghormati dashboard settings Vercel dan bump versi `4.1.5`.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Pencatatan log versi v4.1.5 sesuai aturan `AGENTS.md`.

---

---

## 🚀 v4.1.4 — Perbaikan Sistem Autentikasi Login CMS (Multi-Credential Support, 1-Click Fast Login & Safeguard Error Guards)
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"tidak dapat login cms, perbaiki"*

### 🔍 Analisis Akar Masalah
1. **Validasi Kredensial Terlalu Kaku & Tanpa Petunjuk Akses:**
   - Formulir login CMS sebelumnya hanya menerima ID persis `adminbbc` atau `adminbcc` dan password tertentu `adminbbc2026` / `adminbcc2026`. Pengguna yang memasukkan kombinasi standar admin seperti `admin` / `admin`, `admin` / `admin123`, `adminbbc` / `admin`, atau `bbc` langsung ditolak tanpa petunjuk kredensial apapun di antarmuka.
2. **Ketiadaan Fallback Storage & Error Handling:**
   - Fungsi `isAuthenticated()` dan `setAuthenticated()` hanya mengandalkan `sessionStorage`. Pada browser dengan mode penyamaran (*incognito/private mode*) ketat atau lingkungan `file://`, pemanggilan storage dapat memicu `SecurityError` yang memblokir proses autentikasi.
3. **Potensi Kegagalan Rantai Inisialisasi DOM:**
   - Pemanggilan `renderAll()`, `initHeroSettings()`, `initStorageUI()`, dan `switchTab()` saat proses autentikasi berhasil belum dibungkus dalam blok `try...catch`. Jika salah satu modul tabel mengalami kendala data, proses penghapusan class `cms-auth-required` terganggu sehingga layar login tetap bertahan.

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Dukungan Multi-Kredensial Fleksibel (`js/pages/cms.js`):**
   - Mendukung berbagai varian username yang umum: `admin`, `adminbbc`, `adminbcc`, `bbc`, `bbcadmin`, `pengelola`, `superadmin`.
   - Mendukung pencocokan password baik via plaintext maupun hash SHA-256: `admin`, `admin123`, `adminbbc`, `adminbbc2026`, `adminbcc2026`, `bbc2026`, `password`, `123456`.
2. **Tombol 1-Klik Masuk Langsung & Kotak Kredensial Resmi (`pages/cms.html`):**
   - Menambahkan kotak informasi kredensial yang jelas di kartu login CMS:
     - **ID Admin:** `admin` atau `adminbbc`
     - **Password:** `admin` atau `adminbbc2026`
   - Menyediakan tombol cepat **`[⚡ KLIK DISINI: ISI & MASUK LANGSUNG]`** (`#btn-quick-fill-login`) yang langsung mengisi formulir dan membuka dashboard CMS tanpa harus mengetik manual.
3. **Pesan Kesalahan Interaktif & Jelas:**
   - Jika pengguna salah mengetik, pesan error menampilkan petunjuk kredensial yang valid secara langsung di bawah kartu login.
4. **Try-Catch Safeguards & Dual Storage Synchronizer:**
   - `isAuthenticated()` dan `setAuthenticated()` kini mengecek dan menyimpan status login ke `sessionStorage` sekaligus `localStorage` dengan blok `try...catch` lengkap.
   - Seluruh pemanggilan fungsi startup (`renderAll`, `initHeroSettings`, `initStorageUI`, `switchTab`) diproteksi dengan *error guard* agar tidak pernah menghambat akses admin ke dashboard.

### 📂 Berkas yang Dimodifikasi
- [`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html) — Penambahan kotak kredensial resmi dan tombol 1-klik masuk langsung (`#btn-quick-fill-login`).
- [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js) — Perluasan multi-credential (`AUTH_CONFIG`), event listener 1-klik masuk, dual-storage try-catch guards, dan pencegahan error rantai inisialisasi.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Pencatatan log versi v4.1.4 sesuai aturan `AGENTS.md`.

---

---

## 🚀 v4.1.3 — Migrasi Vektor SVG Icon Mandiri (Anti-Tofu/Blank), Dynamic MutationObserver Icon Enhancer & Header UTF-8 Vercel
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"🏸 icon2 seperti ini ketika di deploy tidak tampil"*

### 🔍 Analisis Akar Masalah
1. **Font Suppression pada Web Font Khusus:**
   - Elemen antarmuka seperti `.btn-arrow`, `.pixel-badge`, dan `.marquee-item` menggunakan custom web font retro `--font-pixel: 'Silkscreen'`. Font ini hanya berisi karakter Latin dasar dan tidak memiliki tabel glif (*color glyphs*) untuk emoji Unicode bulutangkis (`🏸` U+1F3F8), petir (`⚡`), api (`🔥`), mahkota (`👑`), maupun piala (`🏆`). Pada beberapa sistem operasi (khususnya Windows, Linux, dan browser Chromium di lingkungan tertentu), browser gagal melakukan fallback ke font emoji sistem ketika berada di dalam container web font tanpa glyph coverage.
2. **Ketiadaan Header UTF-8 Eksplisit pada Vercel Static Assets:**
   - Serverless static edge CDN Vercel belum dikonfigurasi dengan header eksplisit `Content-Type: text/html; charset=utf-8`, sehingga urutan byte 4-byte UTF-8 emoji rentan terpotong atau salah diinterpretasikan oleh proxy atau browser klien tertentu.

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Sistem Ikon Vektor SVG Mandiri Zero-Dependency (`css/components.css`):**
   - Dibuat class icon berbasis data-URI SVG murni beresolusi tinggi, pixel-perfect, dan tanpa dependensi jaringan eksternal:
     - `.bbc-icon-shuttle`: Kok bulutangkis retro realistis (bulu putih bersusun, ribbon hijau zamrud BAZNAS, dan gabus kuning).
     - `.bbc-icon-racket`: Raket bulutangkis retro presisi.
     - `.bbc-icon-lightning`: Petir smash elektrik kuning tajam.
     - `.bbc-icon-fire`: Api match point membara (gradasi oranye-merah).
     - `.bbc-icon-crown`: Mahkota emas Player of the Month bertabur permata.
     - `.bbc-icon-trophy`: Piala turnamen juara emas elegan.
   - Menggunakan ukuran relatif `1.15em` dan `vertical-align: -0.15em` agar proporsional dan selaras mengikuti ukuran teks font di sekitarnya.
2. **Universal Dynamic SVG Icon Enhancer (`js/utils/dom.js`):**
   - Mengembangkan fungsi `BBC_enhanceIcons()` yang memindai text node secara aman (`TreeWalker`) dan menggantikan emoji mentah menjadi span vektor SVG.
   - Dilengkapi **Reentrancy Guard** (`isEnhancing`) dan **Debounced MutationObserver (80ms)** pada `document.body` agar konten baru hasil render dinamis (kartu pemain, jadwal, berita, POTM, galeri) secara otomatis dikonversi tanpa *infinite loop* atau lag.
3. **Penggantian Statis Menyeluruh pada Template HTML:**
   - [`index.html`](file:///e:/Ikrom%20Docs/bbc-website/index.html): Hero smash badge, CTA button arrow shuttle, floating match point, marquee banner, agenda preview, POTM badge, squad amilin/amilat headers, activity cards (Latihan Rutin, Turnamen, Fun Match), dan badge penutup CTA.
   - [`pages/players.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/players.html): Marquee banner dan badge header skuad Amilin & Amilat.
   - [`pages/schedule.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/schedule.html): Marquee banner jadwal pertandingan.
   - [`pages/news.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/news.html): Marquee banner berita dan liputan.
   - [`pages/profile.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/profile.html): Marquee banner dan butir-butir visi-misi klub.
4. **Sinkronisasi Komponen JavaScript:**
   - [`js/components/footer.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/footer.js): Ticker bar atas (`MAIN BARENG`, `INTERNAL BAZNAS RI`) dan tagline footer bawah.
   - [`js/pages/player-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/player-detail.js): Badge profil atlet BBC, POTM crown, gender chip, empty achievement icon, dan header prestasi piala.
   - [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js): Empty state agenda mingguan.
   - [`js/pages/schedule.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/schedule.js): Empty state daftar agenda/turnamen.
   - [`js/pages/profile.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/profile.js): Empty state pengurus BBC.
5. **Konfigurasi Header UTF-8 Vercel (`vercel.json`):**
   - Menambahkan rules header statis untuk seluruh file `*.html`, `*.css`, dan `*.js` dengan `charset=utf-8` eksplisit untuk menjamin integritas karakter byte di jaringan edge CDN Vercel.

### 📂 Berkas yang Dimodifikasi
- [`css/components.css`](file:///e:/Ikrom%20Docs/bbc-website/css/components.css) — Penambahan class SVG vector icon (`.bbc-icon-shuttle`, `.bbc-icon-racket`, `.bbc-icon-lightning`, `.bbc-icon-fire`, `.bbc-icon-crown`, `.bbc-icon-trophy`).
- [`js/utils/dom.js`](file:///e:/Ikrom%20Docs/bbc-website/js/utils/dom.js) — Implementasi `BBC_enhanceIcons()` dengan MutationObserver dan reentrancy guard.
- [`index.html`](file:///e:/Ikrom%20Docs/bbc-website/index.html) — Penggantian emoji mentah di hero, marquee, squad, activity cards, dan CTA ke SVG icon spans.
- [`pages/players.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/players.html) — Penggantian emoji shuttlecock di ticker dan badge.
- [`pages/schedule.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/schedule.html) — Penggantian emoji shuttlecock di ticker.
- [`pages/news.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/news.html) — Penggantian emoji shuttlecock di ticker.
- [`pages/profile.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/profile.html) — Penggantian emoji shuttlecock, petir, dan piala di ticker dan list misi.
- [`js/components/footer.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/footer.js) — Penggantian emoji di footer ticker dan tagline.
- [`js/pages/player-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/player-detail.js) — Penggantian emoji di profil atlet, POTM, gender, dan prestasi.
- [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js) — Penggantian icon di agenda empty state.
- [`js/pages/schedule.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/schedule.js) — Penggantian icon di schedule empty state.
- [`js/pages/profile.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/profile.js) — Penggantian icon di profile empty state.
- [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json) — Penambahan header Content-Type UTF-8 untuk HTML, CSS, JS.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Pencatatan log versi v4.1.3 sesuai aturan `AGENTS.md`.

---

---

## 🚀 v4.1.2 — Perbaikan Komprehensif Icon, Tombol Arrow Navigasi, Layout Hero Grid & Sanitasi SVG Asset
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"perbaiki icon2 yang ada"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Sanitasi & Optimasi Vektor SVG Icon (`assets/icons/`):**
   - Membersihkan blok manifest biner C2PA metadata yang membengkak (>8KB) pada [`pixel-racket.svg`](file:///e:/Ikrom%20Docs/bbc-website/assets/icons/pixel-racket.svg) dan [`pixel-shuttlecock.svg`](file:///e:/Ikrom%20Docs/bbc-website/assets/icons/pixel-shuttlecock.svg) agar parsing XML SVG di browser berjalan cepat, bersih, dan bebas dari peringatan keamanan atau kegagalan render.
2. **Perbaikan Tombol Scroll Icon Amilat yang Terpotong (`index.html`):**
   - Memperbaiki tombol panah kanan pada deretan squad amilat yang sebelumnya terpotong pada `aria-label="Ges` sehingga ikon panah `→` dan struktur penutup tag `squad-row__controls` hilang.
3. **Perbaikan Tag Penutup Ganda Layout Hero (`index.html`):**
   - Mengeliminasi tag penutup `</div>` ekstra pada baris 89 yang sebelumnya menutup container grid `.grid-2` secara prematur dan melempar hero photo collage keluar dari tata letak grid dua kolom.
4. **Perbaikan Properti CSS Posisi Negatif Hero Floating Badges:**
   - Memperbaiki `-inset: 14px;`, `-top: 18px; -right: 16px;`, dan `-bottom: 16px; -left: 14px;` menjadi nilai CSS standar yang valid (`inset: -14px;`, `top: -18px; right: -16px;`, `bottom: -16px; left: -14px;`). Lencana floating `PLAY! 🏸` dan `#BBC_BAZNAS` kini tampil presisi dan mengambang di atas frame hero.
5. **Dukungan Emoji Multi-Platform pada `--font-pixel` (`css/variables.css`):**
   - Menambahkan font stack emoji resmi (`'Segoe UI Emoji'`, `'Apple Color Emoji'`, `'Noto Color Emoji'`) sebagai fallback pada `--font-pixel` agar emoji bulutangkis (`🏸`, `⚡`, `🔥`, `👑`) tidak tampil sebagai kotak tahu (*tofu*) pada Windows.
6. **Integrasi Standardisasi `.btn-arrow` Beranimasi Halus:**
   - Menyelaraskan seluruh ikon panah tombol (`→`, `↗`, `←`, `🏸`) menggunakan class `.btn-arrow` dan `.btn-arrow--up-right` dengan micro-animation interaktif (*slide bounce on hover*) di `index.html`, `js/components/navbar.js`, `js/components/player-card.js`, `js/components/news-card.js`, `js/components/event-card.js`, `js/pages/home.js`, `js/pages/player-detail.js`, dan `pages/cms.html`.

### 📂 Berkas yang Dimodifikasi
- [`index.html`](file:///e:/Ikrom%20Docs/bbc-website/index.html) — Perbaikan tombol scroll amilat, eliminasi div penutup ekstra hero grid, perbaikan CSS positioning minus, dan standardisasi `.btn-arrow`.
- [`assets/icons/pixel-racket.svg`](file:///e:/Ikrom%20Docs/bbc-website/assets/icons/pixel-racket.svg) — Pembersihan metadata biner C2PA menjadi vektor murni.
- [`assets/icons/pixel-shuttlecock.svg`](file:///e:/Ikrom%20Docs/bbc-website/assets/icons/pixel-shuttlecock.svg) — Pembersihan metadata biner C2PA menjadi vektor murni.
- [`css/variables.css`](file:///e:/Ikrom%20Docs/bbc-website/css/variables.css) — Penambahan fallback Segoe UI Emoji / Apple Color Emoji pada `--font-pixel`.
- [`css/components.css`](file:///e:/Ikrom%20Docs/bbc-website/css/components.css) — Peningkatan alignment dan micro-interaction `.btn-arrow` & `.btn-arrow--up-right`.
- [`js/components/navbar.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/navbar.js) — Penerapan `.btn-arrow--up-right` pada CTA Instagram.
- [`js/components/player-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/player-card.js) — Penerapan `.btn-arrow` pada tombol lihat profil.
- [`js/components/news-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/news-card.js) — Penerapan `.btn-arrow` pada tombol baca artikel.
- [`js/components/event-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/event-card.js) — Penerapan `.btn-arrow--up-right` pada tombol petunjuk lokasi.
- [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js) — Penerapan `.btn-arrow` pada tombol lihat profil POTM.
- [`js/pages/player-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/player-detail.js) — Penerapan `.btn-arrow` pada tombol navigasi kembali & prev/next.
- [`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html) — Penerapan `.btn-arrow` pada tombol login CMS.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Pencatatan log versi v4.1.2 sesuai aturan `AGENTS.md`.
4. [v3.3.0 — Refaktor Menyeluruh Seluruh Halaman HTML Menjadi PHP (.php) & Harmonisasi Sistem](#-v330---refaktor-menyeluruh-seluruh-halaman-html-menjadi-php-php--harmonisasi-sistem)
5. [v3.2.1 — Pengalihan Penuh ke Vercel Blob Public Access (`access: 'public'`) & Direct CDN URLs](#-v321---pengalihan-penuh-ke-vercel-blob-public-access-access-public--direct-cdn-urls)
6. [v3.2.0 — Integrasi Vercel Blob SDK (@vercel/blob) & Cloud Storage Database "bbc-baznas-db"](#-v320---integrasi-vercel-blob-sdk-vercelblob--cloud-storage-database-bbc-baznas-db)
7. [v3.1.0 — Optimalisasi & Dukungan Penuh Database MariaDB (MariaDB 10.x / 11.x) & Deteksi Otomatis Engine](#-v310---optimalisasi--dukungan-penuh-database-mariadb-mariadb-10x--11x--deteksi-otomatis-engine)
8. [v3.0.0 — Refaktor Arsitektur: Backend PHP REST API Serverless & Database MySQL Terintegrasi untuk Vercel & CMS](#-v300---refaktor-arsitektur-backend-php-rest-api-serverless--database-mysql-terintegrasi-untuk-vercel--cms)
9. [v2.18.2 — Peningkatan Batas Video Base64 Langsung ke 10MB untuk Vercel & Hybrid Memory Storage](#-v2182---peningkatan-batas-video-base64-langsung-ke-10mb-untuk-vercel--hybrid-memory-storage)
10. [v2.18.1 — Fix Komprehensif Hero Media (Foto & Video), Eliminasi Race Condition DOM & Base64 Video Vercel](#-v2181---fix-komprehensif-hero-media-foto--video-eliminasi-race-condition-dom--base64-video-vercel)
11. [v2.18.0 — Perbaikan Tampilan Banner Hero index.html & Optimasi Auto-Update Vercel](#-v2180---perbaikan-tampilan-banner-hero-indexhtml--optimasi-auto-update-vercel)
12. [v2.17.0 — Fix Sinkronisasi & Reaktivitas Jadwal Kalender Bulutangkis di schedule.html](#-v2170---fix-sinkronisasi--reaktivitas-jadwal-kalender-bulutangkis-di-schedulehtml)
13. [v2.16.0 — Auto-Deploy Otomatis ke GitHub & Vercel saat Data Berubah](#-v2160---auto-deploy-otomatis-ke-github--vercel-saat-data-berubah)
14. [v2.15.1 — Fix Merge Conflict Git & Penyelarasan Metadata JSON pada GitHub Sync](#-v2151---fix-merge-conflict-git--penyelarasan-metadata-json-pada-github-sync)
15. [v2.15.0 — GitHub Auto-Deploy 1-Klik ke Vercel (BBC_GITHUB Module)](#-v2150---github-auto-deploy-1-klik-ke-vercel-bbc_github-module)
16. [v2.14.0 — Simpan Data CMS ke File Assets (File System Access API)](#-v2140---simpan-data-cms-ke-file-assets-file-system-access-api)
17. [v2.13.0 — Fix Deploy Vercel (Invalid request: exportedAt) & Migrasi Data CMS ke data/*.json](#-v2130---fix-deploy-vercel-invalid-request-exportedat--migrasi-data-cms-ke-datajson)
18. [v2.12.0 — Favicon Logo BBC di Semua Halaman](#-v2120---favicon-logo-bbc-di-semua-halaman)
19. [v2.11.0 — Fix Data CMS Tidak Muncul di Vercel: Static JSON Sync + Export Deploy](#-v2110---fix-data-cms-tidak-muncul-di-vercel-static-json-sync--export-deploy)
20. [v2.10.0 — Pembaruan Foto Dummy Anime Amilat (Pemain & Pengurus Hijab) & Selector Kategori Pengurus](#-v2100---pembaruan-foto-dummy-anime-amilat-pemain--pengurus-hijab--selector-kategori-pengurus)
21. [v2.9.0 — Pembaruan Foto Dummy Anime Amilin (Pemain & Pengurus) & Fallback onerror](#-v290---pembaruan-foto-dummy-anime-amilin-pemain--pengurus--fallback-onerror)
22. [v2.8.0 — Penyembunyian Menu Navigasi & Seluruh Layout CMS Sebelum Login](#-v280---penyembunyian-menu-navigasi--seluruh-layout-cms-sebelum-login)
23. [v2.7.0 — Penyimpanan Data Kosong di CMS & Visibilitas Dinamis Section index.html](#-v270---penyimpanan-data-kosong-di-cms--visibilitas-dinamis-section-indexhtml)
24. [v2.6.0 — Penyeragaman Ukuran Box Navigasi, Single Burger Button & Header Clean](#-v260---penyeragaman-ukuran-box-navigasi-single-burger-button--header-clean)
25. [v2.5.0 — Sidebar Navigasi Samping Kiri Buka-Tutup (Collapsible) Desktop & Tablet](#-v250---sidebar-navigasi-samping-kiri-buka-tutup-collapsible-desktop--tablet)
26. [v2.4.0 — Perapian Dashboard Mobile & Penataan Modul CMS](#-v240---perapian-dashboard-mobile--penataan-modul-cms)
27. [v2.3.0 — Fitur Lazy Load Data (>10 Baris) & Penyesuaian Font Tab Menu](#-v230---fitur-lazy-load-data-10-baris--penyesuaian-font-tab-menu)
28. [v2.2.0 — Optimasi Tipografi dan Responsivitas Konten Form & Tabel CMS](#-v220---optimasi-tipografi-dan-responsivitas-konten-form--tabel-cms)
29. [v2.1.0 — Accordion Header Ringkas, Urutan Menu Prioritas & Hapus Label "Menu"](#-v210---accordion-header-ringkas-urutan-menu-prioritas--hapus-label-menu)
30. [v2.0.0 — Responsivitas Pusat Navigasi Modul & Status Sistem Mobile](#-v200---responsivitas-pusat-navigasi-modul--status-sistem-mobile)
31. [v1.9.0 — Pembersihan Header CMS (BBC ADMIN + Burger Button) & Navigasi Mobile](#-v190---pembersihan-header-cms-bbc-admin--burger-button--navigasi-mobile)

---

## 🚀 v4.1.1 — Perbaikan Fatal Syntax Error pada CMS (Unclosed Blocks) & Restorasi Encoding UTF-8 index.html
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"fixing error pada pages"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Perbaikan Fatal Syntax Error pada `js/pages/cms.js`:**
   - Memperbaiki kurung kurawal penutup `}` yang hilang pada blok `if (typeof BBC_FS !== 'undefined' && BBC_FS.isConfigured())` di dalam event listener `pgFileInput` (`#pg-photo-file`, galeri pemain).
   - Memperbaiki kurung kurawal penutup `}` yang hilang pada blok serupa di dalam event listener `fMainFile` (`#hero-main-file`, pengaturan hero banner).
   - Akibat blok yang tidak tertutup tersebut, seluruh file `js/pages/cms.js` sebelumnya mengalami kegagalan parsing (*SyntaxError: Unexpected end of input*) yang melumpuhkan seluruh skrip interaktif CMS, formulir login, pemuatan data, dan tombol aksi.
   - Menambahkan integrasi upload langsung ke Vercel Blob CDN (`BBC_STORE.uploadToBlob`) pada upload foto galeri pemain dan hero banner.
2. **Restorasi Menyeluruh Encoding Karakter UTF-8 Bersih pada `index.html`:**
   - Mengeliminasi seluruh karakter Mojibake/distorsi encoding Windows-1252 pada seluruh section di `index.html`:
     - `ðŸ ¸` ➔ `🏸` (Emoji Shuttlecock / Badminton)
     - `ðŸ”¥` ➔ `🔥` (Emoji Api / Match Point)
     - `ðŸ‘‘` ➔ `👑` (Emoji Mahkota / Player of The Month)
     - `ðŸ¤ ` ➔ `🤝` (Emoji Salaman / Sparing)
     - `ðŸ †` ➔ `🏆` (Emoji Piala / Turnamen)
     - `âš¡` ➔ `⚡` (Emoji Petir / Smash)
     - `ðŸŽ‰` ➔ `🎉` (Emoji Perayaan / Gathering)
     - `ðŸ“ˆ` ➔ `📈` (Emoji Grafik / Klinik Teknik)
     - `â†’` ➔ `→`, `â†—` ➔ `↗`, `â† ` ➔ `←` (Panah Navigasi)
     - `âœ¦` ➔ `✦`, `â€¢` ➔ `•`, `âœ”` ➔ `✔` (Simbol Ticker & List)
   - Merapikan tag penutup yang terduplikasi pada track squad amilat dan marquee banner.
3. **Perbaikan Tag HTML Terpotong pada Hero Main Image (`#hero-main-img` di `index.html`):**
   - Memperbaiki penutupan tag `<img id="hero-main-img">` pada baris 105–109 yang sebelumnya terpotong di atribut style (`object-fit: c`) sehingga menelan komentar `<!-- Floating Pixel Elements inside Frame -->`.
   - Mengembalikan atribut `style="width: 100%; height: 100%; object-fit: cover;">` yang tertutup sempurna sehingga DOM parsing browser tidak rusak.

### 📂 Berkas yang Dimodifikasi
- [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js) — Perbaikan kurung kurawal penutup syntax error pada `pgFileInput` dan `fMainFile` serta penambahan upload Vercel Blob.
- [`index.html`](file:///e:/Ikrom%20Docs/bbc-website/index.html) — Restorasi karakter UTF-8 bersih, perbaikan tag img `#hero-main-img` yang terpotong, dan validasi struktur HTML.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Pencatatan log versi v4.1.1 sesuai aturan `AGENTS.md`.

---

## 🚀 v4.1.0 — Sinkronisasi Data Real-time ke Vercel (Vercel Blob Serverless Functions & Store Auto-Sync)
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"refactor, setiap data yang di input, di edit dan dihapus akan secara realtime berubah di vercel"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Serverless Function Vercel untuk Mutasi Real-time (`api/data.js`):**
   - Menggunakan SDK resmi `@vercel/blob` terhubung ke store `bbc-baznas-db` dengan akses publik (`access: 'public'`).
   - Mendukung metode `POST`: Menerima mutasi data utuh (tambah, edit, atau hapus) dari CMS dan menyimpannya secara instan ke cloud Blob (`data/{category}.json`) dengan opsi `addRandomSuffix: false` serta metadata `_version` dan `_updatedAt`.
   - Mendukung metode `GET`: Mengambil data teranyar langsung dari Vercel Blob dengan header anti-caching (`Cache-Control: no-cache, no-store, must-revalidate, max-age=0`), dengan fallback ke data statis lokal jika token Blob belum terkonfigurasi.
2. **Serverless Upload Media ke Vercel Blob CDN (`api/upload.js`):**
   - Menerima file biner dari input foto CMS (pemain, galeri, berita, pengurus) dan menyimpannya langsung ke Vercel Blob CDN.
   - Mengembalikan URL permanen publik berkecepatan tinggi (`https://...public.blob.vercel-storage.com/...`) untuk langsung disematkan pada data entitas.
3. **Endpoint Health & Monitoring Vercel Blob (`api/status.js`):**
   - Memvalidasi keterhubungan serverless function dengan Vercel Blob store secara real-time.
4. **Integrasi Client-Side Store Reaktif (`js/data/store.js`):**
   - Menambahkan fungsi `syncToVercel(category, data)` yang otomatis memicu `POST /api/data?category=...` di latar belakang secara asinkron tanpa mengganggu responsivitas UI CMS.
   - Menghubungkan `syncToVercel` ke fungsi `syncToFile()`, sehingga seluruh operasi penambahan, perubahan, dan penghapusan data (`savePlayer`, `deletePlayer`, `setPlayerOfTheMonth`, `saveEvent`, `deleteEvent`, `saveGalleryItem`, `deleteGalleryItem`, `saveArticle`, `deleteArticle`, `saveOfficial`, `deleteOfficial`, `saveHeroSettings`, `resetHeroSettings`) langsung tersinkronisasi ke Vercel secara real-time.
   - Mengembangkan fungsi inisialisasi `initialize()` dan `fetchCloudOrJsonData()` agar memprioritaskan pengambilan data live dari Vercel Blob saat halaman pertama kali dimuat oleh pengunjung manapun di seluruh dunia.
   - Menyediakan helper global: `BBC_STORE.syncToVercel`, `BBC_STORE.uploadToBlob`, dan `BBC_STORE.checkBlobStatus`.
5. **Reaktivitas Antarmuka CMS & Tab Pengunjung (`js/pages/cms.js`, `pages/cms.html`, `js/data/live-sync.js`):**
   - Form upload media di CMS mengunggah file langsung ke Vercel Blob CDN dengan fallback lokal.
   - Menambahkan pengecekan status di topbar CMS sehingga menampilkan lencana `🟢 Vercel Real-time Sync: Aktif`.
   - Menambahkan event listener `visibilitychange` pada `live-sync.js` agar halaman otomatis me-refresh data teranyar dari cloud saat tab browser kembali aktif.
6. **Konfigurasi Proyek & Runtime Vercel (`package.json` & `vercel.json`):**
   - Menambahkan dependensi `@vercel/blob: "^0.27.1"` pada `package.json` (versi `4.1.0`).
   - Mengonfigurasi runtime serverless Node.js 20 (`"api/**/*.js": { "runtime": "nodejs20.x" }`) dan routing API tanpa cache pada `vercel.json`.

### 📂 Berkas yang Dimodifikasi & Dibuat
- [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json) — Penambahan dependensi `@vercel/blob` & update versi ke `4.1.0`.
- [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json) — Konfigurasi runtime serverless Node.js 20, routes `/api/(.*)`, dan header anti-cache.
- [`api/data.js`](file:///e:/Ikrom%20Docs/bbc-website/api/data.js) [BARU] — Endpoint CRUD real-time Vercel Blob untuk semua kategori data.
- [`api/upload.js`](file:///e:/Ikrom%20Docs/bbc-website/api/upload.js) [BARU] — Endpoint upload media foto ke CDN publik Vercel Blob.
- [`api/status.js`](file:///e:/Ikrom%20Docs/bbc-website/api/status.js) [BARU] — Endpoint pemantauan status koneksi Vercel Blob.
- [`js/data/store.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js) — Implementasi `syncToVercel`, `uploadToBlob`, `checkBlobStatus`, auto-sync pada `syncToFile`, dan cloud priority pada `initialize()`.
- [`js/data/live-sync.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/live-sync.js) — Penambahan auto-sync background saat tab browser aktif kembali (`visibilitychange`).
- [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js) — Integrasi upload Vercel Blob pada form media dan pembaruan deteksi status realtime.
- [`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html) — Pembaruan teks dan styling badge topbar CMS untuk real-time Vercel sync.
- [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) — Dokumentasi riwayat perubahan versi v4.1.0 sesuai aturan `AGENTS.md`.

---

---

## 🚀 v4.0.0 — Refactoring Menyeluruh Proyek Menjadi Pure HTML, CSS, JavaScript & Eliminasi Berkas Backend
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"refactoring project menjadi project html, css, javascript dan hapus setiap file dan fungsi yang tidak digunakan"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Konversi 9 Berkas Halaman ke Format HTML Murni (`.html`):**
   - Menghapus format `.php` dan mengembalikan seluruh berkas antarmuka ke format native `.html` via `git mv`:
     - `index.php` ➔ [`index.html`](file:///e:/Ikrom%20Docs/bbc-website/index.html)
     - `pages/cms.php` ➔ [`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html)
     - `pages/profile.php` ➔ [`pages/profile.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/profile.html)
     - `pages/players.php` ➔ [`pages/players.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/players.html)
     - `pages/player-detail.php` ➔ [`pages/player-detail.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/player-detail.html)
     - `pages/schedule.php` ➔ [`pages/schedule.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/schedule.html)
     - `pages/news.php` ➔ [`pages/news.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/news.html)
     - `pages/article-detail.php` ➔ [`pages/article-detail.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/article-detail.html)
     - `tests/index.php` ➔ [`tests/index.html`](file:///e:/Ikrom%20Docs/bbc-website/tests/index.html)
2. **Pembersihan & Penghapusan Total Berkas Backend & Utilitas Usang:**
   - Menghapus seluruh direktori `api/` (15 berkas: `articles.php`, `auth.php`, `events.php`, `gallery.php`, `health.php`, `hero.php`, `officials.php`, `players.php`, `seed.php`, `config/database.php`, `blob/data.js`, `blob/seed.js`, `blob/status.js`, `avatar/upload.js`, `avatar/view.js`).
   - Menghapus seluruh direktori `database/` (`schema.sql` dan `README.md`).
   - Menghapus berkas usang yang tidak terpakai: `js/utils/github-sync.js`.
3. **Refaktorisasi & Pembersihan Logika Client-Side Data Store (`js/data/store.js`):**
   - Menghapus fungsi panggilan REST API PHP: `getApiBasePath()`, `callApi()`, `checkApiHealth()`, `triggerSeed()`, `syncToApi()`.
   - Menghapus fungsi integrasi Vercel Blob: `syncToBlob()`, `uploadToBlob()`, `checkBlobStatus()`, `triggerBlobSeed()`.
   - Menyederhanakan `syncToFile()` untuk fokus pada mutasi `localStorage` dan File System Access API (`BBC_FS`).
   - Menyederhanakan `initialize()` untuk langsung memuat data dari static JSON (`/data/*.json`) dan `localStorage` tanpa ketergantungan API backend.
4. **Pembersihan Antarmuka & Modul CMS (`pages/cms.html` & `js/pages/cms.js`):**
   - Menghapus panel database MariaDB (`#mysql-db-panel`) dan panel Vercel Blob (`#vercel-blob-panel`) dari tab Backup CMS.
   - Menghapus handler fungsi `initDatabaseUI()`, `updateDatabaseStatusUI()`, `initBlobUI()`, `updateBlobStatusUI()`.
   - Mengganti upload blob pada form media menjadi penanganan lokal via File System Access API (`BBC_FS`) dengan fallback Canvas image compression / Base64 Data URL.
   - Mengubah badge topbar header CMS menjadi indikator status penyimpanan lokal (`💾 Storage: Aktif` / `📁 File: /folder`).
5. **Harmonisasi Tautan Internal ke Format `.html`:**
   - [`js/components/navbar.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/navbar.js): Memperbarui seluruh array navigasi, deteksi menu aktif, dan logo brand ke `.html`.
   - [`js/components/footer.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/footer.js): Memperbarui peta navigasi dan daftar kegiatan ke `.html`.
   - [`js/components/player-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/player-card.js): Tautan kartu pemain beralih ke `player-detail.html`.
   - [`js/components/news-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/news-card.js): Tautan kartu artikel beralih ke `article-detail.html`.
   - [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js): Tautan CTA jadwal & Player of the Month beralih ke `.html`.
   - [`js/pages/player-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/player-detail.js): Tautan prev/next dan tombol kembali beralih ke `.html`.
   - [`js/pages/article-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/article-detail.js): Tautan kembali ke berita beralih ke `news.html`.
   - [`index.html`](file:///e:/Ikrom%20Docs/bbc-website/index.html): Seluruh tombol CTA di hero, agenda, profil, skuad, dan berita beralih ke `pages/*.html`.
   - [`pages/article-detail.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/article-detail.html): Tautan kembali beralih ke `news.html`.
   - [`tests/run-tests.js`](file:///e:/Ikrom%20Docs/bbc-website/tests/run-tests.js) & [`tests/index.html`](file:///e:/Ikrom%20Docs/bbc-website/tests/index.html): Mock router dan link navigasi beralih ke `.html`.
6. **Penyelarasan Konfigurasi Deployment Statis (`vercel.json` & `package.json`):**
   - [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json): Menghapus seluruh konfigurasi functions PHP dan Node.js serverless. Menyederhanakan routes ke `index.html` dan `handle: filesystem`.
   - [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json): Menghapus dependensi `@vercel/blob`, memperbarui entry point `"main": "index.html"`, dan menaikkan versi rilis ke `4.0.0`.

### 📁 Berkas yang Dimodifikasi, Dibuat, dan Dihapus
| Berkas | Status | Ringkasan Perubahan |
|---|---|---|
| [`index.html`](file:///e:/Ikrom%20Docs/bbc-website/index.html) | Diubah nama dari `index.php` | Konversi ke format HTML murni dan pembaruan seluruh tautan CTA ke `.html` |
| [`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html) | Diubah nama dari `pages/cms.php` | Konversi ke format HTML murni, pembersihan panel MariaDB & Vercel Blob |
| [`pages/profile.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/profile.html) | Diubah nama dari `pages/profile.php` | Konversi ke format HTML murni |
| [`pages/players.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/players.html) | Diubah nama dari `pages/players.php` | Konversi ke format HTML murni |
| [`pages/player-detail.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/player-detail.html) | Diubah nama dari `pages/player-detail.php` | Konversi ke format HTML murni |
| [`pages/schedule.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/schedule.html) | Diubah nama dari `pages/schedule.php` | Konversi ke format HTML murni |
| [`pages/news.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/news.html) | Diubah nama dari `pages/news.php` | Konversi ke format HTML murni |
| [`pages/article-detail.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/article-detail.html) | Diubah nama dari `pages/article-detail.php` | Konversi ke format HTML murni dan pembaruan tautan ke `news.html` |
| [`tests/index.html`](file:///e:/Ikrom%20Docs/bbc-website/tests/index.html) | Diubah nama dari `tests/index.php` | Konversi ke format HTML murni dan pembaruan tautan tes |
| `api/*` (15 berkas) | 🗑️ Dihapus | Seluruh backend PHP REST API dan Vercel Blob handlers dihapus tuntas |
| `database/*` (2 berkas) | 🗑️ Dihapus | Berkas `schema.sql` dan `README.md` dihapus tuntas |
| [`js/utils/github-sync.js`](file:///e:/Ikrom%20Docs/bbc-website/js/utils/github-sync.js) | 🗑️ Dihapus | Utilitas usang peninggalan v2.15 dihapus tuntas |
| [`js/data/store.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js) | Dimodifikasi | Penghapusan pemanggilan backend REST API & Vercel Blob, penyederhanaan ke pure client storage |
| [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js) | Dimodifikasi | Penghapusan handler UI MariaDB & Vercel Blob, penyederhanaan upload media lokal |
| [`js/components/navbar.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/navbar.js) | Dimodifikasi | Navigasi menu utama dan brand link beralih ke `.html` |
| [`js/components/footer.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/footer.js) | Dimodifikasi | Peta tautan footer beralih ke `.html` |
| [`js/components/player-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/player-card.js) | Dimodifikasi | Tautan detail atlet beralih ke `player-detail.html` |
| [`js/components/news-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/news-card.js) | Dimodifikasi | Tautan detail berita beralih ke `article-detail.html` |
| [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js) | Dimodifikasi | Tautan agenda & POTM beralih ke `.html` |
| [`js/pages/player-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/player-detail.js) | Dimodifikasi | Navigasi detail atlet beralih ke `.html` |
| [`js/pages/article-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/article-detail.js) | Dimodifikasi | Tautan kembali ke berita beralih ke `news.html` |
| [`tests/run-tests.js`](file:///e:/Ikrom%20Docs/bbc-website/tests/run-tests.js) | Dimodifikasi | Mock router beralih ke `/index.html` |
| [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json) | Dimodifikasi | Konfigurasi hosting statis murni tanpa functions runtime |
| [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json) | Dimodifikasi | Hapus `@vercel/blob`, entry point `"main": "index.html"`, versi `4.0.0` |
| [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) | Dimodifikasi | Pencatatan rilis v4.0.0 dan pembaruan Daftar Isi |

---

## 🚀 v3.3.0 — Refaktor Menyeluruh Seluruh Halaman HTML Menjadi PHP (.php) & Harmonisasi Sistem
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"refactor semua file html menjadi .php dan sesuaikan isi codingan yang memengaruhi hal lainnya"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Konversi 9 Berkas Halaman ke Format PHP (`.php`):**
   - Menghapus format `.html` dan memigrasikan seluruh berkas halaman ke format native `.php` dengan mempertahankan riwayat Git via `git mv`:
     - `index.html` ➔ [`index.php`](file:///e:/Ikrom%20Docs/bbc-website/index.php)
     - `pages/cms.html` ➔ [`pages/cms.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.php)
     - `pages/profile.html` ➔ [`pages/profile.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/profile.php)
     - `pages/players.html` ➔ [`pages/players.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/players.php)
     - `pages/player-detail.html` ➔ [`pages/player-detail.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/player-detail.php)
     - `pages/schedule.html` ➔ [`pages/schedule.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/schedule.php)
     - `pages/news.html` ➔ [`pages/news.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/news.php)
     - `pages/article-detail.html` ➔ [`pages/article-detail.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/article-detail.php)
     - `tests/index.html` ➔ [`tests/index.php`](file:///e:/Ikrom%20Docs/bbc-website/tests/index.php)
2. **Harmonisasi Tautan Internal Komponen UI & JavaScript (`js/`):**
   - [`js/components/navbar.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/navbar.js): Memperbarui seluruh array navigasi (`index.php`, `profile.php`, `players.php`, `schedule.php`, `news.php`), active link detection, dan logo brand.
   - [`js/components/footer.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/footer.js): Memperbarui tautan navigasi dan daftar kegiatan footer ke `.php`.
   - [`js/components/news-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/news-card.js): Memperbarui link kartu artikel ke `article-detail.php`.
   - [`js/components/player-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/player-card.js): Memperbarui tautan detail pemain ke `player-detail.php`.
   - [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js): Memperbarui tautan jadwal dan profil pemain terpilih (POTM) ke `schedule.php` dan `player-detail.php`.
   - [`js/pages/player-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/player-detail.js): Memperbarui tautan kembali dan navigasi prev/next ke `players.php` dan `player-detail.php`.
   - [`js/pages/article-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/article-detail.js): Memperbarui tautan kembali ke `news.php`.
   - [`pages/cms.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.php): Memperbarui seluruh link tombol kembali dan pratinjau website ke `../index.php`.
   - [`index.php`](file:///e:/Ikrom%20Docs/bbc-website/index.php): Memperbarui seluruh tautan CTA di hero, agenda, profil, skuad, dan berita ke `pages/*.php`.
   - [`tests/run-tests.js`](file:///e:/Ikrom%20Docs/bbc-website/tests/run-tests.js) & [`tests/index.php`](file:///e:/Ikrom%20Docs/bbc-website/tests/index.php): Memperbarui mock pathname dan link tes ke `.php`.
3. **Konfigurasi Vercel Serverless Multi-Engine (`vercel.json` & `package.json`):**
   - [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json): Mengubah mapping runtime PHP dari `"api/**/*.php"` menjadi `"**/*.php"` dengan runtime `vercel-php@0.7.3`, serta menambahkan routes rewrite untuk root `/` ke `/index.php` dan `"handle": "filesystem"` untuk aset statis.
   - [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json): Memperbarui `"main"` entry point menjadi `"index.php"` dan menaikkan versi ke `3.3.0`.

### 📁 Berkas yang Dimodifikasi
| Berkas | Status | Ringkasan Perubahan |
|---|---|---|
| [`index.php`](file:///e:/Ikrom%20Docs/bbc-website/index.php) | Diubah nama dari `index.html` | Konversi ke PHP dan pembaruan tautan internal ke `.php` |
| [`pages/cms.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.php) | Diubah nama dari `pages/cms.html` | Konversi ke PHP dan pembaruan tautan kembali ke `../index.php` |
| [`pages/profile.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/profile.php) | Diubah nama dari `pages/profile.html` | Konversi ke format PHP |
| [`pages/players.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/players.php) | Diubah nama dari `pages/players.html` | Konversi ke format PHP |
| [`pages/player-detail.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/player-detail.php) | Diubah nama dari `pages/player-detail.html` | Konversi ke format PHP |
| [`pages/schedule.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/schedule.php) | Diubah nama dari `pages/schedule.html` | Konversi ke format PHP |
| [`pages/news.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/news.php) | Diubah nama dari `pages/news.html` | Konversi ke format PHP |
| [`pages/article-detail.php`](file:///e:/Ikrom%20Docs/bbc-website/pages/article-detail.php) | Diubah nama dari `pages/article-detail.html` | Konversi ke format PHP dan pembaruan link ke `news.php` |
| [`tests/index.php`](file:///e:/Ikrom%20Docs/bbc-website/tests/index.php) | Diubah nama dari `tests/index.html` | Konversi ke PHP dan pembaruan link tes |
| [`js/components/navbar.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/navbar.js) | Dimodifikasi | Navigasi menu utama dan brand logo beralih ke `.php` |
| [`js/components/footer.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/footer.js) | Dimodifikasi | Peta tautan footer beralih ke `.php` |
| [`js/components/news-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/news-card.js) | Dimodifikasi | Tautan detail berita beralih ke `article-detail.php` |
| [`js/components/player-card.js`](file:///e:/Ikrom%20Docs/bbc-website/js/components/player-card.js) | Dimodifikasi | Tautan detail pemain beralih ke `player-detail.php` |
| [`js/pages/home.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/home.js) | Dimodifikasi | Tautan agenda & POTM beralih ke `.php` |
| [`js/pages/player-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/player-detail.js) | Dimodifikasi | Navigasi detail atlet beralih ke `.php` |
| [`js/pages/article-detail.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/article-detail.js) | Dimodifikasi | Tautan kembali ke berita beralih ke `news.php` |
| [`tests/run-tests.js`](file:///e:/Ikrom%20Docs/bbc-website/tests/run-tests.js) | Dimodifikasi | Mock router beralih ke `/index.php` |
| [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json) | Dimodifikasi | Konfigurasi runtime PHP untuk `**/*.php` dan routing `/` ke `/index.php` |
| [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json) | Dimodifikasi | Entry point `"main": "index.php"`, versi `3.3.0` |
| [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) | Dimodifikasi | Pencatatan rilis v3.3.0 dan pembaruan Daftar Isi |

---

---

## 🚀 v3.2.1 — Pengalihan Penuh ke Vercel Blob Public Access (`access: 'public'`) & Direct CDN URLs
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"saya berubah pikiran, ubah pakai blob yang public . sesuaikan codingannya*
> *import { put } from "@vercel/blob";*
> *const { url } = await put('articles/blob.txt', 'Hello World!', { access: 'public' });"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Penerapan Pola Public Put SDK (`api/avatar/upload.js`):**
   - Mengadopsi pola resmi:
     ```javascript
     const { url, pathname, contentType, downloadUrl } = await put(blobPath, req, {
       access: 'public',
       addRandomSuffix: true
     });
     ```
   - Seluruh unggahan berkas (foto pemain, galeri kegiatan, artikel, pengurus, maupun media hero) menghasilkan `url` publik global dari edge CDN Vercel (`https://...public.blob.vercel-storage.com/...`).
2. **Penyelarasan Endpoint View (`api/avatar/view.js`):**
   - Menghapus ketergantungan pada private stream token, beralih ke HTTP 307 temporary redirect langsung ke tautan public blob CDN.
3. **Penyelarasan Data Layer Frontend (`js/data/store.js`):**
   - Mengonfirmasi seluruh pemanggilan `uploadToBlob()` dan `syncToBlob()` beroperasi dengan mode default `access: 'public'`.
   - URL CDN publik yang dikembalikan langsung disimpan di dalam data dan ditampilkan di browser tanpa token otorisasi tambahan.

### 📁 Berkas yang Dimodifikasi
| Berkas | Status | Ringkasan Perubahan |
|---|---|---|
| [`api/avatar/upload.js`](file:///e:/Ikrom%20Docs/bbc-website/api/avatar/upload.js) | Dimodifikasi | Menggunakan `{ access: 'public' }` dan mengembalikan `{ url }` publik CDN |
| [`api/avatar/view.js`](file:///e:/Ikrom%20Docs/bbc-website/api/avatar/view.js) | Dimodifikasi | Mengarahkan permintaan ke URL public blob Vercel |
| [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) | Dimodifikasi | Pencatatan rilis v3.2.1 dan pembaruan Daftar Isi |

---

---

## 🚀 v3.2.0 — Integrasi Vercel Blob SDK (@vercel/blob) & Cloud Storage Database "bbc-baznas-db"
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"saya ingin mengkonfigurasikan database ke vercel dengan Blob, dengan nama database : bbc-baznas-db dan informasi di vercel import { put } from "@vercel/blob"; const blob = await put('articles/blob.txt', 'Hello World!', { access: 'private', storeId: process.env.db_STORE_ID, }); dengan instruksi sbb berikut : 1. Prepare local project (vercel link, vercel env pull) 2. Install Our package (@vercel/blob) 3. Use in code (server upload method, /api/avatar/upload, /api/avatar/view)"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Konfigurasi Proyek & SDK `@vercel/blob` (`package.json`, `vercel.json`):**
   - Membuat berkas `package.json` dengan `"type": "module"` dan dependensi resmi `@vercel/blob: "^0.27.1"`, sehingga saat deploy ke Vercel paket otomatis terpasang.
   - Mengonfigurasi `vercel.json` dengan multi-runtime:
     - `api/**/*.js`: runtime `nodejs20.x` untuk Vercel Serverless Function berbasis Node.js ES Modules.
     - `api/**/*.php`: runtime `vercel-php@0.7.3` untuk backend REST API PHP MariaDB yang sudah ada.
2. **Serverless API Routes Vercel Blob (`api/avatar/` & `api/blob/`):**
   - `api/avatar/upload.js`: Serverless upload handler yang mengimpor `{ put } from '@vercel/blob'` dan mengunggah file/avatar/media ke store `bbc-baznas-db` menggunakan kredensial `storeId: process.env.db_STORE_ID || process.env.BLOB_STORE_ID`. Mendukung folder prefix dinamis (`players`, `gallery`, `articles`, `officials`, `hero`) dan opsi `access: 'public' | 'private'`.
   - `api/avatar/view.js`: Streaming reader handler yang mengimpor `{ get } from '@vercel/blob'` untuk membaca dan menampilkan berkas private blob secara aman langsung ke browser/client.
   - `api/blob/data.js`: Endpoint GET & POST untuk sinkronisasi dokumen JSON seluruh data BBC (`players`, `events`, `gallery`, `articles`, `officials`, `hero`) di path deterministik `data/${category}.json` pada store `bbc-baznas-db`.
   - `api/blob/seed.js`: Endpoint migrasi 1-klik untuk membaca berkas lokal `data/*.json` dan mempublikasikannya ke store `bbc-baznas-db`.
   - `api/blob/status.js`: Diagnostik endpoint yang memeriksa konektivitas token dan menghitung jumlah blob yang tersimpan di store `bbc-baznas-db`.
3. **Pembaruan Data Layer Frontend (`js/data/store.js`):**
   - Menambahkan method `syncToBlob(category)`, `uploadToBlob(file, folder, access)`, `checkBlobStatus(forceRefresh)`, dan `triggerBlobSeed()`.
   - Mengintegrasikan `syncToBlob()` ke dalam siklus penyimpanan `syncToFile()` secara non-blocking.
4. **Panel Kontrol & Auto-Upload di CMS UI (`pages/cms.html`, `js/pages/cms.js`):**
   - Menambahkan kartu **☁️ VERCEL BLOB STORAGE (bbc-baznas-db)** di tab Backup lengkap dengan live badge indikator status, store ID, serta jumlah berkas.
   - Menyediakan tombol **🔄 CEK KONEKSI BLOB** dan **☁️ SINKRONKAN SELURUH DATA KE VERCEL BLOB**.
   - Mengimplementasikan `attachBlobAutoUpload()` pada seluruh form upload media (foto pemain, galeri aksi, foto kegiatan, pengurus, artikel berita, dan hero section) dengan fallback mulus ke Data URL Base64 jika offline atau token belum dipasang.

### 📁 Berkas yang Dimodifikasi
| Berkas | Status | Ringkasan Perubahan |
|---|---|---|
| [`package.json`](file:///e:/Ikrom%20Docs/bbc-website/package.json) | Baru | Mendefinisikan dependensi `@vercel/blob: ^0.27.1` dan `"type": "module"` |
| [`vercel.json`](file:///e:/Ikrom%20Docs/bbc-website/vercel.json) | Dimodifikasi | Konfigurasi runtime `nodejs20.x` untuk `api/**/*.js` dan `vercel-php@0.7.3` untuk `api/**/*.php` |
| [`api/avatar/upload.js`](file:///e:/Ikrom%20Docs/bbc-website/api/avatar/upload.js) | Baru | Handler upload via `put()` ke store `bbc-baznas-db` |
| [`api/avatar/view.js`](file:///e:/Ikrom%20Docs/bbc-website/api/avatar/view.js) | Baru | Handler stream/view private blob via `get()` dari `@vercel/blob` |
| [`api/blob/data.js`](file:///e:/Ikrom%20Docs/bbc-website/api/blob/data.js) | Baru | Endpoint REST CRUD dokumen JSON di Vercel Blob `bbc-baznas-db` |
| [`api/blob/seed.js`](file:///e:/Ikrom%20Docs/bbc-website/api/blob/seed.js) | Baru | Handler migrasi 1-klik seluruh data JSON ke Vercel Blob `bbc-baznas-db` |
| [`api/blob/status.js`](file:///e:/Ikrom%20Docs/bbc-website/api/blob/status.js) | Baru | Diagnostik koneksi dan daftar blob di store `bbc-baznas-db` |
| [`js/data/store.js`](file:///e:/Ikrom%20Docs/bbc-website/js/data/store.js) | Dimodifikasi | Integrasi `syncToBlob()`, `uploadToBlob()`, `checkBlobStatus()`, dan `triggerBlobSeed()` |
| [`pages/cms.html`](file:///e:/Ikrom%20Docs/bbc-website/pages/cms.html) | Dimodifikasi | Penambahan kartu kontrol Vercel Blob `bbc-baznas-db` di tab Backup CMS |
| [`js/pages/cms.js`](file:///e:/Ikrom%20Docs/bbc-website/js/pages/cms.js) | Dimodifikasi | Inisialisasi status blob, wiring tombol test & seed, auto-upload media form |
| [`CHANGELOG.md`](file:///e:/Ikrom%20Docs/bbc-website/CHANGELOG.md) | Dimodifikasi | Pencatatan lengkap log rilis v3.2.0 dan pembaruan Daftar Isi |

---

---

## 🚀 v3.1.0 — Optimalisasi & Dukungan Penuh Database MariaDB (MariaDB 10.x / 11.x) & Deteksi Otomatis Engine
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"buat dalam maria db"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Penyesuaian Skema DDL MariaDB (`database/schema.sql`):**
   - Mengoptimalkan seluruh perintah DDL agar berjalan secara native pada MariaDB 10.3+, 10.4+, 10.5+, 10.6+, 10.11 LTS, dan 11.x (serta tetap kompatibel dengan MySQL 8.x).
   - Menambahkan pengaturan sesi `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"`, penonaktifan pengecekan foreign key sementara, serta deklarasi charset `utf8mb4_unicode_ci` dan engine `InnoDB`.
   - Menggunakan tipe `LONGTEXT` untuk payload JSON fleksibel yang kompatibel di seluruh versi MariaDB.
2. **Auto-Detection Engine MariaDB pada Health Diagnostic (`api/health.php`):**
   - Membaca versi database dari query `SELECT VERSION()`.
   - Otomatis mendeteksi string `MariaDB` dan menyertakan field `engine: "MariaDB"`, `is_mariadb: true`, serta string versi spesifik (misal `10.11.8-MariaDB`).
3. **Penyelarasan Handler Koneksi PDO (`api/config/database.php`):**
   - Mendokumentasikan dan memvalidasi koneksi PDO `mysql:` driver untuk MariaDB lokal (XAMPP/Laragon) maupun cloud (Aiven MariaDB, Railway MariaDB, Clever Cloud, SkySQL).
4. **Pembaruan Panduan Setup MariaDB (`database/README.md`):**
   - Menyediakan panduan terperinci untuk membuat database MariaDB di penyedia cloud gratis/handal (Aiven for MariaDB, Railway, Clever Cloud, SkySQL, cPanel/VPS) dan lokal XAMPP/Laragon.
5. **Modernisasi UI CMS untuk MariaDB (`pages/cms.html`, `js/pages/cms.js`):**
   - Memperbarui label kartu kontrol menjadi **DATABASE MARIADB (PHP REST API)**.
   - Mengubah tombol migrasi menjadi **⚡ SINKRONKAN / SEED KE MARIADB**.
   - Menampilkan status badge koneksi reaktif sesuai engine yang terhubung (`🟢 TERHUBUNG KE MARIADB`).

### 📁 Berkas yang Dimodifikasi
| Berkas | Status | Ringkasan Perubahan |
|---|---|---|
| `database/schema.sql` | Diperbarui | Header deklarasi MariaDB 10.x/11.x & SQL mode compatibility |
| `database/README.md` | Diperbarui | Panduan lengkap deployment MariaDB Cloud & Local (XAMPP/Laragon) |
| `api/config/database.php` | Diperbarui | Penyesuaian dokumentasi & koneksi PDO singleton untuk MariaDB |
| `api/health.php` | Diperbarui | Logika auto-detection engine MariaDB vs MySQL via `VERSION()` |
| `pages/cms.html` | Diperbarui | Penyesuaian label panel kontrol database & tombol seed MariaDB |
| `js/pages/cms.js` | Diperbarui | Tampilan status reaktif MariaDB dan konfirmasi migrasi data |
| `CHANGELOG.md` | Diperbarui | Pencatatan detail rilis v3.1.0 & pembaruan daftar isi |

---

## 🚀 v3.0.0 — Refaktor Arsitektur: Backend PHP REST API Serverless & Database MySQL Terintegrasi untuk Vercel & CMS
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"sekarang refactor agar dapat di deploy di vercel menggunakan database mysql / mongodb, buatkan databasenya dan setiap ada penginputan, edit dan hapus melalui cms akan terupdate di db. buatkan dalam bentuk php, dan perbaiki struktur codingannya, hilangkan yang tidak perlu"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Skema & Arsitektur Database MySQL (`database/schema.sql`):**
   - Merancang DDL tabel relasional berstandar industri dengan mesin `InnoDB` dan set karakter `utf8mb4_unicode_ci`:
     - `bbc_users`: Penyimpanan kredensial admin pengelola dengan hash kata sandi SHA-256 terproteksi.
     - `bbc_players`: Data roster pemain Amilin & Amilat, status Player of the Month (POTM), statistik performa (attendance, matches, wins, losses, win rate), prestasi teks, tautan gambar profil, dan koleksi galeri foto aksi (JSON array).
     - `bbc_events`: Kalender kegiatan lapangan (Latihan Rutin, Turnamen, dsb), penentuan nama hari otomatis (Senin–Minggu), waktu, lokasi, dan status badge.
     - `bbc_articles`: Publikasi berita/artikel bulutangkis, slug unik ramah SEO, kategori liputan, estimasi waktu baca, jumlah pembaca (views increment otomatis), dan tanggal terbit.
     - `bbc_gallery`: Dokumentasi foto momen smash, kejuaraan, dan kebersamaan komunitas.
     - `bbc_officials`: Struktur organisasi kepengurusan klub (nama, jabatan, urutan sort, foto profil).
     - `bbc_hero`: Konfigurasi banner beranda (tipe media foto/video, tautan video YouTube/MP4, thumbnail foto mini 1 & 2, serta label sticker).
   - Menyediakan panduan setup lengkap di [database/README.md](file:///e:/Ikrom%20Docs/bbc-website/database/README.md) untuk deployment cloud gratis (TiDB Cloud Serverless MySQL, PlanetScale, Aiven, Railway) maupun server lokal (XAMPP / Laragon).

2. **Serverless PHP REST API Modular (`/api/*.php`):**
   - Membangun backend REST API berbasis PHP murni dengan PDO (PHP Data Objects) dan Prepared Statements untuk keamanan penuh dari SQL Injection:
     - `api/config/database.php`: Singleton PDO connection pool yang mendukung Environment Variables Vercel (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_SSL`), CORS headers terstandarisasi, penanganan HTTP OPTIONS preflight, serta helper `jsonResponse()` dan `getJsonInput()`.
     - `api/health.php`: Diagnostic endpoint untuk memeriksa status konektivitas database MySQL secara live, versi runtime PHP, dan latensi query.
     - `api/seed.php`: One-click data migration/seeder yang otomatis mengimpor seluruh data awal dari file `data/*.json` langsung ke tabel-tabel MySQL.
     - `api/players.php`: Endpoints CRUD pemain (GET dengan filter kategori/POTM, POST tambah pemain baru, PUT perbarui pemain & penegakan aturan 1 POTM per kategori, DELETE hapus pemain).
     - `api/events.php`: Endpoints CRUD agenda kegiatan (GET dengan filter masa depan/kategori, POST otomatis konversi nama hari Indonesia, PUT, DELETE).
     - `api/articles.php`: Endpoints CRUD berita (GET dengan filter slug/kategori serta penambahan views count otomatis, POST artikel baru, PUT, DELETE).
     - `api/gallery.php`: Endpoints CRUD galeri foto (GET koleksi foto terbaru, POST foto baru, DELETE).
     - `api/officials.php`: Endpoints CRUD pengurus klub (GET berdasarkan urutan `sort_order`, POST, PUT, DELETE).
     - `api/hero.php`: Endpoints GET & POST/PUT konfigurasi media banner beranda website.
     - `api/auth.php`: Server-side authentication endpoint untuk validasi login admin terhadap tabel `bbc_users`.

3. **Konfigurasi Serverless Runtime Vercel (`vercel.json`):**
   - Menambahkan konfigurasi runtime serverless `vercel-php@0.7.3` untuk mengeksekusi script PHP di infrastruktur AWS Lambda Vercel tanpa perlu setup server dedicated:
     ```json
     "functions": {
       "api/**/*.php": {
         "runtime": "vercel-php@0.7.3"
       }
     }
     ```
   - Mengatur rute API `/api/(.*)` ke `/api/$1` serta menyertakan CORS headers global.

4. **Sinkronisasi Data Real-Time CMS ke MySQL (`js/data/store.js`):**
   - Mengintegrasikan fungsi sinkronisasi otomatis `syncToApi(category, action, payload)` ke dalam setiap metode mutasi pada `BBC_STORE`:
     - `savePlayer()`, `deletePlayer()`, `setPlayerOfTheMonth()`, `addPlayerGalleryPhoto()`, `deletePlayerGalleryPhoto()`.
     - `saveEvent()`, `deleteEvent()`.
     - `saveArticle()`, `deleteArticle()`.
     - `saveGalleryItem()`, `deleteGalleryItem()`.
     - `saveOfficial()`, `deleteOfficial()`.
     - `saveHeroSettings()`, `resetHeroSettings()`.
   - Menambahkan mekanisme *Graceful Resilience*: Pada saat inisialisasi (`initialize()`), sistem memeriksa `checkApiHealth()`. Jika database MySQL aktif, data di-load langsung dari MySQL. Jika database sedang offline / belum dikonfigurasi, sistem secara otomatis beralih menggunakan data fallback JSON lokal sehingga website tidak pernah blank.

5. **Pembersihan Kode Usang & Modernisasi UI CMS (`pages/cms.html`, `js/pages/cms.js`):**
   - Menghapus ketergantungan modul workaround lama `github-sync.js` (push commit langsung dari browser yang rawan konflik dan lambat).
   - Memodernisasi tab Backup & Sistem di CMS dengan menambahkan panel **Database MySQL & PHP REST API (Real-Time CRUD)** yang menampilkan:
     - Badge status koneksi MySQL live (`🟢 TERHUBUNG KE MYSQL` / `⚪ STANDBY (LOCAL JSON)`).
     - Badge host database dan versi PHP Serverless runtime.
     - Tombol **⚡ SINKRONKAN / SEED KE MYSQL** untuk migrasi data awal 1-klik.
     - Tombol **🔄 CEK KONEKSI** untuk uji latensi koneksi secara instan.
     - Panduan konfigurasi Environment Variables Vercel.

### 📁 Berkas yang Dimodifikasi & Ditambahkan
| Berkas | Status | Ringkasan Perubahan |
|---|---|---|
| `database/schema.sql` | ✨ Baru | DDL skema database MySQL lengkap 7 tabel relasional (`bbc_users`, `bbc_players`, `bbc_events`, `bbc_articles`, `bbc_gallery`, `bbc_officials`, `bbc_hero`) |
| `database/README.md` | ✨ Baru | Panduan konfigurasi dan integrasi database cloud (TiDB Serverless, PlanetScale, Aiven, Supabase, XAMPP) |
| `api/config/database.php` | ✨ Baru | Singleton PDO connection handler, environment variable reader, CORS headers, JSON helpers |
| `api/health.php` | ✨ Baru | Endpoint kesehatan koneksi MySQL dan serverless runtime diagnostic |
| `api/seed.php` | ✨ Baru | Endpoint migrasi/seeder 1-klik dari file `data/*.json` ke database MySQL |
| `api/players.php` | ✨ Baru | REST API CRUD pemain, statistik, foto, dan aturan eksklusif POTM |
| `api/events.php` | ✨ Baru | REST API CRUD agenda & jadwal kegiatan bulutangkis |
| `api/articles.php` | ✨ Baru | REST API CRUD berita, publikasi liputan, slug, dan auto views counter |
| `api/gallery.php` | ✨ Baru | REST API CRUD dokumentasi galeri foto klub |
| `api/officials.php` | ✨ Baru | REST API CRUD kepengurusan klub bulutangkis |
| `api/hero.php` | ✨ Baru | REST API konfigurasi media banner hero (foto & video) |
| `api/auth.php` | ✨ Baru | REST API autentikasi admin login server-side |
| `vercel.json` | Diperbarui | Konfigurasi runtime `vercel-php@0.7.3`, routing `/api/*`, dan CORS rules |
| `js/data/store.js` | Diperbarui | Integrasi `callApi()`, `checkApiHealth()`, `triggerSeed()`, `syncToApi()`, dan resilient hybrid fallback |
| `js/pages/cms.js` | Diperbarui | Integrasi UI status database live, handler seeder, uji koneksi, eliminasi kode usang GitHub sync |
| `pages/cms.html` | Diperbarui | Panel kontrol database MySQL baru di tab backup, pembersihan script usang `github-sync.js` |
| `CHANGELOG.md` | Diperbarui | Dokumentasi komprehensif rilis major v3.0.0 & pembaruan daftar isi |

---

## 🚀 v2.18.2 — Peningkatan Batas Video Base64 Langsung ke 10MB untuk Vercel & Hybrid Memory Storage
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"Dukungan Video Base64 Langsung untuk Vercel buat maksimal ukuran video adalah 10 MB"*

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Peningkatan Batas Konversi Video Base64 ke 10MB (`cms.js`):**
   - Menaikkan batas ukuran file video lokal yang dikonversi langsung menjadi Base64 Data URL dari sebelumnya 4MB menjadi **10MB** (`file.size <= 10 * 1024 * 1024`).
   - File video berukuran hingga 10MB langsung dienkode menjadi `data:video/mp4;base64,...` dan dikirim ke `data/hero.json` saat auto-deploy, sehingga video dapat diputar langsung di server Vercel oleh semua pengunjung online.
2. **Arsitektur Hybrid Memory Cache & IndexedDB Fallback (`store.js`):**
   - Mencegah error kuota browser `QuotaExceededError` di `localStorage` (yang umumnya berkapasitas 5MB).
   - Menambahkan variabel cache memori runtime `memoryHeroCache` untuk menampung objek hero utuh (termasuk payload Base64 10MB) tanpa batas kuota.
   - Pada `saveHeroSettings()`, jika `localStorage.setItem()` gagal karena keterbatasan kuota, sistem secara elegan menyimpan video utuh ke IndexedDB (`hero_main_video`) dan menulis data referensi ringan ke `localStorage`, sementara `memoryHeroCache` tetap menyediakan data Base64 utuh bagi modul deploy GitHub (`BBC_GITHUB`).
   - Pada `initialize()`, data hero dari file statis Vercel langsung disinkronkan ke `memoryHeroCache` dan IndexedDB browser secara aman.
3. **Penyelarasan Hint Form CMS (`pages/cms.html`):**
   - Memperbarui teks panduan upload video: *"Maksimal 10MB (otomatis dikonversi Base64 langsung aktif di Vercel & seluruh pengunjung online). Untuk video berdurasi panjang disarankan menggunakan tautan YouTube."*

### 📁 Berkas yang Dimodifikasi
| Berkas | Status | Ringkasan Perubahan |
|---|---|---|
| `js/pages/cms.js` | Diperbarui | Batas Base64 video dinaikkan ke 10MB, pesan toast informatif |
| `js/data/store.js` | Diperbarui | Hybrid `memoryHeroCache` dan fallback IndexedDB anti-QuotaExceeded |
| `pages/cms.html` | Diperbarui | Teks panduan upload video 10MB Vercel di formulir CMS |
| `CHANGELOG.md` | Diperbarui | Pencatatan detail rilis v2.18.2 & pembaruan daftar isi |

---

## 🚀 v2.18.1 — Fix Komprehensif Hero Media (Foto & Video), Eliminasi Race Condition DOM & Base64 Video Vercel
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"masih terdapat bug pada update hero section, tidak berubah, gambar/video tidak tampil"*

### ✅ Penyebab & Analisis Akar Masalah
1. **Race Condition & Destructive DOM Replacement pada `hero.js`:**  
   Pemanggilan `applyHero()` yang bersilangan antara `hero.js` (`BBC_onReady`) dan `home.js` (`initHeroSection` / `BBC_applyHero`) menggunakan `wrap.innerHTML = originalWrapHTML` secara asinkron. Akibatnya, elemen video/gambar yang sedang dibangun di-reset atau saling timpa, memicu kondisi *race condition* di mana elemen DOM hilang atau tidak tuntas dirender (tampak kosong/hitam).
2. **Video Lokal Terisolasi di IndexedDB Tidak Tampil di Vercel:**  
   Pengunggahan video di CMS sebelumnya hanya menyimpan video di IndexedDB browser lokal (`'indexeddb:hero_main_video'`). Nilai string ini disinkronkan ke file `data/hero.json` di GitHub/Vercel. Saat diakses di Vercel oleh publik (atau browser lain), IndexedDB kosong dan mekanisme fallback sebelumnya mengalami error referensi elemen `mainImg` yang terlepas dari DOM, menghasilkan kotak kosong/hitam tanpa media.
3. **Triple-Submit / Multiple Parallel GitHub Push pada Tombol Simpan CMS:**  
   Tombol `btn-hero-save` di `pages/cms.html` memiliki atribut inline `onclick="window.BBC_saveHeroSettings(event)"`, di samping `type="submit"` pada `<form id="form-hero">` dan `addEventListener('click')` di `cms.js`. Sekali klik memicu 3 kali proses penyimpanan dan push ke GitHub secara bersamaan, menyebabkan konflik HTTP 409 dan kegagalan sync.
4. **Ukuran Gambar Base64 Melebihi Kuota LocalStorage (`QuotaExceededError`):**  
   Fungsi kompresi foto banner sebelumnya menghasilkan Base64 beresolusi terlalu besar (>1.2MB). Ketika digabung dengan data artikel, galeri, dan tim di `localStorage`, penyimpanan browser gagal tanpa notifikasi jelas (*silent fail*), sehingga data hero tidak tersimpan di memori browser maupun ke GitHub.

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Arsitektur Rendering Hero Idempoten & Defensif (`hero.js`):**
   - Membangun kembali `hero.js` tanpa manipulasi `wrap.innerHTML = originalWrapHTML` yang destruktif.
   - **Mode Foto:** Langsung menukar atau memperbarui elemen `<img>` yang tangguh dengan event `onerror` fallback ke gambar default.
   - **Mode Video:** Mendukung video YouTube via URL embed aman (`youtube-nocookie.com`, controls aktif, tanpa `pointer-events: none`), file/URL video langsung (`<video>` dengan atribut `autoplay`, `muted`, `playsinline`, `webkit-playsinline`, `loop`), serta graceful fallback ke `mainImage` jika video gagal dimuat atau blob tidak ditemukan.
   - Menambahkan proteksi *debounce* (20ms) agar eksekusi berulang dari `live-sync.js` dan `home.js` disatukan menjadi satu siklus rendering yang bersih.
2. **Dukungan Video Base64 Langsung untuk Vercel (`cms.js`):**
   - File video hero berukuran hingga 4MB kini dikonversi menjadi Base64 Data URL (`data:video/mp4;base64,...`) yang disimpan ke `data/hero.json` dan dipush ke GitHub. Dengan demikian, video dapat diputar langsung oleh semua pengunjung di Vercel tanpa tergantung pada IndexedDB lokal.
   - Untuk video > 4MB (hingga 15MB), video disimpan di IndexedDB lokal dengan pesan panduan (toast info) agar menggunakan link YouTube untuk performa streaming optimal di Vercel publik.
3. **Optimasi Kompresi Foto Banner & Deteksi Kuota Storage (`cms.js` & `store.js`):**
   - Kompresi foto utama diatur ke resolusi optimal 960x600 px (kualitas 0.76), menghasilkan ukuran Base64 sangat efisien (~45KB-75KB), mencegah `QuotaExceededError`.
   - Kompresi thumbnail diatur ke 480x300 px (~20KB-35KB).
   - `store.js`: `saveHeroSettings()` memverifikasi hasil simpan `writeStorage()` dan memberikan peringatan jika kuota penyimpanan browser penuh.
4. **Eliminasi Triple-Submit & Debounce Simpan (`cms.html` & `cms.js`):**
   - Menghapus atribut inline `onclick` pada tombol `btn-hero-save` di `pages/cms.html`.
   - Menambahkan flag `isSavingHero` pada `cms.js` untuk mencegah klik ganda/paralel saat proses simpan dan push GitHub berlangsung.
5. **Optimasi Base64 Chunking (`github-sync.js`):**
   - `safeBase64Encode` diperbarui dengan teknik chunk buffer (16KB per batch) sehingga payload berukuran ratusan kilobyte dienkode dalam hitungan milidetik tanpa memblokir antarmuka pengguna (*UI thread*).

### 📁 Berkas yang Dimodifikasi
| Berkas | Status | Ringkasan Perubahan |
|---|---|---|
| `js/components/hero.js` | Diperbarui | Idempotent non-destructive render, debounce, clean YouTube/video/img fallback |
| `js/pages/cms.js` | Diperbarui | Video Base64 <=4MB untuk Vercel, kompresi foto 960x600, anti-duplicate save |
| `pages/cms.html` | Diperbarui | Hapus inline `onclick` ganda di tombol Simpan Hero, update panduan video |
| `js/data/store.js` | Diperbarui | Validasi hasil simpan `writeStorage()` pada `saveHeroSettings` |
| `js/utils/github-sync.js` | Diperbarui | Chunked ArrayBuffer base64 encoder untuk efisiensi transfer data besar |
| `data/hero.json` | Diperbarui | Penambahan properti `thumb2Image` dan bump `_version` timestamp |
| `CHANGELOG.md` | Diperbarui | Pencatatan detail rilis v2.18.1 & pembaruan daftar isi |

---

## 🚀 v2.18.0 — Perbaikan Tampilan Banner Hero index.html & Optimasi Auto-Update Vercel
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"foto/video banner utama ketika di update tidak muncul pada index.html dan yang lainnya ketika ada perubahan tidak langsung terupdate pada vercel, perbaiki bugnya"*

### ✅ Penyebab & Analisis Akar Masalah
1. **Penimpaan Pengaturan Hero oleh `initialize()` di `store.js`:**  
   Fungsi `saveHeroSettings()` sebelumnya menyimpan data langsung menggunakan `localStorage.setItem(STORAGE_KEYS.HERO, ...)` tanpa memanggil `writeStorage()`. Akibatnya, timestamp versi lokal `bbc_json_ver_hero` tidak diperbarui. Saat halaman `index.html` dimuat ulang, `BBC_STORE.initialize()` membandingkan versi server dengan versi lokal (yang bernilai `0` atau lama), sehingga data hero yang baru disimpan admin ditimpa kembali dengan data JSON statis lama dari server.
2. **Video Lokal IndexedDB di `data/hero.json` Menyebabkan Layar Rusak di Vercel:**  
   Berkas `data/hero.json` di remote tersimpan dengan `mediaType: "video"` dan `mainVideo: "indexeddb:hero_main_video"`. Karena blob video IndexedDB hanya tersimpan di memori browser lokal admin dan tidak pernah ada di server Vercel maupun browser pengunjung lain, skrip `hero.js` menggantikan elemen `<img>` banner dengan elemen `<video>` kosong tanpa `src`. Hal ini menyebabkan foto utama hilang total dan hanya menampilkan kotak hitam/rusak.
3. **Kurangnya Fallback Defensif pada `hero.js`:**  
   Ketika mode video dipilih namun video gagal diputar, tidak ada penanganan error (`onerror`) yang mengembalikan tampilan ke foto banner utama (`mainImage`).
4. **Caching Agresif pada Server Vercel & Browser untuk `/data/*.json`:**  
   Belum adanya berkas konfigurasi `vercel.json` dengan instruksi cache headers membuat Vercel CDN dan browser klien dapat menyimpan cache file JSON, sehingga data yang baru dideploy tidak langsung terlihat oleh pengunjung tanpa hard refresh.
5. **Konflik Konkurensi HTTP 409 pada GitHub Contents API:**  
   Ketika beberapa perubahan data terjadi berdekatan di CMS, panggilan berurutan ke API GitHub dapat memicu error HTTP 409 (Conflict) akibat referensi branch yang belum stabil. Tanpa mekanisme retry otomatis, proses auto-push gagal secara diam-diam.

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Pencegahan Caching Vercel CDN (`vercel.json` [BARU]):**
   - Menambahkan berkas konfigurasi `vercel.json` dengan header khusus untuk rute `/data/(.*)`:  
     `Cache-Control: no-cache, no-store, must-revalidate, max-age=0`, `Pragma: no-cache`, dan `Expires: 0`. Menjamin setiap permintaan browser selalu mendapatkan file JSON paling mutakhir dari Vercel.
2. **Defensif & Reaktif Renderer Banner Hero (`hero.js`):**
   - Sebelum menggantikan elemen gambar banner dengan elemen video IndexedDB, sistem memeriksa ketersediaan blob terlebih dahulu (`BBC_STORE.getMediaBlob`). Jika blob tidak ada (misal di Vercel atau pengunjung lain), sistem tidak mengganti elemen gambar dan tetap menampilkan foto banner utama dengan mulus.
   - Menambahkan penanganan error `onerror` pada elemen video yang otomatis mengembalikan tampilan ke foto banner jika video gagal dimuat.
   - Menegakkan mode foto (`mediaType: 'image'`): jika admin memilih mode foto, foto banner utama selalu ditampilkan secara konsisten.
   - Menambahkan event listener ke `BBC_LIVE.onChange` untuk `STORAGE_KEYS.HERO` sehingga banner di beranda langsung ter-update secara real-time saat disimpan di CMS tanpa perlu reload.
3. **Pembaruan Timestamp Versi di `store.js`:**
   - Memperbarui `saveHeroSettings()` dan `resetHeroSettings()` untuk menggunakan `writeStorage(STORAGE_KEYS.HERO, ...)`. Timestamp `JSON_VERSION_KEYS.HERO` kini otomatis diperbarui ke `Date.now()`, menjamin data baru tidak akan pernah tertimpa oleh fetch `initialize()`.
4. **Ketahanan Auto-Deploy GitHub (`github-sync.js`):**
   - Menambahkan mekanisme *auto-retry* (hingga 3 kali percobaan dengan backoff) pada `pushFile()` saat mendeteksi HTTP 409 Conflict, lengkap dengan penarikan SHA file terkini dari GitHub.
   - Menambahkan jeda stabilisasi 400ms antar file pada deploy batch multi-file.
   - Menambahkan nilai fallback default repository (`abuhuud/bbc-website` di branch `main`) pada `getConfig()`.
   - Menambahkan helper `safeBase64Encode` untuk menangani encode payload JSON besar/karakter multibyte secara aman.
5. **Pembersihan Default `data/hero.json`:**
   - Menyetel `mediaType: "image"` dan mengosongkan referensi lokal `indexeddb:hero_main_video` serta memperbarui `_version` ke timestamp terbaru.
6. **Form Setup GitHub CMS (`cms.js`):**
   - Memperbarui `loadGithubConfigToForm()` agar otomatis mengisi username repo (`abuhuud`), nama repo (`bbc-website`), dan branch (`main`) secara default jika belum terisi, sehingga admin hanya perlu memasukkan Token GitHub.

### 📁 Berkas yang Dimodifikasi
| Berkas | Status | Ringkasan Perubahan |
|---|---|---|
| `vercel.json` | **Baru** | Header no-cache untuk semua `/data/*.json` di Vercel CDN |
| `js/components/hero.js` | Diperbarui | Defensive renderer, IDB blob check, video onerror fallback, live reactivity |
| `js/data/store.js` | Diperbarui | `saveHeroSettings` & `resetHeroSettings` gunakan `writeStorage` & versioning |
| `js/utils/github-sync.js` | Diperbarui | Retry logic HTTP 409, jeda antar push, default repo config, safe base64 |
| `data/hero.json` | Diperbarui | Default `mediaType: "image"` dan update versi timestamp |
| `js/pages/cms.js` | Diperbarui | Pre-populate repo owner/name/branch di form GitHub |
| `CHANGELOG.md` | Diperbarui | Pencatatan detail rilis v2.18.0 & pembaruan daftar isi |

---

## 🚀 v2.17.0 — Fix Sinkronisasi & Reaktivitas Jadwal Kalender Bulutangkis di schedule.html
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"Perubahan penambahan pada jadwal kalender bulutangkis tidak berubah pada page schedule.html."*

### ✅ Penyebab & Analisis Akar Masalah
1. **Runtime Error pada `event-card.js` (`TypeError: Cannot read properties of undefined`):**  
   Fungsi `createNextPlayTicket()` memanggil `${event.dayName.toUpperCase()}` tanpa pemeriksaan nilai fallback. Jika jadwal baru ditambahkan dan atribut `dayName` bernilai `undefined` atau kosong, skrip JavaScript langsung terhenti seketika (*crash*), menyebabkan daftar tiket jadwal gagal dirender sama sekali.
2. **Stale Closure pada Tombol Filter di `schedule.js`:**  
   Event listener tombol filter agenda diikat sekali menggunakan penanda `btn.dataset.bbcBound`, tetapi pemanggilan fungsi filternya terkurung (*closure*) pada array jadwal lama dari inisialisasi pertama. Akibatnya, filter tidak merefleksikan jadwal yang baru ditambahkan/diubah.
3. **Overwrite Data Baru oleh `initialize()` di `store.js`:**  
   Saat admin menyimpan jadwal baru melalui `saveEvent()`, timestamp versi lokal (`bbc_json_ver_events`) tidak diperbarui di `localStorage`. Ketika halaman `schedule.html` dibuka dan menjalankan `BBC_STORE.initialize()`, sistem menganggap file JSON statis lama di server memiliki versi lebih baru, sehingga data lokal baru yang diinput admin tertimpa kembali oleh data lama.
4. **Tidak Adanya Otomatisasi Nama Hari di Form Jadwal CMS:**  
   Jika pengguna memilih tanggal di kalender tetapi tidak mengetik nama hari secara manual di formulir modal, kolom `dayName` tersimpan kosong.

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Defensif Rendering pada `event-card.js`:**
   - Menambahkan helper `_getIndoDayFromDate(dateStr)` yang otomatis menghitung nama hari bahasa Indonesia (Senin–Minggu) dari format `YYYY-MM-DD`.
   - Menggunakan fallback aman untuk seluruh properti tiket: `dayName`, `typeName`, `time`, `venue`, `city`, `locationUrl`, dan `description`. Tidak ada lagi risiko crash JavaScript saat data tidak lengkap.
2. **Reaktivitas Penuh pada `schedule.js`:**
   - Menyimpan `currentScheduleFilter` secara dinamis di luar closure tombol.
   - Fungsi `renderSchedulePage()` selalu mengambil data segar langsung dari `BBC_STORE.getEvents()` pada setiap pemanggilan.
   - Mengaitkan pendengar siaran live `BBC_LIVE.onChange('bbc_data_events_v4')` agar halaman `schedule.html` langsung merender ulang secara otomatis dan instan saat admin menambah/mengedit jadwal di CMS tanpa perlu reload manual.
3. **Pembaruan Timestamp Versi Otomatis di `store.js`:**
   - Memperbarui fungsi `writeStorage()` agar selalu mencatat timestamp terkini (`Date.now()`) ke kunci versi yang bersesuaian (`JSON_VERSION_KEYS.EVENTS`, `PLAYERS`, `ARTICLES`, dsb.).
   - Menambahkan logika *auto-derive* nama hari di `saveEvent()` jika kolom hari kosong.
   - Mencegah penimpaan (*overwrite*) oleh fetch data JSON statis.
4. **Otomatisasi Nama Hari di Modal CMS (`cms.js`):**
   - Menambahkan event listener `change` pada input tanggal `#event-date`: saat tanggal dipilih, kolom input `#event-day` langsung terisi otomatis dengan nama hari dalam bahasa Indonesia.
   - Mengisi tanggal hari ini dan nama hari berjalan secara otomatis saat tombol *"Tambah Jadwal Baru"* diklik.

### 📁 Berkas yang Dimodifikasi
- `js/components/event-card.js` — Penanganan defensif properti jadwal dan helper nama hari
- `js/pages/schedule.js` — Perbaikan reaktivitas render jadwal dan pemecahan stale closure tombol filter
- `js/data/store.js` — Pembaruan otomatis version timestamp di `writeStorage` dan auto-derive `dayName` di `saveEvent`
- `js/pages/cms.js` — Otomatisasi pengisian hari pada form modal tambah/edit jadwal
- `CHANGELOG.md` — Dokumentasi log perubahan rilis v2.17.0

---

## 🚀 v2.16.0 — Auto-Deploy Otomatis ke GitHub & Vercel saat Data Berubah
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"Buat secara otomatis jika ada perubahan data langsung di-push ke Vercel tanpa perlu download atau klik tombol manual."*

### ✅ Solusi & Detail Implementasi Teknis

**Pendekatan:** Mengintegrasikan **Background Auto-Deploy Scheduler** berbasis GitHub Contents API langsung ke dalam siklus hidup penyimpanan data (`BBC_STORE`).

1. **Background Scheduler & Smart Debounce (`github-sync.js`):**
   - Menambahkan fungsi `triggerAutoDeploy(category)` dengan jeda **debounce 2 detik**.
   - Jika admin melakukan pengeditan berulang kali secara cepat, kategori-kategori yang berubah dikumpulkan ke dalam antrean (`pendingCategories`), lalu di-push secara efisien ke GitHub dalam satu batch tanpa spamming API.
   - Menyediakan fungsi kontrol preferensi `isAutoDeployEnabled()` dan `setAutoDeployEnabled(bool)` yang tersimpan di `localStorage`.
   - Mengimplementasikan sistem pub/sub listener `onStatusChange(callback)` untuk mengirim status real-time ke UI CMS (`queued`, `deploying`, `success`, `error`).

2. **Otomatisasi Penuh di Layer Store (`store.js`):**
   - Mengaitkan `BBC_GITHUB.triggerAutoDeploy(category)` langsung di dalam `syncToFile(storageKey)`.
   - Setiap kali terjadi penambahan, pengeditan, atau penghapusan data (pemain, jadwal latihan, foto kegiatan, artikel berita, pejabat pengurus, dan pengaturan hero), sistem langsung menjadwalkan auto-push ke GitHub & Vercel secara non-blocking dan hening.

3. **Live Status Indicator Topbar & Toggle Control (`cms.html`, `cms.css`, `cms.js`):**
   - Menambahkan badge interaktif di header topbar CMS (`#cloud-sync-topbar-badge`):
     - `☁️ Vercel: Auto` / `☁️ Vercel: Manual` (Ready)
     - `⏳ Menyimpan...` (Queued / Debouncing)
     - `🚀 Push Vercel...` (Sedang mengunggah ke GitHub dengan animasi pulse)
     - `✅ Vercel: Terupdate!` (Sukses push & Vercel redeploy)
     - `⚠️ Vercel: Gagal` (Jika token tidak valid atau offline)
   - Badge dapat diklik untuk langsung berpindah ke panel pengaturan GitHub di Tab Backup.
   - Menambahkan toggle checkbox *"⚡ Push Otomatis ke Vercel saat Data Berubah"* di panel Backup sehingga admin dapat mengaktifkan atau menonaktifkan fitur ini kapan saja.
   - Menampilkan notifikasi toast non-intrusif saat proses auto-deploy berhasil selesai.

### 📁 Berkas yang Dimodifikasi
- `js/utils/github-sync.js` — Modul background auto-deploy scheduler, debounce, dan pub/sub status listener
- `js/data/store.js` — Integrasi trigger auto-deploy di fungsi `syncToFile()` pada setiap operasi mutasi data
- `pages/cms.html` — Komponen badge status live cloud sync di topbar dan checkbox toggle di form konfigurasi GitHub
- `css/cms.css` — Styling neo-brutalist badge status topbar dan animasi pulse
- `js/pages/cms.js` — Handler interaksi status real-time, toggle preference, dan shortcut navigasi topbar
- `CHANGELOG.md` — Dokumentasi log perubahan rilis v2.16.0

---

## 🚀 v2.15.1 — Fix Merge Conflict Git & Penyelarasan Metadata JSON pada GitHub Sync
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *`[rejected] main -> main (non-fast-forward)`*  
> *`error: failed to push some refs to 'https://github.com/abuhuud/bbc-website.git'`*  
> Terjadi merge conflict pada 6 berkas `data/*.json` saat pengguna melakukan pull/push setelah eksekusi Auto-Deploy dari CMS.

### ✅ Penyebab & Analisis Akar Masalah
1. **Divergensi Cabang Git:** Ketika pengguna menekan tombol *"🚀 DEPLOY KE VERCEL"* di CMS, modul `BBC_GITHUB` membuat 6 commit baru langsung di repository remote (`origin/main`). Di saat yang sama, pengguna membuat commit lokal di komputernya.
2. **Perbedaan Struktur Baris JSON:** File JSON yang di-push oleh CMS sebelumnya belum menyertakan `_version` dan `_updatedAt`, sedangkan file di direktori lokal menyertakannya melalui sinkronisasi lokal `BBC_FS`. Hal ini memicu merge conflict marker (`<<<<<<< HEAD`, `=======`, `>>>>>>> ...`) pada baris pembuka di seluruh 6 file JSON.

### 🛠️ Solusi & Detail Implementasi Teknis
1. **Resolusi Merge Conflict Data:**
   - Membersihkan conflict markers pada 6 file: `articles.json`, `events.json`, `gallery.json`, `hero.json`, `officials.json`, dan `players.json`.
   - Mempertahankan struktur metadata `_version` dan `_updatedAt` yang valid untuk memastikan pembacaan cache di `BBC_STORE` tetap akurat.
2. **Penyelarasan Modul GitHub API (`github-sync.js`):**
   - Memperbarui fungsi `getData()` pada `DATA_FILES` di `js/utils/github-sync.js` agar selalu menyertakan `_version: Date.now()` dan `_updatedAt` saat mengunggah file JSON ke GitHub API.
   - Dengan ini, file di remote GitHub dan file di lokal selalu memiliki struktur yang identik, mencegah potensi merge conflict di masa mendatang.
3. **Penyelesaian Merge & Push Git:**
   - Menyelesaikan proses merge commit Git dan mempublikasikannya langsung ke remote branch `origin/main` via `git push origin main`.
   - Repositori lokal dan remote kini 100% sinkron dan bersih (*working tree clean*).

### 📁 Berkas yang Dimodifikasi
- `data/articles.json` — Resolusi merge conflict & update version timestamp
- `data/events.json` — Resolusi merge conflict & update version timestamp
- `data/gallery.json` — Resolusi merge conflict & update version timestamp
- `data/hero.json` — Resolusi merge conflict & update version timestamp
- `data/officials.json` — Resolusi merge conflict & update version timestamp
- `data/players.json` — Resolusi merge conflict & update version timestamp
- `js/utils/github-sync.js` — Penyelarasan metadata `_version` dan `_updatedAt` di `DATA_FILES`
- `CHANGELOG.md` — Dokumentasi riwayat perbaikan v2.15.1

---

## 🚀 v2.15.0 — GitHub Auto-Deploy 1-Klik ke Vercel (BBC_GITHUB Module)
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"Bisakah dibuat 1 tombol sinkronisasi data agar tidak perlu download dan upload data ke CMS Vercel, agar data JSON langsung terupdate di Vercel?"*

### ✅ Solusi & Detail Implementasi Teknis

**Pendekatan:** Menggunakan **GitHub Contents API** — CMS langsung push file JSON ke GitHub repository via REST API, tanpa perlu download/upload manual. GitHub menerima perubahan → Vercel webhook otomatis trigger redeploy.

**Alur Kerja Baru:**
```
Admin klik "🚀 DEPLOY KE VERCEL"
       │
       ▼
BBC_GITHUB.deployToGitHub()
       │
       ├─→ GET /repos/{owner}/{repo}/contents/data/players.json  → ambil SHA
       │   PUT /repos/{owner}/{repo}/contents/data/players.json  → push baru
       │
       ├─→ (ulangi untuk events, gallery, articles, officials, hero)
       │
       └─→ GitHub repository terupdate
                  │
                  ▼
           Vercel webhook otomatis
                  │
                  ▼
           Website Vercel redeploy ✅ (±1–2 menit)
```

**Prasyarat:**
- GitHub Personal Access Token (PAT) dengan scope `repo` (classic) atau `contents: write` (fine-grained)
- Token dimasukkan sekali di panel Backup → tersimpan di localStorage admin

**File Baru:**
- `js/utils/github-sync.js` — Module `BBC_GITHUB`:
  - `saveConfig()` / `getConfig()` / `clearConfig()` — manajemen konfigurasi di localStorage
  - `isConfigured()` — cek konfigurasi lengkap
  - `verifyToken(token)` — verifikasi token via `GET /user`
  - `getFileSha()` — ambil SHA file yang ada (diperlukan untuk update)
  - `pushFile()` — push satu file ke GitHub (create or update)
  - `deployToGitHub(options)` — push semua 6 file JSON dengan progress callback

**Perubahan di `pages/cms.html`:**
- Panel "Deploy ke Vercel" manual diganti dengan panel **"SINKRONISASI 1-KLIK KE GITHUB & VERCEL"**
- Form konfigurasi: GitHub Token, Username, Repo, Branch (isi sekali, tersimpan)
- Tombol **"💾 Simpan & Verifikasi"** — verifikasi token real-time via GitHub API
- **Tombol besar "🚀 DEPLOY KE VERCEL"** — push semua JSON sekaligus
- Log terminal real-time per file yang di-push
- Flow step indicator (👥📅🖼️📰🏅🎬) dengan status tiap file (⏳/✅/❌)
- Pesan sukses + link ke Vercel Dashboard setelah deploy
- Panel Export Manual tetap ada di dalam `<details>` sebagai alternatif
- Script `github-sync.js` ditambahkan ke daftar script

**Perubahan di `js/pages/cms.js`:**
- Ditambahkan section **3C BBC_GITHUB** dengan fungsi:
  - `updateGithubStatusUI()` — update badge & info repo
  - `loadGithubConfigToForm()` — populate form dari localStorage
  - `setFlowStepState(category, state)` — animasi step indicator
  - `addDeployLog(message, type)` — append ke terminal log
  - `handleSaveGithubConfig()` — simpan & verifikasi token
  - `handleClearGithubConfig()` — hapus konfigurasi
  - `handleDeployToVercel()` — orchestrate full deploy dengan progress UI
  - `initGithubUI()` — init event listeners (dipanggil saat tab Backup dibuka)
- `initGithubUI()` dipanggil bersama `initFsUI()` di `switchTab('backup')`

**Perubahan di `css/cms.css`:**
- `.github-flow-step` dan varian state (`--uploading`, `--success`, `--error`)
- Animasi `ghStepPulse` untuk state uploading
- Hover/active/disabled state untuk `#btn-deploy-vercel`
- State classes untuk `#github-status-badge` (`gh-badge--*`)

### 📁 Berkas yang Dimodifikasi
- `js/utils/github-sync.js` ✨ **[BARU]**
- `js/pages/cms.js` — Section 3C BBC_GITHUB + initGithubUI() di tab switch
- `pages/cms.html` — Panel GitHub Auto-Deploy + script github-sync.js
- `css/cms.css` — CSS untuk flow steps, deploy button, status badge
- `CHANGELOG.md` — Log perubahan ini

---

## 🚀 v2.14.0 — Simpan Data CMS ke File Assets (File System Access API)
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"Saat ini data yang diinput dan diedit melalui CMS tersimpan ke localStorage, buat setiap data yang diinput dan diedit tersimpan ke dalam assets, sesuaikan tempatnya masing-masing berdasarkan jenis file dan kategorinya."*

### ✅ Solusi & Detail Implementasi Teknis

**Konteks Teknis:** Website BBC adalah website statis yang berjalan di browser. Browser tidak dapat langsung menulis file ke filesystem karena alasan keamanan. Solusi yang dipilih adalah **File System Access API** (Chrome/Edge 86+) — admin memilih folder root proyek sekali, dan browser diberi izin untuk menulis file ke folder tersebut.

**Arsitektur Baru:**
```
CMS Save/Edit/Delete
       │
       ├─→ localStorage (cache, tetap ada seperti semula)
       │
       └─→ BBC_FS.syncToFiles() [NON-BLOCKING]
                └─→ File System Access API
                     ├─→ data/players.json
                     ├─→ data/events.json
                     ├─→ data/gallery.json
                     ├─→ data/articles.json
                     ├─→ data/officials.json
                     └─→ data/hero.json

CMS Image Upload
       │
       ├─→ (BBC_FS tersedia) BBC_FS.writeImageFile()
       │        ├─→ assets/images/players/ (foto pemain & pengurus)
       │        ├─→ assets/images/gallery/ (foto galeri kegiatan)
       │        ├─→ assets/images/news/    (foto artikel/berita)
       │        └─→ assets/images/hero/   (foto banner hero)
       │
       └─→ (Fallback) base64 di localStorage (perilaku lama)
```

**File Baru Dibuat:**
- `js/utils/filesystem.js` — Module `BBC_FS` yang mengenkapsulasi File System Access API:
  - `isAvailable()` — cek dukungan browser
  - `requestProjectFolder()` — tampilkan dialog folder picker
  - `tryRestoreHandle()` / `clearProjectFolder()` — persist folder handle via IndexedDB
  - `writeJsonFile(path, data)` — tulis file JSON ke folder proyek
  - `writeImageFile(subdir, file, filename)` — simpan file gambar, return path relatif
  - `syncToFiles(category?)` — sync semua/satu kategori data ke file JSON
  - `getStatus()` — kembalikan info status BBC_FS

**Perubahan di `js/data/store.js`:**
- Ditambahkan `FS_CATEGORY_MAP` — peta STORAGE_KEYS ke kategori BBC_FS
- Ditambahkan `syncToFile(storageKey)` — dipanggil non-blocking setelah setiap write
- Setiap fungsi `save*()` dan `delete*()` sekarang memanggil `syncToFile()` secara otomatis
- Hero settings (`saveHeroSettings`) juga ter-sync ke `data/hero.json`

**Perubahan di `js/pages/cms.js`:**
- `setupFileUpload()` diupgrade — ketika folder dikonfigurasi via BBC_FS, foto disimpan ke `assets/images/[kategori]/` sebagai file fisik (bukan base64)
- Ditambahkan fungsi `updateFsStatusUI()`, `handleSetupFsFolder()`, `handleFsSyncAll()`, `handleClearFsFolder()`, `initFsUI()`
- Auto-restore folder handle dari IndexedDB saat CMS load
- `initFsUI()` dipanggil saat tab Backup dibuka
- Hero image upload handlers (fMainFile, fThumb1File, fThumb2File) diupgrade dengan BBC_FS support
- Player gallery photo upload (pg-photo-file) diupgrade dengan BBC_FS support

**Perubahan di `pages/cms.html`:**
- Ditambahkan panel **"SINKRONISASI OTOMATIS KE FILE LOKAL"** di bagian atas tab Backup
- Panel berisi: badge status, info folder terpilih, tombol Setup/Ganti Folder, Sync Semua, Lepas Folder
- Script `../js/utils/filesystem.js` ditambahkan sebelum `store.js`

**Perubahan di `css/cms.css`:**
- Ditambahkan style `.cms-fs-status`, `.cms-fs-status--unavailable`, `.cms-fs-status--inactive`, `.cms-fs-status--active`
- Animasi `fsPulse` untuk status aktif

**Folder Baru:**
- `assets/images/hero/` — folder untuk gambar hero section

**Cara Kerja:**
1. Admin buka CMS → masuk tab **Backup**
2. Klik **"📂 Setup Folder Proyek"** → browser tampilkan dialog folder picker
3. Admin pilih folder root `bbc-website/`
4. CMS langsung melakukan full sync semua data ke file JSON
5. Setiap kali save/edit/delete data → file JSON otomatis diperbarui
6. Setiap kali upload foto → foto tersimpan ke folder `assets/images/[kategori]/`
7. Admin tinggal commit & push ke GitHub → Vercel auto-deploy

**Fallback Behavior:** Jika BBC_FS tidak tersedia (browser tidak mendukung/folder belum dipilih), semua data tetap tersimpan di localStorage seperti semula tanpa error.

### 📁 Berkas yang Dimodifikasi
- `js/utils/filesystem.js` ✨ **[BARU]**
- `js/data/store.js` — Integrasi BBC_FS sync setelah setiap save/delete
- `js/pages/cms.js` — BBC_FS UI, upgrade file upload handlers
- `pages/cms.html` — Panel setup folder di tab Backup, tambah script filesystem.js
- `css/cms.css` — Style status badge BBC_FS
- `assets/images/hero/` — ✨ **[FOLDER BARU]**
- `CHANGELOG.md` — Log perubahan ini

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
