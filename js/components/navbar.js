/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Reusable Navbar Component
 *
 * Navigation links point to pages/ subfolder for all
 * sub-pages; index.html lives at root.
 */
function renderNavbar() {
    // Determine active menu item based on current pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const isInPagesDir = window.location.pathname.includes('/pages/');

    // Base href: if we're inside pages/, index.html is at ../
    const base = isInPagesDir ? '../' : '';

    const navItems = [
        { label: "Beranda", file: "index.html", href: `${base}index.html` },
        { label: "Profil BBC", file: "profile.html", href: `${base}pages/profile.html` },
        { label: "Daftar Pemain", file: "players.html", href: `${base}pages/players.html` },
        { label: "Jadwal & Kegiatan", file: "schedule.html", href: `${base}pages/schedule.html` },
        { label: "Berita & Artikel", file: "news.html", href: `${base}pages/news.html` }
    ];

    const navLinksHtml = navItems.map(item => {
        const isActive = (currentPath === item.file) ||
            ((currentPath === '' || currentPath === 'index.html') && item.file === 'index.html') ||
            (currentPath === 'player-detail.html' && item.file === 'players.html') ||
            (currentPath === 'article-detail.html' && item.file === 'news.html');
        return `
            <a href="${item.href}" class="navbar__link ${isActive ? 'active' : ''}">
                ${item.label}
            </a>
        `;
    }).join('');

    const igUrl = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.instagramUrl)
        ? SITE_CONFIG.instagramUrl
        : 'https://www.instagram.com/baznas_badmintonclub/';

    const navbarHTML = `
    <header class="navbar" id="main-header" role="banner">
        <div class="container navbar__inner">
            <a href="${base}index.html" class="navbar__brand" aria-label="Beranda BAZNAS Badminton Club">
                <img
                    src="${base}assets/images/brand/logo.png"
                    alt="BAZNAS Badminton Club Logo"
                    class="navbar__logo-img"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >
                <div class="navbar__logo-badge" style="display:none;">BBC</div>
                <div class="navbar__brand-text">
                    <div class="title">BAZNAS BADMINTON CLUB</div>
                    <div class="subtitle">BAZNAS RI COMMUNITY</div>
                </div>
            </a>

            <nav class="navbar__nav" id="navbar-menu" role="navigation" aria-label="Menu Utama">
                ${navLinksHtml}
            </nav>

            <div style="display: flex; align-items: center; gap: 12px;">
                <a href="${igUrl}" target="_blank" rel="noopener noreferrer" class="btn navbar__cta-btn" aria-label="Lihat Instagram BBC">
                    <span>INSTAGRAM BBC</span>
                    <span style="font-family: var(--font-pixel);">↗</span>
                </a>
                
                <button class="navbar__mobile-toggle" id="navbar-toggle" aria-label="Buka navigasi menu" aria-expanded="false">
                    ☰
                </button>
            </div>
        </div>
    </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    // Setup mobile drawer toggle
    const toggleBtn = document.getElementById('navbar-toggle');
    const navMenu = document.getElementById('navbar-menu');
    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('is-open');
            toggleBtn.setAttribute('aria-expanded', String(isOpen));
            toggleBtn.innerHTML = isOpen ? '✕' : '☰';
        });
    }
}