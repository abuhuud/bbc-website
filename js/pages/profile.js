/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Profile Page — Pengurus BBC Periode Saat Ini
 * Dirender dari BBC_STORE, ikut ter-update saat data CMS berubah.
 */
BBC_onReady(() => {
    const grid = document.getElementById('officials-grid');
    if (!grid) return;

    const list = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getOfficials()
        : ((typeof officials !== 'undefined') ? officials : []);

    if (!list || list.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; border: 3px dashed var(--color-grey); border-radius: var(--radius-md); padding: 44px 28px; text-align: center;">
                <div style="font-size: 2.4rem; margin-bottom: 10px;">🏸</div>
                <h3 style="margin: 0 0 6px;">BELUM ADA DATA PENGURUS</h3>
                <p style="color: var(--color-grey); margin: 0;">Data pengurus dapat ditambahkan melalui panel CMS BBC.</p>
            </div>`;
        return;
    }

    grid.innerHTML = list.map(o => {
        const isFemale = (o.gender === 'female') || (o.gender !== 'male' && /siti|nur|fatimah|rahma|putri|dewi|ayu|ani/i.test(o.name || ''));
        const dummyPhoto = isFemale ? '../assets/images/players/dummy-female.jpg' : '../assets/images/players/dummy-male.jpg';
        const photoUrl = (o.image && String(o.image).trim() !== '') ? o.image : dummyPhoto;

        return `
        <div class="player-card">
            <div class="player-card__shimmer" aria-hidden="true"></div>
            <div class="player-card__header" style="justify-content: center;">
                <span class="player-card__role" style="font-size: 0.68rem; letter-spacing: 0.08em;">PENGURUS BBC</span>
            </div>
            <div class="player-card__media">
                <img src="${photoUrl}" alt="${o.name}" class="player-card__image" loading="lazy" onerror="this.onerror=null; this.src='${dummyPhoto}';">
            </div>
            <div class="player-card__body" style="text-align: center; padding: 18px 14px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <h3 class="player-card__name" style="margin: 0 0 8px 0; font-size: 1.25rem;">${o.name}</h3>
                <div style="margin-top: 2px;">
                    <span class="pixel-badge pixel-badge--green" style="font-size: 0.72rem; padding: 4px 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em;">
                        ${o.role || 'PENGURUS'}
                    </span>
                </div>
            </div>
        </div>`;
    }).join('');

    const periodEl = document.getElementById('officials-period');
    if (periodEl) {
        const periods = [...new Set(list.map(o => o.period).filter(Boolean))];
        if (periods.length > 0) periodEl.textContent = periods.join(' · ');
    }
});
