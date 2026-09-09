<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CMS Pengelola Konten — BAZNAS Badminton Club</title>
    <meta name="description"
        content="Dashboard manajemen konten mandiri BAZNAS Badminton Club: kelola pemain, jadwal, foto kegiatan, dan berita.">

    <!-- Google Fonts -->    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/images/brand/logo.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../assets/images/brand/logo.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/images/brand/logo.png">
    <meta name="theme-color" content="#1B6B35">

        <link rel="preconnect" href="https://fonts.googleapis.com">

    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Press+Start+2P&family=Space+Grotesk:wght@700;800&display=swap"
        rel="stylesheet">

    <!-- CSS Core & CMS -->
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/variables.css">
    <link rel="stylesheet" href="../css/typography.css">
    <link rel="stylesheet" href="../css/pixel-system.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/components.css">
    <link rel="stylesheet" href="../css/animations.css">
    <link rel="stylesheet" href="../css/cms.css">
    <link rel="stylesheet" href="../css/cursor.css">
</head>

<body class="cms-layout cms-auth-required">

    <!-- ==========================================
         ADMIN AUTHENTICATION / RETRO ARCADE PASS
         ========================================== -->
    <div class="cms-auth-screen" id="cms-auth-screen">
        <!-- Floating Retro Badges -->
        <div class="anim-float" style="position: absolute; top: 32px; left: 32px; z-index: 1;">
            <span class="pixel-sticker pixel-sticker--yellow sticker-tilt-left"
                style="font-size: 0.85rem; padding: 6px 14px; box-shadow: 4px 4px 0 var(--cms-dark);">
                🏸 BBC CONTROL
            </span>
        </div>
        <div class="anim-float"
            style="position: absolute; bottom: 32px; right: 32px; z-index: 1; animation-delay: 1.5s;">
            <span class="pixel-sticker pixel-sticker--coral sticker-tilt-right"
                style="font-size: 0.85rem; padding: 6px 14px; box-shadow: 4px 4px 0 var(--cms-dark);">
                🔥 PASS REQUIRED
            </span>
        </div>

        <div class="cms-auth-card">
            <div class="cms-auth-header">
                <div class="pixel-badge pixel-badge--yellow" style="margin-bottom: 12px; display: inline-flex;">
                    🔐 RESTRICTED AREA
                </div>
                <h2 style="font-size: 1.7rem; margin: 0 0 6px 0; color: var(--color-white); letter-spacing: -0.01em;">
                    BBC CMS LOGIN</h2>
                <div style="font-family: var(--font-pixel); font-size: 0.65rem; color: var(--cms-mint);">
                    ✦ MASUKKAN ID &amp; PASSWORD PENGELOLA ✦
                </div>
            </div>

            <div class="cms-auth-body">
                <div id="login-error-msg" class="cms-auth-error" role="alert">
                    ⚠️ ID atau Password salah! Akses ditolak.
                </div>

                <form id="cms-login-form">
                    <div class="cms-form-group">
                        <label class="cms-label" for="login-username">Admin ID *</label>
                        <input type="text" id="login-username" class="cms-input" required
                            placeholder="Masukkan ID admin" autocomplete="username" autofocus>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="login-password">Password *</label>
                        <div class="cms-password-wrapper">
                            <input type="password" id="login-password" class="cms-input" required
                                placeholder="••••••••••••" autocomplete="current-password">
                            <button type="button" class="cms-password-toggle" id="toggle-password-btn"
                                title="Tampilkan/Sembunyikan Password" aria-label="Toggle Password">
                                👁️
                            </button>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary"
                        style="width: 100%; justify-content: center; margin-top: 24px; padding: 13px; font-size: 1rem; box-shadow: 4px 4px 0 var(--cms-dark);">
                        <span>MASUK KE DASHBOARD</span>
                        <span style="font-family: var(--font-pixel);">→</span>
                    </button>
                </form>

                <div style="margin-top: 24px; text-align: center;">
                    <a href="../index.php" class="cms-btn-auth-back">
                        <span>← KEMBALI KE WEBSITE UTAMA</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- ==========================================
         CMS COLLAPSIBLE LEFT SIDEBAR & MAIN LAYOUT
         ========================================== -->
    <div class="cms-app-wrapper" id="cms-app-wrapper">
        <!-- Collapsible Left Sidebar Navigation (Desktop, Tablet & Mobile Drawer) -->
        <aside class="cms-sidebar" id="cms-sidebar" aria-label="Navigasi Modul CMS">
            <!-- Sidebar Header & Brand -->
            <div class="cms-sidebar__header">
                <div class="cms-sidebar__brand">
                    <span class="pixel-badge-icon cms-sidebar__logo-badge">🏸</span>
                    <div class="cms-sidebar__brand-text">
                        <strong class="cms-sidebar__brand-name">BBC ADMIN</strong>
                        <span class="cms-sidebar__brand-sub">CONTROL CENTER</span>
                    </div>
                </div>
                <button type="button" class="cms-sidebar__close-btn" id="btn-sidebar-collapse" title="Tutup / Sembunyikan Menu Navigasi Samping" aria-label="Tutup Menu">
                    <span class="cms-sidebar__close-icon" id="sidebar-collapse-icon">◀</span>
                </button>
            </div>

            <!-- Sidebar Nav Modul List (Uniform Box Sizes) -->
            <div class="cms-sidebar__body">
                <div class="cms-sidebar__section-header">
                    <span class="pixel-badge pixel-badge--yellow" style="font-size: 0.65rem;">✦ MODUL PENGELOLA</span>
                    <span class="cms-sidebar__badge-version">V2.6</span>
                </div>

                <ul class="cms-tabs-list" role="tablist">
                    <li>
                        <button type="button" class="cms-tab-btn active" data-tab="dashboard" role="tab" aria-selected="true">
                            <span class="cms-tab-btn__main">
                                <span class="cms-tab-icon">📊</span>
                                <span class="cms-tab-btn__text">DASHBOARD</span>
                            </span>
                            <span class="cms-tab-btn__end">
                                <span class="cms-tab-arrow" aria-hidden="true">→</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="cms-tab-btn" data-tab="players" role="tab" aria-selected="false">
                            <span class="cms-tab-btn__main">
                                <span class="cms-tab-icon">🏸</span>
                                <span class="cms-tab-btn__text">PEMAIN</span>
                            </span>
                            <span class="cms-tab-btn__end">
                                <span class="cms-tab-badge" id="tab-count-players">0</span>
                                <span class="cms-tab-arrow" aria-hidden="true">→</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="cms-tab-btn" data-tab="events" role="tab" aria-selected="false">
                            <span class="cms-tab-btn__main">
                                <span class="cms-tab-icon">📅</span>
                                <span class="cms-tab-btn__text">JADWAL</span>
                            </span>
                            <span class="cms-tab-btn__end">
                                <span class="cms-tab-badge" id="tab-count-events">0</span>
                                <span class="cms-tab-arrow" aria-hidden="true">→</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="cms-tab-btn" data-tab="gallery" role="tab" aria-selected="false">
                            <span class="cms-tab-btn__main">
                                <span class="cms-tab-icon">📸</span>
                                <span class="cms-tab-btn__text">GALERI</span>
                            </span>
                            <span class="cms-tab-btn__end">
                                <span class="cms-tab-badge" id="tab-count-gallery">0</span>
                                <span class="cms-tab-arrow" aria-hidden="true">→</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="cms-tab-btn" data-tab="articles" role="tab" aria-selected="false">
                            <span class="cms-tab-btn__main">
                                <span class="cms-tab-icon">📰</span>
                                <span class="cms-tab-btn__text">BERITA</span>
                            </span>
                            <span class="cms-tab-btn__end">
                                <span class="cms-tab-badge" id="tab-count-articles">0</span>
                                <span class="cms-tab-arrow" aria-hidden="true">→</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="cms-tab-btn" data-tab="hero" role="tab" aria-selected="false">
                            <span class="cms-tab-btn__main">
                                <span class="cms-tab-icon">🎬</span>
                                <span class="cms-tab-btn__text">HERO MEDIA</span>
                            </span>
                            <span class="cms-tab-btn__end">
                                <span class="cms-tab-arrow" aria-hidden="true">→</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="cms-tab-btn" data-tab="officials" role="tab" aria-selected="false">
                            <span class="cms-tab-btn__main">
                                <span class="cms-tab-icon">👔</span>
                                <span class="cms-tab-btn__text">PENGURUS</span>
                            </span>
                            <span class="cms-tab-btn__end">
                                <span class="cms-tab-badge" id="tab-count-officials">0</span>
                                <span class="cms-tab-arrow" aria-hidden="true">→</span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="cms-tab-btn" data-tab="backup" role="tab" aria-selected="false">
                            <span class="cms-tab-btn__main">
                                <span class="cms-tab-icon">💾</span>
                                <span class="cms-tab-btn__text">BACKUP</span>
                            </span>
                            <span class="cms-tab-btn__end">
                                <span class="cms-tab-arrow" aria-hidden="true">→</span>
                            </span>
                        </button>
                    </li>
                </ul>
            </div>

            <!-- Sidebar Footer Quick Actions -->
            <div class="cms-sidebar__footer">
                <a href="../index.php" class="cms-sidebar__btn-site" title="Buka Website Utama BAZNAS Badminton Club">
                    <span class="cms-btn-icon">🌐</span>
                    <span class="cms-sidebar__btn-text">LIHAT WEBSITE</span>
                    <span class="cms-btn-badge" aria-hidden="true">↗</span>
                </a>
                <button type="button" class="cms-sidebar__btn-logout" id="btn-sidebar-logout" title="Keluar dari CMS Pengelola">
                    <span class="cms-btn-icon">🚪</span>
                    <span class="cms-sidebar__btn-text">KELUAR</span>
                </button>
            </div>
        </aside>

        <!-- Backdrop for mobile / tablet drawer overlay -->
        <div class="cms-sidebar-backdrop" id="cms-sidebar-backdrop"></div>

        <!-- Main Content Wrapper (Topbar Header + Main Panes) -->
        <div class="cms-main-wrapper">
            <!-- Clean Header with Single Unified Burger Toggle & BBC ADMIN Brand -->
            <header class="cms-topbar" id="cms-header">
                <div class="container">
                    <div class="cms-topbar__main">
                        <div class="cms-topbar__brand">
                            <!-- Single Clean Burger Toggle Button (Desktop, Tablet & Mobile) -->
                            <button type="button" class="cms-burger-btn" id="cms-burger-btn" aria-label="Buka / Tutup Menu Navigasi" title="Buka / Tutup Menu">
                                <span class="cms-burger-icon" id="cms-burger-icon" aria-hidden="true">☰</span>
                            </button>

                            <!-- Ultra-Clean Modern Brand: BBC ADMIN -->
                            <div class="cms-topbar__brand-badge" aria-label="BBC Admin">
                                <span class="pixel-badge-icon">🏸</span>
                                <span class="cms-topbar__brand-title">BBC ADMIN</span>
                            </div>
                        </div>

                        <div class="cms-topbar__controls">
                            <!-- Desktop & Tablet Actions -->
                            <div class="cms-topbar__actions cms-topbar__actions--desktop">
                                <!-- Cloud Sync Status Badge (Vercel / GitHub Auto-Deploy) -->
                                <div id="cloud-sync-topbar-badge" class="cms-cloud-sync-badge" title="Status Auto-Deploy ke Vercel" style="cursor: pointer;">
                                    <span class="cms-cloud-sync-dot" id="cloud-sync-dot"></span>
                                    <span id="cloud-sync-topbar-text" class="cms-cloud-sync-text">☁️ Vercel: Siap</span>
                                </div>

                                <a href="../index.php" class="cms-btn-topbar-site" title="Buka Website Utama BAZNAS Badminton Club">
                                    <span class="cms-btn-icon">🌐</span>
                                    <span class="cms-btn-text">LIHAT WEBSITE</span>
                                    <span class="cms-btn-badge" aria-hidden="true">↗</span>
                                </a>
                                <button type="button" class="cms-btn-topbar-logout" id="btn-logout" title="Keluar dari CMS Pengelola">
                                    <span class="cms-btn-icon">🚪</span>
                                    <span class="cms-btn-text">KELUAR</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

    <!-- Main Content Panel -->
    <main class="cms-panel">
        <div class="container">

            <!-- ==========================================
                 TAB 0: DASHBOARD / OVERVIEW PANEL
                 ========================================== -->
            <section id="pane-dashboard" class="cms-tab-pane">
                <!-- Welcome Banner -->
                <div class="cms-dashboard-hero">
                    <div class="cms-dashboard-hero__content">
                        <div class="cms-dashboard-hero__badge-row">
                            <span class="pixel-badge pixel-badge--yellow">⚡ DASHBOARD UTAMA</span>
                            <span class="pixel-badge pixel-badge--green">LIVE SINKRONISASI</span>
                        </div>
                        <h2 class="cms-dashboard-hero__title">
                            HALO PENGELOLA BBC! 🏸
                        </h2>
                        <p class="cms-dashboard-hero__desc">
                            Selamat datang di BBC Control Center. Kelola data pemain, agenda kegiatan, galeri foto, artikel turnamen, dan kepengurusan klub secara langsung.
                        </p>
                    </div>
                    <div class="cms-dashboard-hero__quick-actions">
                        <div class="cms-dashboard-hero__actions-label">PINTASAN CEPAT TAMBAH DATA:</div>
                        <div class="cms-dashboard-hero__actions-grid">
                            <button type="button" class="btn btn-primary btn-sm cms-dash-quick-btn" data-dash-action="add-player">
                                <span>🏸 + PEMAIN</span>
                            </button>
                            <button type="button" class="btn btn-primary btn-sm cms-dash-quick-btn" data-dash-action="add-event" style="background: var(--cms-yellow); color: var(--cms-dark); border-color: var(--cms-dark);">
                                <span>📅 + JADWAL</span>
                            </button>
                            <button type="button" class="btn btn-primary btn-sm cms-dash-quick-btn" data-dash-action="add-gallery" style="background: var(--cms-coral); color: #FFF; border-color: var(--cms-dark);">
                                <span>📸 + FOTO</span>
                            </button>
                            <button type="button" class="btn btn-primary btn-sm cms-dash-quick-btn" data-dash-action="add-article" style="background: var(--cms-blue); color: #FFF; border-color: var(--cms-dark);">
                                <span>📰 + BERITA</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 5 Metric Cards Grid (Stats Ribbon) -->
                <div class="cms-stats-grid">
                    <div class="cms-stat-card" data-stat-tab="players" role="button" tabindex="0" title="Buka Tab Pemain">
                        <div class="cms-stat-card__icon"
                            style="background: rgba(0, 155, 99, 0.12); color: var(--color-primary);">🏸</div>
                        <div class="cms-stat-card__info">
                            <div class="cms-stat-card__label">TOTAL PEMAIN</div>
                            <div class="cms-stat-card__value" id="stat-total-players">0</div>
                            <div class="cms-stat-card__sub" id="stat-breakdown-players">0 Amilin • 0 Amilat</div>
                        </div>
                        <span class="cms-stat-card__arrow">→</span>
                    </div>

                    <div class="cms-stat-card" data-stat-tab="events" role="button" tabindex="0" title="Buka Tab Jadwal">
                        <div class="cms-stat-card__icon" style="background: rgba(255, 216, 61, 0.22); color: #8C6D00;">📅
                        </div>
                        <div class="cms-stat-card__info">
                            <div class="cms-stat-card__label">JADWAL KEGIATAN</div>
                            <div class="cms-stat-card__value" id="stat-total-events">0</div>
                            <div class="cms-stat-card__sub" id="stat-upcoming-events">0 Sesi Akan Datang</div>
                        </div>
                        <span class="cms-stat-card__arrow">→</span>
                    </div>

                    <div class="cms-stat-card" data-stat-tab="gallery" role="button" tabindex="0" title="Buka Tab Galeri">
                        <div class="cms-stat-card__icon"
                            style="background: rgba(255, 82, 56, 0.14); color: var(--color-coral);">📸</div>
                        <div class="cms-stat-card__info">
                            <div class="cms-stat-card__label">MOMEN GALERI</div>
                            <div class="cms-stat-card__value" id="stat-total-gallery">0</div>
                            <div class="cms-stat-card__sub">Foto Dokumentasi</div>
                        </div>
                        <span class="cms-stat-card__arrow">→</span>
                    </div>

                    <div class="cms-stat-card" data-stat-tab="officials" role="button" tabindex="0" title="Buka Tab Pengurus">
                        <div class="cms-stat-card__icon" style="background: rgba(2, 83, 53, 0.14); color: var(--color-primary-dark);">👔</div>
                        <div class="cms-stat-card__info">
                            <div class="cms-stat-card__label">PENGURUS BBC</div>
                            <div class="cms-stat-card__value" id="stat-total-officials">0</div>
                            <div class="cms-stat-card__sub">Struktur Kepengurusan</div>
                        </div>
                        <span class="cms-stat-card__arrow">→</span>
                    </div>

                    <div class="cms-stat-card" data-stat-tab="articles" role="button" tabindex="0" title="Buka Tab Berita">
                        <div class="cms-stat-card__icon" style="background: rgba(43, 147, 226, 0.15); color: #1E6EB8;">📰
                        </div>
                        <div class="cms-stat-card__info">
                            <div class="cms-stat-card__label">BERITA &amp; ARTIKEL</div>
                            <div class="cms-stat-card__value" id="stat-total-articles">0</div>
                            <div class="cms-stat-card__sub">Publikasi Lapangan</div>
                        </div>
                        <span class="cms-stat-card__arrow">→</span>
                    </div>
                </div>

                <!-- Dashboard Sections: Module Jump Cards & System Status -->
                <div class="cms-dashboard-sections-grid">
                    <!-- Module Shortcut List -->
                    <div class="cms-dash-widget">
                        <div class="cms-dash-widget__header">
                            <h3 class="cms-dash-widget__title">📌 PUSAT NAVIGASI MODUL</h3>
                            <span class="pixel-badge pixel-badge--yellow">7 MODUL PENGELOLA</span>
                        </div>
                        <div class="cms-dash-modules-list">
                            <div class="cms-dash-module-item" data-stat-tab="players" role="button" tabindex="0">
                                <span class="cms-dash-module-icon">🏸</span>
                                <div class="cms-dash-module-info">
                                    <div class="cms-dash-module-title">Manajemen Pemain Roster</div>
                                    <div class="cms-dash-module-desc">Tambah, edit foto/data pemain Amilin dan Amilat.</div>
                                </div>
                                <span class="cms-dash-module-btn">BUKA TAB →</span>
                            </div>
                            <div class="cms-dash-module-item" data-stat-tab="events" role="button" tabindex="0">
                                <span class="cms-dash-module-icon">📅</span>
                                <div class="cms-dash-module-info">
                                    <div class="cms-dash-module-title">Jadwal &amp; Agenda Lapangan</div>
                                    <div class="cms-dash-module-desc">Jadwalkan sesi latihan rutin dan pertandingan persahabatan.</div>
                                </div>
                                <span class="cms-dash-module-btn">BUKA TAB →</span>
                            </div>
                            <div class="cms-dash-module-item" data-stat-tab="gallery" role="button" tabindex="0">
                                <span class="cms-dash-module-icon">📸</span>
                                <div class="cms-dash-module-info">
                                    <div class="cms-dash-module-title">Dokumentasi Galeri Foto</div>
                                    <div class="cms-dash-module-desc">Upload momen smash, keseruan tanding, dan kebersamaan.</div>
                                </div>
                                <span class="cms-dash-module-btn">BUKA TAB →</span>
                            </div>
                            <div class="cms-dash-module-item" data-stat-tab="articles" role="button" tabindex="0">
                                <span class="cms-dash-module-icon">📰</span>
                                <div class="cms-dash-module-info">
                                    <div class="cms-dash-module-title">Berita &amp; Publikasi Kegiatan</div>
                                    <div class="cms-dash-module-desc">Tulis artikel, liputan turnamen, dan pengumuman klub.</div>
                                </div>
                                <span class="cms-dash-module-btn">BUKA TAB →</span>
                            </div>
                            <div class="cms-dash-module-item" data-stat-tab="hero" role="button" tabindex="0">
                                <span class="cms-dash-module-icon">🎬</span>
                                <div class="cms-dash-module-info">
                                    <div class="cms-dash-module-title">Kustomisasi Media Hero</div>
                                    <div class="cms-dash-module-desc">Atur foto dan video banner utama di homepage website.</div>
                                </div>
                                <span class="cms-dash-module-btn">BUKA TAB →</span>
                            </div>
                            <div class="cms-dash-module-item" data-stat-tab="officials" role="button" tabindex="0">
                                <span class="cms-dash-module-icon">👔</span>
                                <div class="cms-dash-module-info">
                                    <div class="cms-dash-module-title">Struktur Pengurus BBC</div>
                                    <div class="cms-dash-module-desc">Kelola nama, jabatan, foto, dan susunan organisasi.</div>
                                </div>
                                <span class="cms-dash-module-btn">BUKA TAB →</span>
                            </div>
                            <div class="cms-dash-module-item" data-stat-tab="backup" role="button" tabindex="0">
                                <span class="cms-dash-module-icon">💾</span>
                                <div class="cms-dash-module-info">
                                    <div class="cms-dash-module-title">Backup &amp; Restore Database</div>
                                    <div class="cms-dash-module-desc">Unduh cadangan data JSON dan pulihkan kapan saja.</div>
                                </div>
                                <span class="cms-dash-module-btn">BUKA TAB →</span>
                            </div>
                        </div>
                    </div>

                    <!-- System Status & Helpful Tips -->
                    <div class="cms-dash-widget">
                        <div class="cms-dash-widget__header">
                            <h3 class="cms-dash-widget__title">ℹ️ STATUS SISTEM &amp; TIPS</h3>
                            <span class="pixel-badge pixel-badge--green">STATUS: SIAP</span>
                        </div>
                        <div class="cms-dash-status-box">
                            <div class="cms-dash-status-row">
                                <span class="cms-dash-status-lbl">Penyimpanan Lokal:</span>
                                <span class="pixel-badge pixel-badge--green">BROWSER STORAGE (AKTIF)</span>
                            </div>
                            <div class="cms-dash-status-row">
                                <span class="cms-dash-status-lbl">Live Synchronization:</span>
                                <span class="pixel-badge pixel-badge--yellow">OTOMATIS TERSINKRON</span>
                            </div>
                            <div class="cms-dash-status-row">
                                <span class="cms-dash-status-lbl">Akses Pengelola:</span>
                                <span class="cms-status-indicator"><span class="cms-status-indicator__dot"></span> ADMIN TERAUTENTIKASI</span>
                            </div>
                        </div>

                        <div class="cms-dash-tips-card">
                            <div class="cms-dash-tips-title">💡 TIPS PENGELOLAAN DATA:</div>
                            <ul class="cms-dash-tips-list">
                                <li>Setiap perubahan data (pemain, jadwal, foto, berita) langsung otomatis tampil di <strong>Website Utama</strong> secara instan.</li>
                                <li>Gunakan tombol <strong>Backup &amp; Restore</strong> untuk mengekspor cadangan database JSON secara berkala.</li>
                                <li>Pemain tanpa foto akan otomatis diberikan avatar anime retro resmi (Amilin pria &amp; Amilat hijab wanita).</li>
                            </ul>
                        </div>

                        <div style="margin-top: 16px;">
                            <a href="../index.php" class="btn btn-primary cms-dash-preview-btn">
                                <span>🌐 PRATINJAU WEBSITE UTAMA SEKARANG</span>
                                <span>↗</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ==========================================
                 TAB 1: DAFTAR PEMAIN (AMILIN & AMILAT)
                 ========================================== -->
            <section id="pane-players" class="cms-tab-pane" style="display: none;">
                <div class="cms-card cms-card--players">
                    <div class="cms-card__header">
                        <div>
                            <div class="pixel-badge pixel-badge--green" style="font-size: 0.65rem; margin-bottom: 6px;">
                                DATA MASTER // ROSTER</div>
                            <h2 class="cms-card__title">🏸 MANAJEMEN PEMAIN BBC</h2>
                            <div class="cms-card__desc">Kelola seluruh skuad pemain Amilin dan Amilat, statistik performa, dan daftar prestasi.</div>
                        </div>
                        <button type="button" class="btn btn-primary btn-sm" id="btn-add-player">
                            <span>+ TAMBAH PEMAIN BARU</span>
                        </button>
                    </div>

                    <!-- Command Toolbar -->
                    <div class="cms-toolbar">
                        <div class="cms-toolbar__filters">
                            <div class="cms-search-box">
                                <span class="cms-search-icon">🔍</span>
                                <input type="text" id="search-players" class="cms-input"
                                    placeholder="Cari nama pemain...">
                            </div>
                            <select id="filter-player-gender" class="cms-select" style="max-width: 220px;">
                                <option value="all">🏸 Semua Kategori</option>
                                <option value="male">🏸 Hanya Amilin</option>
                                <option value="female">🏸 Hanya Amilat</option>
                            </select>
                        </div>
                        <div class="pixel-badge pixel-badge--dark" style="font-size: 0.65rem;">
                            AUTO-SYNCED
                        </div>
                    </div>

                    <div class="cms-table-wrapper">
                        <table class="cms-table">
                            <thead>
                                <tr>
                                    <th style="width: 60px;">FOTO</th>
                                    <th>NAMA LENGKAP</th>
                                    <th>KATEGORI</th>
                                    <th style="width: 140px; text-align: center;">👑 POTM</th>
                                    <th>STATISTIK PERFORMA</th>
                                    <th>PRESTASI</th>
                                    <th style="width: 200px; text-align: center;">AKSI</th>
                                </tr>
                            </thead>
                            <tbody id="table-players-body">
                                <!-- Populated by cms.js -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ==========================================
                 TAB 2: JADWAL & KEGIATAN (EVENTS)
                 ========================================== -->
            <section id="pane-events" class="cms-tab-pane" style="display: none;">
                <div class="cms-card cms-card--events">
                    <div class="cms-card__header">
                        <div>
                            <div class="pixel-badge pixel-badge--yellow"
                                style="font-size: 0.65rem; margin-bottom: 6px;">DATA MASTER // SCHEDULE</div>
                            <h2 class="cms-card__title">📅 MANAJEMEN JADWAL &amp; KEGIATAN</h2>
                            <div class="cms-card__desc">Kelola sesi latihan rutin, laga persahabatan, dan turnamen
                                internal BBC.</div>
                        </div>
                        <button type="button" class="btn btn-primary btn-sm" id="btn-add-event">
                            <span>+ TAMBAH JADWAL BARU</span>
                        </button>
                    </div>

                    <!-- Command Toolbar -->
                    <div class="cms-toolbar">
                        <div class="cms-toolbar__filters">
                            <div class="pixel-label" style="margin: 0; color: var(--cms-dark);">
                                ⚡ DAFTAR SESI LAPANGAN AKTIF
                            </div>
                        </div>
                        <div class="pixel-badge pixel-badge--yellow" style="font-size: 0.65rem;">
                            LIVE AGENDA
                        </div>
                    </div>

                    <div class="cms-table-wrapper">
                        <table class="cms-table">
                            <thead>
                                <tr>
                                    <th>TANGGAL &amp; WAKTU</th>
                                    <th>JUDUL KEGIATAN</th>
                                    <th>TIPE AGENDA</th>
                                    <th>VENUE / LOKASI</th>
                                    <th>STATUS</th>
                                    <th style="width: 140px; text-align: center;">AKSI</th>
                                </tr>
                            </thead>
                            <tbody id="table-events-body">
                                <!-- Populated by cms.js -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ==========================================
                 TAB 3: FOTO KEGIATAN (GALLERY)
                 ========================================== -->
            <section id="pane-gallery" class="cms-tab-pane" style="display: none;">
                <div class="cms-card cms-card--gallery">
                    <div class="cms-card__header">
                        <div>
                            <div class="pixel-badge pixel-badge--coral" style="font-size: 0.65rem; margin-bottom: 6px;">
                                DATA MASTER // MOMENTS</div>
                            <h2 class="cms-card__title">📸 GALERI FOTO KEGIATAN</h2>
                            <div class="cms-card__desc">Kelola foto-foto keseruan latihan dan pertandingan yang tampil
                                di beranda BBC Moments.</div>
                        </div>
                        <button type="button" class="btn btn-primary btn-sm" id="btn-add-gallery">
                            <span>+ TAMBAH FOTO BARU</span>
                        </button>
                    </div>

                    <div class="cms-gallery-grid" id="grid-gallery-body">
                        <!-- Populated by cms.js -->
                    </div>
                </div>
            </section>

            <!-- ==========================================
                 TAB 4: BERITA & ARTIKEL
                 ========================================== -->
            <section id="pane-articles" class="cms-tab-pane" style="display: none;">
                <div class="cms-card cms-card--articles">
                    <div class="cms-card__header">
                        <div>
                            <div class="pixel-badge pixel-badge--blue" style="font-size: 0.65rem; margin-bottom: 6px;">
                                DATA MASTER // NEWS &amp; ARTICLES</div>
                            <h2 class="cms-card__title">📰 MANAJEMEN BERITA &amp; ARTIKEL</h2>
                            <div class="cms-card__desc">Kelola liputan turnamen, artikel tips bulutangkis, dan cerita
                                lapangan.</div>
                        </div>
                        <button type="button" class="btn btn-primary btn-sm" id="btn-add-article">
                            <span>+ TAMBAH ARTIKEL BARU</span>
                        </button>
                    </div>

                    <div class="cms-table-wrapper">
                        <table class="cms-table">
                            <thead>
                                <tr>
                                    <th style="width: 60px;">COVER</th>
                                    <th>JUDUL ARTIKEL</th>
                                    <th>KATEGORI</th>
                                    <th>TANGGAL</th>
                                    <th>WAKTU BACA</th>
                                    <th style="width: 140px; text-align: center;">AKSI</th>
                                </tr>
                            </thead>
                            <tbody id="table-articles-body">
                                <!-- Populated by cms.js -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ==========================================
                 TAB 5: PENGURUS BBC PERIODE SAAT INI
                 ========================================== -->
            <section id="pane-officials" class="cms-tab-pane" style="display: none;">
                <div class="cms-card cms-card--players">
                    <div class="cms-card__header">
                        <div>
                            <div class="pixel-badge pixel-badge--green" style="font-size: 0.65rem; margin-bottom: 6px;">
                                DATA MASTER // LEADERSHIP</div>
                            <h2 class="cms-card__title">👔 PENGURUS BBC PERIODE SAAT INI</h2>
                            <div class="cms-card__desc">Kelola susunan pengurus yang tampil di halaman Profil BBC —
                                tambah, edit, atau hapus sesuai periode kepengurusan berjalan.</div>
                        </div>
                        <button type="button" class="btn btn-primary btn-sm" id="btn-add-official">
                            <span>+ TAMBAH PENGURUS</span>
                        </button>
                    </div>

                    <div class="cms-table-wrapper">
                        <table class="cms-table">
                            <thead>
                                <tr>
                                    <th style="width: 60px;">FOTO</th>
                                    <th>NAMA</th>
                                    <th>JABATAN</th>
                                    <th>PERIODE</th>
                                    <th style="width: 140px; text-align: center;">AKSI</th>
                                </tr>
                            </thead>
                            <tbody id="table-officials-body">
                                <!-- Populated by cms.js -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- ==========================================
                 TAB 6: BACKUP & DATABASE
                 ========================================== -->
            <section id="pane-backup" class="cms-tab-pane" style="display: none;">

                <!-- ============================================================
                     PANEL: SIMPAN KE FOLDER PROYEK (File System Access API)
                     ============================================================ -->
                <div class="cms-card" style="border-top: 6px solid #059669; background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); margin-bottom: 0;">
                    <div style="display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 260px;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                <div class="pixel-badge" style="background: #059669; color: white;">
                                    📁 SIMPAN KE FOLDER PROYEK
                                </div>
                                <span class="pixel-badge" id="fs-folder-status" style="font-size: 0.6rem; padding: 2px 8px; background: #9CA3AF; color: white;">
                                    ⏳ MENDETEKSI...
                                </span>
                            </div>
                            <h3 class="cms-backup-title" style="color: #065F46;">SINKRONISASI OTOMATIS KE FILE LOKAL</h3>
                            <p class="cms-backup-desc" style="color: #064E3B; font-weight: 500;">
                                Dengan <strong>File System Access API</strong>, setiap data yang diinput/diedit di CMS
                                dapat otomatis tersimpan langsung ke file di komputer Anda — tanpa perlu tombol Export manual.
                                Cukup klik <strong>"Setup Folder Proyek"</strong> sekali, lalu commit &amp; push ke GitHub.
                            </p>

                            <!-- Status folder yang dipilih -->
                            <div id="fs-folder-name" style="font-size: 0.82rem; font-weight: 700; color: #064E3B; background: white; border: 2px solid #059669; border-radius: 8px; padding: 8px 12px; margin: 12px 0; word-break: break-all;">
                                ⏳ Mendeteksi status folder...
                            </div>

                            <!-- Tombol aksi -->
                            <div class="cms-btn-group" style="flex-wrap: wrap; gap: 8px; justify-content: flex-start;">
                                <button type="button" class="btn btn-primary" id="btn-setup-fs-folder"
                                    style="background: #059669; border-color: #064E3B; box-shadow: 3px 3px 0 #064E3B;">
                                    <span>📂 Setup Folder Proyek</span>
                                </button>
                                <button type="button" class="btn btn-primary" id="btn-fs-sync-all"
                                    style="display: none; background: #1D4ED8; border-color: #1E3A8A; box-shadow: 3px 3px 0 #1E3A8A;">
                                    <span>🔄 Sync Semua ke File</span>
                                </button>
                                <button type="button" class="btn btn-sm" id="btn-clear-fs-folder"
                                    style="display: none; background: white; color: #6B7280; border: 2px solid #D1D5DB; box-shadow: 2px 2px 0 #9CA3AF; font-weight: 700;">
                                    <span>🔓 Lepas Folder</span>
                                </button>
                            </div>

                            <div style="margin-top: 10px; font-size: 0.75rem; color: #6B7280; font-weight: 500;">
                                ⚠️ Fitur ini membutuhkan <strong>Chrome / Edge versi terbaru</strong>. Firefox belum mendukung File System Access API.
                            </div>
                        </div>

                        <!-- Info struktur file yang akan disimpan -->
                        <div style="background: white; border: 3px solid #059669; border-radius: 10px; padding: 16px; min-width: 200px; max-width: 260px;">
                            <div style="font-size: 0.7rem; font-weight: 800; color: #059669; letter-spacing: 0.05em; margin-bottom: 8px;">📋 FILE YANG TERSIMPAN OTOMATIS</div>
                            <pre style="font-size: 0.72rem; color: #374151; margin: 0; line-height: 1.8; font-family: 'Courier New', monospace;">bbc-website/
