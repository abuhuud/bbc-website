/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Global App Orchestrator
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render reusable components
    if (typeof renderNavbar === 'function') {
        renderNavbar();
    }

    if (typeof renderFooter === 'function') {
        renderFooter();
    }

    // 2. Global Scroll and Motion Enhancements
    if (typeof setupScrollReveal === 'function') {
        setupScrollReveal();
    }

    // 3. Centralized link bindings for Instagram
    if (typeof SITE_CONFIG !== 'undefined') {
        document.querySelectorAll('a[data-instagram-cta]').forEach(btn => {
            btn.href = SITE_CONFIG.instagramUrl;
        });
    }
});