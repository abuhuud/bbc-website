/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Schedule Page Logic
 * Reads from unified BBC_STORE
 * Sorted: tanggal awal dulu → upcoming → completed paling bawah
 */
let currentScheduleFilter = 'all';

function parseEventDate(dateStr) {
    if (!dateStr) return null;
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

function renderSchedulePage() {
    const listContainer = document.getElementById('schedule-page-list');
    if (!listContainer) return;

    const rawEvents = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getEvents()
        : ((typeof events !== 'undefined') ? events : []);

    // Sort: tanggal lebih awal di atas, upcoming > completed
    const allEvents = [...rawEvents].sort((a, b) => {
        const aCompleted = a.status === 'completed' ? 1 : 0;
        const bCompleted = b.status === 'completed' ? 1 : 0;
        // Completed selalu di bawah upcoming
        if (aCompleted !== bCompleted) return aCompleted - bCompleted;
        // Dalam kelompok yang sama: tanggal lebih awal dulu
        const da = parseEventDate(a.date);
        const db = parseEventDate(b.date);
        if (da && db) return da - db;
        return 0;
    });

    const filtered = currentScheduleFilter === 'all'
        ? allEvents
        : allEvents.filter(e => (e.type || '').toLowerCase() === currentScheduleFilter.toLowerCase());

    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div style="background-color: var(--color-off-white); border: 2px solid var(--color-dark); padding: 36px; text-align: center; border-radius: var(--radius-md);">
                <div style="margin-bottom: 8px;"><span class="bbc-icon-shuttle" style="font-size: 2.2rem;"></span></div>
                <h3 style="margin: 0;">BELUM ADA JADWAL UNTUK KATEGORI INI</h3>
                <p style="color: var(--color-grey); margin-top: 4px;">Silakan cek kategori lain atau pantau Instagram BBC.</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = filtered.map(e => createNextPlayTicket(e)).join('');
}

BBC_onReady(() => {
    const filterButtons = document.querySelectorAll('.filter-btn[data-schedule-filter]');

    // Inisialisasi filter dari tombol aktif awal
    const activeScheduleBtn = document.querySelector('.filter-btn[data-schedule-filter].active');
    if (activeScheduleBtn) {
        currentScheduleFilter = activeScheduleBtn.getAttribute('data-schedule-filter') || 'all';
    }

    // Render jadwal awal
    renderSchedulePage();

    // Bind event listener filter (hanya sekali)
    filterButtons.forEach(btn => {
        if (btn.dataset.bbcBound) return;
        btn.dataset.bbcBound = '1';
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentScheduleFilter = btn.getAttribute('data-schedule-filter') || 'all';
            renderSchedulePage();
        });
    });

    // Dengarkan siaran perubahan data live (misal saat admin menambah/mengedit jadwal di CMS)
    if (typeof BBC_LIVE !== 'undefined' && typeof BBC_LIVE.onChange === 'function') {
        BBC_LIVE.onChange((key) => {
            if (!key || key === 'bbc_data_events_v4') {
                renderSchedulePage();
            }
        });
    }
});
