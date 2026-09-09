/**
 * BAZNAS BADMINTON CLUB (BBC)
 * BBC_GITHUB — GitHub Auto-Deploy Sync Module (Secure Proxy Edition)
 *
 * Arsitektur Keamanan:
 *   - Token GitHub PAT TIDAK disimpan di browser/localStorage
 *   - Semua push ke GitHub dilakukan melalui /api/github-push (serverless proxy Vercel)
 *   - Token hanya ada di Vercel server-side Environment Variables
 *   - Browser hanya tahu: owner, repo, branch (info publik, tidak sensitif)
 *
 * Cara Kerja:
 *   1. CMS menyimpan perubahan ke BBC_STORE (localStorage)
 *   2. BBC_GITHUB.triggerAutoDeploy(category) dipanggil otomatis setelah setiap save
 *   3. Dengan debounce 2 detik, modul push ke /api/github-push
 *   4. Server proxy meneruskan ke GitHub API menggunakan GITHUB_TOKEN (aman)
 *   5. Vercel otomatis redeploy setelah ada commit baru di repo
 *
 * Setup:
 *   - Tambahkan GITHUB_TOKEN di Vercel Dashboard → Project Settings → Environment Variables
 *   - Tidak perlu konfigurasi apapun di browser/CMS — sudah otomatis untuk semua device
 */
