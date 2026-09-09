/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Reusable Navbar Component
 *
 * Navigation links point to pages/ subfolder for all
 * sub-pages; index.php lives at root.
 */
function renderNavbar() {
    // Determine active menu item based on current pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.php';
    const isInPagesDir = window.location.pathname.includes('/pages/');

    // Base href: if we're inside pages/, index.php is at ../
    const base = isInPagesDir ? '../' : '';

    const navItems = [
        { label: "Beranda", file: "index.php", href: `${base}index.php` },
        { label: "Profil BBC", file: "profile.php", href: `${base}pages/profile.php` },
        { label: "Daftar Pemain", file: "players.php", href: `${base}pages/players.php` },
        { label: "Jadwal & Kegiatan", file: "schedule.php", href: `${base}pages/schedule.php` },
        { label: "Berita & Artikel", file: "news.php", href: `${base}pages/news.php` }
    ];

    const navLinksHtml = navItems.map(item => {
        const isActive = (currentPath === item.file) ||
            ((currentPath === '' || currentPath === 'index.html' || currentPath === 'index.php') && item.file === 'index.php') ||
            ((currentPath === 'player-detail.php' || currentPath === 'player-detail.html') && item.file === 'players.php') ||
            ((currentPath === 'article-detail.php' || currentPath === 'article-detail.html') && item.file === 'news.php');
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
            <a href="${base}index.php" class="navbar__brand" aria-label="Beranda BAZNAS Badminton Club">
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