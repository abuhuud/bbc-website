/**
 * BAZNAS BADMINTON CLUB (BBC)
 * News & Articles Page Logic
 * Reads from unified BBC_STORE
 */
BBC_onReady(() => {
    const grid = document.getElementById('news-page-grid');
    const filterBtns = document.querySelectorAll('.filter-btn[data-news-filter]');

    if (!grid) return;

    const allArticles = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getArticles()
        : ((typeof articles !== 'undefined') ? articles : []);

    function renderArticles(filter = 'all') {
        const filtered = filter === 'all'
            ? allArticles
            : allArticles.filter(a => a.category.toLowerCase() === filter.toLowerCase());

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; background-color: var(--color-off-white); border: 2px solid var(--color-dark); padding: 36px; text-align: center; border-radius: var(--radius-md);">
                    <div style="font-size: 2rem; margin-bottom: 8px;">📰</div>
                    <h3 style="margin: 0;">BELUM ADA ARTIKEL UNTUK KATEGORI INI</h3>
                    <p style="color: var(--color-grey); margin-top: 4px;">Silakan pilih kategori artikel lain di atas.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(a => createNewsCard(a)).join('');
    }

    const activeNewsBtn = document.querySelector('.filter-btn[data-news-filter].active');
    renderArticles(activeNewsBtn ? activeNewsBtn.getAttribute('data-news-filter') : 'all');

    filterBtns.forEach(btn => {
        if (btn.dataset.bbcBound) return;
        btn.dataset.bbcBound = '1';
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-news-filter');
            renderArticles(cat);
        });
    });
});
