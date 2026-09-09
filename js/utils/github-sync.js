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
            if (!raw) return null;
            return JSON.parse(raw);
        } catch {
            return null;
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
     * Push satu file ke GitHub (create or update).
     * @param {string} owner
     * @param {string} repo
     * @param {string} path - path file di repo
     * @param {string} branch
     * @param {string} token
     * @param {object|Array} data - data JavaScript yang akan di-stringify
     * @param {string} commitMessage
     * @returns {Promise<{success: boolean, url: string|null, error: string|null}>}
     */
    async function pushFile(owner, repo, path, branch, token, data, commitMessage) {
        try {
            // 1. Ambil SHA file yang ada (jika file sudah ada)
            const sha = await getFileSha(owner, repo, path, branch, token);

            // 2. Encode konten JSON ke base64
            const jsonStr = JSON.stringify(data, null, 2);
            const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));

            // 3. Push ke GitHub
            const body = {
                message: commitMessage,
                content: base64Content,
                branch: branch
            };
            if (sha) body.sha = sha; // Diperlukan untuk update (bukan create)

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
                throw new Error(err.message || `HTTP ${resp.status}`);
            }

            const result = await resp.json();
            return {
                success: true,
                url: result.content ? result.content.html_url : null,
                error: null
            };

        } catch (e) {
            return { success: false, url: null, error: e.message };
        }
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
            getData: () => ({ players: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getPlayers() : []) })
        },
        {
            key: 'events',
            path: 'data/events.json',
            getData: () => ({ events: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getEvents() : []) })
        },
        {
            key: 'gallery',
            path: 'data/gallery.json',
            getData: () => ({ gallery: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getGallery() : []) })
        },
        {
            key: 'articles',
            path: 'data/articles.json',
            getData: () => ({ articles: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getArticles() : []) })
        },
        {
            key: 'officials',
            path: 'data/officials.json',
            getData: () => ({ officials: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getOfficials() : []) })
        },
        {
            key: 'hero',
            path: 'data/hero.json',
            getData: () => ({ hero: (typeof BBC_STORE !== 'undefined' ? BBC_STORE.getHeroSettings() : {}) })
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
        }

        return { success: successCount, failed: failedCount, errors };
    }

    // ====================================================
    // 4. STATUS INFO
    // ====================================================
    function getStatus() {
        const c = getConfig();
        if (!c || !c.token) {
            return { configured: false, owner: null, repo: null, branch: null };
        }
        return {
            configured: isConfigured(),
            owner: c.owner,
            repo: c.repo,
            branch: c.branch,
            // Jangan expose token di status
            tokenMasked: c.token ? ('••••••••' + c.token.slice(-4)) : null
        };
    }

    return {
        saveConfig,
        getConfig,
        clearConfig,
        isConfigured,
        verifyToken,
        deployToGitHub,
        getStatus,
        DATA_FILES
    };
})();