const BBC_GITHUB = (function () {
    'use strict';

    // ====================================================
    // KONFIGURASI DEFAULT (info publik, bukan sensitif)
    // Token disimpan di Vercel server-side, TIDAK di sini
    // ====================================================
    const DEFAULT_CONFIG = {
        owner:  'abuhuud',
        repo:   'bbc-website',
        branch: 'main'
    };

    // Endpoint proxy serverless Vercel (relatif — otomatis pakai domain yang sama)
    const PROXY_PUSH_ENDPOINT   = '/api/github-push';
    const PROXY_STATUS_ENDPOINT = '/api/github-push?action=status';

    const LS_CONFIG_KEY     = 'bbc_github_config';
    const LS_AUTODEPLOY_KEY = 'bbc_github_autodeploy_enabled';

    // ====================================================
    // 1. KONFIGURASI (hanya owner/repo/branch — tanpa token)
    // ====================================================

    /**
     * Auto-inisialisasi konfigurasi default saat pertama kali dijalankan.
     * Dipanggil sekali saat modul dimuat — tidak menimpa konfigurasi yang sudah ada.
     */
    function initDefaultConfig() {
        const existing = getConfig();
        if (!existing || !existing.owner || !existing.repo) {
            saveConfig(DEFAULT_CONFIG);
            console.info('[BBC_GITHUB] Konfigurasi default diinisialisasi:', DEFAULT_CONFIG);
        }
    }

    /**
     * Simpan konfigurasi (owner/repo/branch) ke localStorage.
     * Token TIDAK disimpan di sini — ada di Vercel env var.
     * @param {{owner: string, repo: string, branch: string}} config
     */
    function saveConfig(config) {
        const clean = {
            owner:  (config.owner  || DEFAULT_CONFIG.owner).trim(),
            repo:   (config.repo   || DEFAULT_CONFIG.repo).trim(),
            branch: (config.branch || DEFAULT_CONFIG.branch).trim()
        };
        localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(clean));
        return clean;
    }

    /**
     * Baca konfigurasi dari localStorage.
     * @returns {{owner: string, repo: string, branch: string}|null}
     */
    function getConfig() {
        try {
            const raw = localStorage.getItem(LS_CONFIG_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    /**
     * Reset konfigurasi ke default.
     */
    function resetToDefault() {
        saveConfig(DEFAULT_CONFIG);
    }

    /**
     * Hapus konfigurasi (jarang dipakai — config tidak mengandung token sensitif).
     */
    function clearConfig() {
        localStorage.removeItem(LS_CONFIG_KEY);
    }

    /**
     * Selalu terkonfigurasi karena token ada di server.
     * Menggunakan endpoint status untuk verifikasi server-side.
     * @returns {boolean}
     */
    function isConfigured() {
        // Selalu true — konfigurasi tidak bergantung pada localStorage client
        // Token dicek server-side saat push dilakukan
        return true;
    }

    // ====================================================
    // 2. PROXY PUSH — via /api/github-push
    // ====================================================

    /**
     * Push satu file ke GitHub melalui server-side proxy.
     * Token tidak pernah keluar dari server Vercel.
     *
     * @param {string} filePath     - Path file di repo: 'data/players.json'
     * @param {object|Array} data   - Data JavaScript yang akan di-stringify
     * @param {string} commitMsg    - Pesan commit
     * @returns {Promise<{success: boolean, url: string|null, error: string|null}>}
     */
    async function pushFile(filePath, data, commitMsg) {
        try {
            // Encode ke base64 (diperlukan oleh GitHub Contents API)
            const jsonStr = JSON.stringify(data, null, 2);
            const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));

            const resp = await fetch(PROXY_PUSH_ENDPOINT, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                    path:          filePath,
                    content:       base64Content,
                    commitMessage: commitMsg
                })
            });

            const result = await resp.json().catch(() => ({}));

            if (!resp.ok || !result.success) {
                throw new Error(result.error || `HTTP ${resp.status}`);
            }

            return { success: true, url: result.url || null, error: null };

        } catch (e) {
            return { success: false, url: null, error: e.message };
        }
    }

    /**
     * Cek status konfigurasi server-side (apakah GITHUB_TOKEN sudah diset di Vercel).
     * @returns {Promise<{configured: boolean, owner: string, repo: string, branch: string, message: string}>}
     */
    async function checkServerStatus() {
        try {
            const resp = await fetch(PROXY_STATUS_ENDPOINT, { cache: 'no-store' });
            if (!resp.ok) return { configured: false, message: `HTTP ${resp.status}` };
            return await resp.json();
        } catch (e) {
            return { configured: false, message: e.message };
        }
    }

    /**
     * Verifikasi koneksi ke GitHub (via proxy server — tidak ada token di browser).
     * @returns {Promise<{valid: boolean, username: string|null, error: string|null}>}
     */
    async function verifyToken() {
        const status = await checkServerStatus();
        if (status.configured) {
            return { valid: true, username: `${status.owner} (proxy)`, error: null };
        }
        return {
            valid:    false,
            username: null,
            error:    status.message || 'GITHUB_TOKEN belum dikonfigurasi di server Vercel.'
        };
    }

    // ====================================================
    // 3. MAPPING DATA FILES
    // ====================================================

    const DATA_FILES = [
        {
            key:     'players',
            path:    'data/players.json',
            getData: () => ({
                _version:   Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                players:    (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getPlayers()      : [])
            })
        },
        {
            key:     'events',
            path:    'data/events.json',
            getData: () => ({
                _version:   Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                events:     (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getEvents()       : [])
            })
        },
        {
            key:     'gallery',
            path:    'data/gallery.json',
            getData: () => ({
                _version:   Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                gallery:    (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getGallery()      : [])
            })
        },
        {
            key:     'articles',
            path:    'data/articles.json',
            getData: () => ({
                _version:   Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                articles:   (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getArticles()     : [])
            })
        },
        {
            key:     'officials',
            path:    'data/officials.json',
            getData: () => ({
                _version:   Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                officials:  (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getOfficials()    : [])
            })
        },
        {
            key:     'hero',
            path:    'data/hero.json',
            getData: () => ({
                _version:   Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                hero:       (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getHeroSettings() : {})
            })
        }
    ];

    // ====================================================
    // 4. DEPLOY SEMUA / SEBAGIAN FILE KE GITHUB
    // ====================================================

    /**
     * Push semua (atau sebagian) file data JSON ke GitHub via proxy.
     *
     * @param {object}   [options]
     * @param {string[]} [options.categories] - Kategori spesifik atau kosong = semua
     * @param {function} [options.onProgress] - Callback(category, status, error)
     * @returns {Promise<{success: number, failed: number, errors: string[]}>}
     */
    async function deployToGitHub(options = {}) {
        const { categories, onProgress } = options;

        const targets = categories && categories.length
            ? DATA_FILES.filter(f => categories.includes(f.key))
            : DATA_FILES;

        let successCount = 0;
        let failedCount  = 0;
        const errors     = [];

        const timestamp = new Date().toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
        const commitMsg = `chore: update data via BBC CMS — ${timestamp}`;

        for (const file of targets) {
            if (onProgress) onProgress(file.key, 'uploading', null);
            try {
                const data   = file.getData();
                const result = await pushFile(file.path, data, commitMsg);
                if (result.success) {
                    successCount++;
                    if (onProgress) onProgress(file.key, 'success', null);
                } else {
                    failedCount++;
                    errors.push(`${file.key}: ${result.error}`);
                    if (onProgress) onProgress(file.key, 'error', result.error);
                }
            } catch (e) {
                failedCount++;
                errors.push(`${file.key}: ${e.message}`);
                if (onProgress) onProgress(file.key, 'error', e.message);
            }
        }

        return { success: successCount, failed: failedCount, errors };
    }

    // ====================================================
    // 5. AUTO-DEPLOY BACKGROUND SCHEDULER (Debounced)
    // ====================================================

    let   autoDeployTimer    = null;
    const pendingCategories  = new Set();
    const statusListeners    = [];

    /**
     * Cek apakah auto-deploy diaktifkan.
     * Default: true.
     * @returns {boolean}
     */
    function isAutoDeployEnabled() {
        const val = localStorage.getItem(LS_AUTODEPLOY_KEY);
        return val === null ? true : val === 'true';
    }

    /**
     * Set preferensi auto-deploy.
     * @param {boolean} enabled
     */
    function setAutoDeployEnabled(enabled) {
        localStorage.setItem(LS_AUTODEPLOY_KEY, enabled ? 'true' : 'false');
        notifyStatusListeners({
            type:    'autodeploy_toggle',
            enabled: enabled,
            message: enabled ? 'Auto-deploy ke Vercel diaktifkan.' : 'Auto-deploy ke Vercel dinonaktifkan.'
        });
    }

    /**
     * Daftarkan listener perubahan status sync/deploy.
     * @param {function(object):void} callback
     */
    function onStatusChange(callback) {
        if (typeof callback === 'function') {
            statusListeners.push(callback);
        }
    }

    /**
     * Beritahu semua listener tentang status terkini.
     * @param {object} event
     */
    function notifyStatusListeners(event) {
        statusListeners.forEach(fn => {
            try { fn(event); } catch (e) { console.error('[BBC_GITHUB] Listener error:', e); }
        });
    }

    /**
     * Picu auto-deploy ke GitHub & Vercel dengan debounce 2 detik.
     * Perubahan beruntun dalam 2 detik akan di-batch menjadi satu push.
     *
     * @param {string} category - 'players' | 'events' | 'gallery' | 'articles' | 'officials' | 'hero'
     */
    function triggerAutoDeploy(category) {
        if (!isAutoDeployEnabled()) {
            console.info('[BBC_GITHUB] Auto-deploy dilewati (dinonaktifkan oleh admin).');
            return;
        }

        if (category) pendingCategories.add(category);

        const currentPending = Array.from(pendingCategories);
        notifyStatusListeners({
            type:       'queued',
            categories: currentPending,
            message:    `Menunggu jeda perubahan (${currentPending.join(', ')})...`
        });

        if (autoDeployTimer) clearTimeout(autoDeployTimer);

        autoDeployTimer = setTimeout(async () => {
            const categoriesToDeploy = Array.from(pendingCategories);
            pendingCategories.clear();
            autoDeployTimer = null;

            if (categoriesToDeploy.length === 0) return;

            console.info(`[BBC_GITHUB] 🚀 Auto-push ke GitHub via proxy: ${categoriesToDeploy.join(', ')}`);
            notifyStatusListeners({
                type:       'deploying',
                categories: categoriesToDeploy,
                message:    `☁️ Mendorong ${categoriesToDeploy.join(', ')} ke GitHub & Vercel...`
            });

            try {
                const result = await deployToGitHub({ categories: categoriesToDeploy });

                if (result.success > 0 && result.failed === 0) {
                    console.info(`[BBC_GITHUB] ✅ Auto-deploy berhasil: ${categoriesToDeploy.join(', ')}`);
                    notifyStatusListeners({
                        type:       'success',
                        categories: categoriesToDeploy,
                        message:    `✅ Berhasil sinkron ke Vercel (${categoriesToDeploy.join(', ')}). Vercel sedang redeploy!`,
                        result
                    });
                } else if (result.failed > 0) {
                    console.warn('[BBC_GITHUB] ⚠️ Sebagian file gagal:', result.errors);
                    notifyStatusListeners({
                        type:       'error',
                        categories: categoriesToDeploy,
                        message:    `⚠️ Gagal auto-deploy: ${result.errors.join('; ')}`,
                        result
                    });
                }
            } catch (err) {
                console.error('[BBC_GITHUB] Auto-deploy error:', err);
                notifyStatusListeners({
                    type:       'error',
                    categories: categoriesToDeploy,
                    message:    `⚠️ Gagal auto-deploy: ${err.message}`,
                    error:      err
                });
            }
        }, 2000); // debounce 2 detik
    }

    // ====================================================
    // 6. STATUS INFO
    // ====================================================

    function getStatus() {
        const c = getConfig() || DEFAULT_CONFIG;
        return {
            configured:        true, // selalu true — token di server
            owner:             c.owner  || DEFAULT_CONFIG.owner,
            repo:              c.repo   || DEFAULT_CONFIG.repo,
            branch:            c.branch || DEFAULT_CONFIG.branch,
            autoDeployEnabled: isAutoDeployEnabled(),
            tokenMasked:       '••••••••[server-side]'
        };
    }

    // ====================================================
    // 7. INISIALISASI OTOMATIS saat modul pertama kali dimuat
    // ====================================================
    initDefaultConfig();

    // ====================================================
    // PUBLIC API
    // ====================================================
    return {
        saveConfig,
        getConfig,
        clearConfig,
        resetToDefault,
        isConfigured,
        isAutoDeployEnabled,
        setAutoDeployEnabled,
        triggerAutoDeploy,
        onStatusChange,
        verifyToken,
        checkServerStatus,
        deployToGitHub,
        getStatus,
        DATA_FILES,
        DEFAULT_CONFIG
    };
})();
