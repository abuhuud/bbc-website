/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Schedule Page Logic
 * Reads from unified BBC_STORE
 * Sorted: tanggal awal dulu → upcoming → completed paling bawah
 */
BBC_onReady(() => {
    const listContainer = document.getElementById('schedule-page-list');
    const filterButtons = document.querySelectorAll('.filter-btn[data-schedule-filter]');

    if (!listContainer) return;

    const rawEvents = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getEvents()
        : ((typeof events !== 'undefined') ? events : []);

    // Helper parse tanggal dari format YYYY-MM-DD
    function parseDate(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length !== 3) return null;
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }

    // Sort: tanggal lebih awal di atas, upcoming > completed
    const allEvents = [...rawEvents].sort((a, b) => {
        const aCompleted = a.status === 'completed' ? 1 : 0;
        const bCompleted = b.status === 'completed' ? 1 : 0;
        // Completed selalu di bawah upcoming
        if (aCompleted !== bCompleted) return aCompleted - bCompleted;
        // Dalam kelompok yang sama: tanggal lebih awal dulu
        const da = parseDate(a.date);
        const db = parseDate(b.date);
        if (da && db) return da - db;
        return 0;
    });

    function renderEvents(filter = 'all') {
        const filtered = filter === 'all'
            ? allEvents
            : allEvents.filter(e => e.type.toLowerCase() === filter.toLowerCase());

        if (filtered.length === 0) {
            listContainer.innerHTML = `
                <div style="background-color: var(--color-off-white); border: 2px solid var(--color-dark); padding: 36px; text-align: center; border-radius: var(--radius-md);">
                    <div style="font-size: 2rem; margin-bottom: 8px;">🏸</div>
                    <h3 style="margin: 0;">BELUM ADA JADWAL UNTUK KATEGORI INI</h3>
                    <p style="color: var(--color-grey); margin-top: 4px;">Silakan cek kategori lain atau pantau Instagram BBC.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = filtered.map(e => createNextPlayTicket(e)).join('');
    }

    const activeScheduleBtn = document.querySelector('.filter-btn[data-schedule-filter].active');
    renderEvents(activeScheduleBtn ? activeScheduleBtn.getAttribute('data-schedule-filter') : 'all');

    filterButtons.forEach(btn => {
        if (btn.dataset.bbcBound) return;
        btn.dataset.bbcBound = '1';
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.getAttribute('data-schedule-filter');
            renderEvents(val);
        });
    });
});
