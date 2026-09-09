/**
 * BAZNAS BADMINTON CLUB (BBC)
 * BBC_FS — File System Access API Module
 *
 * Memungkinkan CMS untuk menyimpan data langsung ke file di komputer lokal admin
 * menggunakan File System Access API (Chrome/Edge 86+).
 *
 * Alur Kerja:
 *   1. Admin klik "Setup Folder Proyek" → browser tampilkan folder picker
 *   2. Admin pilih folder root bbc-website/
 *   3. Setiap save/edit/delete → data otomatis ditulis ke data/*.json & assets/images/
 *   4. Admin commit & push ke GitHub → Vercel auto-deploy
 *
 * Fallback: Jika FSAPI tidak tersedia atau folder belum dipilih,
 * semua operasi dibatalkan dengan graceful (tanpa error) dan data
 * tetap tersimpan di localStorage seperti biasa.
 */
const BBC_FS = (function () {
    'use strict';

    // IndexedDB key untuk persist folder handle antar session
    const IDB_DB_NAME = 'bbc_fs_db';
    const IDB_STORE = 'fs_handles';
    const IDB_KEY_FOLDER = 'project_root_folder';

    // Cached handle di memori untuk session ini
    let _rootHandle = null;

    // ====================================================
    // 1. DETEKSI DUKUNGAN BROWSER
    // ====================================================
    /**
     * Cek apakah File System Access API tersedia di browser ini.
     * @returns {boolean}
     */
    function isAvailable() {
        return typeof window !== 'undefined' &&
            typeof window.showDirectoryPicker === 'function';
    }

    /**
     * Cek apakah folder proyek sudah dikonfigurasi untuk session ini.
     * @returns {boolean}
     */
    function isConfigured() {
        return _rootHandle !== null;
    }

    /**
     * Kembalikan nama folder yang dipilih, atau null.
     * @returns {string|null}
     */
    function getFolderName() {
        return _rootHandle ? _rootHandle.name : null;
    }

    // ====================================================
    // 2. PERSIST FOLDER HANDLE VIA INDEXEDDB
    // ====================================================
    function openHandleDB() {
        return new Promise((resolve, reject) => {
            if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB not available'));
            const req = indexedDB.open(IDB_DB_NAME, 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(IDB_STORE)) {
                    db.createObjectStore(IDB_STORE);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function saveHandleToIDB(handle) {
        try {
            const db = await openHandleDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(IDB_STORE, 'readwrite');
                tx.objectStore(IDB_STORE).put(handle, IDB_KEY_FOLDER);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error);
            });
        } catch (e) {
            console.warn('[BBC_FS] Gagal simpan folder handle ke IDB:', e);
            return false;
        }
    }

    async function loadHandleFromIDB() {
        try {
            const db = await openHandleDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(IDB_STORE, 'readonly');
                const req = tx.objectStore(IDB_STORE).get(IDB_KEY_FOLDER);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            return null;
        }
    }

    async function clearHandleFromIDB() {
        try {
            const db = await openHandleDB();
            return new Promise((resolve) => {
                const tx = db.transaction(IDB_STORE, 'readwrite');
                tx.objectStore(IDB_STORE).delete(IDB_KEY_FOLDER);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            });
        } catch (e) {
            return false;
        }
    }

    // ====================================================
    // 3. REQUEST & RESTORE FOLDER
    // ====================================================
    /**
     * Tampilkan dialog folder picker dan simpan handle.
     * @returns {Promise<{success: boolean, folderName: string|null, error: string|null}>}
     */
    async function requestProjectFolder() {
        if (!isAvailable()) {
            return {
                success: false,
                folderName: null,
                error: 'File System Access API tidak didukung di browser ini. Gunakan Chrome atau Edge versi terbaru.'
            };
        }
        try {
            const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
            _rootHandle = handle;
            await saveHandleToIDB(handle);
            return { success: true, folderName: handle.name, error: null };
        } catch (e) {
            if (e.name === 'AbortError') {
                return { success: false, folderName: null, error: 'Pemilihan folder dibatalkan.' };
            }
            return { success: false, folderName: null, error: e.message };
        }
    }

    /**
     * Coba pulihkan folder handle dari IndexedDB (persist dari session sebelumnya).
     * Jika handle ada, verifikasi permission masih aktif.
     * @returns {Promise<boolean>} true jika berhasil restore
     */
    async function tryRestoreHandle() {
        if (_rootHandle) return true; // sudah ada di memory

        const savedHandle = await loadHandleFromIDB();
        if (!savedHandle) return false;

        try {
            // Verifikasi permission
            const perm = await savedHandle.queryPermission({ mode: 'readwrite' });
            if (perm === 'granted') {
                _rootHandle = savedHandle;
                return true;
            }

            // Coba request permission jika belum granted
            const newPerm = await savedHandle.requestPermission({ mode: 'readwrite' });
            if (newPerm === 'granted') {
                _rootHandle = savedHandle;
                return true;
            }
        } catch (e) {
            // Handle mungkin sudah tidak valid
        }

        // Hapus handle yang tidak valid
        await clearHandleFromIDB();
        return false;
    }

    /**
     * Lepas folder yang terpilih dan hapus dari IDB.
     */
    async function clearProjectFolder() {
        _rootHandle = null;
        await clearHandleFromIDB();
    }

    // ====================================================
    // 4. NAVIGASI DIREKTORI
    // ====================================================
    /**
     * Dapatkan FileSystemDirectoryHandle untuk path relatif dari root.
     * Membuat subdirektori jika belum ada.
     * @param {string} relativePath - misal: 'data' atau 'assets/images/players'
     * @returns {Promise<FileSystemDirectoryHandle|null>}
     */
    async function getDirectoryHandle(relativePath) {
        if (!_rootHandle) return null;
        const parts = relativePath.split('/').filter(p => p.length > 0);
        let current = _rootHandle;
        for (const part of parts) {
            try {
                current = await current.getDirectoryHandle(part, { create: true });
            } catch (e) {
                console.warn(`[BBC_FS] Gagal akses direktori '${part}':`, e);
                return null;
            }
        }
        return current;
    }

    // ====================================================
    // 5. TULIS FILE JSON
    // ====================================================
    /**
     * Tulis data sebagai JSON ke path file relatif dari root proyek.
     * @param {string} relativePath - misal: 'data/players.json'
     * @param {object|Array} data - data yang akan di-stringify
     * @param {object} [meta] - metadata tambahan (_version, _updatedAt, arrayKey)
     * @returns {Promise<{success: boolean, error: string|null}>}
     */
    async function writeJsonFile(relativePath, data, meta = {}) {
        if (!_rootHandle) {
            return { success: false, error: 'Folder proyek belum dikonfigurasi.' };
        }

        try {
            // Pisahkan dir dan filename
            const lastSlash = relativePath.lastIndexOf('/');
            const dirPath = lastSlash > 0 ? relativePath.slice(0, lastSlash) : '';
            const filename = lastSlash > 0 ? relativePath.slice(lastSlash + 1) : relativePath;

            // Dapatkan handle direktori target
            const dirHandle = dirPath ? await getDirectoryHandle(dirPath) : _rootHandle;
            if (!dirHandle) throw new Error(`Direktori '${dirPath}' tidak ditemukan.`);

            // Buat/buka file
            const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
            const writable = await fileHandle.createWritable();

            // Buat konten JSON dengan metadata
            const timestamp = new Date().toISOString().split('T')[0];
            const payload = {
                _version: Date.now(),
                _updatedAt: timestamp,
                ...(meta.extraFields || {}),
                ...data // misal: { players: [...] } atau { events: [...] }
            };

            await writable.write(JSON.stringify(payload, null, 2));
            await writable.close();

            return { success: true, error: null };
        } catch (e) {
            console.error(`[BBC_FS] Gagal tulis ${relativePath}:`, e);
            return { success: false, error: e.message };
        }
    }

    // ====================================================
    // 6. SIMPAN FILE GAMBAR
    // ====================================================
    /**
     * Simpan file gambar ke subdirektori assets.
     * @param {string} subdir - path relatif dari root, misal: 'assets/images/players'
     * @param {File} file - file object dari input[type=file]
     * @param {string} [customFilename] - nama file kustom (tanpa ekstensi); jika kosong, pakai nama asli
     * @returns {Promise<{success: boolean, relativePath: string|null, error: string|null}>}
     */
    async function writeImageFile(subdir, file, customFilename = '') {
        if (!_rootHandle) {
            return { success: false, relativePath: null, error: 'Folder proyek belum dikonfigurasi.' };
        }

        try {
            const dirHandle = await getDirectoryHandle(subdir);
            if (!dirHandle) throw new Error(`Direktori '${subdir}' tidak ditemukan.`);

            // Tentukan nama file
            const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'jpg';
            const safeName = customFilename
                ? `${customFilename.toLowerCase().replace(/[^a-z0-9-_]/g, '-')}.${ext}`
                : file.name.toLowerCase().replace(/\s+/g, '-');

            const fileHandle = await dirHandle.getFileHandle(safeName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(file);
            await writable.close();

            // Path relatif untuk digunakan sebagai src di HTML/JSON
            const relativePath = `${subdir}/${safeName}`.replace(/^\//, '');
            return { success: true, relativePath, error: null };

        } catch (e) {
            console.error(`[BBC_FS] Gagal tulis gambar ke ${subdir}:`, e);
            return { success: false, relativePath: null, error: e.message };
        }
    }

    // ====================================================
    // 7. SYNC SEMUA DATA KE JSON FILES
    // ====================================================
    /**
     * Sync semua data dari BBC_STORE ke file JSON di folder proyek.
     * Dipanggil sekali untuk full sync, atau setelah setiap perubahan.
     * @param {string} [category] - kategori spesifik ('players','events','gallery','articles','officials','hero')
     *                              Jika kosong, sync semua.
     * @returns {Promise<{synced: string[], failed: string[]}>}
     */
    async function syncToFiles(category) {
        if (!_rootHandle || typeof BBC_STORE === 'undefined') {
            return { synced: [], failed: [] };
        }

        const synced = [];
        const failed = [];

        const tasks = [
            {
                key: 'players',
                file: 'data/players.json',
                getData: () => ({ players: BBC_STORE.getPlayers() })
            },
            {
                key: 'events',
                file: 'data/events.json',
                getData: () => ({ events: BBC_STORE.getEvents() })
            },
            {
                key: 'gallery',
                file: 'data/gallery.json',
                getData: () => ({ gallery: BBC_STORE.getGallery() })
            },
            {
                key: 'articles',
                file: 'data/articles.json',
                getData: () => ({ articles: BBC_STORE.getArticles() })
            },
            {
                key: 'officials',
                file: 'data/officials.json',
                getData: () => ({ officials: BBC_STORE.getOfficials() })
            },
            {
                key: 'hero',
                file: 'data/hero.json',
                getData: () => ({ hero: BBC_STORE.getHeroSettings() })
            }
        ];

        const selected = category ? tasks.filter(t => t.key === category) : tasks;

        for (const task of selected) {
            try {
                const data = task.getData();
                const result = await writeJsonFile(task.file, data);
                if (result.success) {
                    synced.push(task.key);
                } else {
                    failed.push(task.key);
                    console.warn(`[BBC_FS] Gagal sync '${task.key}':`, result.error);
                }
            } catch (e) {
                failed.push(task.key);
                console.error(`[BBC_FS] Error sync '${task.key}':`, e);
            }
        }

        return { synced, failed };
    }

    // ====================================================
    // 8. STATUS & INFO
    // ====================================================
    /**
     * Kembalikan status lengkap BBC_FS.
     */
    function getStatus() {
        return {
            apiAvailable: isAvailable(),
            folderConfigured: isConfigured(),
            folderName: getFolderName()
        };
    }

    // ====================================================
    // INISIALISASI
    // ====================================================
    // Auto-restore handle dari IDB saat modul dimuat (non-blocking)
    tryRestoreHandle().catch(() => {});

    return {
        isAvailable,
        isConfigured,
        getFolderName,
        getStatus,
        requestProjectFolder,
        tryRestoreHandle,
        clearProjectFolder,
        writeJsonFile,
        writeImageFile,
        syncToFiles
    };
})();
