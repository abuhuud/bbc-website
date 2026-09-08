/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Live Sync Layer — menyiarkan perubahan data CMS ke semua tab/halaman
 * yang sedang terbuka, sehingga tampilan website ikut berubah tanpa refresh.
 */
const BBC_LIVE = (function () {
    const CHANNEL_NAME = 'bbc_cms_sync';
    const WATCHED_KEYS = [
        'bbc_data_players_v5',
        'bbc_data_events_v4',
        'bbc_data_gallery_v1',
        'bbc_data_articles_v1',
        'bbc_data_officials_v1',
        'bbc_data_hero_v1'
    ];

    const subscribers = [];
    let channel = null;

    try {
        if (typeof BroadcastChannel !== 'undefined') {
            channel = new BroadcastChannel(CHANNEL_NAME);
        }
    } catch (e) {
        channel = null;
    }

    let pending = null;
    function fire(key) {
        // Gabungkan beberapa penyimpanan berturut-turut menjadi satu render
        if (pending) clearTimeout(pending);
        pending = setTimeout(() => {
            pending = null;
            subscribers.forEach(cb => {
                try {
                    cb(key || null);
                } catch (e) {
                    console.error('[BBC_LIVE] subscriber error:', e);
                }
            });
        }, 60);
    }

    // Dipanggil oleh BBC_STORE setiap kali data tersimpan
    function notify(key) {
        if (channel) {
            try {
                channel.postMessage({ key: key || null, at: Date.now() });
            } catch (e) { /* diabaikan */ }
        }
        fire(key);
    }

    function onChange(cb) {
        if (typeof cb === 'function') subscribers.push(cb);
    }

    if (channel) {
        channel.onmessage = (ev) => fire(ev && ev.data ? ev.data.key : null);
    }

    // Fallback lintas-tab untuk browser tanpa BroadcastChannel
    window.addEventListener('storage', (ev) => {
        if (!ev.key || WATCHED_KEYS.indexOf(ev.key) === -1) return;
        fire(ev.key);
    });

    return { notify, onChange, WATCHED_KEYS };
})();

/**
 * Helper halaman: jalankan render saat DOM siap DAN setiap kali data CMS berubah.
 */
function BBC_onReady(render) {
    if (typeof render !== 'function') return;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => render());
    } else {
        render();
    }
    if (typeof BBC_LIVE !== 'undefined') {
        BBC_LIVE.onChange(() => render());
    }
}
