/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Reusable Semantic Footer Component — Premium Neo-Brutalist Edition
 * Strictly no membership / join / registration links
 */
function renderFooter() {
    const igUrl = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.instagramUrl)
        ? SITE_CONFIG.instagramUrl
        : 'https://www.instagram.com/baznas_badmintonclub/';

    const igUser = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.instagramUsername)
        ? SITE_CONFIG.instagramUsername
        : '@baznas_badmintonclub';

    const year = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.currentYear)
        ? SITE_CONFIG.currentYear
        : 2026;

    const isInPagesDir = window.location.pathname.includes('/pages/');
    const base = isInPagesDir ? '../' : '';

    const footerHTML = `
    <footer class="footer" role="contentinfo">

        <!-- Top accent bar with pixel pattern -->
        <div class="footer__accent-bar">
            <div class="footer__accent-ticker">
                <span>🏸 MAIN BARENG</span>
                <span class="footer__accent-dot">◆</span>
                <span>SEHAT BARENG</span>
                <span class="footer__accent-dot">◆</span>
                <span>BAZNAS BADMINTON CLUB</span>
                <span class="footer__accent-dot">◆</span>
                <span>🏸 INTERNAL BAZNAS RI</span>
                <span class="footer__accent-dot">◆</span>
                <span>MAIN BARENG</span>
                <span class="footer__accent-dot">◆</span>
                <span>SEHAT BARENG</span>
                <span class="footer__accent-dot">◆</span>
                <span>BAZNAS BADMINTON CLUB</span>
                <span class="footer__accent-dot">◆</span>
                <span>🏸 INTERNAL BAZNAS RI</span>
                <span class="footer__accent-dot">◆</span>
            </div>
        </div>

        <div class="container">
            <div class="footer__main">

                <!-- Col 1: Brand -->
                <div class="footer__col footer__col--brand">
                    <div class="footer__logo-wrap">
                        <img src="${base}assets/images/brand/logo.png" alt="BBC Logo"
                            class="footer__logo-img"
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="footer__logo-fallback navbar__logo-badge" style="display:none;">BBC</div>
                        <div class="footer__brand-name">
                            <span class="footer__brand-title">BAZNAS<br>BADMINTON CLUB</span>
                            <span class="footer__brand-sub">BAZNAS RI · EST. 2023</span>
                        </div>
                    </div>

                    <p class="footer__brand-desc">
                        Komunitas olahraga badminton internal untuk insan amilin &amp; amilat BAZNAS RI.
                        Wadah silaturahmi, kebugaran jasmani, dan sportivitas bersama.
                    </p>

                    <!-- Mini Stats Strip -->
                    <div class="footer__stats">
                        <div class="footer__stat">
                            <span class="footer__stat-num">30+</span>
                            <span class="footer__stat-label">PEMAIN</span>
                        </div>
                        <div class="footer__stat-divider"></div>
                        <div class="footer__stat">
                            <span class="footer__stat-num">52x</span>
                            <span class="footer__stat-label">SESI LATIHAN</span>
                        </div>
                        <div class="footer__stat-divider"></div>
                        <div class="footer__stat">
                            <span class="footer__stat-num">6+</span>
                            <span class="footer__stat-label">TURNAMEN</span>
                        </div>
                    </div>

                    <span class="pixel-badge pixel-badge--green" style="font-size:0.68rem; margin-top: 8px;">🔒 INTERNAL BAZNAS RI ONLY</span>
                </div>

                <!-- Col 2: Navigasi -->
                <div class="footer__col">
                    <div class="footer__col-heading">
                        <span class="footer__col-heading-icon">🗺️</span>
                        NAVIGASI
                    </div>
                    <ul class="footer__links">
                        <li>
                            <a href="${base}index.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Beranda
                            </a>
                        </li>
                        <li>
                            <a href="${base}pages/profile.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Profil BBC
                            </a>
                        </li>
                        <li>
                            <a href="${base}pages/players.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Daftar Pemain
                            </a>
                        </li>
                        <li>
                            <a href="${base}pages/schedule.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Jadwal &amp; Kegiatan
                            </a>
                        </li>
                        <li>
                            <a href="${base}pages/news.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Berita &amp; Artikel
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Col 3: Kegiatan -->
                <div class="footer__col">
                    <div class="footer__col-heading">
                        <span class="footer__col-heading-icon">🏆</span>
                        KEGIATAN
                    </div>
                    <ul class="footer__links">
                        <li>
                            <a href="${base}pages/schedule.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Latihan Rutin
                            </a>
                        </li>
                        <li>
                            <a href="${base}pages/schedule.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Friendly Match
                            </a>
                        </li>
                        <li>
                            <a href="${base}pages/schedule.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Turnamen Internal
                            </a>
                        </li>
                        <li>
                            <a href="${base}pages/schedule.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Fun Match
                            </a>
                        </li>
                        <li>
                            <a href="${base}pages/schedule.html" class="footer__link">
                                <span class="footer__link-arrow">→</span> Gathering &amp; Sharing
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Col 4: Sosial -->
                <div class="footer__col">
                    <div class="footer__col-heading">
                        <span class="footer__col-heading-icon">📱</span>
                        IKUTI KAMI
                    </div>
                    <p class="footer__social-desc">
                        Cuplikan pertandingan, foto kegiatan, dan keseruan lapangan BBC ada di sini:
                    </p>
                    <a href="${igUrl}" target="_blank" rel="noopener noreferrer" class="footer__ig-btn">
                        <span class="footer__ig-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </span>
                        <span class="footer__ig-handle">${igUser}</span>
                        <span class="footer__ig-arrow">↗</span>
                    </a>
                </div>

            </div><!-- /.footer__main -->

            <!-- Bottom Bar -->
            <div class="footer__bottom">
                <div class="footer__bottom-left">
                    <span class="footer__copyright">
                        © ${year} <strong>BAZNAS Badminton Club</strong> · BAZNAS RI
                    </span>
                    <span class="footer__bottom-dot">◆</span>
                    <span class="footer__bottom-rights">Seluruh Hak Cipta Dilindungi.</span>
                </div>
                <div class="footer__bottom-right">
                    <span class="footer__tagline">MAIN BARENG • SEHAT BARENG 🏸</span>
                </div>
            </div>

        </div><!-- /.container -->
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}