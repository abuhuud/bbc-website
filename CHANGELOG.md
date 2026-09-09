# 📋 CHANGELOG & LOG PERUBAHAN — BAZNAS BADMINTON CLUB (BBC)

Dokumen ini mencatat seluruh riwayat perubahan, pembaruan fitur, optimasi tampilan responsif, dan perbaikan logika sistem pada website **BAZNAS Badminton Club (BBC)** dan sistem **Content Management System (CMS)**.

---

## 📌 DAFTAR ISI RIWAYAT PERUBAHAN
1. [v2.17.0 — GitHub Token Diamankan via Vercel Server-Side Proxy + Auto-Deploy Tanpa Konfigurasi Ulang](#-v2170---github-token-diamankan-via-vercel-server-side-proxy--auto-deploy-tanpa-konfigurasi-ulang)
2. [v2.16.0 — Auto-Deploy Otomatis ke GitHub & Vercel saat Data Berubah](#-v2160---auto-deploy-otomatis-ke-github--vercel-saat-data-berubah)

---

## 🔒 v2.17.0 — GitHub Token Diamankan via Vercel Server-Side Proxy + Auto-Deploy Tanpa Konfigurasi Ulang
**Tanggal:** 9 September 2026

### 📝 Permintaan Pengguna / Masalah
> *"Sembunyikan token dalam variabel agar aman. Buat agar dapat melakukan update di semua device yang login ke CMS tanpa harus konfigurasi ulang."*

**Masalah sebelumnya:** Token GitHub PAT disimpan di `localStorage` browser masing-masing — visible di DevTools dan harus diisi ulang di setiap device/browser baru yang login CMS.

### ✅ Solusi & Detail Implementasi Teknis

**Arsitektur Keamanan Baru (Server-Side Proxy):**

```
CMS Browser → POST /api/github-push → Vercel Serverless → GitHub API
                  (tanpa token)         (token server-side)
```

Token **TIDAK PERNAH** dikirim ke browser. Semua operasi GitHub dilakukan di server Vercel menggunakan `GITHUB_TOKEN` Environment Variable.

1. **[NEW] `api/github-push.js` — Serverless Proxy Endpoint:**
   - Endpoint `POST /api/github-push` menerima `{ path, content (base64), commitMessage }` dari browser CMS.
   - Membaca `GITHUB_TOKEN` dari `process.env` (server-side Vercel env var) — tidak pernah dikirim ke client.
   - **Path whitelist**: hanya mengizinkan 6 path yang valid (`data/*.json`) untuk mencegah abuse.
   - Menangani: ambil SHA → push create/update ke GitHub API dalam satu serverless call.
   - Endpoint `GET /api/github-push?action=status` untuk verifikasi konfigurasi server tanpa membocorkan token.

2. **[MODIFIED] `js/utils/github-sync.js` — Migrasi ke Proxy:**
   - Fungsi `pushFile()` diubah dari memanggil `api.github.com` langsung menjadi `fetch('/api/github-push')`.
   - Fungsi `verifyToken()` sekarang memanggil `/api/github-push?action=status` (server-side check).
   - `DEFAULT_CONFIG` hardcode: `owner: 'abuhuud'`, `repo: 'bbc-website'`, `branch: 'main'` (info publik, bukan sensitif).
   - `initDefaultConfig()` auto-seed `localStorage` saat pertama kali diload di device baru — **nol konfigurasi manual**.
   - Token dihapus dari semua operasi client-side — `isConfigured()` selalu `true`.
   - Field `tokenMasked` menampilkan `'••••••••[server-side]'` di UI (bukan token asli).

3. **[MODIFIED] `js/pages/cms.js` — Auto-Deploy Hook di Semua 15 Titik Mutasi Data:**
   - `triggerAutoDeploy('players')` dipanggil setelah: `savePlayer`, `deletePlayer`, `setPlayerOfTheMonth`, `addPlayerGalleryPhoto`, `updatePlayerGalleryPhoto`, `deletePlayerGalleryPhoto`.
   - `triggerAutoDeploy('events')` dipanggil setelah: `saveEvent`, `deleteEvent`.
   - `triggerAutoDeploy('gallery')` dipanggil setelah: `saveGalleryItem`, `deleteGalleryItem`.
   - `triggerAutoDeploy('articles')` dipanggil setelah: `saveArticle`, `deleteArticle`.
   - `triggerAutoDeploy('officials')` dipanggil setelah: `saveOfficial`, `deleteOfficial`.
   - `triggerAutoDeploy('hero')` dipanggil setelah: `saveHeroSettings`, `resetHeroSettings`.
   - Semua pemanggilan menggunakan guard `typeof BBC_GITHUB !== 'undefined'` agar aman jika modul tidak ter-load.

### 🔑 Setup yang Diperlukan (Satu Kali)
1. Buka **Vercel Dashboard** → Project `bbc-website` → **Settings** → **Environment Variables**
2. Tambahkan variabel: `GITHUB_TOKEN` = `<token-github-anda>` *(lihat di pesan WhatsApp admin)*

3. Pilih environment: **Production, Preview, Development**
4. Klik **Save** → Klik **Redeploy**

Setelah itu, **semua device yang login CMS akan otomatis terhubung ke GitHub & Vercel** tanpa perlu konfigurasi apapun.

### 📁 Berkas yang Dimodifikasi
- **[NEW]** `api/github-push.js` — Serverless proxy GitHub push
- **[MODIFIED]** `js/utils/github-sync.js` — Migrasi ke proxy, auto-init default config
- **[MODIFIED]** `js/pages/cms.js` — 15 auto-deploy trigger hooks di semua operasi save/delete


3. [v2.15.1 — Fix Merge Conflict Git & Penyelarasan Metadata JSON pada GitHub Sync](#-v2151---fix-merge-conflict-git--penyelarasan-metadata-json-pada-github-sync)
4. [v2.15.0 — GitHub Auto-Deploy 1-Klik ke Vercel (BBC_GITHUB Module)](#-v2150---github-auto-deploy-1-klik-ke-vercel-bbc_github-module)
5. [v2.14.0 — Simpan Data CMS ke File Assets (File System Access API)](#-v2140---simpan-data-cms-ke-file-assets-file-system-access-api)
6. [v2.13.0 — Fix Deploy Vercel (Invalid request: exportedAt) & Migrasi Data CMS ke data/*.json](#-v2130---fix-deploy-vercel-invalid-request-exportedat--migrasi-data-cms-ke-datajson)
7. [v2.12.0 — Favicon Logo BBC di Semua Halaman](#-v2120---favicon-logo-bbc-di-semua-halaman)
8. [v2.11.0 — Fix Data CMS Tidak Muncul di Vercel: Static JSON Sync + Export Deploy](#-v2110---fix-data-cms-tidak-muncul-di-vercel-static-json-sync--export-deploy)
9. [v2.10.0 — Pembaruan Foto Dummy Anime Amilat (Pemain & Pengurus Hijab) & Selector Kategori Pengurus](#-v2100---pembaruan-foto-dummy-anime-amilat-pemain--pengurus-hijab--selector-kategori-pengurus)
10. [v2.9.0 — Pembaruan Foto Dummy Anime Amilin (Pemain & Pengurus) & Fallback onerror](#-v290---pembaruan-foto-dummy-anime-amilin-pemain--pengurus--fallback-onerror)
11. [v2.8.0 — Penyembunyian Menu Navigasi & Seluruh Layout CMS Sebelum Login](#-v280---penyembunyian-menu-navigasi--seluruh-layout-cms-sebelum-login)
12. [v2.7.0 — Penyimpanan Data Kosong di CMS & Visibilitas Dinamis Section index.html](#-v270---penyimpanan-data-kosong-di-cms--visibilitas-dinamis-section-indexhtml)
13. [v2.6.0 — Penyeragaman Ukuran Box Navigasi, Single Burger Button & Header Clean](#-v260---penyeragaman-ukuran-box-navigasi-single-burger-button--header-clean)
14. [v2.5.0 — Sidebar Navigasi Samping Kiri Buka-Tutup (Collapsible) Desktop & Tablet](#-v250---sidebar-navigasi-samping-kiri-buka-tutup-collapsible-desktop--tablet)
15. [v2.4.0 — Perapian Dashboard Mobile & Penataan Modul CMS](#-v240---perapian-dashboard-mobile--penataan-modul-cms)
16. [v2.3.0 — Fitur Lazy Load Data (>10 Baris) & Penyesuaian Font Tab Menu](#-v230---fitur-lazy-load-data-10-baris--penyesuaian-font-tab-menu)
17. [v2.2.0 — Optimasi Tipografi dan Responsivitas Konten Form & Tabel CMS](#-v220---optimasi-tipografi-dan-responsivitas-konten-form--tabel-cms)
18. [v2.1.0 — Accordion Header Ringkas, Urutan Menu Prioritas & Hapus Label "Menu"](#-v210---accordion-header-ringkas-urutan-menu-prioritas--hapus-label-menu)

18. [v2.0.0 — Responsivitas Pusat Navigasi Modul & Status Sistem Mobile](#-v200---responsivitas-pusat-navigasi-modul--status-sistem-mobile)
19. [v1.9.0 — Pembersihan Header CMS (BBC ADMIN + Burger Button) & Navigasi Mobile](#-v190---pembersihan-header-cms-bbc-admin--burger-button--navigasi-mobile)

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
