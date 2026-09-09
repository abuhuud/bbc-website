/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Hero Media Renderer — menerapkan foto/video hero yang disimpan dari CMS.
 * Idempoten & Defensif: markup asli disimpan lalu dipulihkan sebelum setiap penerapan.
 * Jika video lokal IndexedDB tidak tersedia di browser pengunjung / Vercel,
 * sistem secara otomatis dan mulus fallback ke foto banner utama.
 */
(function () {
    let originalWrapHTML = null;

    const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=900';

    function getSettings() {
        if (typeof BBC_STORE !== 'undefined' && BBC_STORE.getHeroSettings) {
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
        const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
        return m ? m[1] : '';
    }

    function applyHero() {
        const h = getSettings();
        if (!h) return;

        const current = document.getElementById('hero-main-img');
        const wrap = current ? current.parentNode : null;
        if (!wrap) return;

        if (originalWrapHTML === null) originalWrapHTML = wrap.innerHTML;
        else wrap.innerHTML = originalWrapHTML;

        const mainImg = document.getElementById('hero-main-img');
        if (!mainImg) return;

        const hasVideo = !!(h.mainVideo && h.mainVideo.trim());
        const hasImage = !!(h.mainImage && h.mainImage.trim());
        const isVideoType = (h.mediaType === 'video');

        // Fungsi pembantu render gambar banner utama
        const renderImage = () => {
            const targetSrc = hasImage ? h.mainImage.trim() : DEFAULT_IMAGE;
            mainImg.src = targetSrc;
            if (h.mainImageAlt) mainImg.alt = h.mainImageAlt;
            mainImg.onerror = function () {
                this.onerror = null;
                this.src = DEFAULT_IMAGE;
            };
        };

        // Jika mode video dipilih dan ada URL video
        if (isVideoType && hasVideo) {
            const rawVideo = h.mainVideo.trim();
            const isIdb = rawVideo.startsWith('indexeddb:');
            const ytid = (!isIdb && (rawVideo.includes('youtube.com') || rawVideo.includes('youtu.be')))
                ? youtubeId(rawVideo)
                : '';

            if (ytid) {
                // 1. YouTube Embed
                const iframe = document.createElement('iframe');
                iframe.id = 'hero-main-img';
                iframe.src = 'https://www.youtube.com/embed/' + ytid +
                    '?autoplay=1&mute=1&loop=1&playlist=' + ytid + '&controls=0&showinfo=0&playsinline=1&enablejsapi=1';
                iframe.style.cssText = 'width:100%;height:100%;border:none;object-fit:cover;pointer-events:none;';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                mainImg.parentNode.replaceChild(iframe, mainImg);
            } else if (isIdb) {
                // 2. Video Lokal dari IndexedDB (hanya ada di browser admin pembuat)
                // Cek ketersediaan blob TERLEBIH DAHULU sebelum mengganti elemen gambar
                const key = rawVideo.replace('indexeddb:', '') || 'hero_main_video';
                if (typeof BBC_STORE !== 'undefined' && BBC_STORE.getMediaBlob) {
                    BBC_STORE.getMediaBlob(key).then(blob => {
                        if (blob) {
                            const video = document.createElement('video');
                            video.id = 'hero-main-img';
                            video.autoplay = true;
                            video.muted = true;
                            video.loop = true;
                            video.playsInline = true;
                            video.setAttribute('muted', '');
                            video.setAttribute('autoplay', '');
                            video.setAttribute('loop', '');
                            video.setAttribute('playsinline', '');
                            video.setAttribute('webkit-playsinline', '');
                            video.defaultMuted = true;
                            video.style.cssText = 'width:100%;height:100%;object-fit:cover;';
                            video.src = (typeof blob === 'string') ? blob : URL.createObjectURL(blob);

                            video.onerror = () => {
                                console.warn('[BBC_HERO] Video IDB gagal diputar, fallback ke foto banner.');
                                renderImage();
                            };

                            const target = document.getElementById('hero-main-img');
                            if (target && target.parentNode) {
                                target.parentNode.replaceChild(video, target);
                                video.play().catch(() => {});
                            }
                        } else {
                            // Blob tidak ada (misal di Vercel atau pengunjung lain) -> fallback ke foto banner
                            console.info('[BBC_HERO] Video IDB tidak ditemukan di browser ini, menampilkan foto banner.');
                            renderImage();
                        }
                    }).catch(err => {
                        console.warn('[BBC_HERO] Gagal membaca blob IDB:', err);
                        renderImage();
                    });
                } else {
                    renderImage();
                }
            } else {
                // 3. Video URL Langsung (MP4 / WebM dari link URL atau assets)
                const video = document.createElement('video');
                video.id = 'hero-main-img';
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.setAttribute('muted', '');
                video.setAttribute('autoplay', '');
                video.setAttribute('loop', '');
                video.setAttribute('playsinline', '');
                video.setAttribute('webkit-playsinline', '');
                video.defaultMuted = true;
                video.style.cssText = 'width:100%;height:100%;object-fit:cover;';
                video.src = rawVideo;

                video.onerror = () => {
                    console.warn('[BBC_HERO] Video URL gagal diputar, fallback ke foto banner.');
                    if (video.parentNode) {
                        const fallbackImg = document.createElement('img');
                        fallbackImg.id = 'hero-main-img';
                        fallbackImg.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
                        fallbackImg.src = hasImage ? h.mainImage.trim() : DEFAULT_IMAGE;
                        if (h.mainImageAlt) fallbackImg.alt = h.mainImageAlt;
                        video.parentNode.replaceChild(fallbackImg, video);
                    }
                };

                mainImg.parentNode.replaceChild(video, mainImg);
                video.play().catch(() => {});
            }
        } else {
            // Mode Foto / Gambar Utama
            renderImage();
        }

        // Terapkan label banner utama
        const setLabel = (id, text) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (text && text.trim()) {
                el.textContent = text.trim();
                el.style.display = '';
            } else {
                el.textContent = '';
                el.style.display = 'none';
            }
        };

        const setImg = (id, src, alt) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (src && src.trim()) {
                el.src = src.trim();
                if (alt) el.alt = alt;
            }
        };

        setLabel('hero-main-label', h.mainLabel);

        // Thumbnail mini samping
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

        if (hasThumb1) {
            setImg('hero-thumb1-img', h.thumb1Image, h.thumb1Alt);
            setLabel('hero-thumb1-label', h.thumb1Label);
        }
        if (hasThumb2) {
            setImg('hero-thumb2-img', h.thumb2Image, h.thumb2Alt);
            setLabel('hero-thumb2-label', h.thumb2Label);
        }
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
