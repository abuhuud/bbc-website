/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Players Directory Page Logic
 * Two sections: Amilin (male) & Amilat (female)
 * Filter buttons show/hide the relevant section
 * Reads from unified BBC_STORE
 */
BBC_onReady(() => {
    const filterBtns    = document.querySelectorAll('.filter-btn[data-filter]');
    const gridAmilin    = document.getElementById('grid-amilin');
    const gridAmilatEl  = document.getElementById('grid-amilat');
    const sectionAmilin = document.getElementById('section-amilin');
    const sectionAmilatEl = document.getElementById('section-amilat');

    const countAllEl    = document.getElementById('count-all');
    const countMaleEl   = document.getElementById('count-male');
    const countFemaleEl = document.getElementById('count-female');
    const labelMaleEl   = document.getElementById('label-count-male');
    const labelFemaleEl = document.getElementById('label-count-female');

    const allPlayers = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getPlayers()
        : ((typeof players !== 'undefined') ? players : []);

    if (!allPlayers || allPlayers.length === 0) return;

    const amilin = allPlayers.filter(p => p.gender === 'male');
    const amilat = allPlayers.filter(p => p.gender === 'female');

    // Populate counts
    if (countAllEl)    countAllEl.textContent    = allPlayers.length;
    if (countMaleEl)   countMaleEl.textContent   = amilin.length;
    if (countFemaleEl) countFemaleEl.textContent = amilat.length;
    if (labelMaleEl)   labelMaleEl.textContent   = `${amilin.length} pemain`;
    if (labelFemaleEl) labelFemaleEl.textContent = `${amilat.length} pemain`;

    // Render all cards into their respective grids
    if (gridAmilin)   gridAmilin.innerHTML   = amilin.map(p => createPlayerCard(p)).join('');
    if (gridAmilatEl) gridAmilatEl.innerHTML = amilat.map(p => createPlayerCard(p)).join('');

    // Filter: show/hide sections based on active filter
    function applyFilter(category) {
        if (!sectionAmilin || !sectionAmilatEl) return;

        if (category === 'all') {
            sectionAmilin.style.display   = '';
            sectionAmilatEl.style.display = '';
            sectionAmilatEl.style.marginTop = '56px';
        } else if (category === 'male') {
            sectionAmilin.style.display   = '';
            sectionAmilatEl.style.display = 'none';
        } else if (category === 'female') {
            sectionAmilin.style.display   = 'none';
            sectionAmilatEl.style.display = '';
            sectionAmilatEl.style.marginTop = '0';
        }
    }

    filterBtns.forEach(btn => {
        if (btn.dataset.bbcBound) return;
        btn.dataset.bbcBound = '1';
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.getAttribute('data-filter'));
        });
    });

    // Pertahankan filter aktif saat data CMS berubah
    const activeBtn = document.querySelector('.filter-btn[data-filter].active');
    applyFilter(activeBtn ? activeBtn.getAttribute('data-filter') : 'all');
});
