/**
 * Helper untuk mendapatkan nama hari bahasa Indonesia dari string tanggal YYYY-MM-DD
 */
function _getIndoDayFromDate(dateStr) {
    if (!dateStr) return 'AGENDA';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            if (!isNaN(d.getDay())) return days[d.getDay()];
        }
    } catch (e) { /* ignore */ }
    return 'AGENDA';
}

function createNextPlayTicket(event) {
    if (!event) return '';
    const dateParts = getDayMonthParts(event.date);
    const isCompleted = event.status === 'completed';
    const dayName = (event.dayName || _getIndoDayFromDate(event.date) || 'AGENDA').toUpperCase();
    const typeName = event.typeName || (event.type === 'training' ? 'Latihan Rutin' : (event.type === 'friendly' ? 'Friendly Match' : (event.type === 'tournament' ? 'Turnamen' : 'Kegiatan')));
    const title = event.title || 'Jadwal Pertandingan BBC';
    const time = event.time || 'Waktu Belum Ditentukan';
    const venue = event.venue || 'Lapangan BBC';
    const city = event.city ? `, ${event.city}` : '';
    const description = event.description || 'Sesi latihan dan kegiatan rutin BAZNAS Badminton Club.';
    const locationUrl = event.locationUrl && event.locationUrl.trim() ? event.locationUrl : null;

    // Adaptive styling based on status
    const ticketClass = isCompleted ? 'event-ticket event-ticket--completed' : 'event-ticket';
    const statusBadge = isCompleted
        ? `<span class="pixel-badge" style="background:#C0392B; color:#fff; border-color:#7B1A13;">✅ SELESAI</span>`
        : `<span class="pixel-badge pixel-badge--neon">STATUS: UPCOMING</span>`;
    const liveBadge = isCompleted
        ? `<span class="pixel-sticker" style="background:#7B1A13; color:#FFD6D2; border:1.5px solid #C0392B; font-size:0.68rem; padding:2px 8px; font-family:var(--font-pixel);">ARSIP</span>`
        : `<span class="pixel-sticker pixel-sticker--yellow" style="font-size:0.68rem; padding:2px 8px;">GOR LIVE</span>`;
    const titleColor = isCompleted ? '#7B1A13' : 'var(--color-dark)';
    const descColor = isCompleted ? '#A04040' : '#4B5E57';

    const actionBtn = locationUrl
        ? (isCompleted
            ? `<a href="${locationUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="white-space:nowrap; background:#C0392B; color:#fff; border:2px solid #7B1A13; box-shadow:4px 4px 0 #7B1A13;">
                   <span>LIHAT LOKASI</span>
                   <span style="font-family:var(--font-pixel);">↗</span>
               </a>`
            : `<a href="${locationUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="white-space:nowrap; box-shadow:4px 4px 0px var(--color-dark);">
                   <span>PETUNJUK LOKASI</span>
                   <span style="font-family:var(--font-pixel);">↗</span>
               </a>`)
        : `<span class="btn btn-disabled" style="white-space:nowrap; opacity:0.6; cursor:default;">
               <span>📍 LOKASI GOR</span>
           </span>`;

    const typeBadge = isCompleted
        ? `<span class="badge" style="background:#FDDDD9; color:#7B1A13; border:1.5px solid #C0392B;">${typeName}</span>`
        : `<span class="badge badge--dark-green">${typeName}</span>`;

    return `
    <div class="${ticketClass}" style="position: relative;">
        <!-- Realistic Perforation Cutout Notches -->
        <div class="ticket-notch-top"></div>
        <div class="ticket-notch-bottom"></div>

        <div class="event-ticket__left">
            <div class="event-ticket__date-day">${dateParts.day}</div>
            <div class="event-ticket__date-month">${dateParts.month}</div>
            <div class="event-ticket__date-year">${dateParts.year}</div>
            <div class="pixel-badge pixel-badge--yellow" style="margin-top: 12px; font-size: 0.7rem;">
                ${dayName}
            </div>
            <div style="font-family: var(--font-pixel); font-size: 0.6rem; margin-top: 14px; opacity: 0.85; letter-spacing: 2px;">
                ||||||||||||||
            </div>
        </div>

        <div class="event-ticket__body">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                ${typeBadge}
                ${statusBadge}
                ${liveBadge}
            </div>

            <h3 style="font-size: clamp(1.7rem, 3.2vw, 2.6rem); line-height: 1.05; margin: 0; color: ${titleColor};">
                ${title}
            </h3>

            <div class="event-ticket__meta">
                <div class="event-ticket__meta-item">
                    <span style="font-size: 1.2rem;">⏰</span>
                    <span>${time}</span>
                </div>
                <div class="event-ticket__meta-item">
                    <span style="font-size: 1.2rem;">📍</span>
                    <span>${venue}${city}</span>
                </div>
            </div>

            <p style="font-size: 0.95rem; color: ${descColor}; margin: 0; line-height: 1.55;">
                ${description}
            </p>
        </div>

        <div class="event-ticket__action">
            ${actionBtn}
        </div>
    </div>
    `;
}

