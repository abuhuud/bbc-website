/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Player Detail Page Logic — Hero Athlete Dossier
 */
BBC_onReady(() => {
    const container = document.getElementById('player-detail-container');
    if (!container) return;

    const allPlayers = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getPlayers()
        : ((typeof players !== 'undefined') ? players : []);

    if (!allPlayers || allPlayers.length === 0) return;

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

    const urlParams = new URLSearchParams(window.location.search);
    const slugParam = (urlParams.get('slug') || urlParams.get('name') || '').toLowerCase().trim();
    const idParam = (urlParams.get('id') || '').toLowerCase().trim();

    let currentIndex = -1;
    if (slugParam) {
        currentIndex = allPlayers.findIndex(p => {
            const pSlug = (p.slug || slugify(p.name)).toLowerCase();
            const pNameSlug = slugify(p.name).toLowerCase();
            const pId = String(p.id).toLowerCase();
            return pSlug === slugParam || pNameSlug === slugParam || pId === slugParam;
        });
    }

    if (currentIndex === -1 && idParam) {
        currentIndex = allPlayers.findIndex(p => {
            const pId = String(p.id).toLowerCase();
            const pSlug = (p.slug || slugify(p.name)).toLowerCase();
            return pId === idParam || pSlug === idParam || slugify(p.name).toLowerCase() === idParam;
        });
    }

    // Default fallback to first player only when no query params were provided
    if (currentIndex === -1 && !slugParam && !idParam) {
        currentIndex = 0;
    }

    const player = currentIndex >= 0 ? allPlayers[currentIndex] : null;

    if (!player) {
        container.innerHTML = `
            <div class="pd-empty-state">
                <span class="pixel-badge pixel-badge--yellow" style="margin-bottom: 12px;">STATUS: ERROR 404</span>
                <h3>PEMAIN TIDAK DITEMUKAN</h3>
                <p>Data profil pemain tidak tercatat dalam roster resmi BBC.</p>
                <a href="players.php" class="btn btn-primary" style="margin-top: 18px;">
                    <span>← KEMBALI KE DAFTAR PEMAIN</span>
                </a>
            </div>
        `;
        return;
    }

    // Synchronize browser address bar: keep URL slug matching the current player's latest name
    const activeSlug = player.slug || slugify(player.name);
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        const currentUrlSlug = urlParams.get('slug');
        if (currentUrlSlug !== activeSlug) {
            const newParams = new URLSearchParams(window.location.search);
            newParams.delete('id');
            newParams.delete('name');
            newParams.set('slug', activeSlug);
            const newUrl = `${window.location.pathname}?${newParams.toString()}`;
            window.history.replaceState({ slug: activeSlug }, '', newUrl);
        }
    }

    // Previous & Next navigation
    const validIndex = currentIndex >= 0 ? currentIndex : 0;
    const prevIndex = (validIndex - 1 + allPlayers.length) % allPlayers.length;
    const nextIndex = (validIndex + 1) % allPlayers.length;
    const prevPlayer = allPlayers[prevIndex];
    const nextPlayer = allPlayers[nextIndex];
    const prevSlug = prevPlayer.slug || slugify(prevPlayer.name);
    const nextSlug = nextPlayer.slug || slugify(nextPlayer.name);

    // Data formatting
    const isMale = player.gender === 'male';
    const genderLabel = isMale ? 'AMILIN' : 'AMILAT';
    const genderAccent = isMale ? 'var(--color-primary)' : 'var(--color-coral)';
    const badgeGenderClass = isMale ? 'pixel-badge--green' : 'pixel-badge--coral';
    const isPotm = !!player.isPlayerOfTheMonth;

    // Stats calculation
    const stats = player.stats || { attendance: 0, matches: 0, wins: 0, losses: 0 };
    const matches = Number(stats.matches) || 0;
    const wins = Number(stats.wins) || 0;
    const losses = Number(stats.losses) || 0;
    const attendance = Number(stats.attendance) || 0;
    const winRate = matches > 0 ? Math.round((wins / matches) * 100) : 0;
    const lossRate = matches > 0 ? (100 - winRate) : 0;

    // Achievements list
    const achievements = Array.isArray(player.achievements)
        ? player.achievements
        : (player.achievement ? [player.achievement] : []);

    const achievementsHtml = achievements.length > 0
        ? achievements.map(item => `
            <li class="pd-achievement-item">
                <span class="pd-achievement-icon">🏅</span>
                <span class="pd-achievement-text">${item}</span>
            </li>
        `).join('')
        : `
            <li class="pd-achievement-item pd-achievement-item--empty">
                <span class="pd-achievement-icon">🏸</span>
                <span class="pd-achievement-text">Pemain aktif skuad resmi BBC musim 2026.</span>
            </li>
        `;

    // Gallery list
    const gallery = Array.isArray(player.gallery) ? player.gallery : [];

    // Media Fallback: Anime dummy photo when photo is empty or broken
    const dummyPhoto = isMale
        ? '../assets/images/players/dummy-male.jpg'
        : '../assets/images/players/dummy-female.jpg';
    const playerPhoto = (player.image && String(player.image).trim() !== '')
        ? player.image
        : dummyPhoto;

    // Page title update
    document.title = `${player.name} | BAZNAS Badminton Club`;

    // RENDER MAIN COMPONENT
    container.innerHTML = `
    <div class="pd-wrapper">

        <!-- ===== TOP NAVIGATION BAR ===== -->
        <div class="pd-top-nav">
            <a href="players.php" class="btn btn-outline btn-sm">
                <span style="font-family: var(--font-pixel);">←</span>
                <span>KEMBALI KE DAFTAR PEMAIN</span>
            </a>
            <div class="pd-top-nav__counter">
                <span class="pixel-badge pixel-badge--dark">PEMAIN ${validIndex + 1} DARI ${allPlayers.length}</span>
            </div>
        </div>

        <!-- ===== MAIN ATHLETE DOSSIER CARD ===== -->
        <div class="pd-card ${isPotm ? 'pd-card--potm' : ''}">

            <!-- Card Header Strip -->
            <div class="pd-header" style="background: ${isMale ? 'linear-gradient(90deg, #025335 0%, #009B63 100%)' : 'linear-gradient(90deg, #B91C1C 0%, #EF4444 100%)'};">
                <div class="pd-header__left">
                    <span class="pixel-badge pixel-badge--yellow">🏸 PROFIL ATLET BBC</span>
                    <span class="pd-header__tag">ROSTER 2026</span>
                </div>
                <div class="pd-header__right">
                    ${isPotm ? '<span class="pixel-badge pixel-badge--yellow">👑 PLAYER OF THE MONTH</span>' : ''}
                    <span class="pixel-badge pixel-badge--dark">${genderLabel}</span>
                </div>
            </div>

            <!-- Card Body: 2-Column Precision Layout -->
            <div class="pd-body">

                <!-- === LEFT COLUMN: Athlete Photo Frame with Court Pattern & Watermark === -->
                <div class="pd-col-left" data-gender="${player.gender}">

                    <!-- Badminton Court Line Watermark Behind Photo -->
                    <div class="pd-court-watermark" aria-hidden="true">
                        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="15" y="15" width="170" height="210" stroke="currentColor" stroke-width="2.5" stroke-dasharray="6 4"/>
                            <line x1="15" y1="65" x2="185" y2="65" stroke="currentColor" stroke-width="2"/>
                            <line x1="15" y1="175" x2="185" y2="175" stroke="currentColor" stroke-width="2"/>
                            <line x1="100" y1="65" x2="100" y2="225" stroke="currentColor" stroke-width="2"/>
                            <line x1="32" y1="15" x2="32" y2="225" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6"/>
                            <line x1="168" y1="15" x2="168" y2="225" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6"/>
                            <circle cx="100" cy="120" r="18" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>
                        </svg>
                    </div>

                    <div class="pd-photo-frame" style="border-color: ${genderAccent};">
                        <div class="pd-photo-wrap">
                            <!-- Sports Pattern Texture Behind Photo -->
                            <div class="pd-photo-bg-pattern"></div>

                            <img src="${playerPhoto}"
                                 alt="Foto Atlet BBC ${player.name}"
                                 class="pd-photo"
                                 onerror="this.onerror=null; this.src='${dummyPhoto}';">

                            <!-- Cinematic Vignette Lighting Overlay -->
                            <div class="pd-photo-overlay" aria-hidden="true"></div>

                            <!-- POTM Ribbon (Bottom) -->
                            ${isPotm ? `
                            <div class="pd-potm-ribbon">
                                <span>👑 PLAYER OF THE MONTH</span>
                            </div>` : ''}
                        </div>
                    </div>

                    <!-- Performance Stats Panel Directly Under Photo -->
                    <div class="pd-stats-panel">
                        <div class="pd-stats-panel__top">
                            <span class="pd-stats-panel__title">● STATISTIK PERFORMA</span>
                            <span class="pd-stats-panel__wr">WIN RATE: ${winRate}%</span>
                        </div>

                        <!-- 4 Stat Boxes (2x2 Grid) -->
                        <div class="pd-stats-grid">
                            <div class="pd-stat-box">
                                <div class="pd-stat-box__val" style="color: var(--color-yellow);">${attendance}</div>
                                <div class="pd-stat-box__lbl">KEHADIRAN</div>
                                <div class="pd-stat-box__sub">Sesi Latihan</div>
                            </div>
                            <div class="pd-stat-box">
                                <div class="pd-stat-box__val" style="color: #60A5FA;">${matches}</div>
                                <div class="pd-stat-box__lbl">TOTAL LAGA</div>
                                <div class="pd-stat-box__sub">Pertandingan</div>
                            </div>
                            <div class="pd-stat-box">
                                <div class="pd-stat-box__val" style="color: #34D399;">${wins}</div>
                                <div class="pd-stat-box__lbl">MENANG (W)</div>
                                <div class="pd-stat-box__sub">${winRate}% Rasio</div>
                            </div>
                            <div class="pd-stat-box">
                                <div class="pd-stat-box__val" style="color: #F87171;">${losses}</div>
                                <div class="pd-stat-box__lbl">KALAH (L)</div>
                                <div class="pd-stat-box__sub">${lossRate}% Rasio</div>
                            </div>
                        </div>

                        <!-- Win-Rate Progress Meter -->
                        <div class="pd-wr-meter">
                            <div class="pd-wr-meter__labels">
                                <span>HASIL LAGA</span>
                                <span style="color: ${genderAccent}; font-weight: 700;">${wins}W · ${losses}L (${matches} Total)</span>
                            </div>
                            <div class="pd-wr-meter__track">
                                <div class="pd-wr-meter__fill-win" id="pd-win-bar" style="width: 0%; background: ${genderAccent};"></div>
                                <div class="pd-wr-meter__fill-loss" id="pd-loss-bar" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div><!-- /.pd-stats-panel -->

                </div><!-- /.pd-col-left -->

                <!-- === RIGHT COLUMN: Profile Details & Achievements === -->
                <div class="pd-col-right">

                    <!-- POTM Special Spotlight Banner (If Applicable) -->
                    ${isPotm ? `
                    <div class="pd-spotlight-banner">
                        <span class="pd-spotlight-banner__icon">👑</span>
                        <div class="pd-spotlight-banner__content">
                            <div class="pd-spotlight-banner__headline">OFFICIAL PLAYER OF THE MONTH</div>
                            <div class="pd-spotlight-banner__desc">
                                Atlet teladan BBC edisi bulan ini dengan performa & kedisiplinan tertinggi.
                            </div>
                        </div>
                        <span class="pixel-badge pixel-badge--dark" style="flex-shrink: 0; font-size: 0.62rem;">MVP</span>
                    </div>` : ''}

                    <!-- Identity Block -->
                    <div class="pd-identity">
                        <div class="pd-identity__chips">
                            <span class="pixel-badge ${badgeGenderClass}">🏸 ${genderLabel}</span>
                        </div>
                        <h1 class="pd-name">${player.name}</h1>
                    </div>

                    <!-- Achievements Block -->
                    <div class="pd-achievements-block">
                        <div class="pd-achievements-header">
                            <span>🏆 PRESTASI &amp; PENCAPAIAN</span>
                            <span class="pixel-badge pixel-badge--yellow" style="font-size: 0.6rem;">${achievements.length} REKOR</span>
                        </div>
                        <ul class="pd-achievements-list">
                            ${achievementsHtml}
                        </ul>
                    </div>

                    <!-- Player Photo Gallery Block (Directly Under Achievements) -->
                    <div class="pd-gallery-block">
                        <div class="pd-gallery-header">
                            <div class="pd-gallery-header__left">
                                <span class="pd-gallery-header__icon">📸</span>
                                <span class="pd-gallery-header__title">DOKUMENTASI &amp; GALERI AKSI</span>
                            </div>
                            <span class="pixel-badge ${isMale ? 'pixel-badge--green' : 'pixel-badge--coral'}" style="font-size: 0.6rem;">
                                ${gallery.length} FOTO
                            </span>
                        </div>

                        ${gallery.length > 0 ? `
                        <div class="pd-gallery-grid">
                            ${gallery.map((item, idx) => `
                            <div class="pd-gallery-card" data-gallery-index="${idx}" tabindex="0" role="button" title="Lihat foto aksi">
                                <div class="pd-gallery-img-wrap">
                                    <img src="${item.url || item.image}"
                                         alt="Foto Aksi ${player.name}"
                                         loading="lazy"
                                         class="pd-gallery-img"
                                         onerror="this.src='${fallbackSvg}'">
                                    <div class="pd-gallery-overlay">
                                        <span class="pd-gallery-zoom-badge">👁️ LIHAT</span>
                                    </div>
                                </div>
                            </div>
                            `).join('')}
                        </div>
                        ` : `
                        <div class="pd-gallery-empty">
                            <span style="font-size: 1.3rem;">📸</span>
                            <div class="pd-gallery-empty__text">Belum ada foto aksi untuk pemain ini.</div>
                        </div>
                        `}
                    </div><!-- /.pd-gallery-block -->

                    <!-- Bottom Navigation Inside Card -->
                    <div class="pd-card-footer">
                        <a href="player-detail.php?slug=${encodeURIComponent(prevSlug)}" class="btn btn-outline btn-sm">
                            <span style="font-family: var(--font-pixel);">←</span>
                            <span>${prevPlayer.name.split(' ')[0]}</span>
                        </a>
                        <a href="players.php" class="btn btn-outline btn-sm">
                            <span>SEMUA PEMAIN</span>
                        </a>
                        <a href="player-detail.php?slug=${encodeURIComponent(nextSlug)}" class="btn btn-primary btn-sm">
                            <span>${nextPlayer.name.split(' ')[0]}</span>
                            <span style="font-family: var(--font-pixel);">→</span>
                        </a>
                    </div>

                </div><!-- /.pd-col-right -->

            </div><!-- /.pd-body -->

        </div><!-- /.pd-card -->

    </div><!-- /.pd-wrapper -->
    `;

    // Smooth progress bar animation
    requestAnimationFrame(() => {
        setTimeout(() => {
            const winBar = document.getElementById('pd-win-bar');
            const lossBar = document.getElementById('pd-loss-bar');
            if (winBar) {
                winBar.style.width = matches > 0 ? `${winRate}%` : '0%';
            }
            if (lossBar) {
                lossBar.style.width = matches > 0 ? `${lossRate}%` : '0%';
            }
        }, 120);
    });

    // ===== LIGHTBOX INTERACTIVITY =====
    const lightboxEl = document.getElementById('pd-lightbox');
    if (lightboxEl && gallery.length > 0) {
        const lightboxImg = document.getElementById('pd-lightbox-img');
        const lightboxCaption = document.getElementById('pd-lightbox-caption');
        const lightboxCounter = document.getElementById('pd-lightbox-counter');
        const btnPrev = document.getElementById('pd-lightbox-prev');
        const btnNext = document.getElementById('pd-lightbox-next');
        let activeGalleryIndex = 0;

        function showLightboxPhoto(idx) {
            if (idx < 0) idx = gallery.length - 1;
            if (idx >= gallery.length) idx = 0;
            activeGalleryIndex = idx;

            const photo = gallery[idx];
            if (lightboxImg) lightboxImg.src = photo.url || photo.image || '';
            if (lightboxCaption) lightboxCaption.textContent = '';
            if (lightboxCounter) lightboxCounter.textContent = `${idx + 1} / ${gallery.length}`;
            lightboxEl.classList.add('active');
            lightboxEl.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightboxEl.classList.remove('active');
            lightboxEl.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        // Attach click handlers to cards
        document.querySelectorAll('.pd-gallery-card').forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.getAttribute('data-gallery-index'), 10) || 0;
                showLightboxPhoto(idx);
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const idx = parseInt(card.getAttribute('data-gallery-index'), 10) || 0;
                    showLightboxPhoto(idx);
                }
            });
        });

        // Close triggers
        lightboxEl.querySelectorAll('[data-close-lightbox]').forEach(el => {
            el.addEventListener('click', closeLightbox);
        });

        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                showLightboxPhoto(activeGalleryIndex - 1);
            });
        }
        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                showLightboxPhoto(activeGalleryIndex + 1);
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightboxEl.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showLightboxPhoto(activeGalleryIndex - 1);
            if (e.key === 'ArrowRight') showLightboxPhoto(activeGalleryIndex + 1);
        });
    }
});
