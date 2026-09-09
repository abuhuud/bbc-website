/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Player Card Component — Elegant Edition
 * Fields: Nama · Kategori · Prestasi[]
 */
function createPlayerCard(player, options) {
    const opts = options || {};
    const genderLabel = player.gender === 'male' ? 'AMILIN' : 'AMILAT';

    // Resolve detail URL relative to current directory
    const inPages = window.location.pathname.includes('/pages/');
    const detailBase = inPages ? '' : 'pages/';

    // Calculate player slug from player.name
    const playerSlug = (typeof BBC_STORE !== 'undefined' && BBC_STORE.slugify)
        ? BBC_STORE.slugify(player.name)
        : (player.slug || (typeof BBC_slugify === 'function' ? BBC_slugify(player.name) : (player.name || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')));
    const detailUrl = `${detailBase}player-detail.html?slug=${encodeURIComponent(playerSlug)}`;

    const isPotm = !!player.isPlayerOfTheMonth;
    const base = inPages ? '../' : '';
    const dummyPhoto = player.gender === 'female'
        ? `${base}assets/images/players/dummy-female.jpg`
        : `${base}assets/images/players/dummy-male.jpg`;
    const photoSrc = (player.image && String(player.image).trim() !== '') ? player.image : dummyPhoto;

    // NAME ONLY MODE: Used in homepage OUR SQUAD // COLLECTIBLES
    // Displays strictly the player photo, player name, and button lihat profil
    if (opts.nameOnly) {
        return `
        <article class="player-card player-card--name-only ${isPotm ? 'player-card--potm' : ''}"
           data-gender="${player.gender}"
           onclick="if(!event.target.closest('a')) window.location.href='${detailUrl}'">

            <!-- Elegant shimmer layer -->
            <div class="player-card__shimmer" aria-hidden="true"></div>

            <!-- Photo -->
            <div class="player-card__media">
                <img src="${photoSrc}"
                     alt="Foto Pemain BBC ${player.name}"
                     class="player-card__image"
                     loading="lazy"
                     onerror="this.onerror=null; this.src='${dummyPhoto}'">
                ${isPotm ? `
                <span class="pixel-sticker pixel-sticker--yellow sticker-tilt-wild" style="position: absolute; bottom: 8px; right: 8px; font-size: 0.65rem; padding: 3px 8px; z-index: 4; box-shadow: 2px 2px 0 var(--color-dark); border: 2px solid var(--color-dark); font-weight: 700;">
                    👑 PLAYER OF THE MONTH
                </span>` : ''}
            </div>

            <!-- Info Body: strictly only the name and button lihat profil -->
            <div class="player-card__body player-card__body--name-only">
                <h3 class="player-card__name">${player.name}</h3>

                <div class="player-card__footer">
                    <a href="${detailUrl}"
                       class="btn btn-sm ${player.gender === 'female' ? 'btn-coral' : 'btn-primary'}"
                       style="width: 100%; justify-content: center; box-shadow: 2px 2px 0 var(--color-dark);"
                       aria-label="Lihat profil ${player.name}">
                        <span>LIHAT PROFIL</span>
                        <span class="btn-arrow">→</span>
                    </a>
                </div>
            </div>
        </article>
        `;
    }

    // Render achievements list (supports multiple entries)
    const achievements = Array.isArray(player.achievements)
        ? player.achievements
        : (player.achievement ? [player.achievement] : []);

    const achievementsHtml = achievements.length > 0
        ? achievements.map(a => `
            <li class="player-card__achievement-item">
                <span class="player-card__achievement-icon">🏅</span>
                <span>${a}</span>
            </li>`).join('')
        : '';

    const stats = player.stats || { attendance: 0, matches: 0, wins: 0, losses: 0 };
    const winRate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0;

    return `
    <article class="player-card ${isPotm ? 'player-card--potm' : ''}" data-gender="${player.gender}">

        <!-- Elegant shimmer layer (CSS pseudo animates on hover) -->
        <div class="player-card__shimmer" aria-hidden="true"></div>

        <!-- Header Strip -->
        <div class="player-card__header">
            <div>
                ${isPotm ? '<span class="pixel-badge pixel-badge--yellow" style="font-size: 0.6rem; padding: 2px 6px;">👑 POTM</span>' : ''}
            </div>
            <span class="player-card__role">${genderLabel}</span>
        </div>

        <!-- Photo -->
        <div class="player-card__media">
            <img src="${photoSrc}"
                 alt="Foto Pemain BBC ${player.name}"
                 class="player-card__image"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${dummyPhoto}'">
            ${isPotm ? `
            <span class="pixel-sticker pixel-sticker--yellow sticker-tilt-wild" style="position: absolute; bottom: 8px; right: 8px; font-size: 0.65rem; padding: 2px 8px; z-index: 2; box-shadow: 2px 2px 0 var(--color-dark);">
                ★ PLAYER OF THE MONTH
            </span>` : ''}
        </div>

        <!-- Info Body -->
        <div class="player-card__body">

            <div class="player-card__identity">
                <h3 class="player-card__name">${player.name}</h3>
            </div>

            <!-- 4 Core Performance Stats -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; background: var(--color-off-white); border: 1.5px solid var(--color-dark); border-radius: var(--radius-xs); padding: 6px 4px; text-align: center; margin-top: 8px; box-shadow: 2px 2px 0 var(--color-dark);">
                <div>
                    <div style="font-family: var(--font-pixel); font-size: 0.85rem; color: var(--color-primary-dark); font-weight: 700;">${stats.attendance}</div>
                    <div style="font-size: 0.52rem; font-weight: 800; color: var(--color-grey); text-transform: uppercase;">Hadir</div>
                </div>
                <div>
                    <div style="font-family: var(--font-pixel); font-size: 0.85rem; color: #1E40AF; font-weight: 700;">${stats.matches}</div>
                    <div style="font-size: 0.52rem; font-weight: 800; color: var(--color-grey); text-transform: uppercase;">Main</div>
                </div>
                <div>
                    <div style="font-family: var(--font-pixel); font-size: 0.85rem; color: var(--color-primary); font-weight: 700;">${stats.wins}</div>
                    <div style="font-size: 0.52rem; font-weight: 800; color: var(--color-grey); text-transform: uppercase;">Menang</div>
                </div>
                <div>
                    <div style="font-family: var(--font-pixel); font-size: 0.85rem; color: #DC2626; font-weight: 700;">${stats.losses}</div>
                    <div style="font-size: 0.52rem; font-weight: 800; color: var(--color-grey); text-transform: uppercase;">Kalah</div>
                </div>
            </div>

            <!-- Prestasi Section with Header & Generous Spacing -->
            ${opts.hideAchievements ? '' : `
            <div class="player-card__achievements-section" style="margin-top: 14px; margin-bottom: 14px; flex: 1;">
                <div class="player-card__achievements-header" style="font-family: var(--font-pixel); font-size: 0.65rem; color: var(--color-grey); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                    <span>🏅</span>
                    <span>PRESTASI</span>
                </div>
                ${achievementsHtml ? `
                <ul class="player-card__achievements" aria-label="Prestasi ${player.name}">
                    ${achievementsHtml}
                </ul>` : `
                <div style="font-size: 0.78rem; color: var(--color-grey); font-style: italic; padding: 4px 0;">Pemain aktif BBC 2026</div>
                `}
            </div>`}

            <div class="player-card__footer">
                <a href="${detailUrl}"
                   class="player-card__cta"
                   aria-label="Lihat profil ${player.name}">
                    <span>LIHAT PROFIL</span>
                    <span class="player-card__cta-arrow">→</span>
                </a>
            </div>
        </div>
    </article>
    `;
}