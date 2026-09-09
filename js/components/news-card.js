/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Editorial News Card Component
 */
function createNewsCard(article) {
    const formattedDate = formatDateIndo(article.date);
    
    // Choose badge color based on category
    let badgeClass = 'badge--yellow';
    if (article.category === 'Turnamen') badgeClass = 'badge--coral';
    if (article.category === 'Kegiatan') badgeClass = 'badge--green';
    if (article.category === 'Tips Badminton') badgeClass = 'badge--blue';

    // Resolve detail URL relative to current directory
    const inPages = window.location.pathname.includes('/pages/');
    const detailBase = inPages ? '' : 'pages/';

    return `
    <article class="news-card anim-hover-pop">
        <div class="news-card__media">
            <img src="${article.image}" alt="${article.title}" class="news-card__image" loading="lazy">
            <div class="news-card__tag">
                <span class="badge ${badgeClass}">${article.category}</span>
            </div>
        </div>
        <div class="news-card__body">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="news-card__date">📅 ${formattedDate}</span>
                <span style="font-family: var(--font-pixel); font-size: 0.68rem; color: var(--color-grey);">${article.readTime}</span>
            </div>

            <h3 class="news-card__title">
                <a href="${detailBase}article-detail.html?id=${article.id}" style="color: inherit; text-decoration: none;">
                    ${article.title}
                </a>
            </h3>

            <p class="news-card__excerpt">
                ${article.excerpt}
            </p>

            <div style="margin-top: auto; padding-top: 12px; border-top: 1px dashed var(--color-light-grey);">
                <a href="${detailBase}article-detail.html?id=${article.id}" class="btn btn-outline btn-sm" aria-label="Baca selengkapnya artikel ${article.title}">
                    <span>BACA CERITA</span>
                    <span style="font-family: var(--font-pixel);">→</span>
                </a>
            </div>
        </div>
    </article>
    `;
}