/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Article Detail Page Logic
 */
BBC_onReady(() => {
    const container = document.getElementById('article-detail-container');
    if (!container) return;

    const allArticles = (typeof BBC_STORE !== 'undefined')
        ? BBC_STORE.getArticles()
        : ((typeof articles !== 'undefined') ? articles : []);

    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id') || (allArticles[0] ? allArticles[0].id : null);

    const article = allArticles.find(a => String(a.id) === String(articleId)) || allArticles[0];

    if (!article) {
        container.innerHTML = `
            <div style="background: white; border: 2px solid var(--color-dark); padding: 40px; text-align: center; border-radius: var(--radius-md);">
                <h3>ARTIKEL TIDAK DITEMUKAN</h3>
                <p>Artikel yang Anda cari tidak tersedia.</p>
                <a href="news.html" class="btn btn-primary" style="margin-top: 16px;">KEMBALI KE BERITA</a>
            </div>
        `;
        return;
    }

    const formattedDate = formatDateIndo(article.date);

    container.innerHTML = `
    <article style="background-color: var(--color-white); border: 3px solid var(--color-dark); border-radius: var(--radius-xl); box-shadow: var(--pixel-shadow-lg); overflow: hidden; padding: 36px 32px;">
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
            <span class="badge badge--yellow">${article.category}</span>
            <span style="font-family: var(--font-pixel); font-size: 0.72rem; color: var(--color-grey);">📅 ${formattedDate}</span>
            <span style="font-family: var(--font-pixel); font-size: 0.72rem; color: var(--color-grey);">⏱ ${article.readTime}</span>
        </div>

        <h1 style="font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.05; margin-bottom: 24px;">
            ${article.title}
        </h1>

        <div style="border: 2px solid var(--color-dark); border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 16/9; margin-bottom: 28px; box-shadow: var(--pixel-shadow-sm);">
            <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div style="font-size: 1.05rem; line-height: 1.8; color: #2B3833; display: flex; flex-direction: column; gap: 18px;">
            ${article.content}
        </div>

        <div class="pixel-divider pixel-divider--green" style="margin: 36px 0 24px 0;"></div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
                <span class="pixel-badge pixel-badge--dark">BAZNAS BADMINTON CLUB</span>
            </div>
            <a href="https://www.instagram.com/baznas_badmintonclub/" target="_blank" rel="noopener noreferrer" class="btn btn-yellow btn-sm" data-bind-instagram>
                <span>LIHAT DI INSTAGRAM</span>
                <span style="font-family: var(--font-pixel);">↗</span>
            </a>
        </div>
    </article>
    `;
});