├── data/           📄
│   ├── players.json
│   ├── events.json
│   ├── gallery.json
│   ├── articles.json
│   ├── officials.json
│   └── hero.json
└── assets/
    └── images/     🖼️
        ├── players/
        ├── gallery/
        └── news/</pre>
                        </div>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="cms-card cms-card--backup">
                        <div class="pixel-badge pixel-badge--green" style="margin-bottom: 8px;">DATA BACKUP</div>
                        <h3 class="cms-backup-title">UNDUH CADANGAN DATA (JSON)</h3>
                        <p class="cms-backup-desc">
                            Simpan seluruh data pemain, jadwal, foto kegiatan, dan artikel ke dalam file JSON di
                            komputer Anda agar data aman dan bisa dipindahkan ke perangkat lain.
                        </p>
                        <button type="button" class="btn btn-primary" id="btn-export-backup">
                            <span>💾 UNDUH BACKUP JSON</span>
                        </button>
                    </div>

                    <div class="cms-card cms-card--backup">
                        <div class="pixel-badge pixel-badge--blue" style="margin-bottom: 8px;">RESTORE DATA</div>
                        <h3 class="cms-backup-title">PULIHKAN DATA DARI FILE JSON</h3>
                        <p class="cms-backup-desc">
                            Unggah file JSON backup yang pernah Anda unduh untuk memulihkan seluruh data secara instan
                            ke dalam browser ini.
                        </p>
                        <input type="file" id="input-import-backup" accept=".json" style="display: none;">
                        <button type="button" class="btn btn-outline"
                            onclick="document.getElementById('input-import-backup').click()"
                            style="border-color: var(--cms-dark);">
                            <span>📂 PILIH FILE BACKUP...</span>
                        </button>
                    </div>
                </div>


                <!-- ============================================================
                     PANEL: DATABASE MARIADB & PHP REST API (REAL-TIME CRUD)
                     ============================================================ -->
                <div class="cms-card" id="mysql-db-panel"
                    style="border-top: 6px solid #009B63; background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%); margin-top: 0; box-shadow: 4px 4px 0 var(--cms-dark);">

                    <!-- Header -->
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
                        <div class="pixel-badge pixel-badge--green" style="font-size: 0.75rem;">
                            🗄️ DATABASE MARIADB (PHP REST API)
                        </div>
                        <span class="pixel-badge" id="db-status-badge"
                            style="font-size: 0.65rem; padding: 3px 10px; background: #64748B; color: white;">
                            ⏳ MEMERIKSA KONEKSI API...
                        </span>
                        <span class="pixel-badge pixel-badge--yellow" id="db-host-badge"
                            style="font-size: 0.65rem; display: none;">
                            HOST: -
                        </span>
                    </div>

                    <h3 class="cms-backup-title" style="color: #065F46; font-size: 1.25rem;">SINKRONISASI DATABASE MARIADB SERVERLESS</h3>
                    <p class="cms-backup-desc" style="color: #047857; font-weight: 500; line-height: 1.6;">
                        Setiap aksi <strong>Tambah, Edit, dan Hapus</strong> data (pemain, jadwal, galeri, berita, pengurus, media hero) melalui CMS akan otomatis tersimpan langsung ke database MariaDB (atau MySQL) secara instan melalui <strong>Serverless PHP REST API (<code>/api/*</code>)</strong> tanpa perlu build ulang di Vercel.
                    </p>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 18px 0;">
                        <!-- Status Card -->
                        <div style="background: white; border: 2.5px solid #009B63; border-radius: 10px; padding: 16px; box-shadow: 2.5px 2.5px 0 var(--cms-dark);">
                            <div style="font-size: 0.72rem; font-weight: 800; color: #065F46; letter-spacing: 0.05em; margin-bottom: 10px;">
                                📊 STATUS KONEKSI SERVER &amp; DB
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.82rem;">
                                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #E2E8F0; padding-bottom: 6px;">
                                    <span style="color: #64748B;">Backend Engine:</span>
                                    <strong id="db-info-engine" style="color: #0D1612;">PHP 8.2 Serverless (Vercel)</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #E2E8F0; padding-bottom: 6px;">
                                    <span style="color: #64748B;">Koneksi Database:</span>
                                    <strong id="db-info-connected" style="color: #D97706;">Memeriksa...</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #E2E8F0; padding-bottom: 6px;">
                                    <span style="color: #64748B;">Database Host:</span>
                                    <code id="db-info-host" style="font-size: 0.75rem; background: #F1F5F9; padding: 2px 6px; border-radius: 4px;">-</code>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #64748B;">Endpoint Kesehatan:</span>
                                    <a href="../api/health.php" target="_blank" rel="noopener" style="color: #009B63; font-weight: 700; text-decoration: underline;">/api/health.php ↗</a>
                                </div>
                            </div>
                        </div>

                        <!-- Action Card -->
                        <div style="background: white; border: 2.5px solid #0D1612; border-radius: 10px; padding: 16px; box-shadow: 2.5px 2.5px 0 var(--cms-dark); display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.72rem; font-weight: 800; color: #0D1612; letter-spacing: 0.05em; margin-bottom: 8px;">
                                    ⚡ MIGRASI DATA AWAL (SEEDER)
                                </div>
                                <p style="font-size: 0.78rem; color: #475569; line-height: 1.5; margin: 0 0 12px 0;">
                                    Belum ada data di database MariaDB baru Anda? Jalankan seeder 1-klik untuk mengimpor seluruh data roster, jadwal, pengurus, galeri, berita, dan konfigurasi hero bawaan ke MariaDB.
                                </p>
                            </div>

                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <button type="button" id="btn-seed-database" class="btn btn-primary btn-sm"
                                    style="flex: 1; min-width: 170px; justify-content: center; background: #009B63; border-color: #0D1612; box-shadow: 3px 3px 0 #0D1612; font-size: 0.82rem; padding: 10px 14px;">
                                    <span>⚡ SINKRONKAN / SEED KE MARIADB</span>
                                </button>
                                <button type="button" id="btn-test-db" class="btn btn-outline btn-sm"
                                    style="border-color: #0D1612; font-size: 0.8rem; padding: 10px 14px;">
                                    <span>🔄 CEK KONEKSI</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Environment Variable Guide -->
                    <div style="background: #FEF9C3; border: 2px solid #CA8A04; border-radius: 8px; padding: 12px 14px; font-size: 0.75rem; color: #854D0E; line-height: 1.6;">
                        <strong>💡 Konfigurasi Database Vercel:</strong> Pastikan Anda telah menambahkan Environment Variables pada Vercel Dashboard (Settings → Environment Variables):<br>
                        <code>DB_HOST</code>, <code>DB_PORT</code> (default: 3306), <code>DB_NAME</code>, <code>DB_USER</code>, <code>DB_PASS</code>, dan <code>DB_SSL</code> (true untuk Aiven MariaDB / SkySQL / cloud database ber-SSL).
                    </div>
                </div>

                <!-- ============================================================
                     PANEL: VERCEL BLOB DATABASE & MEDIA STORAGE (bbc-baznas-db)
                     ============================================================ -->
                <div class="cms-card" id="vercel-blob-panel"
                    style="border-top: 6px solid #0284C7; background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); margin-top: 18px; box-shadow: 4px 4px 0 var(--cms-dark);">

                    <!-- Header -->
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
                        <div class="pixel-badge" style="background: #0284C7; color: white; font-size: 0.75rem;">
                            ☁️ VERCEL BLOB (bbc-baznas-db)
                        </div>
                        <span class="pixel-badge" id="blob-status-badge"
                            style="font-size: 0.65rem; padding: 3px 10px; background: #64748B; color: white;">
                            ⏳ MEMERIKSA VERCEL BLOB...
                        </span>
                        <span class="pixel-badge pixel-badge--yellow" id="blob-store-badge"
                            style="font-size: 0.65rem;">
                            STORE: bbc-baznas-db
                        </span>
                    </div>

                    <h3 class="cms-backup-title" style="color: #0369A1; font-size: 1.25rem;">PENYIMPANAN DATA &amp; MEDIA CLOUD VERCEL BLOB</h3>
                    <p class="cms-backup-desc" style="color: #0284C7; font-weight: 500; line-height: 1.6;">
                        Terkoneksi langsung ke Vercel Blob store <strong><code>bbc-baznas-db</code></strong> menggunakan SDK resmi <code>@vercel/blob</code>. Seluruh file gambar avatar, foto aksi pemain, cover artikel, dan file data JSON tersimpan secara permanen pada CDN global Vercel tanpa batasan ukuran payload memori lokal.
                    </p>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 18px 0;">
                        <!-- Status Card -->
                        <div style="background: white; border: 2.5px solid #0284C7; border-radius: 10px; padding: 16px; box-shadow: 2.5px 2.5px 0 var(--cms-dark);">
                            <div style="font-size: 0.72rem; font-weight: 800; color: #0369A1; letter-spacing: 0.05em; margin-bottom: 10px;">
                                📊 STATUS VERCEL BLOB STORE
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.82rem;">
                                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #E2E8F0; padding-bottom: 6px;">
                                    <span style="color: #64748B;">Blob Store Name:</span>
                                    <strong style="color: #0D1612;">bbc-baznas-db</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #E2E8F0; padding-bottom: 6px;">
                                    <span style="color: #64748B;">Status Koneksi:</span>
                                    <strong id="blob-info-connected" style="color: #D97706;">Memeriksa...</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #E2E8F0; padding-bottom: 6px;">
                                    <span style="color: #64748B;">Total File Tersimpan:</span>
                                    <strong id="blob-info-count" style="color: #0D1612;">-</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #64748B;">Endpoint Status:</span>
                                    <a href="../api/blob/status" target="_blank" rel="noopener" style="color: #0284C7; font-weight: 700; text-decoration: underline;">/api/blob/status ↗</a>
                                </div>
                            </div>
                        </div>

                        <!-- Action Card -->
                        <div style="background: white; border: 2.5px solid #0D1612; border-radius: 10px; padding: 16px; box-shadow: 2.5px 2.5px 0 var(--cms-dark); display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.72rem; font-weight: 800; color: #0D1612; letter-spacing: 0.05em; margin-bottom: 8px;">
                                    ⚡ SINKRONKAN SEMUA DATA KE BLOB
                                </div>
                                <p style="font-size: 0.78rem; color: #475569; line-height: 1.5; margin: 0 0 12px 0;">
                                    Unggah seluruh database JSON lokal (pemain, jadwal, pengurus, galeri, berita, hero) sekaligus ke Vercel Blob store <code>bbc-baznas-db</code> dalam 1-klik.
                                </p>
                            </div>

                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <button type="button" id="btn-seed-blob" class="btn btn-primary btn-sm"
                                    style="flex: 1; min-width: 170px; justify-content: center; background: #0284C7; border-color: #0D1612; box-shadow: 3px 3px 0 #0D1612; font-size: 0.82rem; padding: 10px 14px;">
                                    <span>⚡ SEED KE VERCEL BLOB</span>
                                </button>
                                <button type="button" id="btn-test-blob" class="btn btn-outline btn-sm"
                                    style="border-color: #0D1612; font-size: 0.8rem; padding: 10px 14px;">
                                    <span>🔄 CEK STATUS</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style="background: #E0F2FE; border: 2px solid #38BDF8; border-radius: 8px; padding: 12px 14px; font-size: 0.75rem; color: #0369A1; line-height: 1.6;">
                        <strong>💡 Konfigurasi Vercel Blob:</strong> Pastikan Anda telah mengaitkan store <code>bbc-baznas-db</code> di Vercel Dashboard (Storage → Blob → Connect to Project). Variabel <code>BLOB_READ_WRITE_TOKEN</code> dan <code>db_STORE_ID</code> otomatis terkonfigurasi.
                    </div>
                </div>

                <!-- Panel Export JSON lama (tetap ada sebagai alternatif) -->
                <details style="margin: 0;">
                    <summary style="cursor: pointer; padding: 12px 16px; background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 8px; font-size: 0.82rem; font-weight: 700; color: #475569; list-style: none; display: flex; align-items: center; gap: 8px;">
                        <span>📦</span> <span>Export JSON Manual (alternatif jika tidak menggunakan GitHub API)</span>
                        <span style="margin-left: auto; font-size: 0.7rem; color: #94A3B8;">▼ klik untuk buka</span>
                    </summary>
                    <div style="border: 2px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px; padding: 16px; background: white;">
                        <p style="font-size: 0.82rem; color: #64748B; margin-bottom: 12px;">
                            Download semua file JSON → copy ke folder <code>data/</code> di repository → commit &amp; push secara manual.
                        </p>
                        <button type="button" class="btn btn-primary" id="btn-export-json-files"
                            style="background: #7C3AED; border-color: #1E1B4B; box-shadow: 4px 4px 0 #1E1B4B;">
                            <span>📦 EXPORT JSON FILES (6 FILE)</span>
                        </button>
                        <p style="font-size: 0.72rem; color: #9CA3AF; margin-top: 8px;">
                            File: players.json, events.json, gallery.json, articles.json, officials.json, hero.json
                        </p>
                    </div>
                </details>



                <div class="cms-card"
                    style="border-color: var(--cms-coral); border-top: 6px solid var(--cms-coral); background: #FFF9F8;">
                    <div class="pixel-badge pixel-badge--coral" style="margin-bottom: 8px;">PENGATURAN AWAL / RESET
                    </div>
                    <h3 class="cms-backup-title" style="color: var(--cms-coral);">RESET KE DATA DEFAULT PABRIK</h3>
                    <p class="cms-backup-desc" style="color: var(--cms-dark);">
                        Tindakan ini akan mengembalikan seluruh database ke data bawaan awal (default roster, jadwal
                        resmi, dan berita default). Perubahan kustom yang belum dibackup akan terhapus.
                    </p>
                    <button type="button" class="btn btn-sm" id="btn-reset-defaults"
                        style="background: var(--cms-coral); color: white; border-color: var(--cms-dark); font-weight: 800;">
                        <span>⚠️ RESET KE DATA BAWAAN</span>
                    </button>
                </div>
            </section>

            <!-- ==========================================
                 TAB 6: HERO SECTION PHOTOS
                 ========================================== -->
            <section id="pane-hero" class="cms-tab-pane" style="display: none;">
                <div class="cms-card cms-card--hero" style="border-top: 6px solid #7C3AED;">
                    <div class="cms-card__header">
                        <div>
                            <div class="pixel-badge"
                                style="background:#7C3AED;color:#fff;font-size:0.65rem;margin-bottom:6px;">PENGATURAN
                                TAMPILAN // HERO</div>
                            <h2 class="cms-card__title">🎬 MEDIA HERO BERANDA (FOTO / VIDEO)</h2>
                            <div class="cms-card__desc">Edit foto/video utama dan 2 foto mini (thumbnail) yang tampil di hero
                                section beranda website. Media utama bisa berupa foto atau video (MP4/YouTube/Upload).</div>
                        </div>
                        <div style="display:flex;gap:10px;">
                            <button type="button" class="btn btn-sm" id="btn-hero-reset"
                                style="background:#FFF1F2;color:#E11D48;border:2px solid #E11D48;font-weight:800;">
                                ↩ RESET DEFAULT
                            </button>
                        </div>
                    </div>

                    <!-- Live Preview Panel -->
                    <div class="cms-hero-preview" id="hero-live-preview">
                        <div class="cms-hero-preview__label">
                            <span class="pixel-badge pixel-badge--green" style="font-size:0.6rem;">PREVIEW
                                LANGSUNG</span>
                        </div>
                        <div class="cms-hero-preview__frame">
                            <div class="cms-hero-preview__main" id="hero-preview-main-wrap">
                                <img id="hero-preview-main" src="" alt=""
                                    style="width:100%;height:100%;object-fit:cover;">
                                <span class="cms-hero-preview__sticker" id="hero-preview-main-label"></span>
                            </div>
                            <div class="cms-hero-preview__thumbs">
                                <div class="cms-hero-preview__thumb">
                                    <img id="hero-preview-thumb1" src="" alt=""
                                        style="width:100%;height:100%;object-fit:cover;">
                                    <span class="cms-hero-preview__thumb-label" id="hero-preview-thumb1-label"></span>
                                </div>
                                <div class="cms-hero-preview__thumb">
                                    <img id="hero-preview-thumb2" src="" alt=""
                                        style="width:100%;height:100%;object-fit:cover;">
                                    <span class="cms-hero-preview__thumb-label" id="hero-preview-thumb2-label"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form id="form-hero" novalidate style="margin-top: 24px;">

                        <!-- === ACCORDION 1: MEDIA UTAMA (FOTO ATAU VIDEO) === -->
                        <div class="cms-hero-accordion is-open" id="hero-acc-main"
                            style="border: 2.5px solid #7C3AED; border-radius: 8px; margin-bottom: 18px; background: #FAF5FF; overflow: hidden; box-shadow: 3px 3px 0 var(--cms-dark);">
                            <button type="button" class="cms-hero-acc-header" onclick="window.toggleHeroAccordion('hero-acc-main')"
                                style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: none; border: none; cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                    <span class="pixel-badge" style="background:#7C3AED;color:#fff;font-size:0.65rem;">🎬 MEDIA UTAMA (HERO BESAR)</span>
                                    <span class="cms-hero-acc-subtitle">Foto / Video Banner Utama</span>
                                </div>
                                <span class="cms-hero-acc-arrow" style="font-family: var(--font-pixel); font-size: 0.72rem; color: #7C3AED;">▼</span>
                            </button>
                            <div class="cms-hero-acc-body" style="padding: 0 18px 18px 18px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px; border-top: 1.5px dashed #DDD6FE; padding-top: 14px;">
                                    <div class="cms-hero-acc-tip">
                                        Pilih tipe media yang akan aktif tampil di Beranda:
                                    </div>
                                    <div style="display:flex; gap:6px; align-items:center; background:#EDE9FE; padding:4px; border:2.5px solid #7C3AED; border-radius:8px;">
                                        <button type="button" id="btn-toggle-hero-image"
                                            onclick="if(window.BBC_applyHeroToggle){window.BBC_applyHeroToggle('image');}"
                                            style="background:#7C3AED; color:#fff; border:none; font-weight:800; font-size:0.82rem; padding:7px 16px; border-radius:6px; cursor:pointer; transition:all 0.2s;">
                                            🖼️ FOTO / GAMBAR
                                        </button>
                                        <button type="button" id="btn-toggle-hero-video"
                                            onclick="if(window.BBC_applyHeroToggle){window.BBC_applyHeroToggle('video');}"
                                            style="background:transparent; color:#7C3AED; border:none; font-weight:800; font-size:0.82rem; padding:7px 16px; border-radius:6px; cursor:pointer; transition:all 0.2s;">
                                            🎬 VIDEO (MP4 / YOUTUBE)
                                        </button>
                                        <!-- Hidden radio elements for state binding -->
                                        <input type="radio" name="hero-media-type" value="image" checked id="hero-type-image" style="display:none;">
                                        <input type="radio" name="hero-media-type" value="video" id="hero-type-video" style="display:none;">
                                    </div>
                                </div>

                                <!-- Input Foto Utama -->
                                <div id="hero-image-fields">
                                    <div class="cms-form-group">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                            <label class="cms-label" for="hero-main-url" style="margin: 0;">URL Foto Utama</label>
                                            <button type="button" class="btn btn-sm" id="btn-delete-main-img"
                                                style="background: #FFF1F2; color: #E11D48; border: 2px solid #E11D48; font-size: 0.72rem; padding: 3px 10px; font-weight: 800;"
                                                title="Hapus / Kosongkan Foto Utama">
                                                🗑️ HAPUS FOTO UTAMA
                                            </button>
                                        </div>
                                        <input type="text" id="hero-main-url" class="cms-input"
                                            placeholder="https://images.unsplash.com/... atau pilih file di bawah">
                                    </div>
                                    <div class="cms-form-group">
                                        <label class="cms-label" for="hero-main-file">📁 Upload File Foto Baru (Kompres Otomatis)</label>
                                        <input type="file" id="hero-main-file" accept="image/*" class="cms-input"
                                            style="padding: 6px; background: #fff;">
                                        <div class="cms-form-hint">Upload foto (JPG, PNG, WebP). Otomatis dikompresi agar ringan dan hemat memori.</div>
                                    </div>
                                </div>

                                <!-- Input Video Utama -->
                                <div id="hero-video-fields" style="display:none;">
                                    <div class="cms-form-group">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                            <label class="cms-label" for="hero-main-video" style="margin: 0;">URL Video (MP4 / WebM / Link YouTube / Shorts)</label>
                                            <button type="button" class="btn btn-sm" id="btn-delete-main-video"
                                                style="background: #FFF1F2; color: #E11D48; border: 2px solid #E11D48; font-size: 0.72rem; padding: 3px 10px; font-weight: 800;"
                                                title="Hapus / Kosongkan Video Utama">
                                                🗑️ HAPUS VIDEO
                                            </button>
                                        </div>
                                        <input type="text" id="hero-main-video" class="cms-input"
                                            placeholder="https://www.youtube.com/watch?v=... atau https://example.com/video.mp4">
                                        <div class="cms-form-hint">Mendukung tautan video YouTube standar, YouTube Shorts, atau file .mp4.</div>
                                    </div>
                                    <div class="cms-form-group">
                                        <label class="cms-label" for="hero-video-file">📁 Upload File Video Lokal (MP4 / WebM)</label>
                                        <input type="file" id="hero-video-file" accept="video/mp4,video/webm" class="cms-input"
                                            style="padding: 6px; background: #fff;">
                                        <div class="cms-form-hint">Maksimal 10MB (otomatis dikonversi Base64 langsung aktif di Vercel & seluruh pengunjung online). Untuk video berdurasi panjang disarankan menggunakan tautan YouTube.</div>
                                    </div>
                                </div>

                                <div class="grid grid-2" style="gap:16px; margin-top:14px;">
                                    <div class="cms-form-group">
                                        <label class="cms-label" for="hero-main-alt">Deskripsi Media (Alt Text)</label>
                                        <input type="text" id="hero-main-alt" class="cms-input"
                                            placeholder="Pemain BBC berlatih di lapangan">
                                    </div>
                                    <div class="cms-form-group">
                                        <label class="cms-label" for="hero-main-label">Label Sticker Pojok Kiri (Kosongkan jika tidak ingin ditampilkan)</label>
                                        <input type="text" id="hero-main-label" class="cms-input"
                                            placeholder="🔥 MATCH POINT!">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- === ACCORDION 2: FOTO THUMBNAIL 1 === -->
                        <div class="cms-hero-accordion" id="hero-acc-thumb1"
                            style="border: 2.5px solid #009B63; border-radius: 8px; margin-bottom: 18px; background: #F0FFF8; overflow: hidden; box-shadow: 3px 3px 0 var(--cms-dark);">
                            <button type="button" class="cms-hero-acc-header" onclick="window.toggleHeroAccordion('hero-acc-thumb1')"
                                style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: none; border: none; cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                    <span class="pixel-badge pixel-badge--green" style="font-size:0.65rem;">📸 FOTO MINI KIRI (THUMBNAIL 1)</span>
                                    <span class="cms-hero-acc-subtitle">Card Thumbnail Lapangan</span>
                                </div>
                                <span class="cms-hero-acc-arrow" style="font-family: var(--font-pixel); font-size: 0.72rem; color: #009B63;">▼</span>
                            </button>
                            <div class="cms-hero-acc-body" style="padding: 0 18px 18px 18px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px; border-top: 1.5px dashed #A7F3D0; padding-top: 14px;">
                                    <span style="font-size: 0.8rem; color: var(--color-grey);">Atur gambar dan label kartu mini kiri</span>
                                    <button type="button" class="btn btn-sm" id="btn-delete-thumb1"
                                        style="background: #FFF1F2; color: #E11D48; border: 2px solid #E11D48; font-size: 0.72rem; padding: 3px 10px; font-weight: 800;"
                                        title="Hapus / Kosongkan Foto Mini 1">
                                        🗑️ HAPUS FOTO MINI 1
                                    </button>
                                </div>

                                <div class="cms-form-group">
                                    <label class="cms-label" for="hero-thumb1-url">URL Foto Thumbnail 1</label>
                                    <input type="text" id="hero-thumb1-url" class="cms-input"
                                        placeholder="https://images.unsplash.com/... (Kosongkan jika ingin disembunyikan)">
                                </div>
                                <div class="cms-form-group">
                                    <label class="cms-label" for="hero-thumb1-file">📁 Upload File Foto Mini 1</label>
                                    <input type="file" id="hero-thumb1-file" accept="image/*" class="cms-input"
                                        style="padding:6px; background: #fff;">
                                </div>
                                <div class="grid grid-2" style="gap:16px;">
                                    <div class="cms-form-group">
                                        <label class="cms-label" for="hero-thumb1-alt">Deskripsi Foto</label>
                                        <input type="text" id="hero-thumb1-alt" class="cms-input"
                                            placeholder="Turnamen Badminton BBC">
                                    </div>
                                    <div class="cms-form-group">
                                        <label class="cms-label" for="hero-thumb1-label">Label Badge Kuning</label>
                                        <input type="text" id="hero-thumb1-label" class="cms-input" placeholder="SPARING">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- === ACCORDION 3: FOTO THUMBNAIL 2 === -->
                        <div class="cms-hero-accordion" id="hero-acc-thumb2"
                            style="border: 2.5px solid #0284C7; border-radius: 8px; margin-bottom: 18px; background: #F0F9FF; overflow: hidden; box-shadow: 3px 3px 0 var(--cms-dark);">
                            <button type="button" class="cms-hero-acc-header" onclick="window.toggleHeroAccordion('hero-acc-thumb2')"
                                style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: none; border: none; cursor: pointer; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                    <span class="pixel-badge pixel-badge--blue" style="font-size:0.65rem;">📸 FOTO MINI KANAN (THUMBNAIL 2)</span>
                                    <span class="cms-hero-acc-subtitle">Card Thumbnail Latihan</span>
                                </div>
                                <span class="cms-hero-acc-arrow" style="font-family: var(--font-pixel); font-size: 0.72rem; color: #0284C7;">▼</span>
                            </button>
                            <div class="cms-hero-acc-body" style="padding: 0 18px 18px 18px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px; border-top: 1.5px dashed #BAE6FD; padding-top: 14px;">
                                    <span style="font-size: 0.8rem; color: var(--color-grey);">Atur gambar dan label kartu mini kanan</span>
                                    <button type="button" class="btn btn-sm" id="btn-delete-thumb2"
                                        style="background: #FFF1F2; color: #E11D48; border: 2px solid #E11D48; font-size: 0.72rem; padding: 3px 10px; font-weight: 800;"
                                        title="Hapus / Kosongkan Foto Mini 2">
                                        🗑️ HAPUS FOTO MINI 2
                                    </button>
                                </div>

                                <div class="cms-form-group">
                                    <label class="cms-label" for="hero-thumb2-url">URL Foto Thumbnail 2</label>
                                    <input type="text" id="hero-thumb2-url" class="cms-input"
                                        placeholder="https://images.unsplash.com/... (Kosongkan jika ingin disembunyikan)">
                                </div>
                                <div class="cms-form-group">
                                    <label class="cms-label" for="hero-thumb2-file">📁 Upload File Foto Mini 2</label>
                                    <input type="file" id="hero-thumb2-file" accept="image/*" class="cms-input"
                                        style="padding:6px; background: #fff;">
                                </div>
                                <div class="grid grid-2" style="gap:16px;">
                                    <div class="cms-form-group">
                                        <label class="cms-label" for="hero-thumb2-alt">Deskripsi Foto</label>
                                        <input type="text" id="hero-thumb2-alt" class="cms-input"
                                            placeholder="Latihan Footwork BBC">
                                    </div>
                                    <div class="cms-form-group">
                                        <label class="cms-label" for="hero-thumb2-label">Label Badge Neon</label>
                                        <input type="text" id="hero-thumb2-label" class="cms-input" placeholder="PRACTICE">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex;gap:12px;justify-content:flex-end;">
                            <button type="button" id="btn-hero-preview" class="btn btn-outline"
                                onclick="if(window.BBC_updateHeroPreview){window.BBC_updateHeroPreview();}"
                                style="border-color:#7C3AED;color:#7C3AED;">
                                👁️ PREVIEW
                            </button>
                            <button type="submit" class="btn btn-primary" id="btn-hero-save">
                                <span>💾 SIMPAN MEDIA HERO (FOTO / VIDEO)</span>
                            </button>
                        </div>
                    </form>
                </div>
            </section>

        </div>
    </main>
        </div><!-- /.cms-main-wrapper -->
    </div><!-- /.cms-app-wrapper -->

    <!-- ==========================================
         MODAL: PEMAIN (CREATE / EDIT)
         ========================================== -->
    <div class="cms-modal-backdrop" id="modal-player">
        <div class="cms-modal">
            <div class="cms-modal__handle" aria-hidden="true"></div>
            <div class="cms-modal__header cms-modal__header--players">
                <h3 class="cms-modal__title" id="modal-player-title">🏸 TAMBAH PEMAIN</h3>
                <button type="button" class="cms-modal__close" data-close-modal>✕</button>
            </div>
            <form id="form-player">
                <div class="cms-modal__body">
                    <input type="hidden" id="player-id">

                    <div class="grid grid-2" style="gap: 16px;">
                        <div class="cms-form-group">
                            <label class="cms-label" for="player-name">Nama Lengkap *</label>
                            <input type="text" id="player-name" class="cms-input" required placeholder="Contoh: Ikrom">
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="player-gender">Kategori Skuad *</label>
                            <select id="player-gender" class="cms-select" required>
                                <option value="male">Amilin (Laki-laki)</option>
                                <option value="female">Amilat (Perempuan)</option>
                            </select>
                        </div>
                    </div>

                    <!-- POTM Checkbox Card -->
                    <div class="cms-potm-form-card">
                        <label
                            style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 800; font-size: 0.95rem; color: #92400E;">
                            <input type="checkbox" id="player-is-potm"
                                style="width: 20px; height: 20px; accent-color: #D97706; cursor: pointer;">
                            <span>👑 JADIKAN PLAYER OF THE MONTH (POTM)</span>
                        </label>
                        <div style="font-size: 0.76rem; color: #B45309; margin-top: 6px; line-height: 1.45;">
                            ✦ <strong>Ketentuan:</strong> Hanya 1 pemain untuk Amilin dan 1 pemain untuk Amilat.
                            Mengaktifkan opsi ini otomatis memindahkan status POTM dari pemain lain pada kategori skuad
                            yang sama.
                        </div>
                    </div>

                    <!-- Player Stats Grid -->
                    <div
                        style="background: #F0FDF4; border: 2.5px solid #15803D; border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 2.5px 2.5px 0px #0D1612;">
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span class="pixel-badge pixel-badge--green" style="font-size: 0.65rem;">📊 STATISTIK
                                PERFORMA PEMAIN</span>
                            <span id="player-stat-winrate-pill" class="pixel-badge pixel-badge--yellow"
                                style="font-size: 0.65rem;">WIN RATE: 0%</span>
                        </div>

                        <div class="grid grid-2" style="gap: 14px;">
                            <div class="cms-form-group">
                                <label class="cms-label" for="player-stat-attendance">📅 Kehadiran (Jumlah Sesi)
                                    *</label>
                                <input type="number" id="player-stat-attendance" class="cms-input" min="0" value="0"
                                    required placeholder="Contoh: 24">
                            </div>
                            <div class="cms-form-group">
                                <label class="cms-label" for="player-stat-matches">🏸 Total Main (Match Dimainkan)
                                    *</label>
                                <input type="number" id="player-stat-matches" class="cms-input" min="0" value="0"
                                    required placeholder="Contoh: 30">
                            </div>
                        </div>

                        <div class="grid grid-2" style="gap: 14px; margin-top: 8px;">
                            <div class="cms-form-group">
                                <label class="cms-label" for="player-stat-wins">⚡ Menang Berapa Kali *</label>
                                <input type="number" id="player-stat-wins" class="cms-input" min="0" value="0" required
                                    placeholder="Contoh: 26">
                            </div>
                            <div class="cms-form-group">
                                <label class="cms-label" for="player-stat-losses">🛡️ Kalah Berapa Kali *</label>
                                <input type="number" id="player-stat-losses" class="cms-input" min="0" value="0"
                                    required placeholder="Contoh: 4">
                            </div>
                        </div>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="player-achievements">Daftar Prestasi (1 baris = 1
                            prestasi)</label>
                        <textarea id="player-achievements" class="cms-textarea"
                            placeholder="Juara 1 Internal Cup 2025&#10;MVP Sparring 2025"></textarea>
                        <div class="cms-form-hint">Tekan Enter untuk menambah prestasi lebih dari satu.</div>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="player-image">Foto Pemain (URL atau Upload Langsung)</label>
                        <input type="url" id="player-image" class="cms-input"
                            placeholder="https://images.unsplash.com/...">
                        <div style="margin-top: 8px;">
                            <input type="file" id="player-file" accept="image/*" class="cms-input"
                                style="padding: 6px;">
                        </div>
                        <div class="cms-image-preview-wrapper">
                            <div class="cms-image-preview" id="player-preview">
                                <span>Preview</span>
                            </div>
                            <span class="cms-form-hint">Pilih file foto dari laptop/HP Anda atau gunakan tautan gambar
                                online.</span>
                        </div>
                    </div>

                    <!-- Player Photo Gallery Manager Section Inside Modal -->
                    <div class="cms-player-gallery-section" style="background: #F8FAFC; border: 2.5px solid var(--cms-dark); border-radius: 8px; padding: 16px; margin-top: 16px; box-shadow: 2.5px 2.5px 0px #0D1612;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span class="pixel-badge pixel-badge--yellow" style="font-size: 0.65rem;">📸 GALERI FOTO AKSI PEMAIN</span>
                                <span id="player-modal-gallery-badge" class="pixel-badge pixel-badge--dark" style="font-size: 0.6rem;">0 FOTO</span>
                            </div>
                            <button type="button" class="btn btn-outline btn-sm" id="btn-modal-open-gallery" style="font-size: 0.72rem; padding: 4px 10px;">
                                + KELOLA / TAMBAH FOTO
                            </button>
                        </div>
                        <div id="player-modal-gallery-list" class="cms-player-gallery-preview-grid">
                            <!-- Populated with thumbnails -->
                        </div>
                    </div>
                </div>
                <div class="cms-modal__footer">
                    <button type="button" class="cms-btn-modal-cancel" data-close-modal>✕ BATAL</button>
                    <button type="submit" class="cms-btn-modal-submit">💾 SIMPAN DATA PEMAIN</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ==========================================
         MODAL: KELOLA GALERI FOTO PEMAIN
         ========================================== -->
    <div class="cms-modal-backdrop" id="modal-player-gallery">
        <div class="cms-modal" style="max-width: 680px;">
            <div class="cms-modal__handle" aria-hidden="true"></div>
            <div class="cms-modal__header cms-modal__header--players">
                <h3 class="cms-modal__title" id="modal-player-gallery-title">📸 KELOLA GALERI FOTO PEMAIN</h3>
                <button type="button" class="cms-modal__close" data-close-modal>✕</button>
            </div>
            <div class="cms-modal__body">
                <input type="hidden" id="pg-target-player-id">
                <input type="hidden" id="pg-edit-photo-id">

                <!-- Add / Edit Photo Form -->
                <div style="background: #F0FDF4; border: 2px solid #15803D; border-radius: 8px; padding: 16px; margin-bottom: 18px; box-shadow: 2px 2px 0 var(--cms-dark);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span class="pixel-badge pixel-badge--green" id="pg-form-badge" style="font-size: 0.62rem;">➕ TAMBAH FOTO BARU</span>
                        <button type="button" id="pg-btn-cancel-edit" class="btn btn-outline btn-sm" style="display: none; padding: 2px 8px; font-size: 0.65rem;">BATAL EDIT</button>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="pg-photo-url">URL Gambar Foto *</label>
                        <input type="url" id="pg-photo-url" class="cms-input" placeholder="https://images.unsplash.com/...">
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="pg-photo-file">Atau Upload File dari Perangkat</label>
                        <input type="file" id="pg-photo-file" accept="image/*" class="cms-input" style="padding: 6px;">
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="pg-photo-caption">Keterangan / Caption Momen</label>
                        <input type="text" id="pg-photo-caption" class="cms-input" placeholder="Contoh: Smash keras mematikan di babak final">
                        <span class="cms-form-hint">Caption singkat untuk menggambarkan momen aksi pemain di lapangan.</span>
                    </div>

                    <div class="cms-image-preview-wrapper" style="margin-top: 8px;">
                        <div class="cms-image-preview" id="pg-preview-box" style="width: 120px; height: 80px;">
                            <span>Preview</span>
                        </div>
                        <button type="button" id="pg-btn-save-photo" class="btn btn-primary" style="margin-left: auto;">
                            <span>💾 SIMPAN FOTO</span>
                        </button>
                    </div>
                </div>

                <!-- Existing Photos List -->
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong style="font-size: 0.88rem; color: var(--cms-dark);">DAFTAR FOTO TERPASANG</strong>
                        <span id="pg-photos-count" class="pixel-badge pixel-badge--yellow" style="font-size: 0.62rem;">0 FOTO</span>
                    </div>
                    <div id="pg-photos-grid" class="cms-pg-cards-grid">
                        <!-- Populated by JavaScript -->
                    </div>
                </div>
            </div>
            <div class="cms-modal__footer">
                <button type="button" class="cms-btn-modal-cancel" data-close-modal>✕ SELESAI / TUTUP</button>
            </div>
        </div>
    </div>

    <!-- ==========================================
         MODAL: JADWAL / EVENT (CREATE / EDIT)
         ========================================== -->
    <div class="cms-modal-backdrop" id="modal-event">
        <div class="cms-modal">
            <div class="cms-modal__handle" aria-hidden="true"></div>
            <div class="cms-modal__header cms-modal__header--events">
                <h3 class="cms-modal__title" id="modal-event-title">📅 TAMBAH JADWAL KEGIATAN</h3>
                <button type="button" class="cms-modal__close" data-close-modal>✕</button>
            </div>
            <form id="form-event">
                <div class="cms-modal__body">
                    <input type="hidden" id="event-id">

                    <div class="cms-form-group">
                        <label class="cms-label" for="event-title">Judul Agenda / Pertandingan *</label>
                        <input type="text" id="event-title" class="cms-input" required
                            placeholder="Contoh: Latihan Rutin BBC: Drill Footwork">
                    </div>

                    <div class="grid grid-2" style="gap: 16px;">
                        <div class="cms-form-group">
                            <label class="cms-label" for="event-type">Tipe Agenda *</label>
                            <select id="event-type" class="cms-select" required>
                                <option value="training">Latihan Rutin</option>
                                <option value="friendly">Friendly Match / Sparring</option>
                                <option value="tournament">Turnamen</option>
                                <option value="activity">Gathering / Olahraga Bareng</option>
                            </select>
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="event-status">Status *</label>
                            <select id="event-status" class="cms-select" required>
                                <option value="upcoming">Akan Datang (Upcoming)</option>
                                <option value="completed">Selesai (Completed)</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-3" style="gap: 16px;">
                        <div class="cms-form-group">
                            <label class="cms-label" for="event-date">Tanggal *</label>
                            <input type="date" id="event-date" class="cms-input" required>
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="event-day">Hari *</label>
                            <input type="text" id="event-day" class="cms-input" required placeholder="Selasa">
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="event-time">Waktu *</label>
                            <input type="text" id="event-time" class="cms-input" required
                                placeholder="19:00 - 21:30 WIB">
                        </div>
                    </div>

                    <div class="grid grid-2" style="gap: 16px;">
                        <div class="cms-form-group">
                            <label class="cms-label" for="event-venue">Venue / Lapangan *</label>
                            <input type="text" id="event-venue" class="cms-input" required
                                placeholder="GOR Kebayoran Court 2 &amp; 3">
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="event-city">Kota *</label>
                            <input type="text" id="event-city" class="cms-input" required placeholder="Jakarta Selatan">
                        </div>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="event-location-url">Tautan Google Maps</label>
                        <input type="url" id="event-location-url" class="cms-input"
                            placeholder="https://maps.google.com/?q=...">
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="event-description">Deskripsi Singkat</label>
                        <textarea id="event-description" class="cms-textarea"
                            placeholder="Detail latihan, rotasi pasangan, atau catatan teknis..."></textarea>
                    </div>
                </div>
                <div class="cms-modal__footer">
                    <button type="button" class="cms-btn-modal-cancel" data-close-modal>✕ BATAL</button>
                    <button type="submit" class="cms-btn-modal-submit">💾 SIMPAN JADWAL</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ==========================================
         MODAL: FOTO KEGIATAN / GALLERY (CREATE / EDIT)
         ========================================== -->
    <div class="cms-modal-backdrop" id="modal-gallery">
        <div class="cms-modal">
            <div class="cms-modal__handle" aria-hidden="true"></div>
            <div class="cms-modal__header cms-modal__header--gallery">
                <h3 class="cms-modal__title" id="modal-gallery-title">📸 TAMBAH FOTO KEGIATAN</h3>
                <button type="button" class="cms-modal__close" data-close-modal>✕</button>
            </div>
            <form id="form-gallery">
                <div class="cms-modal__body">
                    <input type="hidden" id="gallery-id">

                    <div class="grid grid-2" style="gap: 16px;">
                        <div class="cms-form-group">
                            <label class="cms-label" for="gallery-tag">Tag / Caption Sticker *</label>
                            <input type="text" id="gallery-tag" class="cms-input" required
                                placeholder="Contoh: SMASH! 🏸">
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="gallery-badge-color">Warna Sticker *</label>
                            <select id="gallery-badge-color" class="cms-select" required>
                                <option value="coral">Coral (Merah Oranye)</option>
                                <option value="yellow">Yellow (Kuning)</option>
                                <option value="green">Green (Hijau)</option>
                                <option value="blue">Blue (Biru)</option>
                            </select>
                        </div>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="gallery-alt">Deskripsi Foto (Alt Text)</label>
                        <input type="text" id="gallery-alt" class="cms-input"
                            placeholder="Momen latihan ganda putra BBC">
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="gallery-image">Foto (URL atau Upload File) *</label>
                        <input type="url" id="gallery-image" class="cms-input"
                            placeholder="https://images.unsplash.com/...">
                        <div style="margin-top: 8px;">
                            <input type="file" id="gallery-file" accept="image/*" class="cms-input"
                                style="padding: 6px;">
                        </div>
                        <div class="cms-image-preview-wrapper">
                            <div class="cms-image-preview" id="gallery-preview">
                                <span>Preview</span>
                            </div>
                            <span class="cms-form-hint">Format JPG, PNG, atau WebP. Gambar akan tampil otomatis di
                                beranda BBC Moments.</span>
                        </div>
                    </div>
                </div>
                <div class="cms-modal__footer">
                    <button type="button" class="cms-btn-modal-cancel" data-close-modal>✕ BATAL</button>
                    <button type="submit" class="cms-btn-modal-submit">💾 SIMPAN FOTO</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ==========================================
         MODAL: PENGURUS BBC (CREATE / EDIT)
         ========================================== -->
    <div class="cms-modal-backdrop" id="modal-official">
        <div class="cms-modal">
            <div class="cms-modal__handle" aria-hidden="true"></div>
            <div class="cms-modal__header cms-modal__header--players">
                <h3 class="cms-modal__title" id="modal-official-title">👔 TAMBAH PENGURUS BBC</h3>
                <button type="button" class="cms-modal__close" data-close-modal>✕</button>
            </div>
            <form id="form-official">
                <div class="cms-modal__body">
                    <input type="hidden" id="official-id">

                    <div class="grid grid-2" style="gap: 16px;">
                        <div class="cms-form-group">
                            <label class="cms-label" for="official-name">Nama Lengkap *</label>
                            <input type="text" id="official-name" class="cms-input" required
                                placeholder="Contoh: Ikrom">
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="official-role">Jabatan *</label>
                            <input type="text" id="official-role" class="cms-input" required
                                placeholder="Contoh: Koordinator Utama">
                        </div>
                    </div>

                    <div class="grid grid-2" style="gap: 16px;">
                        <div class="cms-form-group">
                            <label class="cms-label" for="official-period">Periode Kepengurusan *</label>
                            <input type="text" id="official-period" class="cms-input" required
                                placeholder="Contoh: Periode 2026">
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="official-gender">Kategori (Amilin / Amilat)</label>
                            <select id="official-gender" class="cms-select">
                                <option value="male">Amilin (Laki-laki)</option>
                                <option value="female">Amilat (Perempuan)</option>
                            </select>
                        </div>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="official-image">Foto (URL atau Upload File) <span style="font-weight: normal; color: var(--color-grey);">(Opsional)</span></label>
                        <input type="url" id="official-image" class="cms-input"
                            placeholder="Biarkan kosong untuk menggunakan avatar dummy Amilin/Amilat">
                        <div style="margin-top: 8px;">
                            <input type="file" id="official-file" accept="image/*" class="cms-input"
                                style="padding: 6px;">
                        </div>
                        <div class="cms-image-preview-wrapper">
                            <div class="cms-image-preview" id="official-preview">
                                <span>Preview</span>
                            </div>
                            <span class="cms-form-hint">Jika foto kosong atau gagal dimuat, avatar dummy Amilin atau Amilat akan otomatis digunakan.</span>
                        </div>
                    </div>
                </div>
                <div class="cms-modal__footer">
                    <button type="button" class="cms-btn-modal-cancel" data-close-modal>✕ BATAL</button>
                    <button type="submit" class="cms-btn-modal-submit">💾 SIMPAN PENGURUS</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ==========================================
         MODAL: BERITA & ARTIKEL (CREATE / EDIT)
         ========================================== -->
    <div class="cms-modal-backdrop" id="modal-article">
        <div class="cms-modal">
            <div class="cms-modal__handle" aria-hidden="true"></div>
            <div class="cms-modal__header cms-modal__header--articles">
                <h3 class="cms-modal__title" id="modal-article-title">📰 TAMBAH BERITA / ARTIKEL</h3>
                <button type="button" class="cms-modal__close" data-close-modal>✕</button>
            </div>
            <form id="form-article">
                <div class="cms-modal__body">
                    <input type="hidden" id="article-id">

                    <div class="cms-form-group">
                        <label class="cms-label" for="article-title">Judul Berita / Artikel *</label>
                        <input type="text" id="article-title" class="cms-input" required
                            placeholder="Contoh: Keseruan Six Wonder Cup BAZNAS RI">
                    </div>

                    <div class="grid grid-3" style="gap: 16px;">
                        <div class="cms-form-group">
                            <label class="cms-label" for="article-category">Kategori *</label>
                            <input type="text" id="article-category" class="cms-input" required
                                placeholder="Turnamen / Tips Badminton">
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="article-date">Tanggal Publikasi *</label>
                            <input type="date" id="article-date" class="cms-input" required>
                        </div>
                        <div class="cms-form-group">
                            <label class="cms-label" for="article-read-time">Estimasi Baca</label>
                            <input type="text" id="article-read-time" class="cms-input" placeholder="3 Menit Baca">
                        </div>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="article-image">Foto Sampul (URL atau Upload) *</label>
                        <input type="url" id="article-image" class="cms-input"
                            placeholder="https://images.unsplash.com/...">
                        <div style="margin-top: 8px;">
                            <input type="file" id="article-file" accept="image/*" class="cms-input"
                                style="padding: 6px;">
                        </div>
                        <div class="cms-image-preview-wrapper">
                            <div class="cms-image-preview" id="article-preview">
                                <span>Preview</span>
                            </div>
                        </div>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="article-excerpt">Ringkasan Singkat (Excerpt) *</label>
                        <textarea id="article-excerpt" class="cms-textarea" style="min-height: 70px;" required
                            placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."></textarea>
                    </div>

                    <div class="cms-form-group">
                        <label class="cms-label" for="article-content">Konten Lengkap (HTML atau Paragraf) *</label>
                        <textarea id="article-content" class="cms-textarea" style="min-height: 140px;" required
                            placeholder="Isi artikel berita lengkap..."></textarea>
                        <div class="cms-form-hint">Gunakan baris baru atau tag &lt;p&gt; untuk memisahkan paragraf.
                        </div>
                    </div>
                </div>
                <div class="cms-modal__footer">
                    <button type="button" class="cms-btn-modal-cancel" data-close-modal>✕ BATAL</button>
                    <button type="submit" class="cms-btn-modal-submit">💾 SIMPAN ARTIKEL</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ==========================================
         MODAL: KONFIRMASI HAPUS
         ========================================== -->
    <div class="cms-modal-backdrop" id="modal-delete">
        <div class="cms-modal" style="max-width: 440px;">
            <div class="cms-modal__handle" aria-hidden="true"></div>
            <div class="cms-modal__header cms-modal__header--delete">
                <h3 class="cms-modal__title">🗑️ KONFIRMASI HAPUS</h3>
                <button type="button" class="cms-modal__close" data-close-modal>✕</button>
            </div>
            <div class="cms-modal__body" style="text-align: center; padding: 28px 24px;">
                <div style="font-size: 3rem; margin-bottom: 8px;">⚠️</div>
                <h4 style="margin: 0 0 10px 0; font-size: 1.3rem; color: #0D1612; font-weight: 800;">
                    KONFIRMASI HAPUS DATA
                </h4>
                <div
                    style="background: #FFF1F2; border: 2.5px solid #E11D48; padding: 14px 16px; margin: 14px 0; box-shadow: 3px 3px 0 #0D1612;">
                    <p id="delete-target-text"
                        style="color: #9F1239; font-size: 1.05rem; font-weight: 800; line-height: 1.5; margin: 0;">
                        Tindakan ini tidak dapat dibatalkan.
                    </p>
                </div>
                <p style="color: #475569; font-size: 0.88rem; font-weight: 600; margin: 0;">
                    Data yang dihapus akan hilang permanen dari database.
                </p>
            </div>
            <div class="cms-modal__footer"
                style="justify-content: center; gap: 14px; padding: 18px 24px; background: #F1F5F9; border-top: 3px solid #0D1612;">
                <button type="button" class="cms-btn-modal-cancel" data-close-modal>
                    ✕ BATALKAN
                </button>
                <button type="button" class="cms-btn-modal-delete" id="btn-confirm-delete">
                    🗑️ YA, HAPUS PERMANEN
                </button>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div id="cms-toast" class="cms-toast" role="alert" aria-live="polite"></div>

    <!-- Scripts -->
    <script src="../js/config.js"></script>
    <script src="../js/data/players.js"></script>
    <script src="../js/data/events.js"></script>
    <script src="../js/data/gallery.js"></script>
    <script src="../js/data/news.js"></script>
    <script src="../js/data/officials.js"></script>
    <script src="../js/utils/filesystem.js"></script>
    <script src="../js/data/store.js"></script>
    <script src="../js/data/live-sync.js"></script>
    <script src="../js/pages/cms.js"></script>
</body>

</html>