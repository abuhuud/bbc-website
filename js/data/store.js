/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Unified Data Store Layer (LocalStorage with Fallback Seed + Static JSON Sync)
 * Central management for Players, Events, Gallery Moments, and Articles.
 *
 * DEPLOYMENT FIX: Data kini di-fetch dari file JSON statis (/data/*.json) saat
 * pertama kali dibuka atau saat versi JSON lebih baru dari localStorage.
 * Alur kerja: Edit via CMS → Export JSON → Commit ke GitHub → Vercel redeploy.
 */
const BBC_STORE = (function () {
    const STORAGE_KEYS = {
        PLAYERS: 'bbc_data_players_v5',
        EVENTS: 'bbc_data_events_v4',
        GALLERY: 'bbc_data_gallery_v1',
        ARTICLES: 'bbc_data_articles_v1',
        OFFICIALS: 'bbc_data_officials_v1',
        HERO: 'bbc_data_hero_v1'
    };

    // Versi JSON yang tersimpan di localStorage (untuk deteksi update)
    const JSON_VERSION_KEYS = {
        PLAYERS: 'bbc_json_ver_players',
        EVENTS: 'bbc_json_ver_events',
        GALLERY: 'bbc_json_ver_gallery',
        ARTICLES: 'bbc_json_ver_articles',
        OFFICIALS: 'bbc_json_ver_officials',
        HERO: 'bbc_json_ver_hero'
    };

    // Path JSON relatif — otomatis menyesuaikan apakah di /pages/ atau root
    function getJsonBasePath() {
        if (typeof window !== 'undefined' && window.location.pathname.includes('/pages/')) {
            return '../data/';
        }
        return './data/';
    }

    // Path API relatif — otomatis menyesuaikan apakah di /pages/ atau root
    function getApiBasePath() {
        if (typeof window !== 'undefined' && window.location.pathname.includes('/pages/')) {
            return '../api/';
        }
        return './api/';
    }

    // Default Hero Settings (Supports Photo or Video)
    const DEFAULT_HERO = {
        mediaType: 'image', // 'image' | 'video'
        mainImage: 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=900',
        mainVideo: '',
        mainImageAlt: 'Insan BAZNAS Badminton Club berlatih di lapangan',
        mainLabel: '🔥 MATCH POINT!',
        thumb1Image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400',
        thumb1Alt: 'Turnamen Badminton BBC',
        thumb1Label: 'SPARING',
        thumb2Image: 'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&q=80&w=400',
        thumb2Alt: 'Latihan Footwork BBC',
        thumb2Label: 'PRACTICE'
    };

    // ========================================================
    // IN-MEMORY DATA STORE (SINGLE SOURCE OF TRUTH)
    // Data dimuat langsung dari file .json / Vercel API, TIDAK lagi disimpan di localStorage.
    // ========================================================
    const inMemoryData = {
        players: null,
        events: null,
        gallery: null,
        articles: null,
        officials: null,
        hero: null
    };

    // Bersihkan cache usang di localStorage agar browser tidak tertahan pada data lama
    function purgeLegacyLocalStorage() {
        try {
            if (typeof localStorage !== 'undefined') {
                Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
                Object.values(JSON_VERSION_KEYS).forEach(k => localStorage.removeItem(k));
            }
        } catch (e) {}
    }

    // Eksekusi pembersihan sekali saat inisialisasi modul
    purgeLegacyLocalStorage();

    // Siarkan perubahan agar tampilan website ikut ter-update seketika
    function broadcast(key) {
        if (typeof BBC_LIVE !== 'undefined' && BBC_LIVE.notify) {
            BBC_LIVE.notify(key);
        }
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
            try {
                window.dispatchEvent(new CustomEvent('bbc-data-changed', { detail: { key } }));
            } catch (e) {}
        }
    }

    // ========================================================
    // PERSISTENSI LANGSUNG KE FILE .JSON & VERCEL BLOB
    // Setiap penambahan, perubahan, dan penghapusan langsung disimpan ke backend .json
    // ========================================================
    const FS_CATEGORY_MAP = {
        [STORAGE_KEYS.PLAYERS]:   'players',
        [STORAGE_KEYS.EVENTS]:    'events',
        [STORAGE_KEYS.GALLERY]:   'gallery',
        [STORAGE_KEYS.ARTICLES]:  'articles',
        [STORAGE_KEYS.OFFICIALS]: 'officials',
        [STORAGE_KEYS.HERO]:      'hero'
    };

    /**
     * Persistensi utama langsung ke file JSON & Vercel Blob (Tanpa LocalStorage)
     * Dipanggil otomatis pada setiap operasi penambahan, perubahan, dan penghapusan di CMS.
     * @param {string} category - 'players' | 'events' | 'gallery' | 'articles' | 'officials' | 'hero'
     * @param {*} [data=null] - data terbaru untuk kategori
     */
    async function persistCategory(category, data = null) {
        if (!category) return null;
        const currentVer = Date.now();
        const timestamp = new Date().toISOString();

        let payloadData = data;
        if (!payloadData) {
            if (category === 'players') payloadData = getPlayers();
            else if (category === 'events') payloadData = getEvents();
            else if (category === 'gallery') payloadData = getGallery();
            else if (category === 'articles') payloadData = getArticles();
            else if (category === 'officials') payloadData = getOfficials();
            else if (category === 'hero') payloadData = getHeroSettings();
        }

        // Simpan langsung ke in-memory store
        inMemoryData[category] = payloadData;

        const fullPayload = {
            _version: currentVer,
            _updatedAt: timestamp,
            [category]: payloadData
        };

        // 1. Simpan langsung ke endpoint API Vercel / serverless / local node
        let apiResult = null;
        try {
            if (typeof fetch !== 'undefined') {
                const base = getApiBasePath();
                const res = await fetch(`${base}data?category=${encodeURIComponent(category)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fullPayload)
                });
                if (res.ok) {
                    apiResult = await res.json();
                    console.info(`[BBC_STORE] ☁️ Berhasil disimpan langsung ke file .json & Vercel (${category}):`, apiResult);
                    if (typeof document !== 'undefined') {
                        const badgeText = document.getElementById('cloud-sync-topbar-text');
                        const badgeDot = document.getElementById('cloud-sync-dot');
                        if (badgeText) badgeText.textContent = `☁️ Vercel: ${category}.json tersimpan!`;
                        if (badgeDot) {
                            badgeDot.style.background = '#10B981';
                            badgeDot.style.boxShadow = '0 0 8px #10B981';
                        }
                    }
                } else {
                    console.warn(`[BBC_STORE] Serverless API HTTP ${res.status} saat menyimpan ${category}`);
                }
            }
        } catch (err) {
            console.warn(`[BBC_STORE] Gagal kirim ke API /api/data (${category}):`, err.message);
        }

        // 2. Simpan ke file lokal via File System Access API jika aktif di CMS
        if (typeof BBC_FS !== 'undefined' && BBC_FS.isConfigured && BBC_FS.isConfigured()) {
            try {
                await BBC_FS.writeJsonFile(`data/${category}.json`, payloadData);
            } catch (fsErr) {
                console.warn(`[BBC_STORE] BBC_FS writeJsonFile error for ${category}:`, fsErr);
            }
        }

        // 3. Memicu broadcast agar tab dan UI website terupdate seketika
        broadcast(category);

        return {
            success: true,
            category,
            version: currentVer,
            updatedAt: timestamp,
            apiResult
        };
    }

    async function syncToVercel(category, data = null) {
        return await persistCategory(category, data);
    }

    function syncToFile(storageKey) {
        const category = FS_CATEGORY_MAP[storageKey] || storageKey;
        if (!category) return;
        persistCategory(category);
    }

    // Helper to generate URL-safe slugs
    function slugify(text) {
        if (!text) return '';
        return text.toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
    function getDummyPhoto(gender) {
        const inPages = (typeof window !== 'undefined' && window.location.pathname.includes('/pages/'));
        const base = inPages ? '../' : '';
        return gender === 'female'
            ? `${base}assets/images/players/dummy-female.jpg`
            : `${base}assets/images/players/dummy-male.jpg`;
    }

    function getPlayerPhoto(player) {
        if (player && typeof player.image === 'string' && player.image.trim() !== '') {
            return player.image;
        }
        return getDummyPhoto(player ? player.gender : 'male');
    }

    if (typeof window !== 'undefined') {
        window.BBC_slugify = slugify;
        window.BBC_getDummyPhoto = getDummyPhoto;
        window.BBC_getPlayerPhoto = getPlayerPhoto;
    }

    // Helper to generate IDs
    function makeId(prefix, text) {
        if (text) {
            const slug = slugify(text);
            if (slug) return `${slug}-${Date.now().toString().slice(-4)}`;
        }
        return `${prefix}-${Date.now()}`;
    }

    // ========================================================
    // 1. PLAYERS CRUD & PLAYER OF THE MONTH (POTM)
    // ========================================================
    function normalizePlayer(p) {
        if (!p) return p;
        p.slug = slugify(p.name);
        delete p.nickname;
        delete p.number;
        if (typeof p.isPlayerOfTheMonth !== 'boolean') {
            p.isPlayerOfTheMonth = false;
        }
        if (!p.stats || typeof p.stats !== 'object') {
            p.stats = {
                attendance: 20,
                matches: 25,
                wins: 18,
                losses: 7
            };
        } else {
            p.stats.attendance = parseInt(p.stats.attendance, 10) || 0;
            p.stats.matches = parseInt(p.stats.matches, 10) || 0;
            p.stats.wins = parseInt(p.stats.wins, 10) || 0;
            p.stats.losses = parseInt(p.stats.losses, 10) || 0;
        }

        // Ensure gallery array
        if (!Array.isArray(p.gallery)) {
            const seed = (typeof players !== 'undefined') ? players : [];
            const seedMatch = seed.find(s => String(s.id) === String(p.id));
            p.gallery = (seedMatch && Array.isArray(seedMatch.gallery)) ? [...seedMatch.gallery] : [];
        }

        return p;
    }

    function ensureSinglePotmPerGender(list) {
        let hasMalePotm = false;
        let hasFemalePotm = false;

        list.forEach(p => {
            if (p.isPlayerOfTheMonth) {
                if (p.gender === 'male') {
                    if (hasMalePotm) {
                        p.isPlayerOfTheMonth = false;
                    } else {
                        hasMalePotm = true;
                    }
                } else if (p.gender === 'female') {
                    if (hasFemalePotm) {
                        p.isPlayerOfTheMonth = false;
                    } else {
                        hasFemalePotm = true;
                    }
                }
            }
        });

        // If neither was flagged, ensure default first
        if (!hasMalePotm) {
            const firstMale = list.find(p => p.gender === 'male');
            if (firstMale) firstMale.isPlayerOfTheMonth = true;
        }
        if (!hasFemalePotm) {
            const firstFemale = list.find(p => p.gender === 'female');
            if (firstFemale) firstFemale.isPlayerOfTheMonth = true;
        }
    }

    function getPlayers() {
        if (inMemoryData.players === null) {
            const seed = (typeof players !== 'undefined') ? players : [];
            inMemoryData.players = seed.map(p => normalizePlayer({ ...p }));
            ensureSinglePotmPerGender(inMemoryData.players);
        } else {
            inMemoryData.players = inMemoryData.players.map(p => normalizePlayer(p));
            ensureSinglePotmPerGender(inMemoryData.players);
        }
        return inMemoryData.players;
    }

    function getPlayerById(idOrSlug) {
        if (!idOrSlug) return null;
        const list = getPlayers();
        const key = String(idOrSlug).toLowerCase().trim();
        return list.find(p => 
            String(p.id).toLowerCase() === key || 
            (p.slug && p.slug.toLowerCase() === key) ||
            slugify(p.name).toLowerCase() === key
        ) || null;
    }

    function getPlayersOfTheMonth() {
        const list = getPlayers();
        const amilin = list.find(p => p.gender === 'male' && p.isPlayerOfTheMonth) ||
            list.find(p => p.gender === 'male') || null;
        const amilat = list.find(p => p.gender === 'female' && p.isPlayerOfTheMonth) ||
            list.find(p => p.gender === 'female') || null;
        return { amilin, amilat };
    }

    function setPlayerOfTheMonth(id, isPotm) {
        const list = getPlayers();
        const target = list.find(p => String(p.id) === String(id));
        if (!target) return false;

        if (isPotm) {
            // Strictly enforce: only 1 POTM for this gender
            list.forEach(p => {
                if (p.gender === target.gender) {
                    p.isPlayerOfTheMonth = false;
                }
            });
            target.isPlayerOfTheMonth = true;
        } else {
            target.isPlayerOfTheMonth = false;
        }

        inMemoryData.players = list;
        persistCategory('players', list);
        return true;
    }

    function savePlayer(player) {
        const list = getPlayers();
        const index = list.findIndex(p => String(p.id) === String(player.id));

        if (!player.id) {
            player.id = makeId('player', player.name);
        }

        // Always compute and sync slug with player name
        player.slug = slugify(player.name);
        delete player.nickname;
        delete player.number;

        // Normalize stats
        player.stats = {
            attendance: parseInt(player.stats?.attendance, 10) || 0,
            matches: parseInt(player.stats?.matches, 10) || 0,
            wins: parseInt(player.stats?.wins, 10) || 0,
            losses: parseInt(player.stats?.losses, 10) || 0
        };

        // Ensure achievements is array
        if (typeof player.achievements === 'string') {
            player.achievements = player.achievements
                .split('\n')
                .map(s => s.trim())
                .filter(s => s.length > 0);
        } else if (!Array.isArray(player.achievements)) {
            player.achievements = [];
        }

        // Ensure gallery is preserved/array
        if (Array.isArray(player.gallery)) {
            player.gallery = player.gallery.filter(g => g && (g.url || g.image));
        } else if (index >= 0 && Array.isArray(list[index].gallery)) {
            player.gallery = list[index].gallery;
        } else {
            player.gallery = [];
        }

        // Enforce POTM single-gender rule if enabled
        if (player.isPlayerOfTheMonth) {
            list.forEach(p => {
                if (p.gender === player.gender && String(p.id) !== String(player.id)) {
                    p.isPlayerOfTheMonth = false;
                }
            });
        }

        if (index >= 0) {
            list[index] = { ...list[index], ...player };
        } else {
            list.push(player);
        }

        inMemoryData.players = list;
        persistCategory('players', list);
        return player;
    }

    function deletePlayer(id) {
        let list = getPlayers();
        list = list.filter(p => String(p.id) !== String(id));
        ensureSinglePotmPerGender(list);
        inMemoryData.players = list;
        persistCategory('players', list);
        return list;
    }

    function addPlayerGalleryPhoto(playerId, photo) {
        const list = getPlayers();
        const p = list.find(x => String(x.id) === String(playerId));
        if (!p) return null;
        if (!Array.isArray(p.gallery)) p.gallery = [];
        const newPhoto = {
            id: photo.id || makeId('gal', photo.caption || 'photo'),
            url: photo.url || photo.image || '',
            caption: photo.caption || ''
        };
        p.gallery.push(newPhoto);
        inMemoryData.players = list;
        persistCategory('players', list);
        return newPhoto;
    }

    function updatePlayerGalleryPhoto(playerId, photoId, photoData) {
        const list = getPlayers();
        const p = list.find(x => String(x.id) === String(playerId));
        if (!p || !Array.isArray(p.gallery)) return null;
        const idx = p.gallery.findIndex(g => String(g.id) === String(photoId));
        if (idx === -1) return null;
        p.gallery[idx] = {
            ...p.gallery[idx],
            url: photoData.url !== undefined ? photoData.url : p.gallery[idx].url,
            caption: photoData.caption !== undefined ? photoData.caption : p.gallery[idx].caption
        };
        inMemoryData.players = list;
        persistCategory('players', list);
        return p.gallery[idx];
    }

    function deletePlayerGalleryPhoto(playerId, photoId) {
        const list = getPlayers();
        const p = list.find(x => String(x.id) === String(playerId));
        if (!p || !Array.isArray(p.gallery)) return false;
        p.gallery = p.gallery.filter(g => String(g.id) !== String(photoId));
        inMemoryData.players = list;
        persistCategory('players', list);
        return true;
    }

    // ========================================================
    // 2. EVENTS / JADWAL CRUD
    // ========================================================
    function getEvents() {
        if (inMemoryData.events === null) {
            const seed = (typeof events !== 'undefined') ? events : [];
            inMemoryData.events = [...seed];
        }
        return inMemoryData.events;
    }

    function getEventById(id) {
        const list = getEvents();
        return list.find(e => String(e.id) === String(id)) || null;
    }

    function saveEvent(event) {
        const list = getEvents();
        const index = list.findIndex(e => String(e.id) === String(event.id));

        if (!event.id) {
            event.id = makeId('event', event.title);
        }

        // Auto map typeName if not provided
        if (!event.typeName) {
            const map = {
                training: 'Latihan Rutin',
                friendly: 'Friendly Match',
                tournament: 'Turnamen',
                activity: 'Gathering'
            };
            event.typeName = map[event.type] || 'Kegiatan';
        }

        // Auto derive dayName dari tanggal jika kosong
        if (!event.dayName && event.date) {
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            try {
                const parts = event.date.split('-');
                if (parts.length === 3) {
                    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                    if (!isNaN(d.getDay())) {
                        event.dayName = days[d.getDay()];
                    }
                }
            } catch (e) { /* ignore */ }
        }
        if (!event.dayName) event.dayName = 'Jadwal';

        if (index >= 0) {
            list[index] = { ...list[index], ...event };
        } else {
            list.push(event);
        }

        inMemoryData.events = list;
        persistCategory('events', list);
        return event;
    }

    function deleteEvent(id) {
        let list = getEvents();
        list = list.filter(e => String(e.id) !== String(id));
        inMemoryData.events = list;
        persistCategory('events', list);
        return list;
    }

    // ========================================================
    // 3. GALLERY / MOMENTS CRUD
    // ========================================================
    function getGallery() {
        if (inMemoryData.gallery === null) {
            const seed = (typeof initialGallery !== 'undefined') ? initialGallery : [];
            inMemoryData.gallery = [...seed];
        }
        return inMemoryData.gallery;
    }

    function getGalleryById(id) {
        const list = getGallery();
        return list.find(g => String(g.id) === String(id)) || null;
    }

    function saveGalleryItem(item) {
        const list = getGallery();
        const index = list.findIndex(g => String(g.id) === String(item.id));

        if (!item.id) {
            item.id = makeId('moment', item.tag);
        }

        if (!item.tilt) {
            const tilts = ['sticker-tilt-left', 'sticker-tilt-right', 'sticker-tilt-wild'];
            item.tilt = tilts[Math.floor(Math.random() * tilts.length)];
        }

        if (index >= 0) {
            list[index] = { ...list[index], ...item };
        } else {
            list.push(item);
        }

        inMemoryData.gallery = list;
        persistCategory('gallery', list);
        return item;
    }

    function deleteGalleryItem(id) {
        let list = getGallery();
        list = list.filter(g => String(g.id) !== String(id));
        inMemoryData.gallery = list;
        persistCategory('gallery', list);
        return list;
    }

    // ========================================================
    // 4. ARTICLES / NEWS CRUD
    // ========================================================
    function getArticles() {
        if (inMemoryData.articles === null) {
            const seed = (typeof articles !== 'undefined') ? articles : [];
            inMemoryData.articles = [...seed];
        }
        return inMemoryData.articles;
    }

    function getArticleById(id) {
        const list = getArticles();
        return list.find(a => String(a.id) === String(id)) || null;
    }

    function saveArticle(article) {
        const list = getArticles();
        const index = list.findIndex(a => String(a.id) === String(article.id));

        if (!article.id) {
            article.id = makeId('article', article.title);
        }

        if (index >= 0) {
            list[index] = { ...list[index], ...article };
        } else {
            list.unshift(article); // New articles at the top
        }

        inMemoryData.articles = list;
        persistCategory('articles', list);
        return article;
    }

    function deleteArticle(id) {
        let list = getArticles();
        list = list.filter(a => String(a.id) !== String(id));
        inMemoryData.articles = list;
        persistCategory('articles', list);
        return list;
    }

    // ========================================================
    // 5. PENGURUS BBC (OFFICIALS) CRUD
    // ========================================================
    function getOfficials() {
        if (inMemoryData.officials === null) {
            const seed = (typeof officials !== 'undefined') ? officials : [];
            inMemoryData.officials = seed.map(o => ({
                id: o.id,
                name: o.name || '',
                role: o.role || '',
                period: o.period || '',
                gender: o.gender || (/siti|nur|fatimah|rahma|putri|dewi|ayu|ani/i.test(o.name || '') ? 'female' : 'male'),
                image: o.image || ''
            }));
        }
        return inMemoryData.officials;
    }

    function getOfficialById(id) {
        const list = getOfficials();
        return list.find(o => String(o.id) === String(id)) || null;
    }

    function saveOfficial(official) {
        const list = getOfficials();

        if (!official.id) {
            official.id = makeId('pengurus', official.name);
        }

        const cleanOfficial = {
            id: official.id,
            name: official.name ? String(official.name).trim() : '',
            role: official.role ? String(official.role).trim() : '',
            period: official.period ? String(official.period).trim() : '',
            gender: official.gender === 'female' ? 'female' : 'male',
            image: official.image ? String(official.image).trim() : ''
        };

        const index = list.findIndex(o => String(o.id) === String(cleanOfficial.id));
        if (index >= 0) {
            list[index] = cleanOfficial;
        } else {
            list.push(cleanOfficial);
        }

        inMemoryData.officials = list;
        persistCategory('officials', list);
        return cleanOfficial;
    }

    function deleteOfficial(id) {
        let list = getOfficials();
        list = list.filter(o => String(o.id) !== String(id));
        inMemoryData.officials = list;
        persistCategory('officials', list);
        return list;
    }

    // ========================================================
    // 6. HERO SETTINGS
    // ========================================================
    function getHeroSettings() {
        if (inMemoryData.hero !== null && typeof inMemoryData.hero === 'object') {
            return { ...DEFAULT_HERO, ...inMemoryData.hero };
        }
        return { ...DEFAULT_HERO };
    }

    async function saveHeroSettings(settings) {
        try {
            const current = getHeroSettings();
            const merged = { ...current, ...settings };
            inMemoryData.hero = merged;
            await persistCategory('hero', merged);
            return merged;
        } catch (e) {
            console.error('[BBC_STORE] Failed to save hero settings:', e);
            return null;
        }
    }

    async function resetHeroSettings() {
        try {
            const resetData = { ...DEFAULT_HERO };
            inMemoryData.hero = resetData;
            await persistCategory('hero', resetData);
            return resetData;
        } catch (e) {
            console.error('[BBC_STORE] Failed to reset hero settings:', e);
            return null;
        }
    }

    // ========================================================
    // 5B. LARGE MEDIA BLOB STORAGE (INDEXEDDB - SUPPORTS >= 10MB)
    // ========================================================
    const DB_NAME = 'bbc_media_db';
    const DB_VERSION = 1;
    const MEDIA_STORE_NAME = 'media_blobs';

    function openMediaDB() {
        return new Promise((resolve, reject) => {
            if (typeof indexedDB === 'undefined') {
                return reject(new Error('IndexedDB is not supported'));
            }
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
                    db.createObjectStore(MEDIA_STORE_NAME);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function setMediaBlob(key, data) {
        try {
            const db = await openMediaDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(MEDIA_STORE_NAME, 'readwrite');
                const store = tx.objectStore(MEDIA_STORE_NAME);
                store.put(data, key);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error);
            });
        } catch (e) {
            console.warn('[BBC_STORE] Failed to store media blob in IndexedDB:', e);
            return false;
        }
    }

    async function getMediaBlob(key) {
        try {
            const db = await openMediaDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(MEDIA_STORE_NAME, 'readonly');
                const store = tx.objectStore(MEDIA_STORE_NAME);
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.warn('[BBC_STORE] Failed to read media blob from IndexedDB:', e);
            return null;
        }
    }

    async function deleteMediaBlob(key) {
        try {
            const db = await openMediaDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(MEDIA_STORE_NAME, 'readwrite');
                const store = tx.objectStore(MEDIA_STORE_NAME);
                store.delete(key);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error);
            });
        } catch (e) {
            return false;
        }
    }

    function resetHeroSettings() {
        inMemoryData.hero = { ...DEFAULT_HERO };
        deleteMediaBlob('hero_main_video');
        persistCategory('hero', { ...DEFAULT_HERO });
        return { ...DEFAULT_HERO };
    }

    // ========================================================
    // REAL-TIME VERCEL BLOB & STATIC JSON SYNC
    // Dipanggil saat halaman load.
    // Memprioritaskan data realtime dari /api/data?category=... (Vercel Blob),
    // dengan fallback ke file JSON statis lokal (/data/*.json).
    // ========================================================
    async function fetchCloudOrJsonData(filename, arrayKey) {
        const category = filename.replace('.json', '');

        // 1. Coba fetch dari Serverless Real-time API (/api/data?category=...)
        try {
            const apiBase = getApiBasePath();
            const res = await fetch(`${apiBase}data?category=${encodeURIComponent(category)}&t=${Date.now()}`, {
                cache: 'no-store'
            });
            if (res.ok) {
                const json = await res.json();
                if (json && json.success && json.data !== undefined) {
                    return {
                        data: json.data,
                        version: json.version || Date.now(),
                        source: json.source || 'vercel-blob'
                    };
                }
            }
        } catch (apiErr) {
            // Lanjutkan ke fallback JSON statis lokal
        }

        // 2. Fallback: fetch dari file JSON statis lokal (/data/*.json)
        try {
            const base = getJsonBasePath();
            const res = await fetch(`${base}${filename}?v=${Date.now()}`, {
                cache: 'no-store'
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            return {
                data: json[arrayKey] !== undefined ? json[arrayKey] : [],
                version: json._version || 0,
                source: 'local-static-json'
            };
        } catch (e) {
            console.warn(`[BBC_STORE] Gagal fetch data ${filename}:`, e.message);
            return null;
        }
    }

    /**
     * initialize() — Harus dipanggil satu kali sebelum render halaman.
     * Sinkronkan data langsung dari file .json / Vercel API ke memori aktif (tanpa localStorage).
     * @returns {Promise<void>}
     */
    async function initialize() {
        purgeLegacyLocalStorage();

        const tasks = [
            { file: 'players.json', key: 'players' },
            { file: 'events.json',  key: 'events' },
            { file: 'gallery.json', key: 'gallery' },
            { file: 'articles.json',key: 'articles' },
            { file: 'officials.json',key: 'officials' },
            { file: 'hero.json',    key: 'hero' }
        ];

        await Promise.all(tasks.map(async (task) => {
            const result = await fetchCloudOrJsonData(task.file, task.key);
            if (!result || result.data === undefined) return;

            if (task.key === 'players') {
                const arr = Array.isArray(result.data) ? result.data : [];
                const normalized = arr.map(p => normalizePlayer(p));
                ensureSinglePotmPerGender(normalized);
                inMemoryData.players = normalized;
            } else if (task.key === 'events') {
                inMemoryData.events = Array.isArray(result.data) ? result.data : [];
            } else if (task.key === 'gallery') {
                inMemoryData.gallery = Array.isArray(result.data) ? result.data : [];
            } else if (task.key === 'articles') {
                inMemoryData.articles = Array.isArray(result.data) ? result.data : [];
            } else if (task.key === 'officials') {
                inMemoryData.officials = Array.isArray(result.data) ? result.data : [];
            } else if (task.key === 'hero') {
                if (result.data && typeof result.data === 'object') {
                    inMemoryData.hero = { ...DEFAULT_HERO, ...result.data };
                }
            }
            const srcLabel = result.source === 'vercel-blob' ? 'Vercel Blob ☁️' : 'Vercel JSON 📁';
            console.info(`[BBC_STORE] Data '${task.key}' berhasil dimuat langsung dari ${srcLabel} (v${result.version}).`);
        }));

        broadcast(null);
    }

    /**
     * forceReloadFromJson() — Paksa reload semua data dari JSON serverless/statis.
     * @returns {Promise<void>}
     */
    async function forceReloadFromJson() {
        await initialize();
        broadcast(null);
    }

    // ========================================================
    // 6. BACKUP, RESTORE & FACTORY RESET
    // ========================================================

    /**
     * exportToJsonFiles() — Export semua data sebagai kumpulan file JSON
     * yang bisa langsung di-commit ke repository untuk deploy ke Vercel.
     * Dipanggil dari CMS → Backup → Export JSON Files.
     */
    function exportToJsonFiles() {
        const timestamp = new Date().toISOString().split('T')[0];
        const files = [
            {
                filename: 'players.json',
                content: JSON.stringify({ _version: Date.now(), _updatedAt: timestamp, players: getPlayers() }, null, 2)
            },
            {
                filename: 'events.json',
                content: JSON.stringify({ _version: Date.now(), _updatedAt: timestamp, events: getEvents() }, null, 2)
            },
            {
                filename: 'gallery.json',
                content: JSON.stringify({ _version: Date.now(), _updatedAt: timestamp, gallery: getGallery() }, null, 2)
            },
            {
                filename: 'articles.json',
                content: JSON.stringify({ _version: Date.now(), _updatedAt: timestamp, articles: getArticles() }, null, 2)
            },
            {
                filename: 'officials.json',
                content: JSON.stringify({ _version: Date.now(), _updatedAt: timestamp, officials: getOfficials() }, null, 2)
            },
            {
                filename: 'hero.json',
                content: JSON.stringify({ _version: Date.now(), _updatedAt: timestamp, hero: getHeroSettings() }, null, 2)
            }
        ];

        files.forEach(f => {
            const blob = new Blob([f.content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = f.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        return files.map(f => f.filename);
    }

    function exportDatabase() {
        const backup = {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            players: getPlayers(),
            events: getEvents(),
            gallery: getGallery(),
            articles: getArticles(),
            officials: getOfficials(),
            hero: getHeroSettings()
        };
        return JSON.stringify(backup, null, 2);
    }

    function importDatabase(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (Array.isArray(data.players)) {
                inMemoryData.players = data.players;
                persistCategory('players', data.players);
            }
            if (Array.isArray(data.events)) {
                inMemoryData.events = data.events;
                persistCategory('events', data.events);
            }
            if (Array.isArray(data.gallery)) {
                inMemoryData.gallery = data.gallery;
                persistCategory('gallery', data.gallery);
            }
            if (Array.isArray(data.articles)) {
                inMemoryData.articles = data.articles;
                persistCategory('articles', data.articles);
            }
            if (Array.isArray(data.officials)) {
                inMemoryData.officials = data.officials;
                persistCategory('officials', data.officials);
            }
            if (data.hero && typeof data.hero === 'object') {
                inMemoryData.hero = data.hero;
                persistCategory('hero', data.hero);
            }
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    function resetToDefaults() {
        purgeLegacyLocalStorage();
        inMemoryData.players = null;
        inMemoryData.events = null;
        inMemoryData.gallery = null;
        inMemoryData.articles = null;
        inMemoryData.officials = null;
        inMemoryData.hero = null;

        const p = getPlayers();
        const ev = getEvents();
        const g = getGallery();
        const a = getArticles();
        const o = getOfficials();
        const h = getHeroSettings();

        persistCategory('players', p);
        persistCategory('events', ev);
        persistCategory('gallery', g);
        persistCategory('articles', a);
        persistCategory('officials', o);
        persistCategory('hero', h);

        broadcast(null);
        return true;
    }

    return {
        slugify,
        getPlayerPhoto,
        getDummyPhoto,
        getPlayers,
        getPlayerById,
        getPlayersOfTheMonth,
        setPlayerOfTheMonth,
        savePlayer,
        deletePlayer,
        addPlayerGalleryPhoto,
        updatePlayerGalleryPhoto,
        deletePlayerGalleryPhoto,

        getEvents,
        getEventById,
        saveEvent,
        deleteEvent,

        getGallery,
        getGalleryById,
        saveGalleryItem,
        deleteGalleryItem,

        getArticles,
        getArticleById,
        saveArticle,
        deleteArticle,

        getOfficials,
        getOfficialById,
        saveOfficial,
        deleteOfficial,

        getHeroSettings,
        saveHeroSettings,
        resetHeroSettings,
        setMediaBlob,
        getMediaBlob,
        deleteMediaBlob,

        // Vercel Real-time Cloud Helpers & Direct JSON Persist
        persistCategory,
        syncToVercel,
        uploadToBlob,
        checkBlobStatus,

        // Static JSON sync
        initialize,
        forceReloadFromJson,
        exportToJsonFiles,

        exportDatabase,
        importDatabase,
        resetToDefaults
    };
})();
