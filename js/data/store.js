/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Unified Data Store Layer (LocalStorage with Fallback Seed)
 * Central management for Players, Events, Gallery Moments, and Articles.
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

    // Helper to safely read from localStorage
    function readStorage(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (raw !== null) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
                if (parsed !== null && typeof parsed === 'object') return parsed;
            }
        } catch (e) {
            console.warn(`[BBC_STORE] Failed to read ${key} from storage:`, e);
        }
        return fallback;
    }

    // Helper to write to localStorage
    function writeStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            broadcast(key);
            return true;
        } catch (e) {
            console.error(`[BBC_STORE] Failed to save ${key} to storage:`, e);
            return false;
        }
    }

    // Siarkan perubahan agar tampilan website ikut ter-update tanpa refresh
    function broadcast(key) {
        if (typeof BBC_LIVE !== 'undefined' && BBC_LIVE.notify) {
            BBC_LIVE.notify(key);
        }
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
        const seed = (typeof players !== 'undefined') ? players : [];
        let data = readStorage(STORAGE_KEYS.PLAYERS, null);
        if (data === null || !Array.isArray(data)) {
            data = seed.map(p => normalizePlayer({ ...p }));
            ensureSinglePotmPerGender(data);
            writeStorage(STORAGE_KEYS.PLAYERS, data);
        } else {
            data = data.map(p => normalizePlayer(p));
            ensureSinglePotmPerGender(data);
        }
        return data;
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

        writeStorage(STORAGE_KEYS.PLAYERS, list);
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

        writeStorage(STORAGE_KEYS.PLAYERS, list);
        return player;
    }

    function deletePlayer(id) {
        let list = getPlayers();
        list = list.filter(p => String(p.id) !== String(id));
        ensureSinglePotmPerGender(list);
        writeStorage(STORAGE_KEYS.PLAYERS, list);
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
        writeStorage(STORAGE_KEYS.PLAYERS, list);
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
        writeStorage(STORAGE_KEYS.PLAYERS, list);
        return p.gallery[idx];
    }

    function deletePlayerGalleryPhoto(playerId, photoId) {
        const list = getPlayers();
        const p = list.find(x => String(x.id) === String(playerId));
        if (!p || !Array.isArray(p.gallery)) return false;
        p.gallery = p.gallery.filter(g => String(g.id) !== String(photoId));
        writeStorage(STORAGE_KEYS.PLAYERS, list);
        return true;
    }

    // ========================================================
    // 2. EVENTS / JADWAL CRUD
    // ========================================================
    function getEvents() {
        const seed = (typeof events !== 'undefined') ? events : [];
        let data = readStorage(STORAGE_KEYS.EVENTS, null);
        if (data === null || !Array.isArray(data)) {
            data = seed;
            writeStorage(STORAGE_KEYS.EVENTS, data);
        }
        return data;
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

        if (index >= 0) {
            list[index] = { ...list[index], ...event };
        } else {
            list.push(event);
        }

        writeStorage(STORAGE_KEYS.EVENTS, list);
        return event;
    }

    function deleteEvent(id) {
        let list = getEvents();
        list = list.filter(e => String(e.id) !== String(id));
        writeStorage(STORAGE_KEYS.EVENTS, list);
        return list;
    }

    // ========================================================
    // 3. GALLERY / MOMENTS CRUD
    // ========================================================
    function getGallery() {
        const seed = (typeof initialGallery !== 'undefined') ? initialGallery : [];
        let data = readStorage(STORAGE_KEYS.GALLERY, null);
        if (data === null || !Array.isArray(data)) {
            data = seed;
            writeStorage(STORAGE_KEYS.GALLERY, data);
        }
        return data;
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

        writeStorage(STORAGE_KEYS.GALLERY, list);
        return item;
    }

    function deleteGalleryItem(id) {
        let list = getGallery();
        list = list.filter(g => String(g.id) !== String(id));
        writeStorage(STORAGE_KEYS.GALLERY, list);
        return list;
    }

    // ========================================================
    // 4. ARTICLES / NEWS CRUD
    // ========================================================
    function getArticles() {
        const seed = (typeof articles !== 'undefined') ? articles : [];
        let data = readStorage(STORAGE_KEYS.ARTICLES, null);
        if (data === null || !Array.isArray(data)) {
            data = seed;
            writeStorage(STORAGE_KEYS.ARTICLES, data);
        }
        return data;
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

        writeStorage(STORAGE_KEYS.ARTICLES, list);
        return article;
    }

    function deleteArticle(id) {
        let list = getArticles();
        list = list.filter(a => String(a.id) !== String(id));
        writeStorage(STORAGE_KEYS.ARTICLES, list);
        return list;
    }

    // ========================================================
    // 5. PENGURUS BBC (OFFICIALS) CRUD
    // ========================================================
    function getOfficials() {
        const seed = (typeof officials !== 'undefined') ? officials : [];
        let data = readStorage(STORAGE_KEYS.OFFICIALS, null);
        if (data === null || !Array.isArray(data)) {
            data = seed.map(o => ({
                id: o.id,
                name: o.name || '',
                role: o.role || '',
                period: o.period || '',
                gender: o.gender || (/siti|nur|fatimah|rahma|putri|dewi|ayu|ani/i.test(o.name || '') ? 'female' : 'male'),
                image: o.image || ''
            }));
            writeStorage(STORAGE_KEYS.OFFICIALS, data);
        } else {
            // Clean up any stale number, nickname, division from earlier stored data
            data = data.map(o => ({
                id: o.id,
                name: o.name || '',
                role: o.role || '',
                period: o.period || '',
                gender: o.gender || (/siti|nur|fatimah|rahma|putri|dewi|ayu|ani/i.test(o.name || '') ? 'female' : 'male'),
                image: o.image || ''
            }));
        }
        return data;
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

        writeStorage(STORAGE_KEYS.OFFICIALS, list);
        return cleanOfficial;
    }

    function deleteOfficial(id) {
        let list = getOfficials();
        list = list.filter(o => String(o.id) !== String(id));
        writeStorage(STORAGE_KEYS.OFFICIALS, list);
        return list;
    }

    // ========================================================
    // 6. HERO SETTINGS
    // ========================================================
    function getHeroSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.HERO);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') return { ...DEFAULT_HERO, ...parsed };
            }
        } catch (e) {
            console.warn('[BBC_STORE] Failed to read hero settings:', e);
        }
        return { ...DEFAULT_HERO };
    }

    function saveHeroSettings(settings) {
        try {
            const current = getHeroSettings();
            const merged = { ...current, ...settings };
            localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(merged));
            broadcast(STORAGE_KEYS.HERO);
            return merged;
        } catch (e) {
            console.error('[BBC_STORE] Failed to save hero settings:', e);
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
        localStorage.removeItem(STORAGE_KEYS.HERO);
        deleteMediaBlob('hero_main_video');
        broadcast(STORAGE_KEYS.HERO);
        return { ...DEFAULT_HERO };
    }

    // ========================================================
    // 6. BACKUP, RESTORE & FACTORY RESET
    // ========================================================
    function exportDatabase() {
        const backup = {
            version: '1.0',
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
            if (Array.isArray(data.players)) writeStorage(STORAGE_KEYS.PLAYERS, data.players);
            if (Array.isArray(data.events)) writeStorage(STORAGE_KEYS.EVENTS, data.events);
            if (Array.isArray(data.gallery)) writeStorage(STORAGE_KEYS.GALLERY, data.gallery);
            if (Array.isArray(data.articles)) writeStorage(STORAGE_KEYS.ARTICLES, data.articles);
            if (Array.isArray(data.officials)) writeStorage(STORAGE_KEYS.OFFICIALS, data.officials);
            if (data.hero && typeof data.hero === 'object') saveHeroSettings(data.hero);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    function resetToDefaults() {
        localStorage.removeItem(STORAGE_KEYS.PLAYERS);
        localStorage.removeItem(STORAGE_KEYS.EVENTS);
        localStorage.removeItem(STORAGE_KEYS.GALLERY);
        localStorage.removeItem(STORAGE_KEYS.ARTICLES);
        localStorage.removeItem(STORAGE_KEYS.OFFICIALS);
        localStorage.removeItem(STORAGE_KEYS.HERO);
        // Re-read to seed
        getPlayers();
        getEvents();
        getGallery();
        getArticles();
        getOfficials();
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

        exportDatabase,
        importDatabase,
        resetToDefaults
    };
})();
