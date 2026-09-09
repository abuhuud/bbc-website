/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Hero Media Renderer — menerapkan foto/video hero yang disimpan dari CMS.
 * Idempoten: markup asli disimpan lalu dipulihkan sebelum setiap penerapan,
 * sehingga aman dipanggil ulang saat data CMS berubah (realtime).
 */
(function () {
    let originalWrapHTML = null;

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

        if (mainImg) {
            const hasVideo = !!(h.mainVideo && h.mainVideo.trim());
            const hasImage = !!(h.mainImage && h.mainImage.trim());
            const preferVideo = (h.mediaType === 'video' && hasVideo) || (!hasImage && hasVideo);

            if (preferVideo) {
                const isIdb = h.mainVideo.startsWith('indexeddb:');
                const ytid = (!isIdb && (h.mainVideo.includes('youtube.com') || h.mainVideo.includes('youtu.be')))
                    ? youtubeId(h.mainVideo)
                    : '';
                if (ytid) {
                    const iframe = document.createElement('iframe');
                    iframe.id = 'hero-main-img';
                    iframe.src = 'https://www.youtube.com/embed/' + ytid +
                        '?autoplay=1&mute=1&loop=1&playlist=' + ytid + '&controls=0&showinfo=0&playsinline=1&enablejsapi=1';
                    iframe.style.cssText = 'width:100%;height:100%;border:none;object-fit:cover;pointer-events:none;';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                    mainImg.parentNode.replaceChild(iframe, mainImg);
                } else {
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

                    if (isIdb) {
                        const key = h.mainVideo.replace('indexeddb:', '') || 'hero_main_video';
                        if (typeof BBC_STORE !== 'undefined' && BBC_STORE.getMediaBlob) {
                            BBC_STORE.getMediaBlob(key).then(blob => {
                                if (blob) {
                                    video.src = (typeof blob === 'string') ? blob : URL.createObjectURL(blob);
                                    video.play().catch(() => {});
                                }
                            });
                        }
                    } else {
                        video.src = h.mainVideo;
                    }

                    mainImg.parentNode.replaceChild(video, mainImg);
                    video.play().catch(() => {});
                }
            } else if (hasImage) {
                mainImg.src = h.mainImage;
                if (h.mainImageAlt) mainImg.alt = h.mainImageAlt;
            } else {
                mainImg.src = 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=900';
            }
        }

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
            if (src) el.src = src;
            if (alt) el.alt = alt;
        };

        setLabel('hero-main-label', h.mainLabel);

        // Handle thumbnail visibility if deleted/cleared
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
    if (typeof BBC_onReady === 'function') BBC_onReady(applyHero);
})();
