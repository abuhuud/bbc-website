/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Hero Media Renderer — menerapkan foto/video hero yang disimpan dari CMS.
 * Idempoten, responsif & bebas race-condition:
 * - Menangani mode Foto (URL/Base64/default)
 * - Menangani mode Video (YouTube embed, direct MP4 URL, Data URL video, dan IndexedDB lokal)
 * - Fallback cerdas: jika video tidak ada / gagal diputar, otomatis kembali ke foto banner
 */
(function () {
    const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=900';

    function getSettings() {
        if (typeof BBC_STORE !== 'undefined' && typeof BBC_STORE.getHeroSettings === 'function') {
            return BBC_STORE.getHeroSettings();
        }
        try {
            const raw = localStorage.getItem('bbc_data_hero_v1');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function youtubeId(url) {
        if (!url) return '';
        const m = String(url).match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
        return m ? m[1] : '';
    }

    let renderTimer = null;

    function applyHeroImmediate() {
        const h = getSettings();
        if (!h) return;

        const currentMedia = document.getElementById('hero-main-img');
        if (!currentMedia) return;

        const wrap = currentMedia.parentNode;
        if (!wrap) return;

        const hasVideo = !!(h.mainVideo && h.mainVideo.trim());
        const hasImage = !!(h.mainImage && h.mainImage.trim());
        const isVideoType = (h.mediaType === 'video');
        const fallbackSrc = hasImage ? h.mainImage.trim() : DEFAULT_IMAGE;

        // Helper: Tampilkan gambar
        function showImage(src, alt) {
            const el = document.getElementById('hero-main-img');
            const targetSrc = (src && src.trim()) ? src.trim() : DEFAULT_IMAGE;

            if (el && el.tagName.toLowerCase() === 'img') {
                el.src = targetSrc;
                el.alt = alt || 'Insan BAZNAS Badminton Club berlatih di lapangan';
                el.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
                el.onerror = function () {
                    this.onerror = null;
                    this.src = DEFAULT_IMAGE;
                };
            } else if (el && el.parentNode) {
                const img = document.createElement('img');
                img.id = 'hero-main-img';
                img.src = targetSrc;
                img.alt = alt || 'Insan BAZNAS Badminton Club berlatih di lapangan';
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
                img.onerror = function () {
                    this.onerror = null;
                    this.src = DEFAULT_IMAGE;
                };
                el.parentNode.replaceChild(img, el);
            }
        }

        // Helper: Tampilkan YouTube iframe
        function showYouTube(ytid) {
            const el = document.getElementById('hero-main-img');
            if (!el || !el.parentNode) return;

            const embedUrl = `https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${ytid}&controls=1&rel=0`;

            if (el.tagName.toLowerCase() === 'iframe' && el.src.includes(ytid)) {
                return; // Iframe sudah terpasang
            }

            const iframe = document.createElement('iframe');
            iframe.id = 'hero-main-img';
            iframe.src = embedUrl;
            iframe.style.cssText = 'width: 100%; height: 100%; border: none; object-fit: cover;';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;

            el.parentNode.replaceChild(iframe, el);
        }

        // Helper: Tampilkan video HTML5 (URL langsung / Data URL / Blob)
        function showVideo(videoSrc) {
            const el = document.getElementById('hero-main-img');
            if (!el || !el.parentNode) return;

            if (el.tagName.toLowerCase() === 'video' && el.src === videoSrc) {
                el.play().catch(() => {});
                return;
            }

            const video = document.createElement('video');
            video.id = 'hero-main-img';
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.controls = false;
            video.setAttribute('muted', '');
            video.setAttribute('autoplay', '');
            video.setAttribute('loop', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            video.defaultMuted = true;
            video.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
            video.src = videoSrc;

            video.onerror = () => {
                console.warn('[BBC_HERO] Video gagal dimuat, beralih ke foto banner.');
                showImage(fallbackSrc, h.mainImageAlt);
            };

            el.parentNode.replaceChild(video, el);
            video.play().catch(() => {});
        }

        // 1. Render Media Utama
        if (isVideoType && hasVideo) {
            const rawVideo = h.mainVideo.trim();
            const isIdb = rawVideo.startsWith('indexeddb:');
            const ytid = !isIdb ? youtubeId(rawVideo) : '';

            if (ytid) {
                // YouTube Embed
                showYouTube(ytid);
            } else if (isIdb) {
                // Video Lokal dari IndexedDB
                const key = rawVideo.replace('indexeddb:', '') || 'hero_main_video';
                if (typeof BBC_STORE !== 'undefined' && typeof BBC_STORE.getMediaBlob === 'function') {
                    BBC_STORE.getMediaBlob(key).then(blob => {
                        if (blob) {
                            const blobUrl = (typeof blob === 'string') ? blob : URL.createObjectURL(blob);
                            showVideo(blobUrl);
                        } else {
                            // Blob tidak ada di browser ini (misal di Vercel / perangkat lain) -> fallback ke foto
                            showImage(fallbackSrc, h.mainImageAlt);
                        }
                    }).catch(err => {
                        console.warn('[BBC_HERO] Gagal membaca blob video IDB:', err);
                        showImage(fallbackSrc, h.mainImageAlt);
                    });
                } else {
                    showImage(fallbackSrc, h.mainImageAlt);
                }
            } else {
                // Video URL Langsung (MP4 / WebM / Data URL)
                showVideo(rawVideo);
            }
        } else {
            // Mode Foto
            showImage(fallbackSrc, h.mainImageAlt);
        }

        // 2. Terapkan Label Banner Utama
        const mainLabelEl = document.getElementById('hero-main-label');
        if (mainLabelEl) {
            if (h.mainLabel && h.mainLabel.trim()) {
                mainLabelEl.textContent = h.mainLabel.trim();
                mainLabelEl.style.display = '';
            } else {
                mainLabelEl.textContent = '';
                mainLabelEl.style.display = 'none';
            }
        }

        // 3. Terapkan Thumbnail Mini Samping
        const thumbsRow = document.getElementById('hero-thumbs-row');
        const thumb1Wrap = document.getElementById('hero-thumb1-wrap');
        const thumb2Wrap = document.getElementById('hero-thumb2-wrap');
        const hasThumb1 = !!(h.thumb1Image && h.thumb1Image.trim());
        const hasThumb2 = !!(h.thumb2Image && h.thumb2Image.trim());

        if (thumbsRow) {
            if (!hasThumb1 && !hasThumb2) {
                thumbsRow.style.display = 'none';
            } else {
                thumbsRow.style.display = 'grid';
                if (hasThumb1 && hasThumb2) {
                    thumbsRow.style.gridTemplateColumns = '1fr 1fr';
                    if (thumb1Wrap) thumb1Wrap.style.display = 'block';
                    if (thumb2Wrap) thumb2Wrap.style.display = 'block';
                } else if (hasThumb1) {
                    thumbsRow.style.gridTemplateColumns = '1fr';
                    if (thumb1Wrap) thumb1Wrap.style.display = 'block';
                    if (thumb2Wrap) thumb2Wrap.style.display = 'none';
                } else if (hasThumb2) {
                    thumbsRow.style.gridTemplateColumns = '1fr';
                    if (thumb1Wrap) thumb1Wrap.style.display = 'none';
                    if (thumb2Wrap) thumb2Wrap.style.display = 'block';
                }
            }
        }

        const setThumb = (imgId, lblId, src, alt, lbl) => {
            const imgEl = document.getElementById(imgId);
            const lblEl = document.getElementById(lblId);
            if (imgEl && src && src.trim()) {
                imgEl.src = src.trim();
                if (alt) imgEl.alt = alt;
            }
            if (lblEl) {
                if (lbl && lbl.trim()) {
                    lblEl.textContent = lbl.trim();
                    lblEl.style.display = '';
                } else {
                    lblEl.style.display = 'none';
                }
            }
        };

        if (hasThumb1) {
            setThumb('hero-thumb1-img', 'hero-thumb1-label', h.thumb1Image, h.thumb1Alt, h.thumb1Label);
        }
        if (hasThumb2) {
            setThumb('hero-thumb2-img', 'hero-thumb2-label', h.thumb2Image, h.thumb2Alt, h.thumb2Label);
        }
    }

    // Debounced applyHero untuk mencegah collision antar script
    function applyHero() {
        if (renderTimer) clearTimeout(renderTimer);
        renderTimer = setTimeout(applyHeroImmediate, 20);
    }

    window.BBC_applyHero = applyHero;

    if (typeof BBC_onReady === 'function') {
        BBC_onReady(applyHero);
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyHero);
        } else {
            applyHero();
        }
    }

    // Reaktivitas real-time saat hero data diubah di CMS
    if (typeof BBC_LIVE !== 'undefined' && typeof BBC_LIVE.onChange === 'function') {
        BBC_LIVE.onChange((key) => {
            if (!key || key === 'bbc_data_hero_v1') {
                applyHero();
            }
        });
    }
})();
