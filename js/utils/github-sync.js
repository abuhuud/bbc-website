/**
 * BAZNAS BADMINTON CLUB (BBC)
 * BBC_GITHUB — GitHub Contents API Sync Module
 *
 * Memungkinkan CMS untuk melakukan push file JSON langsung ke GitHub repository
 * tanpa perlu download/upload manual. Setelah push, Vercel otomatis redeploy.
 *
 * Prasyarat:
 *   - GitHub Personal Access Token (PAT) dengan scope: repo (atau contents:write)
 *   - Repository dan branch yang benar
 *
 * Cara Kerja:
 *   1. Admin masukkan GitHub Token, owner, repo, branch sekali di panel Backup
 *   2. Klik "🚀 Deploy ke Vercel" → semua file JSON di-push ke GitHub
 *   3. Vercel otomatis redeploy dalam ±1–2 menit
 *
 * Keamanan:
 *   - Token disimpan di localStorage (hanya tersimpan di browser lokal admin)
 *   - Tidak dikirim ke pihak ketiga selain api.github.com via HTTPS
 *   - Admin dapat menghapus token kapan saja
 */
const BBC_GITHUB = (function () {
    'use strict';

    const GITHUB_API = 'https://api.github.com';
    const LS_CONFIG_KEY = 'bbc_github_config';

    // ====================================================
    // 1. KONFIGURASI
    // ====================================================
    /**
     * Simpan konfigurasi GitHub ke localStorage.
     * @param {{owner: string, repo: string, branch: string, token: string}} config
     */
    function saveConfig(config) {
        const clean = {
            owner: (config.owner || '').trim(),
            repo: (config.repo || '').trim(),
            branch: (config.branch || 'main').trim(),
            token: (config.token || '').trim()
        };
        localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(clean));
        return clean;
    }

    /**
     * Baca konfigurasi GitHub dari localStorage.
     * @returns {{owner: string, repo: string, branch: string, token: string}|null}
     */
    function getConfig() {
        try {
            const raw = localStorage.getItem(LS_CONFIG_KEY);
            if (!raw) {
                return {
                    owner: 'abuhuud',
                    repo: 'bbc-website',
                    branch: 'main',
                    token: ''
                };
            }
            const parsed = JSON.parse(raw);
            return {
                owner: (parsed.owner || 'abuhuud').trim(),
                repo: (parsed.repo || 'bbc-website').trim(),
                branch: (parsed.branch || 'main').trim(),
                token: (parsed.token || '').trim()
            };
        } catch {
            return {
                owner: 'abuhuud',
                repo: 'bbc-website',
                branch: 'main',
                token: ''
            };
        }
    }

    /**
     * Hapus konfigurasi GitHub dari localStorage.
     */
    function clearConfig() {
        localStorage.removeItem(LS_CONFIG_KEY);
    }

    /**
     * Cek apakah konfigurasi sudah lengkap.
     * @returns {boolean}
     */
    function isConfigured() {
        const c = getConfig();
        return !!(c && c.owner && c.repo && c.branch && c.token);
    }

    // ====================================================
    // 2. GITHUB API HELPERS
    // ====================================================
    /**
     * Buat header autentikasi GitHub.
     * @param {string} token
     * @returns {Headers}
     */
    function makeHeaders(token) {
        return {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json'
        };
    }

    /**
     * Dapatkan SHA file saat ini di GitHub (diperlukan untuk update).
     * @param {string} owner
     * @param {string} repo
     * @param {string} path - path file di repo, misal 'data/players.json'
     * @param {string} branch
     * @param {string} token
     * @returns {Promise<string|null>} SHA atau null jika file belum ada
     */
    async function getFileSha(owner, repo, path, branch, token) {
        try {
            const resp = await fetch(
                `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
                { headers: makeHeaders(token) }
            );
            if (resp.status === 404) return null; // File belum ada, akan dibuat baru
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err.message || `HTTP ${resp.status}`);
            }
            const data = await resp.json();
            return data.sha || null;
        } catch (e) {
            if (e.message && e.message.includes('404')) return null;
            throw e;
        }
    }

    /**
     * Encode string UTF-8 ke Base64 secara aman dan cepat (mendukung payload besar multibyte).
     * @param {string} str
     * @returns {string}
     */
    function safeBase64Encode(str) {
        try {
            const bytes = new TextEncoder().encode(str);
            const chunks = [];
            const chunkSize = 16384;
            for (let i = 0; i < bytes.length; i += chunkSize) {
                chunks.push(String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize)));
            }
            return btoa(chunks.join(''));
        } catch {
            return btoa(unescape(encodeURIComponent(str)));
        }
    }

    /**
     * Push satu file ke GitHub (create or update) dengan mekanisme retry otomatis
     * jika terjadi 409 Conflict (cabang baru saja diperbarui oleh commit lain).
     * @param {string} owner
     * @param {string} repo
     * @param {string} path - path file di repo
     * @param {string} branch
     * @param {string} token
     * @param {object|Array} data - data JavaScript yang akan di-stringify
     * @param {string} commitMessage
     * @param {number} [maxRetries=3]
     * @returns {Promise<{success: boolean, url: string|null, error: string|null}>}
     */
    async function pushFile(owner, repo, path, branch, token, data, commitMessage, maxRetries = 3) {
        let lastError = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // 1. Ambil SHA file terkini dari GitHub
                const sha = await getFileSha(owner, repo, path, branch, token);

                // 2. Encode konten JSON ke base64
                const jsonStr = JSON.stringify(data, null, 2);
                const base64Content = safeBase64Encode(jsonStr);

                // 3. Push ke GitHub
                const body = {
                    message: commitMessage,
                    content: base64Content,
                    branch: branch
                };
                if (sha) body.sha = sha; // Diperlukan untuk update file yang sudah ada

                const resp = await fetch(
                    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
                    {
                        method: 'PUT',
                        headers: makeHeaders(token),
                        body: JSON.stringify(body)
                    }
                );

                if (!resp.ok) {
                    const err = await resp.json().catch(() => ({}));
                    const errMsg = err.message || `HTTP ${resp.status}`;

                    // Jika 409 Conflict (branch updated in parallel), tunggu dan coba lagi dengan SHA baru
                    if (resp.status === 409 && attempt < maxRetries) {
                        console.warn(`[BBC_GITHUB] Conflict 409 pada '${path}' (percobaan ${attempt}/${maxRetries}), mencoba ulang dalam 500ms...`);
                        await new Promise(r => setTimeout(r, 500 * attempt));
                        continue;
                    }

                    throw new Error(errMsg);
                }

                const result = await resp.json();
                return {
                    success: true,
                    url: result.content ? result.content.html_url : null,
                    error: null
                };

            } catch (e) {
                lastError = e;
                if (attempt < maxRetries) {
                    await new Promise(r => setTimeout(r, 500 * attempt));
                }
            }
        }

        return { success: false, url: null, error: lastError ? lastError.message : 'Unknown error' };
    }

    /**
     * Verifikasi token GitHub dengan memanggil endpoint user.
     * @param {string} token
     * @returns {Promise<{valid: boolean, username: string|null, error: string|null}>}
     */
    async function verifyToken(token) {
        try {
            const resp = await fetch(`${GITHUB_API}/user`, {
                headers: makeHeaders(token)
            });
            if (!resp.ok) {
                if (resp.status === 401) return { valid: false, username: null, error: 'Token tidak valid atau sudah kadaluarsa.' };
                return { valid: false, username: null, error: `HTTP ${resp.status}` };
            }
            const data = await resp.json();
            return { valid: true, username: data.login, error: null };
        } catch (e) {
            return { valid: false, username: null, error: e.message };
        }
    }

    // ====================================================
    // 3. SYNC SEMUA DATA KE GITHUB
    // ====================================================
    /**
     * Mapping kategori data ke path file JSON di repository.
     */
    const DATA_FILES = [
        {
            key: 'players',
            path: 'data/players.json',
            getData: () => ({
                _version: Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                players: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getPlayers() : [])
            })
        },
        {
            key: 'events',
            path: 'data/events.json',
            getData: () => ({
                _version: Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                events: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getEvents() : [])
            })
        },
        {
            key: 'gallery',
            path: 'data/gallery.json',
            getData: () => ({
                _version: Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                gallery: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getGallery() : [])
            })
        },
        {
            key: 'articles',
            path: 'data/articles.json',
            getData: () => ({
                _version: Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                articles: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getArticles() : [])
            })
        },
        {
            key: 'officials',
            path: 'data/officials.json',
            getData: () => ({
                _version: Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                officials: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getOfficials() : [])
            })
        },
        {
            key: 'hero',
            path: 'data/hero.json',
            getData: () => ({
                _version: Date.now(),
                _updatedAt: new Date().toISOString().split('T')[0],
                hero: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getHeroSettings() : {})
            })
        }
    ];

    /**
     * Push semua file data JSON ke GitHub, satu per satu.
     *
     * @param {object} [options]
     * @param {string[]} [options.categories] - Kategori spesifik ('players','events', dll).
     *                                          Kosong = push semua.
     * @param {function} [options.onProgress] - Callback (kategori, status, error) per file
     * @returns {Promise<{success: number, failed: number, errors: string[]}>}
     */
    async function deployToGitHub(options = {}) {
        const config = getConfig();
        if (!config || !isConfigured()) {
            return { success: 0, failed: 0, errors: ['Konfigurasi GitHub belum diatur.'] };
        }

        const { owner, repo, branch, token } = config;
        const { categories, onProgress } = options;

        const targets = categories && categories.length
            ? DATA_FILES.filter(f => categories.includes(f.key))
            : DATA_FILES;

        let successCount = 0;
        let failedCount = 0;
        const errors = [];

        const timestamp = new Date().toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
        const commitMsg = `chore: update data via BBC CMS — ${timestamp}`;

        for (const file of targets) {
            if (onProgress) onProgress(file.key, 'uploading', null);
            try {
                const data = file.getData();
                const result = await pushFile(owner, repo, file.path, branch, token, data, commitMsg);
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

            // Jeda singkat antar file untuk memberi waktu GitHub memperbarui ref pointer branch
            if (targets.length > 1) {
                await new Promise(r => setTimeout(r, 400));
            }
        }

        return { success: successCount, failed: failedCount, errors };
    }

    // ====================================================
    // 4. AUTO-DEPLOY BACKGROUND SCHEDULER
    // ====================================================
    const LS_AUTODEPLOY_KEY = 'bbc_github_autodeploy_enabled';
    let autoDeployTimer = null;
    const pendingCategories = new Set();
    const statusListeners = [];

    /**
     * Cek apakah auto-deploy otomatis diaktifkan.
     * Default: true (aktif) jika GitHub sudah dikonfigurasi.
     * @returns {boolean}
     */
    function isAutoDeployEnabled() {
        const val = localStorage.getItem(LS_AUTODEPLOY_KEY);
        return val === null ? true : val === 'true';
    }

    /**
     * Set preferensi auto-deploy (aktif/nonaktif).
     * @param {boolean} enabled
     */
    function setAutoDeployEnabled(enabled) {
        localStorage.setItem(LS_AUTODEPLOY_KEY, enabled ? 'true' : 'false');
        notifyStatusListeners({
            type: 'autodeploy_toggle',
            enabled: enabled,
            message: enabled ? 'Auto-deploy ke Vercel diaktifkan.' : 'Auto-deploy ke Vercel dinonaktifkan.'
        });
    }

    /**
     * Daftarkan pendengar perubahan status sync / deploy.
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
     * Picu auto-deploy ke GitHub & Vercel secara otomatis dengan debounce 2 detik.
     * Jika terjadi beberapa kali perubahan data secara berturut-turut,
     * kategori yang diubah dikumpulkan dan di-push sekaligus dalam satu batch.
     *
     * @param {string} category - Kategori data ('players' | 'events' | 'gallery' | 'articles' | 'officials' | 'hero')
     */
    function triggerAutoDeploy(category) {
        if (!isConfigured()) return;
        if (!isAutoDeployEnabled()) {
            console.info('[BBC_GITHUB] Auto-deploy dilewati (fitur dinonaktifkan oleh admin).');
            return;
        }

        if (category) {
            pendingCategories.add(category);
        }

        const currentPending = Array.from(pendingCategories);

        notifyStatusListeners({
            type: 'queued',
            categories: currentPending,
            message: `Menunggu jeda perubahan (${currentPending.join(', ')})...`
        });

        // Reset timer jika ada mutasi baru dalam 2 detik
        if (autoDeployTimer) {
            clearTimeout(autoDeployTimer);
        }

        autoDeployTimer = setTimeout(async () => {
            const categoriesToDeploy = Array.from(pendingCategories);
            pendingCategories.clear();
            autoDeployTimer = null;

            if (categoriesToDeploy.length === 0) return;

            console.info(`[BBC_GITHUB] 🚀 Memulai auto-push ke GitHub untuk: ${categoriesToDeploy.join(', ')}`);
            notifyStatusListeners({
                type: 'deploying',
                categories: categoriesToDeploy,
                message: `☁️ Mendorong ${categoriesToDeploy.join(', ')} ke GitHub & Vercel...`
            });

            try {
                const result = await deployToGitHub({ categories: categoriesToDeploy });
                if (result.success > 0 && result.failed === 0) {
                    console.info(`[BBC_GITHUB] ✅ Auto-deploy berhasil untuk: ${categoriesToDeploy.join(', ')}`);
                    notifyStatusListeners({
                        type: 'success',
                        categories: categoriesToDeploy,
                        message: `✅ Berhasil sinkron ke Vercel (${categoriesToDeploy.join(', ')}). Vercel sedang redeploy!`,
                        result
                    });
                } else if (result.failed > 0) {
                    console.warn(`[BBC_GITHUB] ⚠️ Sebagian file gagal di-push:`, result.errors);
                    notifyStatusListeners({
                        type: 'error',
                        categories: categoriesToDeploy,
                        message: `⚠️ Gagal auto-deploy: ${result.errors.join('; ')}`,
                        result
                    });
                }
            } catch (err) {
                console.error('[BBC_GITHUB] Auto-deploy error:', err);
                notifyStatusListeners({
                    type: 'error',
                    categories: categoriesToDeploy,
                    message: `⚠️ Gagal auto-deploy: ${err.message}`,
                    error: err
                });
            }
        }, 2000);
    }

    // ====================================================
    // 5. STATUS INFO
    // ====================================================
    function getStatus() {
        const c = getConfig();
        if (!c || !c.token) {
            return {
                configured: false,
                owner: null,
                repo: null,
                branch: null,
                autoDeployEnabled: isAutoDeployEnabled()
            };
        }
        return {
            configured: isConfigured(),
            owner: c.owner,
            repo: c.repo,
            branch: c.branch,
            autoDeployEnabled: isAutoDeployEnabled(),
            tokenMasked: c.token ? ('••••••••' + c.token.slice(-4)) : null
        };
    }

    return {
        saveConfig,
        getConfig,
        clearConfig,
        isConfigured,
        isAutoDeployEnabled,
        setAutoDeployEnabled,
        triggerAutoDeploy,
        onStatusChange,
        verifyToken,
        deployToGitHub,
        getStatus,
        DATA_FILES
    };
})();