function createScheduleListItem(event) {
    if (!event) return '';
    const dateParts = getDayMonthParts(event.date);
    const isCompleted = event.status === 'completed';
    const dayName = event.dayName || _getIndoDayFromDate(event.date);
    const typeName = event.typeName || (event.type === 'training' ? 'Latihan Rutin' : (event.type === 'friendly' ? 'Friendly Match' : (event.type === 'tournament' ? 'Turnamen' : 'Kegiatan')));
    const title = event.title || 'Jadwal Latihan BBC';
    const time = event.time || 'Waktu Belum Ditentukan';
    const venue = event.venue || 'Lapangan Pakko';
    const locationUrl = event.locationUrl && event.locationUrl.trim() ? event.locationUrl : null;

    const cardClass = isCompleted ? 'schedule-card schedule-card--completed anim-hover-pop' : 'schedule-card anim-hover-pop';
    const dateBoxBg = isCompleted
        ? 'linear-gradient(135deg, #7B1A13, #C0392B)'
        : 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))';
    const dayColor = isCompleted ? '#FFD6D2' : 'var(--color-yellow)';
    const typeBadge = isCompleted
        ? `<span class="badge" style="background:#FDDDD9; color:#7B1A13; border:1px solid #C0392B; font-size:0.65rem; padding:2px 6px;">${typeName}</span>`
        : `<span class="pixel-badge pixel-badge--green" style="font-size: 0.65rem; padding: 2px 6px;">${typeName}</span>`;
    const statusBadge = isCompleted
        ? `<span class="pixel-badge" style="background:#C0392B; color:#fff; border-color:#7B1A13; font-size:0.6rem; padding:1px 5px;">SELESAI</span>`
        : '';
    const titleColor = isCompleted ? '#7B1A13' : 'inherit';
    const btnAction = locationUrl
        ? (isCompleted
            ? `<a href="${locationUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm" style="background:#C0392B; color:#fff; border:1.5px solid #7B1A13;">
                   <span>ARSIP</span>
                   <span style="font-family: var(--font-pixel);">↗</span>
               </a>`
            : `<a href="${locationUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                   <span>LOKASI</span>
                   <span style="font-family: var(--font-pixel);">↗</span>
               </a>`)
        : '';

    return `
    <div class="${cardClass}">
        <div style="display: flex; align-items: center; gap: 18px;">
            <div class="schedule-card__date-box" style="text-align: center; background: ${dateBoxBg}; color: white; border: 2.5px solid var(--color-dark); border-radius: var(--radius-xs); padding: 10px 14px; min-width: 70px; box-shadow: 3px 3px 0 var(--color-dark);">
                <div style="font-family: var(--font-pixel); font-size: 1.7rem; font-weight: 700; line-height: 1; color: ${dayColor};">${dateParts.day}</div>
                <div style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800;">${dateParts.month}</div>
            </div>
            <div>
                <div style="display: flex; gap: 8px; margin-bottom: 4px; align-items: center; flex-wrap: wrap;">
                    ${typeBadge}
                    ${statusBadge}
                    <span style="font-size: 0.82rem; font-weight: 700; color: var(--color-grey);">${dayName}, ${time}</span>
                </div>
                <h4 style="margin: 0; font-size: 1.3rem; color: ${titleColor};">${title}</h4>
                <div style="font-size: 0.88rem; color: var(--color-grey); margin-top: 2px;">📍 ${venue}</div>
            </div>
        </div>
        <div>
            ${btnAction}
        </div>
    </div>
    `;
}