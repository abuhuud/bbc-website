/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Homepage Interactive Logic
 * Squad rendered as 2 separate horizontal rows: Amilin & Amilat
 * Reads from unified BBC_STORE (LocalStorage / Data Seed)
 */
BBC_onReady(() => {

    // Retrieve data from BBC_STORE with fallback to global arrays
    const playerList = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getPlayers()
        : ((typeof players !== 'undefined') ? players : []);

    const eventList = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getEvents()
        : ((typeof events !== 'undefined') ? events : []);

    const articleList = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getArticles()
        : ((typeof articles !== 'undefined') ? articles : []);

    const galleryList = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getGallery()
        : ((typeof initialGallery !== 'undefined') ? initialGallery : []);

    // 0. Render Player Of The Month (1 Amilin & 1 Amilat)
    try {
        const potmSection = document.getElementById('section-potm');
        const potmContainer = document.getElementById('potm-container');
        if (potmSection) {
            if (!playerList || playerList.length === 0) {
                potmSection.style.display = 'none';
            } else {
                potmSection.style.display = '';
                if (potmContainer) {
                    const amilinPotm = playerList.find(p => p.gender === 'male' && p.isPlayerOfTheMonth) ||
                        playerList.find(p => p.gender === 'male');
                    const amilatPotm = playerList.find(p => p.gender === 'female' && p.isPlayerOfTheMonth) ||
                        playerList.find(p => p.gender === 'female');

                    let html = '';
                    if (amilinPotm) html += createPotmCard(amilinPotm, true);
                    if (amilatPotm) html += createPotmCard(amilatPotm, false);
                    potmContainer.innerHTML = html;
                }
            }
        }
    } catch (errPotm) {
        console.error('[BBC Home] Error rendering POTM section:', errPotm);
    }

    // 1. Render Squad — 2 horizontal rows (Amilin / Amilat)
    try {
        const amilinTrack = document.getElementById('amilin-track');
        const amilatTrack = document.getElementById('amilat-track');
        const countMaleEl = document.getElementById('squad-count-male');
        const countFemEl = document.getElementById('squad-count-female');

        if (playerList && playerList.length > 0) {
            const amilin = playerList.filter(p => p.gender === 'male');
            const amilat = playerList.filter(p => p.gender === 'female');

            if (amilinTrack) {
                amilinTrack.innerHTML = amilin.map(p => createPlayerCard(p, { nameOnly: true })).join('');
            }
            if (amilatTrack) {
                amilatTrack.innerHTML = amilat.map(p => createPlayerCard(p, { nameOnly: true })).join('');
            }
            if (countMaleEl) {
                countMaleEl.textContent = `${amilin.length} pemain`;
            }
            if (countFemEl) {
                countFemEl.textContent = `${amilat.length} pemain`;
            }
        }
    } catch (errSquad) {
        console.error('[BBC Home] Error rendering Squad section:', errSquad);
    }

    // 2. Filter events within 7 days from today (sorted by date ascending)
    try {
        const agendaSection = document.getElementById('section-agenda');
        if (agendaSection) {
            if (!eventList || eventList.length === 0) {
                agendaSection.style.display = 'none';
            } else {
                agendaSection.style.display = '';

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const weekEnd = new Date(today);
                weekEnd.setDate(weekEnd.getDate() + 7);
                weekEnd.setHours(23, 59, 59, 999);

                function parseEventDate(dateStr) {
                    if (!dateStr) return null;
                    const parts = dateStr.split('-');
                    if (parts.length !== 3) return null;
                    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                }

                const sortedEventList = [...eventList].sort((a, b) => {
                    const da = parseEventDate(a.date);
                    const db = parseEventDate(b.date);
                    const aCompleted = a.status === 'completed' ? 1 : 0;
                    const bCompleted = b.status === 'completed' ? 1 : 0;
                    if (aCompleted !== bCompleted) return aCompleted - bCompleted;
                    if (da && db) return da - db;
                    return 0;
                });

                const weekEvents = sortedEventList.filter(ev => {
                    if (ev.status === 'completed') return false;
                    const d = parseEventDate(ev.date);
                    if (!d) return false;
                    return d >= today && d <= weekEnd;
                });

                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                const fmt = (d) => `${d.getDate()} ${months[d.getMonth()]}`;
                const periodLabel = `${fmt(today)} – ${fmt(weekEnd)}`;

                const agendaPeriodBadge = document.getElementById('agenda-period-badge');
                if (agendaPeriodBadge) {
                    agendaPeriodBadge.textContent = `📅 ${periodLabel}`;
                }
                const agendaPeriodSub = document.getElementById('agenda-period-sub');
                if (agendaPeriodSub) {
                    agendaPeriodSub.textContent = `PERIODE 7 HARI KE DEPAN: ${periodLabel}`;
                }

                // 3. Render Next Play Ticket
                const nextEventContainer = document.getElementById('next-play-card');
                if (nextEventContainer) {
                    if (weekEvents.length > 0) {
                        nextEventContainer.innerHTML = createNextPlayTicket(weekEvents[0]);
                    } else {
                        nextEventContainer.innerHTML = `
                        <div style="
                            border: 3px dashed var(--color-grey, #8A9E95);
                            border-radius: var(--radius-md, 12px);
                            padding: 48px 32px;
                            text-align: center;
                            background: repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 10px,
                                rgba(0,0,0,0.02) 10px,
                                rgba(0,0,0,0.02) 20px
                            );
                        ">
                            <div style="font-size: 3.5rem; margin-bottom: 12px; line-height: 1;">🏸</div>
                            <h3 style="margin: 0 0 8px; font-size: clamp(1.3rem, 2.5vw, 1.8rem); color: var(--color-dark);">TIDAK ADA AGENDA MINGGU INI</h3>
                            <p style="color: var(--color-grey, #6B7F78); font-size: 0.95rem; margin: 0 0 24px; max-width: 420px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                                Belum ada jadwal pertandingan atau latihan dalam 7 hari ke depan.
                                Pantau jadwal lengkap BBC untuk rencana latihan selanjutnya.
                            </p>
                            <a href="pages/schedule.html" class="btn btn-primary" style="box-shadow: 4px 4px 0 var(--color-dark);">
                                <span>LIHAT SEMUA JADWAL</span>
                                <span style="font-family: var(--font-pixel);">→</span>
                            </a>
                        </div>`;
                    }
                }

                // 4. Render agenda lain dalam 7 hari
                const upcomingWeekList = document.getElementById('upcoming-week-list');
                if (upcomingWeekList) {
                    const otherWeekEvents = weekEvents.slice(1);
                    if (otherWeekEvents.length > 0) {
                        upcomingWeekList.style.display = '';
                        upcomingWeekList.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                                <span class="pixel-label">JUGA MINGGU INI</span>
                                <span class="pixel-badge pixel-badge--neon" style="font-size: 0.65rem;">${otherWeekEvents.length} AGENDA LAGI</span>
                            </div>
                            <div class="grid grid-2" style="gap: 16px;">
                                ${otherWeekEvents.map(e => createScheduleListItem(e)).join('')}
                            </div>
                        `;
                    } else {
                        upcomingWeekList.style.display = 'none';
                    }
                }
            }
        }

        const upcomingSection = document.getElementById('upcoming-schedule-section');
        if (upcomingSection) upcomingSection.style.display = 'none';
    } catch (errAgenda) {
        console.error('[BBC Home] Error rendering Agenda section:', errAgenda);
    }

    // 4. Render BBC Moments (Photo Gallery)
    try {
        const gallerySection = document.getElementById('section-gallery');
        const galleryContainer = document.getElementById('gallery-grid');
        if (gallerySection) {
            if (!galleryList || galleryList.length === 0) {
                gallerySection.style.display = 'none';
            } else {
                gallerySection.style.display = '';
                if (galleryContainer) {
                    galleryContainer.innerHTML = galleryList.slice(0, 4).map(item => {
                        const badgeClass = `pixel-sticker--${item.badgeColor || 'coral'}`;
                        const tiltClass = item.tilt || 'sticker-tilt-wild';
                        return `
                            <div class="moment-item anim-hover-pop">
                                <img src="${item.image}" alt="${item.alt || item.tag}" class="moment-item__img" loading="lazy">
                                <span class="pixel-sticker ${badgeClass} ${tiltClass} moment-item__tag">${item.tag}</span>
                            </div>
                        `;
                    }).join('');
                }
            }
        }
    } catch (errGal) {
        console.error('[BBC Home] Error rendering Gallery section:', errGal);
    }

    // 5. Render Latest Stories / News Grid
    try {
        const newsSection = document.getElementById('section-news');
        const newsContainer = document.getElementById('latest-news-grid');
        if (newsSection) {
            if (!articleList || articleList.length === 0) {
                newsSection.style.display = 'none';
            } else {
                newsSection.style.display = '';
                if (newsContainer) {
                    newsContainer.innerHTML = articleList.slice(0, 3).map(a => createNewsCard(a)).join('');
                }
            }
        }
    } catch (errNews) {
        console.error('[BBC Home] Error rendering News section:', errNews);
    }

    // 6. Terapkan media hero dari CMS
    try {
        if (typeof BBC_applyHero === 'function') BBC_applyHero();
    } catch (errHero) {
        console.error('[BBC Home] Error applying Hero:', errHero);
    }

    // 7. Connect all Dynamic Instagram Links to Central Config
    try {
        if (typeof SITE_CONFIG !== 'undefined') {
            const igElements = document.querySelectorAll('[data-bind-instagram]');
            igElements.forEach(el => {
                if (el.tagName.toLowerCase() === 'a') {
                    el.href = SITE_CONFIG.instagramUrl;
                }
                if (el.hasAttribute('data-bind-username')) {
                    el.textContent = SITE_CONFIG.instagramUsername;
                }
            });
        }
    } catch (errIg) {
        console.error('[BBC Home] Error binding Instagram:', errIg);
    }
});

/**
 * Render Player Of The Month Card Component
 */
function createPotmCard(player, isAmilin) {
    if (!player) return '';
    const cardClass = isAmilin ? 'potm-card--amilin' : 'potm-card--amilat';
    const bannerBadge = isAmilin
        ? '<span class="pixel-badge pixel-badge--neon">🏆 AMILIN OF THE MONTH</span>'
        : '<span class="pixel-badge pixel-badge--yellow">👑 AMILAT OF THE MONTH</span>';
    const subBadge = isAmilin
        ? '<span style="font-family: var(--font-pixel); font-size: 0.65rem; color: var(--color-yellow);">MVP PUTRA</span>'
        : '<span style="font-family: var(--font-pixel); font-size: 0.65rem; color: #FFF;">MVP PUTRI</span>';

    const photoBadge = isAmilin
        ? '<span class="potm-card__photo-badge">★ MVP AMILIN</span>'
        : '<span class="potm-card__photo-badge">★ MVP AMILAT</span>';

    const stats = player.stats || { attendance: 0, matches: 0, wins: 0, losses: 0 };
    const attendance = stats.attendance || 0;
    const matches = stats.matches || 0;
    const wins = stats.wins || 0;
    const losses = stats.losses || 0;
    const winRate = matches > 0 ? Math.round((wins / matches) * 100) : 0;

    const topAchievement = Array.isArray(player.achievements) && player.achievements.length > 0
        ? player.achievements[0]
        : (player.achievement || 'Pemain Aktif Berdedikasi BBC 2026');

    const fillClass = isAmilin ? 'potm-winrate-bar__fill--green' : 'potm-winrate-bar__fill--coral';
    const winColorClass = isAmilin ? 'potm-stat-tile__value--green' : 'potm-stat-tile__value--coral';
    const photoSrc = (typeof BBC_STORE !== 'undefined' && BBC_STORE.getPlayerPhoto)
        ? BBC_STORE.getPlayerPhoto(player)
        : (player.image || (player.gender === 'female' ? 'assets/images/players/dummy-female.jpg' : 'assets/images/players/dummy-male.jpg'));
    const dummyFallback = (typeof BBC_STORE !== 'undefined' && BBC_STORE.getDummyPhoto)
        ? BBC_STORE.getDummyPhoto(player.gender)
        : (player.gender === 'female' ? 'assets/images/players/dummy-female.jpg' : 'assets/images/players/dummy-male.jpg');

    return `
    <article class="potm-card ${cardClass}">
        <!-- Top Status Banner -->
        <div class="potm-card__banner">
            <div style="display: flex; align-items: center; gap: 8px;">
                ${bannerBadge}
                <span class="pixel-sticker pixel-sticker--dark" style="font-size: 0.6rem; padding: 2px 6px;">HONOR ROLL</span>
            </div>
            <div>${subBadge}</div>
        </div>

        <div class="potm-card__content">
            <!-- Profile Info & Big Highlighted Photo Showcase -->
            <div class="potm-card__profile">
                <div class="potm-card__avatar-wrap">
                    <img src="${photoSrc}" alt="Player of the Month ${player.name}" class="potm-card__avatar" loading="lazy" onerror="this.onerror=null; this.src='${dummyFallback}';">
                    ${photoBadge}
                </div>
                <div class="potm-card__info">
                    <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                        <span class="pixel-badge ${isAmilin ? 'pixel-badge--green' : 'pixel-badge--coral'}" style="font-size: 0.65rem; padding: 3px 8px;">${isAmilin ? 'AMILIN BBC' : 'AMILAT BBC'}</span>
                        <span class="pixel-sticker pixel-sticker--yellow" style="font-size: 0.62rem; padding: 2px 6px;">★ TOP PERFORMER</span>
                    </div>
                    <h3 class="potm-card__name">${player.name}</h3>

                    <!-- Highlight Achievement integrated into info column -->
                    <div class="potm-card__achievement-box">
                        <div class="potm-card__achievement-label">
                            <span>🏅</span>
                            <span>PRESTASI TERBAIK</span>
                        </div>
                        <div class="potm-card__achievement-content">
                            <span style="font-size: 1.15rem; flex-shrink: 0;">🏆</span>
                            <span class="potm-card__achievement-text">
                                ${topAchievement}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- LED Scoreboard Style 4-Stat Box -->
            <div class="potm-stats-board">
                <div class="potm-stats-board__header">
                    <span>● MONTHLY STATS MATRIX</span>
                    <span style="color: #8EA39A;">PERIODE BULAN INI</span>
                </div>

                <div class="potm-stats-grid">
                    <div class="potm-stat-tile">
                        <div class="potm-stat-tile__value potm-stat-tile__value--yellow">${attendance}</div>
                        <div class="potm-stat-tile__label">KEHADIRAN</div>
                    </div>
                    <div class="potm-stat-tile">
                        <div class="potm-stat-tile__value potm-stat-tile__value--blue">${matches}</div>
                        <div class="potm-stat-tile__label">MAIN</div>
                    </div>
                    <div class="potm-stat-tile">
                        <div class="potm-stat-tile__value ${winColorClass}">${wins}</div>
                        <div class="potm-stat-tile__label">MENANG</div>
                    </div>
                    <div class="potm-stat-tile">
                        <div class="potm-stat-tile__value" style="color: #94A3B8;">${losses}</div>
                        <div class="potm-stat-tile__label">KALAH</div>
                    </div>
                </div>

                <!-- Win Rate Meter -->
                <div class="potm-winrate-bar">
                    <div class="potm-winrate-bar__meta">
                        <span style="font-family: var(--font-pixel); font-size: 0.65rem; color: #94A3B8;">WIN RATE EFISIENSI</span>
                        <span style="font-family: var(--font-pixel); font-size: 0.72rem; color: var(--color-yellow);">${winRate}%</span>
                    </div>
                    <div class="potm-winrate-bar__track">
                        <div class="potm-winrate-bar__fill ${fillClass}" style="width: ${winRate}%;"></div>
                    </div>
                </div>
            </div>

            <!-- Footer Action -->
            <div class="potm-card__footer">
                <div style="font-size: 0.75rem; color: var(--color-grey); font-weight: 700;">
                    ✦ TERPILIH BULAN INI
                </div>
                <a href="pages/player-detail.html?slug=${encodeURIComponent(player.slug || (typeof BBC_STORE !== 'undefined' && BBC_STORE.slugify ? BBC_STORE.slugify(player.name) : (typeof BBC_slugify === 'function' ? BBC_slugify(player.name) : player.id)))}" class="btn btn-sm ${isAmilin ? 'btn-primary' : 'btn-coral'}" style="box-shadow: 3px 3px 0 var(--color-dark);">
                    <span>LIHAT PROFIL</span>
                    <span class="btn-arrow">→</span>
                </a>
            </div>
        </div>
    </article>
    `;
}