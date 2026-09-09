/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Content Management System (CMS) Interactive Logic
 * Full CRUD for Players, Events, Gallery Moments, and Articles.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // 0. SECURE AUTHENTICATION (STANDALONE SHA-256 HASH GUARD)
    // Runs natively in all contexts (including file:// protocol).
    // Plain-text credentials NEVER appear in inspect element/source code.
    // ========================================================
    function sha256(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }
        var mathPow = Math.pow;
        var maxWord = mathPow(2, 32);
        var lengthProperty = 'length';
        var i, j;
        var result = '';
        var words = [];
        var asciiBitLength = ascii[lengthProperty] * 8;
        var hash = [];
        var k = [];
        var primeCounter = 0;
        var isComposite = {};
        for (var candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }
        ascii += '\x80';
        while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }
        words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
        words[words[lengthProperty]] = (asciiBitLength);
        for (j = 0; j < words[lengthProperty];) {
            var w = words.slice(j, j += 16);
            var oldHash = hash;
            hash = hash.slice(0, 8);
            for (i = 0; i < 64; i++) {
                var w15 = w[i - 15], w2 = w[i - 2];
                var a = hash[0], e = hash[4];
                var temp1 = hash[7]
                    + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                    + ((e & hash[5]) ^ ((~e) & hash[6]))
                    + k[i]
                    + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                    ) | 0
                    );
                var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                    + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }
            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }
        for (i = 0; i < 8; i++) {
            for (var i2 = 3; i2 >= 0; i2--) {
                var b = (hash[i] >> (8 * i2)) & 255;
                result += ((b < 16) ? 0 : '') + b.toString(16);
            }
        }
        return result;
    }

    const AUTH_CONFIG = {
        // Valid hashes (Sha-256 for adminbcc2026 & adminbbc2026)
        VALID_PASSWORD_HASHES: [
            '50e8d103261dc36d343ca631ea3bf0c78f16deff8b8ca49c533c1ecf8ce192af', // adminbcc2026
            '5bf2e06fa8a5f09cbd51b9006bfeef036436fe1e6902187d1b3c5b2f078524fa'  // adminbbc2026
        ],
        SESSION_KEY: 'bbc_cms_session_token'
    };

    function isAuthenticated() {
        return sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY) === 'authenticated_bbc_admin';
    }

    function setAuthenticated(status) {
        if (status) {
            sessionStorage.setItem(AUTH_CONFIG.SESSION_KEY, 'authenticated_bbc_admin');
            document.body.classList.remove('cms-auth-required');
            renderAll();
            initHeroSettings();
            switchTab('dashboard');
        } else {
            sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
            document.body.classList.add('cms-auth-required');
            const wrapper = document.getElementById('cms-app-wrapper');
            if (wrapper) wrapper.classList.remove('sidebar-open');
            document.body.style.overflow = '';
        }
    }

    // Login Form Elements
    const loginForm = document.getElementById('cms-login-form');
    const userInput = document.getElementById('login-username');
    const passInput = document.getElementById('login-password');
    const errorAlert = document.getElementById('login-error-msg');
    const togglePassBtn = document.getElementById('toggle-password-btn');
    const btnLogout = document.getElementById('btn-logout');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (errorAlert) errorAlert.classList.remove('show');

            const enteredUser = (userInput ? userInput.value : '').trim().toLowerCase();
            const enteredPass = (passInput ? passInput.value : '').trim();

            const isUserValid = (enteredUser === 'adminbbc' || enteredUser === 'adminbcc');
            const passHash = sha256(enteredPass);
            const isPassValid = AUTH_CONFIG.VALID_PASSWORD_HASHES.includes(passHash);

            if (isUserValid && isPassValid) {
                setAuthenticated(true);
                showToast('Login berhasil! Selamat datang di BBC CMS.');
                loginForm.reset();
            } else {
                if (errorAlert) {
                    errorAlert.textContent = '⚠️ ID atau Password salah! Periksa kembali ketikan Anda.';
                    errorAlert.classList.add('show');
                }
                if (passInput) {
                    passInput.value = '';
                    passInput.focus();
                }
            }
        });
    }

    if (togglePassBtn && passInput) {
        togglePassBtn.addEventListener('click', () => {
            const isPassword = passInput.type === 'password';
            passInput.type = isPassword ? 'text' : 'password';
            togglePassBtn.textContent = isPassword ? '🙈' : '👁️';
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            setAuthenticated(false);
            showToast('Anda telah keluar dari CMS.');
        });
    }

    // Global state for deletion target
    let pendingDeleteCallback = null;

    // ========================================================
    // 1. TOAST NOTIFICATION HELPER
    // ========================================================
    const toastEl = document.getElementById('cms-toast');
    let toastTimeout = null;

    function showToast(message, type = 'success') {
        if (!toastEl) return;
        clearTimeout(toastTimeout);

        toastEl.textContent = message;
        toastEl.className = `cms-toast cms-toast--${type} show`;

        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 3500);
    }

    // ========================================================
    // 2. MODALS OPEN / CLOSE
    // ========================================================
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modalId) {
        const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (modal) {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    }

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const openModalEl = btn.closest('.cms-modal-backdrop');
            if (openModalEl) closeModal(openModalEl);
        });
    });

    // Close on backdrop click
    document.querySelectorAll('.cms-modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal(backdrop);
        });
    });

    // ========================================================
    // 3. FILE UPLOAD & PREVIEW HELPER
    // ========================================================

    /**
     * setupFileUpload — Menghubungkan file input & URL input ke preview.
     * Jika BBC_FS dikonfigurasi, gambar disimpan sebagai file fisik ke folder assets.
     * Jika tidak, fallback ke base64 (perilaku lama).
     * @param {string} fileInputId
     * @param {string} urlInputId
     * @param {string} previewId
     * @param {string} [assetSubdir] - folder tujuan, misal 'assets/images/players'
     */
    function setupFileUpload(fileInputId, urlInputId, previewId, assetSubdir) {
        const fileInput = document.getElementById(fileInputId);
        const urlInput = document.getElementById(urlInputId);
        const previewEl = document.getElementById(previewId);

        if (!fileInput || !urlInput || !previewEl) return;

        // When user types or pastes an image URL
        urlInput.addEventListener('input', () => {
            const url = urlInput.value.trim();
            if (url) {
                previewEl.innerHTML = `<img src="${url}" alt="Preview" onerror="this.onerror=null; this.parentElement.innerHTML='Invalid URL';">`;
            } else {
                previewEl.innerHTML = `<span>Preview</span>`;
            }
        });

        // When user selects a local file
        fileInput.addEventListener('change', async () => {
            const file = fileInput.files[0];
            if (!file) return;

            // Coba simpan ke folder proyek via BBC_FS jika tersedia
            if (typeof BBC_FS !== 'undefined' && BBC_FS.isConfigured() && assetSubdir) {
                // Buat nama file yang aman dari nama file asli
                const safeName = file.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_.]/g, '');
                try {
                    const result = await BBC_FS.writeImageFile(assetSubdir, file, '');
                    if (result.success) {
                        // Gunakan path relatif dari root proyek (cocok untuk GitHub/Vercel)
                        const relativePath = result.relativePath;
                        urlInput.value = relativePath;
                        previewEl.innerHTML = `<img src="../${relativePath}" alt="Preview" onerror="this.src='${relativePath}'">`;
                        showToast(`📁 Foto tersimpan: ${relativePath}`, 'success');
                        return;
                    } else {
                        console.warn('[CMS] Gagal simpan ke folder, fallback ke base64:', result.error);
                    }
                } catch (err) {
                    console.warn('[CMS] Error BBC_FS, fallback ke base64:', err);
                }
            }

            // Fallback: base64 di localStorage (perilaku lama)
            if (file.size > 2 * 1024 * 1024) {
                showToast('Ukuran foto terlalu besar. Maksimal 2MB disarankan.', 'warning');
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const base64Data = e.target.result;
                urlInput.value = base64Data;
                previewEl.innerHTML = `<img src="${base64Data}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        });
    }

    setupFileUpload('player-file', 'player-image', 'player-preview', 'assets/images/players');
    setupFileUpload('gallery-file', 'gallery-image', 'gallery-preview', 'assets/images/gallery');
    setupFileUpload('article-file', 'article-image', 'article-preview', 'assets/images/news');
    setupFileUpload('official-file', 'official-image', 'official-preview', 'assets/images/players');

    // ========================================================
    // 3B. BBC_FS — SETUP FOLDER PROYEK & STATUS UI
    // ========================================================

    /**
     * Update semua elemen UI yang menampilkan status folder BBC_FS.
     */
    function updateFsStatusUI() {
        if (typeof BBC_FS === 'undefined') return;
        const status = BBC_FS.getStatus();

        // Update badge/indicator folder di panel backup
        const statusEl = document.getElementById('fs-folder-status');
        const folderNameEl = document.getElementById('fs-folder-name');
        const btnSetup = document.getElementById('btn-setup-fs-folder');
        const btnClear = document.getElementById('btn-clear-fs-folder');
        const btnSyncAll = document.getElementById('btn-fs-sync-all');

        if (!status.apiAvailable) {
            if (statusEl) statusEl.className = 'cms-fs-status cms-fs-status--unavailable';
            if (folderNameEl) folderNameEl.textContent = 'Tidak didukung di browser ini (gunakan Chrome/Edge)';
            if (btnSetup) btnSetup.disabled = true;
            if (btnClear) btnClear.style.display = 'none';
            if (btnSyncAll) btnSyncAll.style.display = 'none';
            return;
        }

        if (status.folderConfigured) {
            if (statusEl) statusEl.className = 'cms-fs-status cms-fs-status--active';
            if (folderNameEl) folderNameEl.textContent = `✅ Folder: /${status.folderName}`;
            if (btnSetup) btnSetup.textContent = '🔄 Ganti Folder';
            if (btnClear) btnClear.style.display = '';
            if (btnSyncAll) btnSyncAll.style.display = '';
        } else {
            if (statusEl) statusEl.className = 'cms-fs-status cms-fs-status--inactive';
            if (folderNameEl) folderNameEl.textContent = 'Belum dikonfigurasi — klik Setup Folder untuk mulai';
            if (btnSetup) btnSetup.textContent = '📂 Setup Folder Proyek';
            if (btnClear) btnClear.style.display = 'none';
            if (btnSyncAll) btnSyncAll.style.display = 'none';
        }
    }

    /**
     * Tangani klik tombol Setup Folder Proyek.
     */
    async function handleSetupFsFolder() {
        if (typeof BBC_FS === 'undefined' || !BBC_FS.isAvailable()) {
            showToast('Browser Anda tidak mendukung File System Access API. Gunakan Chrome atau Edge.', 'error');
            return;
        }
        showToast('📂 Membuka dialog pemilihan folder...', 'info');
        const result = await BBC_FS.requestProjectFolder();
        if (result.success) {
            updateFsStatusUI();
            showToast(`✅ Folder "/${result.folderName}" terpilih! Data akan otomatis tersinkronisasi.`, 'success');
            // Lakukan full sync segera setelah folder dikonfigurasi
            showToast('⏳ Melakukan sinkronisasi awal semua data ke file...', 'info');
            const { synced, failed } = await BBC_FS.syncToFiles();
            if (synced.length > 0) {
                showToast(`✅ Sync berhasil: ${synced.length} file JSON diperbarui!`, 'success');
            }
            if (failed.length > 0) {
                showToast(`⚠️ ${failed.length} file gagal disync. Periksa console untuk detail.`, 'warning');
            }
        } else {
            showToast(result.error || 'Gagal memilih folder.', 'error');
        }
    }

    /**
     * Tangani klik tombol Sync Semua ke File.
     */
    async function handleFsSyncAll() {
        if (typeof BBC_FS === 'undefined' || !BBC_FS.isConfigured()) {
            showToast('Folder proyek belum dikonfigurasi.', 'error');
            return;
        }
        const btnSyncAll = document.getElementById('btn-fs-sync-all');
        if (btnSyncAll) btnSyncAll.disabled = true;
        showToast('⏳ Sinkronisasi semua data ke file JSON...', 'info');
        try {
            const { synced, failed } = await BBC_FS.syncToFiles();
            if (synced.length > 0) {
                showToast(`✅ Sync selesai! ${synced.length} file JSON diperbarui: ${synced.join(', ')}`, 'success');
            }
            if (failed.length > 0) {
                showToast(`⚠️ ${failed.length} file gagal: ${failed.join(', ')}`, 'error');
            }
            if (synced.length === 0 && failed.length === 0) {
                showToast('Tidak ada data untuk disinkronisasi.', 'info');
            }
        } catch (e) {
            showToast('Gagal melakukan sinkronisasi: ' + e.message, 'error');
        } finally {
            if (btnSyncAll) btnSyncAll.disabled = false;
        }
    }

    /**
     * Tangani klik tombol Lepas Folder.
     */
    async function handleClearFsFolder() {
        if (typeof BBC_FS !== 'undefined') {
            await BBC_FS.clearProjectFolder();
            updateFsStatusUI();
            showToast('🔓 Folder proyek dilepas. Data hanya tersimpan di localStorage.', 'info');
        }
    }

    // Pasang event listeners untuk tombol BBC_FS di panel backup
    // (dipanggil setelah DOM selesai & saat panel backup aktif)
    function initFsUI() {
        const btnSetup = document.getElementById('btn-setup-fs-folder');
        const btnClear = document.getElementById('btn-clear-fs-folder');
        const btnSyncAll = document.getElementById('btn-fs-sync-all');

        if (btnSetup && !btnSetup._fsWired) {
            btnSetup._fsWired = true;
            btnSetup.addEventListener('click', handleSetupFsFolder);
        }
        if (btnClear && !btnClear._fsWired) {
            btnClear._fsWired = true;
            btnClear.addEventListener('click', handleClearFsFolder);
        }
        if (btnSyncAll && !btnSyncAll._fsWired) {
            btnSyncAll._fsWired = true;
            btnSyncAll.addEventListener('click', handleFsSyncAll);
        }

        updateFsStatusUI();
    }

    // Auto-restore folder handle saat CMS load (jika tersimpan di IDB)
    if (typeof BBC_FS !== 'undefined' && BBC_FS.isAvailable()) {
        BBC_FS.tryRestoreHandle().then((restored) => {
            if (restored) {
                console.info(`[CMS] BBC_FS: Folder proyek dipulihkan: /${BBC_FS.getFolderName()}`);
            }
            updateFsStatusUI();
        });
    }

    // ========================================================
    // 3C. STORAGE & FILE SYSTEM SYNC STATUS
    // ========================================================

    /**
     * Update badge status Storage di topbar header CMS.
     */
    function updateStorageTopbarBadge() {
        const badge = document.getElementById('cloud-sync-topbar-badge');
        const label = document.getElementById('cloud-sync-topbar-text');
        if (!badge || !label) return;

        if (typeof BBC_FS !== 'undefined' && BBC_FS.isConfigured && BBC_FS.isConfigured()) {
            badge.className = 'cms-cloud-sync-badge cms-cloud-sync-badge--ready';
            label.textContent = `📁 File: /${BBC_FS.getFolderName() || 'Terkonfigurasi'}`;
        } else {
            badge.className = 'cms-cloud-sync-badge cms-cloud-sync-badge--ready';
            label.textContent = '💾 Storage: Aktif';
        }
    }

    function initStorageUI() {
        updateStorageTopbarBadge();

        const topbarCloudBadge = document.getElementById('cloud-sync-topbar-badge');
        if (topbarCloudBadge && !topbarCloudBadge._storageWired) {
            topbarCloudBadge._storageWired = true;
            topbarCloudBadge.addEventListener('click', () => {
                switchTab('backup');
            });
        }

        // Auto-upload hook untuk semua form media (File System API + Base64 fallback)
        attachMediaAutoUpload('player-file', 'player-image', 'player-preview', 'players');
        attachMediaAutoUpload('gallery-file', 'gallery-image', 'gallery-preview', 'gallery');
        attachMediaAutoUpload('official-file', 'official-image', 'official-preview', 'officials', () => {
            if (typeof updateOfficialPreview === 'function') updateOfficialPreview();
        });
        attachMediaAutoUpload('article-file', 'article-image', 'article-preview', 'articles');
    }

    /**
     * Helper universal untuk upload media lokal (BBC_FS / Base64 Data URL)
     */
    function attachMediaAutoUpload(fileInputId, urlInputId, previewElId, folder, onDone) {
        const fileInput = document.getElementById(fileInputId);
        const urlInput = document.getElementById(urlInputId);
        if (!fileInput || !urlInput || fileInput._autoUploadWired) return;
        fileInput._autoUploadWired = true;

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            // 1. Coba simpan ke folder proyek jika BBC_FS aktif
            if (typeof BBC_FS !== 'undefined' && BBC_FS.isConfigured && BBC_FS.isConfigured()) {
                try {
                    showToast(`⏳ Menyimpan "${file.name}" ke folder proyek...`);
                    const result = await BBC_FS.writeImageFile(`assets/images/${folder}`, file);
                    if (result && result.success) {
                        urlInput.value = result.relativePath;
                        const previewEl = document.getElementById(previewElId);
                        if (previewEl) {
                            previewEl.innerHTML = `<img src="${result.relativePath}" alt="Preview">`;
                        }
                        showToast(`✅ File tersimpan di: ${result.relativePath}`, 'success');
                        if (typeof onDone === 'function') onDone(result.relativePath);
                        return;
                    }
                } catch (err) {
                    console.warn('[MediaAutoUpload] BBC_FS write failed, fallback ke Base64:', err);
                }
            }

            // 2. Fallback: Base64 data URL
            const reader = new FileReader();
            reader.onload = (evt) => {
                const dataUrl = evt.target.result;
                urlInput.value = dataUrl;
                const previewEl = document.getElementById(previewElId);
                if (previewEl) {
                    previewEl.innerHTML = `<img src="${dataUrl}" alt="Preview">`;
                }
                showToast('✅ Foto siap disimpan (Data URL lokal).', 'info');
                if (typeof onDone === 'function') onDone(dataUrl);
            };
            reader.readAsDataURL(file);
        });
    }
    // 4. COLLAPSIBLE LEFT SIDEBAR & TAB SWITCHING (DESKTOP, TABLET & MOBILE)
    // ========================================================
    const tabPanes = document.querySelectorAll('.cms-tab-pane');
    const appWrapper = document.getElementById('cms-app-wrapper');
    const sidebarEl = document.getElementById('cms-sidebar');
    const burgerBtn = document.getElementById('cms-burger-btn');
    const burgerIcon = document.getElementById('cms-burger-icon');
    const btnSidebarCollapse = document.getElementById('btn-sidebar-collapse');
    const sidebarBackdrop = document.getElementById('cms-sidebar-backdrop');
    const btnSidebarLogout = document.getElementById('btn-sidebar-logout');

    function isDesktopOrTablet() {
        return window.innerWidth > 768;
    }

    function isSidebarCollapsed() {
        return appWrapper ? appWrapper.classList.contains('sidebar-collapsed') : false;
    }

    function setSidebarCollapsed(collapsed) {
        if (!appWrapper) return;

        if (isDesktopOrTablet()) {
            if (collapsed) {
                appWrapper.classList.add('sidebar-collapsed');
                localStorage.setItem('bbc_cms_sidebar_collapsed', 'true');
                if (burgerIcon) burgerIcon.textContent = '☰';
                if (burgerBtn) {
                    burgerBtn.setAttribute('title', 'Buka Menu Samping');
                    burgerBtn.classList.remove('is-active');
                    burgerBtn.setAttribute('aria-expanded', 'false');
                }
            } else {
                appWrapper.classList.remove('sidebar-collapsed');
                localStorage.setItem('bbc_cms_sidebar_collapsed', 'false');
                if (burgerIcon) burgerIcon.textContent = '◀';
                if (burgerBtn) {
                    burgerBtn.setAttribute('title', 'Tutup Menu Samping');
                    burgerBtn.classList.add('is-active');
                    burgerBtn.setAttribute('aria-expanded', 'true');
                }
            }
        } else {
            if (collapsed) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        }
    }

    function toggleSidebar() {
        if (isDesktopOrTablet()) {
            setSidebarCollapsed(!isSidebarCollapsed());
        } else {
            toggleMobileDrawer();
        }
    }

    function openMobileDrawer() {
        if (appWrapper) appWrapper.classList.add('sidebar-open');
        if (burgerBtn) {
            burgerBtn.classList.add('is-active');
            burgerBtn.setAttribute('aria-expanded', 'true');
        }
        if (burgerIcon) burgerIcon.textContent = '✕';
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        if (appWrapper) appWrapper.classList.remove('sidebar-open');
        if (burgerBtn) {
            burgerBtn.classList.remove('is-active');
            burgerBtn.setAttribute('aria-expanded', 'false');
        }
        if (burgerIcon) burgerIcon.textContent = '☰';
        document.body.style.overflow = '';
    }

    function toggleMobileDrawer() {
        if (!appWrapper) return;
        if (appWrapper.classList.contains('sidebar-open')) {
            closeMobileDrawer();
        } else {
            openMobileDrawer();
        }
    }

    // Initialize sidebar state on page load
    if (isDesktopOrTablet()) {
        const savedCollapsed = localStorage.getItem('bbc_cms_sidebar_collapsed') === 'true';
        setSidebarCollapsed(savedCollapsed);
    } else {
        closeMobileDrawer();
    }

    // Single Unified Burger Button Listener (Header)
    if (burgerBtn) {
        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Collapse Button Listener inside Sidebar Header
    if (btnSidebarCollapse) {
        btnSidebarCollapse.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isDesktopOrTablet()) {
                setSidebarCollapsed(true);
            } else {
                closeMobileDrawer();
            }
        });
    }

    // Backdrop click listener (mobile / overlay)
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', () => {
            closeMobileDrawer();
        });
    }

    if (btnSidebarLogout) {
        btnSidebarLogout.addEventListener('click', () => {
            closeMobileDrawer();
            setAuthenticated(false);
            showToast('Anda telah keluar dari CMS.');
        });
    }

    // Close mobile drawer on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!isDesktopOrTablet() && appWrapper && appWrapper.classList.contains('sidebar-open')) {
                closeMobileDrawer();
            }
        }
    });

    // Window resize handler: adapt between desktop/tablet side-by-side and mobile drawer
    window.addEventListener('resize', () => {
        if (isDesktopOrTablet()) {
            closeMobileDrawer();
            const savedCollapsed = localStorage.getItem('bbc_cms_sidebar_collapsed') === 'true';
            setSidebarCollapsed(savedCollapsed);
        } else {
            if (appWrapper) appWrapper.classList.remove('sidebar-collapsed');
        }
    });

    // Global Accordion Handler for Mobile Cards & Gallery
    document.addEventListener('click', (e) => {
        // Table accordion row toggle
        const summaryCell = e.target.closest('.cms-accordion-summary');
        if (summaryCell) {
            const row = summaryCell.closest('.cms-accordion-row');
            if (row) {
                row.classList.toggle('is-open');
            }
            return;
        }

        // Gallery accordion card toggle
        const galleryHeader = e.target.closest('.cms-gallery-accordion-header');
        if (galleryHeader) {
            const card = galleryHeader.closest('.cms-gallery-accordion-card');
            if (card) {
                card.classList.toggle('is-open');
            }
            return;
        }
    });

    // Hero Accordion Toggle
    window.toggleHeroAccordion = function (accId) {
        const el = document.getElementById(accId);
        if (el) {
            el.classList.toggle('is-open');
            const arrow = el.querySelector('.cms-hero-acc-arrow');
            if (arrow) {
                arrow.textContent = el.classList.contains('is-open') ? '▲' : '▼';
            }
        }
    };

    function switchTab(target) {
        if (!target) return;

        // Synchronize Tab Buttons
        document.querySelectorAll('.cms-tab-btn[data-tab]').forEach(b => {
            const isMatch = b.getAttribute('data-tab') === target;
            b.classList.toggle('active', isMatch);
            b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        // Show corresponding pane
        tabPanes.forEach(pane => {
            pane.style.display = (pane.id === `pane-${target}`) ? 'block' : 'none';
        });

        if (target === 'hero' && typeof initHeroSettings === 'function') {
            initHeroSettings();
        }

        if (target === 'backup') {
            initFsUI();
            updateStorageTopbarBadge();
        }

        // Close mobile drawer if opened on mobile devices
        if (!isDesktopOrTablet()) {
            closeMobileDrawer();
        }
    }

    // Attach click listeners to tabs
    document.querySelectorAll('.cms-tab-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            switchTab(target);
        });
    });

    function updateTabCounts() {
        const players = BBC_STORE.getPlayers();
        const events = BBC_STORE.getEvents();
        const gallery = BBC_STORE.getGallery();
        const articles = BBC_STORE.getArticles();
        const officialsList = BBC_STORE.getOfficials();

        // Desktop counts
        const countPlayersEl = document.getElementById('tab-count-players');
        const countEventsEl = document.getElementById('tab-count-events');
        const countGalleryEl = document.getElementById('tab-count-gallery');
        const countArticlesEl = document.getElementById('tab-count-articles');
        const countOfficialsEl = document.getElementById('tab-count-officials');

        if (countPlayersEl) countPlayersEl.textContent = players.length;
        if (countEventsEl) countEventsEl.textContent = events.length;
        if (countGalleryEl) countGalleryEl.textContent = gallery.length;
        if (countArticlesEl) countArticlesEl.textContent = articles.length;
        if (countOfficialsEl) countOfficialsEl.textContent = officialsList.length;

        // Mobile counts
        const countPlayersMob = document.getElementById('tab-count-players-mobile');
        const countEventsMob = document.getElementById('tab-count-events-mobile');
        const countGalleryMob = document.getElementById('tab-count-gallery-mobile');
        const countArticlesMob = document.getElementById('tab-count-articles-mobile');
        const countOfficialsMob = document.getElementById('tab-count-officials-mobile');

        if (countPlayersMob) countPlayersMob.textContent = players.length;
        if (countEventsMob) countEventsMob.textContent = events.length;
        if (countGalleryMob) countGalleryMob.textContent = gallery.length;
        if (countArticlesMob) countArticlesMob.textContent = articles.length;
        if (countOfficialsMob) countOfficialsMob.textContent = officialsList.length;

        // Update stats ribbon
        const statPlayersEl = document.getElementById('stat-total-players');
        const statBreakdownEl = document.getElementById('stat-breakdown-players');
        const statEventsEl = document.getElementById('stat-total-events');
        const statUpcomingEl = document.getElementById('stat-upcoming-events');
        const statGalleryEl = document.getElementById('stat-total-gallery');
        const statArticlesEl = document.getElementById('stat-total-articles');
        const statOfficialsEl = document.getElementById('stat-total-officials');

        const amilinCount = players.filter(p => p.gender === 'male').length;
        const amilatCount = players.filter(p => p.gender === 'female').length;
        const upcomingCount = events.filter(e => e.status !== 'completed').length;

        if (statPlayersEl) statPlayersEl.textContent = players.length;
        if (statBreakdownEl) {
            statBreakdownEl.innerHTML = `<span class="pixel-badge pixel-badge--green" style="font-size:0.6rem; padding: 2px 6px;">${amilinCount} AMILIN</span> <span class="pixel-badge pixel-badge--coral" style="font-size:0.6rem; padding: 2px 6px;">${amilatCount} AMILAT</span>`;
        }
        if (statEventsEl) statEventsEl.textContent = events.length;
        if (statUpcomingEl) {
            statUpcomingEl.innerHTML = `<span class="pixel-badge pixel-badge--yellow" style="font-size:0.6rem; padding: 2px 6px;">${upcomingCount} UPCOMING</span>`;
        }
        if (statGalleryEl) statGalleryEl.textContent = gallery.length;
        if (statArticlesEl) statArticlesEl.textContent = articles.length;
        if (statOfficialsEl) statOfficialsEl.textContent = officialsList.length;
    }

    // Connect stat cards and dashboard module items to switch tabs on click
    document.querySelectorAll('[data-stat-tab]').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-stat-tab');
            switchTab(target);
            const panel = document.querySelector('.cms-panel');
            if (panel) {
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Connect quick action buttons on dashboard hero
    document.querySelectorAll('[data-dash-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-dash-action');
            if (action === 'add-player') {
                switchTab('players');
                const addBtn = document.getElementById('btn-add-player');
                if (addBtn) setTimeout(() => addBtn.click(), 100);
            } else if (action === 'add-event') {
                switchTab('events');
                const addBtn = document.getElementById('btn-add-event');
                if (addBtn) setTimeout(() => addBtn.click(), 100);
            } else if (action === 'add-gallery') {
                switchTab('gallery');
                const addBtn = document.getElementById('btn-add-gallery');
                if (addBtn) setTimeout(() => addBtn.click(), 100);
            } else if (action === 'add-article') {
                switchTab('articles');
                const addBtn = document.getElementById('btn-add-article');
                if (addBtn) setTimeout(() => addBtn.click(), 100);
            }
        });
    });

    // ========================================================
    // 5. DELETE CONFIRMATION DIALOG
    // ========================================================
    const deleteModal = document.getElementById('modal-delete');
    const deleteTextEl = document.getElementById('delete-target-text');
    const confirmDeleteBtn = document.getElementById('btn-confirm-delete');

    function promptDelete(targetName, onConfirm) {
        if (deleteTextEl) {
            deleteTextEl.innerHTML = `Apakah Anda yakin ingin menghapus:<br><span style="display: block; font-size: 1.15rem; color: #881337; font-weight: 800; margin-top: 6px; text-decoration: underline;">"${targetName}"</span>`;
        }
        pendingDeleteCallback = onConfirm;
        openModal('modal-delete');
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (typeof pendingDeleteCallback === 'function') {
                pendingDeleteCallback();
            }
            closeModal(deleteModal);
        });
    }

    // ========================================================
    // 6. MODULE: PLAYERS CRUD
    // ========================================================
    const playersTableBody = document.getElementById('table-players-body');
    const searchPlayersInput = document.getElementById('search-players');
    const filterGenderSelect = document.getElementById('filter-player-gender');
    const btnAddPlayer = document.getElementById('btn-add-player');
    const formPlayer = document.getElementById('form-player');
    const playerTitle = document.getElementById('modal-player-title');

    // Lazy Load Limits (Default 10 items per module)
    let playersVisibleLimit = 10;
    let eventsVisibleLimit = 10;
    let articlesVisibleLimit = 10;

    // Helper for automatic lazy load on scroll via IntersectionObserver
    function setupLazyLoadObserver(triggerId, onLoadMore) {
        const triggerEl = document.getElementById(triggerId);
        if (!triggerEl || !('IntersectionObserver' in window)) return;

        let cooldown = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !cooldown) {
                    cooldown = true;
                    onLoadMore();
                    setTimeout(() => { cooldown = false; }, 350);
                }
            });
        }, { rootMargin: '120px' });

        observer.observe(triggerEl);
    }

    function renderPlayersTable() {
        if (!playersTableBody) return;
        const allPlayers = BBC_STORE.getPlayers();
        const query = searchPlayersInput ? searchPlayersInput.value.toLowerCase().trim() : '';
        const genderFilter = filterGenderSelect ? filterGenderSelect.value : 'all';

        const filtered = allPlayers.filter(p => {
            const matchQuery = p.name && p.name.toLowerCase().includes(query);
            const matchGender = (genderFilter === 'all') || (p.gender === genderFilter);
            return matchQuery && matchGender;
        });

        if (filtered.length === 0) {
            playersTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 32px; color: var(--color-grey);">
                        Belum ada pemain yang sesuai kriteria pencarian.
                    </td>
                </tr>
            `;
            return;
        }

        const totalCount = filtered.length;
        const hasMore = totalCount > playersVisibleLimit;
        const visibleList = hasMore ? filtered.slice(0, playersVisibleLimit) : filtered;

        const rowsHtml = visibleList.map(p => {
            const genderBadge = p.gender === 'male'
                ? `<span class="pixel-badge pixel-badge--green" style="font-size: 0.65rem; padding: 2px 8px;">🏸 AMILIN</span>`
                : `<span class="pixel-badge pixel-badge--coral" style="font-size: 0.65rem; padding: 2px 8px;">🏸 AMILAT</span>`;

            const achievements = Array.isArray(p.achievements)
                ? p.achievements
                : (p.achievement ? [p.achievement] : []);

            const achievementsPreview = achievements.length > 0
                ? `<span style="font-size: 0.8rem; font-weight: 700; color: #854D0E;">🏅 ${achievements[0]} ${achievements.length > 1 ? `<em style="color: var(--color-grey); font-weight: 400;">(+${achievements.length - 1})</em>` : ''}</span>`
                : `<span style="color: var(--color-grey); font-size: 0.8rem;">-</span>`;

            // POTM button state
            const isPotm = !!p.isPlayerOfTheMonth;
            const potmButton = isPotm
                ? `<button type="button" class="cms-btn-potm cms-btn-potm--active" data-toggle-potm="${p.id}" data-potm-status="true" title="Klik untuk nonaktifkan status POTM">⭐ POTM AKTIF</button>`
                : `<button type="button" class="cms-btn-potm cms-btn-potm--inactive" data-toggle-potm="${p.id}" data-potm-status="false" title="Jadikan Player of the Month">☆ JADIKAN POTM</button>`;

            // Statistics display
            const stats = p.stats || { attendance: 0, matches: 0, wins: 0, losses: 0 };
            const winRate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0;
            const statsHtml = `
                <div class="cms-stat-badge-group">
                    <div class="cms-stat-badge-row">
                        <span style="font-weight: 700; color: var(--cms-primary-dark);">📅 Hadir:</span>
                        <span>${stats.attendance} sesi</span>
                    </div>
                    <div class="cms-stat-badge-row">
                        <span style="font-weight: 700; color: #1E40AF;">🏸 Main:</span>
                        <span>${stats.matches} match</span>
                    </div>
                    <div class="cms-stat-badge-row" style="font-size: 0.72rem;">
                        <span class="pixel-badge pixel-badge--green" style="font-size: 0.58rem; padding: 1px 4px;">W: ${stats.wins}</span>
                        <span class="pixel-badge pixel-badge--coral" style="font-size: 0.58rem; padding: 1px 4px;">L: ${stats.losses}</span>
                        <span style="font-weight: 800; color: #D97706;">(${winRate}%)</span>
                    </div>
                </div>
            `;

            const dummyPhoto = p.gender === 'female'
                ? '../assets/images/players/dummy-female.jpg'
                : '../assets/images/players/dummy-male.jpg';

            return `
                <tr class="cms-player-row cms-accordion-row ${p.gender === 'male' ? 'cms-player-row--amilin' : 'cms-player-row--amilat'} ${isPotm ? 'cms-player-row--potm' : ''}">
                    <td class="cms-accordion-summary" colspan="7">
                        <div class="cms-accordion-summary__inner">
                            <div class="cms-accordion-summary__info">
                                <img src="${p.image || dummyPhoto}" alt="${p.name}" class="cms-accordion-thumb" onerror="this.onerror=null; this.src='${dummyPhoto}';">
                                <div class="cms-accordion-summary__text">
                                    <div class="cms-accordion-title">
                                        <strong>${p.name}</strong>
                                        ${isPotm ? '<span title="Player of the Month">👑</span>' : ''}
                                    </div>
                                    <div class="cms-accordion-meta">
                                        ${genderBadge}
                                        <span class="cms-accordion-winrate-badge">WR: ${winRate}%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="cms-accordion-toggle">
                                <span class="cms-accordion-toggle-lbl">DETAIL</span>
                                <span class="cms-accordion-arrow">▼</span>
                            </div>
                        </div>
                    </td>
                    <td data-label="Foto" class="cms-acc-cell">
                        <img src="${p.image || dummyPhoto}" alt="${p.name}" class="cms-thumb" onerror="this.onerror=null; this.src='${dummyPhoto}';">
                    </td>
                    <td data-label="Nama Lengkap" class="cms-acc-cell">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <strong style="color: var(--cms-dark); font-size: 0.95rem;">${p.name}</strong>
                            ${isPotm ? '<span title="Player of the Month" style="font-size: 0.95rem;">👑</span>' : ''}
                        </div>
                    </td>
                    <td data-label="Kategori" class="cms-acc-cell">${genderBadge}</td>
                    <td data-label="POTM" class="cms-acc-cell" style="text-align: center;">${potmButton}</td>
                    <td data-label="Statistik" class="cms-acc-cell">${statsHtml}</td>
                    <td data-label="Prestasi" class="cms-acc-cell">${achievementsPreview}</td>
                    <td data-label="Aksi" class="cms-acc-cell">
                        <div class="cms-btn-group" style="justify-content: center; gap: 4px;">
                            <button type="button" class="cms-btn-action cms-btn-action--gallery" data-manage-gallery="${p.id}" title="Kelola Galeri Foto Pemain">
                                📸 GALERI (${(p.gallery || []).length})
                            </button>
                            <button type="button" class="cms-btn-action cms-btn-action--edit" data-edit-player="${p.id}" title="Edit Pemain">
                                ✏️ EDIT
                            </button>
                            <button type="button" class="cms-btn-action cms-btn-action--delete" data-delete-player="${p.id}" title="Hapus Pemain">
                                🗑️ HAPUS
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        const lazyLoadHtml = hasMore ? `
            <tr class="cms-lazyload-row" id="lazyload-players-trigger">
                <td colspan="7">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;">
                        <span class="cms-lazyload-info">Menampilkan <strong>${visibleList.length}</strong> dari <strong>${totalCount}</strong> pemain</span>
                        <button type="button" class="btn btn-primary btn-sm cms-btn-load-more" id="btn-load-more-players">
                            ⬇ MUAT LEBIH BANYAK (+10)
                        </button>
                        <button type="button" class="btn btn-outline btn-sm cms-btn-load-all" id="btn-load-all-players" style="border-color: var(--cms-dark);">
                            ⚡ TAMPILKAN SEMUA
                        </button>
                    </div>
                </td>
            </tr>
        ` : '';

        playersTableBody.innerHTML = rowsHtml + lazyLoadHtml;

        // Lazy load click handlers & observer
        if (hasMore) {
            const btnMore = document.getElementById('btn-load-more-players');
            if (btnMore) {
                btnMore.addEventListener('click', () => {
                    playersVisibleLimit += 10;
                    renderPlayersTable();
                });
            }
            const btnAll = document.getElementById('btn-load-all-players');
            if (btnAll) {
                btnAll.addEventListener('click', () => {
                    playersVisibleLimit = totalCount;
                    renderPlayersTable();
                });
            }
            setupLazyLoadObserver('lazyload-players-trigger', () => {
                playersVisibleLimit += 10;
                renderPlayersTable();
            });
        }

        // Attach POTM quick-toggle handlers
        document.querySelectorAll('[data-toggle-potm]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-toggle-potm');
                const isCurrentlyPotm = btn.getAttribute('data-potm-status') === 'true';
                const nextStatus = !isCurrentlyPotm;
                const p = BBC_STORE.getPlayerById(id);
                if (!p) return;

                BBC_STORE.setPlayerOfTheMonth(id, nextStatus);
                renderPlayersTable();
                updateTabCounts();
                if (nextStatus) {
                    showToast(`"${p.name}" kini aktif sebagai Player of the Month (${p.gender === 'male' ? 'Amilin' : 'Amilat'})!`, 'success');
                } else {
                    showToast(`Status POTM untuk "${p.name}" dinonaktifkan.`, 'info');
                }
            });
        });

        // Attach gallery management handlers
        document.querySelectorAll('[data-manage-gallery]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-manage-gallery');
                openPlayerGalleryModal(id);
            });
        });

        // Attach edit handlers
        document.querySelectorAll('[data-edit-player]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-edit-player');
                openEditPlayer(id);
            });
        });

        // Attach delete handlers
        document.querySelectorAll('[data-delete-player]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-delete-player');
                const p = BBC_STORE.getPlayerById(id);
                if (p) {
                    promptDelete(`Pemain: ${p.name}`, () => {
                        BBC_STORE.deletePlayer(id);
                        renderPlayersTable();
                        updateTabCounts();
                        showToast(`Pemain "${p.name}" berhasil dihapus.`);
                    });
                }
            });
        });
    }

    if (searchPlayersInput) {
        searchPlayersInput.addEventListener('input', () => {
            playersVisibleLimit = 10;
            renderPlayersTable();
        });
    }
    if (filterGenderSelect) {
        filterGenderSelect.addEventListener('change', () => {
            playersVisibleLimit = 10;
            renderPlayersTable();
        });
    }

    function updateWinRatePreview() {
        const matches = parseInt(document.getElementById('player-stat-matches').value, 10) || 0;
        const wins = parseInt(document.getElementById('player-stat-wins').value, 10) || 0;
        const pill = document.getElementById('player-stat-winrate-pill');
        if (pill) {
            const wr = matches > 0 ? Math.round((wins / matches) * 100) : 0;
            pill.textContent = `WIN RATE: ${wr}%`;
        }
    }

    const matchesInput = document.getElementById('player-stat-matches');
    const winsInput = document.getElementById('player-stat-wins');
    if (matchesInput) matchesInput.addEventListener('input', updateWinRatePreview);
    if (winsInput) winsInput.addEventListener('input', updateWinRatePreview);

    function openEditPlayer(id) {
        const player = BBC_STORE.getPlayerById(id);
        if (!player) return;

        playerTitle.textContent = `EDIT PEMAIN: ${player.name.toUpperCase()}`;
        document.getElementById('player-id').value = player.id;
        document.getElementById('player-name').value = player.name || '';
        document.getElementById('player-gender').value = player.gender || 'male';

        // POTM & Stats
        document.getElementById('player-is-potm').checked = !!player.isPlayerOfTheMonth;
        const stats = player.stats || { attendance: 0, matches: 0, wins: 0, losses: 0 };
        document.getElementById('player-stat-attendance').value = stats.attendance || 0;
        document.getElementById('player-stat-matches').value = stats.matches || 0;
        document.getElementById('player-stat-wins').value = stats.wins || 0;
        document.getElementById('player-stat-losses').value = stats.losses || 0;
        updateWinRatePreview();

        const achievements = Array.isArray(player.achievements)
            ? player.achievements.join('\n')
            : (player.achievement || '');
        document.getElementById('player-achievements').value = achievements;

        const imgInput = document.getElementById('player-image');
        imgInput.value = player.image || '';
        const previewEl = document.getElementById('player-preview');
        previewEl.innerHTML = player.image
            ? `<img src="${player.image}" alt="Preview">`
            : `<span>Preview</span>`;

        // Render gallery preview inside modal
        renderPlayerModalGalleryPreview(player);

        openModal('modal-player');
    }

    if (btnAddPlayer) {
        btnAddPlayer.addEventListener('click', () => {
            playerTitle.textContent = 'TAMBAH PEMAIN BARU';
            formPlayer.reset();
            document.getElementById('player-id').value = '';
            document.getElementById('player-is-potm').checked = false;
            document.getElementById('player-stat-attendance').value = 0;
            document.getElementById('player-stat-matches').value = 0;
            document.getElementById('player-stat-wins').value = 0;
            document.getElementById('player-stat-losses').value = 0;
            updateWinRatePreview();
            document.getElementById('player-preview').innerHTML = `<span>Preview</span>`;
            renderPlayerModalGalleryPreview(null);
            openModal('modal-player');
        });
    }

    // Helper to render player gallery preview inside modal-player
    function renderPlayerModalGalleryPreview(player) {
        const badge = document.getElementById('player-modal-gallery-badge');
        const listEl = document.getElementById('player-modal-gallery-list');
        if (!badge || !listEl) return;

        const gallery = (player && Array.isArray(player.gallery)) ? player.gallery : [];
        badge.textContent = `${gallery.length} FOTO`;

        if (gallery.length === 0) {
            listEl.innerHTML = `
                <div style="font-size: 0.8rem; color: var(--color-grey); padding: 6px 0; width: 100%;">
                    Belum ada foto aksi untuk pemain ini. Klik tombol "+ KELOLA / TAMBAH FOTO" di atas untuk menambahkan.
                </div>
            `;
            return;
        }

        listEl.innerHTML = gallery.map((item, idx) => `
            <div class="cms-player-gallery-preview-item" title="${item.caption || 'Foto Aksi'}">
                <img src="${item.url || item.image}" alt="${item.caption || 'Foto'}" onerror="this.src='https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=200'">
                <span class="cms-player-gallery-preview-caption">${item.caption || `#${idx + 1}`}</span>
            </div>
        `).join('');
    }

    // Connect "+ KELOLA / TAMBAH FOTO" button inside modal-player
    const btnModalOpenGallery = document.getElementById('btn-modal-open-gallery');
    if (btnModalOpenGallery) {
        btnModalOpenGallery.addEventListener('click', () => {
            const playerId = document.getElementById('player-id').value;
            if (!playerId) {
                showToast('Harap simpan data pemain baru terlebih dahulu sebelum mengelola galeri fotonya.', 'info');
                return;
            }
            openPlayerGalleryModal(playerId);
        });
    }

    // ===== DEDICATED PLAYER GALLERY MODAL LOGIC =====
    function openPlayerGalleryModal(playerId) {
        const player = BBC_STORE.getPlayerById(playerId);
        if (!player) return;

        document.getElementById('pg-target-player-id').value = player.id;
        const titleEl = document.getElementById('modal-player-gallery-title');
        if (titleEl) titleEl.textContent = `📸 KELOLA GALERI: ${player.name.toUpperCase()}`;

        resetPlayerGalleryForm();
        renderPlayerGalleryModalGrid(player.id);
        openModal('modal-player-gallery');
    }

    function resetPlayerGalleryForm() {
        document.getElementById('pg-edit-photo-id').value = '';
        document.getElementById('pg-photo-url').value = '';
        const fileInput = document.getElementById('pg-photo-file');
        if (fileInput) fileInput.value = '';
        document.getElementById('pg-photo-caption').value = '';
        document.getElementById('pg-preview-box').innerHTML = '<span>Preview</span>';
        const formBadge = document.getElementById('pg-form-badge');
        if (formBadge) {
            formBadge.textContent = '➕ TAMBAH FOTO BARU';
            formBadge.className = 'pixel-badge pixel-badge--green';
        }
        const saveBtn = document.getElementById('pg-btn-save-photo');
        if (saveBtn) saveBtn.innerHTML = '<span>💾 SIMPAN FOTO</span>';
        const cancelBtn = document.getElementById('pg-btn-cancel-edit');
        if (cancelBtn) cancelBtn.style.display = 'none';
    }

    function renderPlayerGalleryModalGrid(playerId) {
        const player = BBC_STORE.getPlayerById(playerId);
        if (!player) return;

        const gallery = Array.isArray(player.gallery) ? player.gallery : [];
        const countBadge = document.getElementById('pg-photos-count');
        const gridEl = document.getElementById('pg-photos-grid');
        if (countBadge) countBadge.textContent = `${gallery.length} FOTO`;
        if (!gridEl) return;

        if (gallery.length === 0) {
            gridEl.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 24px; text-align: center; background: #FFF; border: 2px dashed var(--cms-dark); border-radius: 6px;">
                    <span style="font-size: 1.5rem;">📸</span>
                    <div style="font-weight: 700; color: var(--cms-dark); margin-top: 6px;">Belum Ada Foto Terpasang</div>
                    <div style="font-size: 0.78rem; color: var(--color-grey); margin-top: 2px;">Gunakan form di atas untuk menambahkan foto aksi pertandingan pemain.</div>
                </div>
            `;
            return;
        }

        gridEl.innerHTML = gallery.map((item, idx) => `
            <div class="cms-pg-card" data-photo-card-id="${item.id}">
                <div class="cms-pg-card__thumb-box">
                    <img src="${item.url || item.image}" alt="${item.caption || 'Foto'}" class="cms-pg-card__thumb" onerror="this.src='https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=300'">
                    <span class="pixel-badge pixel-badge--dark cms-pg-card__num">#${idx + 1}</span>
                </div>
                <div class="cms-pg-card__body">
                    <div class="cms-pg-card__caption">${item.caption || '<em style="color: #94A3B8;">Tanpa keterangan</em>'}</div>
                    <div class="cms-btn-group" style="margin-top: 8px;">
                        <button type="button" class="cms-btn-action cms-btn-action--edit" data-edit-photo="${item.id}" style="flex: 1; justify-content: center; font-size: 0.72rem; padding: 4px 6px;">
                            ✏️ EDIT
                        </button>
                        <button type="button" class="cms-btn-action cms-btn-action--delete" data-delete-photo="${item.id}" style="flex: 1; justify-content: center; font-size: 0.72rem; padding: 4px 6px;">
                            🗑️ HAPUS
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach edit photo handlers
        gridEl.querySelectorAll('[data-edit-photo]').forEach(btn => {
            btn.addEventListener('click', () => {
                const photoId = btn.getAttribute('data-edit-photo');
                const photo = gallery.find(g => String(g.id) === String(photoId));
                if (!photo) return;

                document.getElementById('pg-edit-photo-id').value = photo.id;
                document.getElementById('pg-photo-url').value = photo.url || photo.image || '';
                document.getElementById('pg-photo-caption').value = photo.caption || '';
                document.getElementById('pg-preview-box').innerHTML = `<img src="${photo.url || photo.image}" alt="Preview">`;
                const formBadge = document.getElementById('pg-form-badge');
                if (formBadge) {
                    formBadge.textContent = '✏️ EDIT FOTO';
                    formBadge.className = 'pixel-badge pixel-badge--yellow';
                }
                const saveBtn = document.getElementById('pg-btn-save-photo');
                if (saveBtn) saveBtn.innerHTML = '<span>💾 PERBARUI FOTO</span>';
                const cancelBtn = document.getElementById('pg-btn-cancel-edit');
                if (cancelBtn) cancelBtn.style.display = 'inline-flex';

                document.getElementById('pg-photo-url').focus();
            });
        });

        // Attach delete photo handlers
        gridEl.querySelectorAll('[data-delete-photo]').forEach(btn => {
            btn.addEventListener('click', () => {
                const photoId = btn.getAttribute('data-delete-photo');
                const targetPhoto = gallery.find(g => String(g.id) === String(photoId));
                promptDelete(`Foto Galeri: "${targetPhoto?.caption || 'Momen Aksi'}"`, () => {
                    BBC_STORE.deletePlayerGalleryPhoto(playerId, photoId);
                    renderPlayerGalleryModalGrid(playerId);
                    renderPlayersTable();
                    const updatedPlayer = BBC_STORE.getPlayerById(playerId);
                    renderPlayerModalGalleryPreview(updatedPlayer);
                    showToast('Foto galeri berhasil dihapus.', 'info');
                });
            });
        });
    }

    // Cancel edit photo button
    const btnPgCancelEdit = document.getElementById('pg-btn-cancel-edit');
    if (btnPgCancelEdit) {
        btnPgCancelEdit.addEventListener('click', resetPlayerGalleryForm);
    }

    // Live preview for photo URL input
    const pgUrlInput = document.getElementById('pg-photo-url');
    if (pgUrlInput) {
        pgUrlInput.addEventListener('input', () => {
            const url = pgUrlInput.value.trim();
            const previewBox = document.getElementById('pg-preview-box');
            if (previewBox) {
                previewBox.innerHTML = url ? `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<span>URL Error</span>'">` : '<span>Preview</span>';
            }
        });
    }

    // File upload for gallery photo with FileReader (BBC_FS aware)
    const pgFileInput = document.getElementById('pg-photo-file');
    if (pgFileInput) {
        pgFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Coba simpan ke folder proyek via BBC_FS
            if (typeof BBC_FS !== 'undefined' && BBC_FS.isConfigured()) {
                try {
                    const result = await BBC_FS.writeImageFile('assets/images/players', file, '');
                    if (result.success) {
                        document.getElementById('pg-photo-url').value = result.relativePath;
                        const previewBox = document.getElementById('pg-preview-box');
                        if (previewBox) {
                            previewBox.innerHTML = `<img src="../${result.relativePath}" alt="Preview" onerror="this.src='${result.relativePath}'">`;
                        }
                        showToast(`📁 Foto tersimpan: ${result.relativePath}`, 'success');
                        return;
                    }
                } catch (err) {
                    console.warn('[CMS] BBC_FS error, fallback ke base64:', err);
                }
            // Fallback: base64
            const reader = new FileReader();
            reader.onload = (evt) => {
                const dataUrl = evt.target.result;
                document.getElementById('pg-photo-url').value = dataUrl;
                const previewBox = document.getElementById('pg-preview-box');
                if (previewBox) {
                    previewBox.innerHTML = `<img src="${dataUrl}" alt="Preview">`;
                }
                showToast(`ℹ️ Foto dimuat sebagai Data URL (Lokal/Standby).`, 'info');
            };
            reader.readAsDataURL(file);
        });
    }

    // Save photo button in gallery modal
    const btnPgSavePhoto = document.getElementById('pg-btn-save-photo');
    if (btnPgSavePhoto) {
        btnPgSavePhoto.addEventListener('click', () => {
            const playerId = document.getElementById('pg-target-player-id').value;
            const photoId = document.getElementById('pg-edit-photo-id').value;
            const url = document.getElementById('pg-photo-url').value.trim();
            const caption = document.getElementById('pg-photo-caption').value.trim();

            if (!url) {
                showToast('Harap masukkan URL foto atau pilih file dari perangkat.', 'error');
                document.getElementById('pg-photo-url').focus();
                return;
            }

            if (photoId) {
                BBC_STORE.updatePlayerGalleryPhoto(playerId, photoId, { url, caption });
                showToast('Foto galeri berhasil diperbarui!', 'success');
            } else {
                BBC_STORE.addPlayerGalleryPhoto(playerId, { url, caption });
                showToast('Foto baru berhasil ditambahkan ke galeri pemain!', 'success');
            }

            resetPlayerGalleryForm();
            renderPlayerGalleryModalGrid(playerId);
            renderPlayersTable();
            const updatedPlayer = BBC_STORE.getPlayerById(playerId);
            renderPlayerModalGalleryPreview(updatedPlayer);
        });
    }

    // File upload for main player photo is wired via attachBlobAutoUpload() supporting Vercel Blob & base64 fallback.

    if (formPlayer) {
        formPlayer.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('player-id').value;
            const name = document.getElementById('player-name').value.trim();
            const gender = document.getElementById('player-gender').value;
            const isPlayerOfTheMonth = document.getElementById('player-is-potm').checked;
            const achievementsText = document.getElementById('player-achievements').value;
            let image = document.getElementById('player-image').value.trim();

            const stats = {
                attendance: parseInt(document.getElementById('player-stat-attendance').value, 10) || 0,
                matches: parseInt(document.getElementById('player-stat-matches').value, 10) || 0,
                wins: parseInt(document.getElementById('player-stat-wins').value, 10) || 0,
                losses: parseInt(document.getElementById('player-stat-losses').value, 10) || 0
            };

            if (!image) {
                image = gender === 'female'
                    ? '../assets/images/players/dummy-female.jpg'
                    : '../assets/images/players/dummy-male.jpg';
            }

            const achievements = achievementsText
                .split('\n')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            // Preserve gallery if editing
            let existingGallery = [];
            if (id) {
                const existing = BBC_STORE.getPlayerById(id);
                if (existing && Array.isArray(existing.gallery)) {
                    existingGallery = existing.gallery;
                }
            }

            const playerData = {
                id: id || undefined,
                name,
                gender,
                isPlayerOfTheMonth,
                stats,
                achievements,
                image,
                gallery: existingGallery
            };

            BBC_STORE.savePlayer(playerData);
            closeModal('modal-player');
            renderPlayersTable();
            updateTabCounts();
            showToast(id ? `Data ${name} berhasil diperbarui!` : `Pemain ${name} berhasil ditambahkan!`);
        });
    }

    // ========================================================
    // 7. MODULE: EVENTS CRUD
    // ========================================================
    const eventsTableBody = document.getElementById('table-events-body');
    const btnAddEvent = document.getElementById('btn-add-event');
    const formEvent = document.getElementById('form-event');
    const eventTitleHeader = document.getElementById('modal-event-title');

    function renderEventsTable() {
        if (!eventsTableBody) return;
        const list = BBC_STORE.getEvents();

        if (list.length === 0) {
            eventsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 32px; color: var(--color-grey);">
                        Belum ada jadwal kegiatan yang tercatat.
                    </td>
                </tr>
            `;
            return;
        }

        const totalCount = list.length;
        const hasMore = totalCount > eventsVisibleLimit;
        const visibleList = hasMore ? list.slice(0, eventsVisibleLimit) : list;

        const rowsHtml = visibleList.map(ev => {
            const statusBadge = ev.status === 'completed'
                ? `<span class="pixel-badge pixel-badge--dark" style="font-size: 0.65rem;">SELESAI</span>`
                : `<span class="pixel-badge pixel-badge--green" style="font-size: 0.65rem;">🟢 UPCOMING</span>`;

            let typeBadgeClass = 'pixel-badge--yellow';
            if (ev.type === 'tournament') typeBadgeClass = 'pixel-badge--coral';
            else if (ev.type === 'training') typeBadgeClass = 'pixel-badge--green';
            else if (ev.type === 'friendly') typeBadgeClass = 'pixel-badge--neon';

            return `
                <tr class="cms-event-row cms-accordion-row">
                    <td class="cms-accordion-summary" colspan="6">
                        <div class="cms-accordion-summary__inner">
                            <div class="cms-accordion-summary__info">
                                <span class="cms-accordion-icon">📅</span>
                                <div class="cms-accordion-summary__text">
                                    <div class="cms-accordion-title">
                                        <strong>${ev.title}</strong>
                                    </div>
                                    <div class="cms-accordion-meta">
                                        <span class="pixel-badge ${typeBadgeClass}" style="font-size: 0.58rem;">${ev.typeName || ev.type}</span>
                                        <span class="cms-accordion-subtext">${ev.dayName ? ev.dayName + ', ' : ''}${ev.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="cms-accordion-toggle">
                                ${statusBadge}
                                <span class="cms-accordion-arrow">▼</span>
                            </div>
                        </div>
                    </td>
                    <td data-label="Waktu" class="cms-acc-cell">
                        <strong style="color: var(--cms-dark);">${ev.dayName || ''}, ${ev.date}</strong><br>
                        <span class="font-pixel" style="font-size: 0.68rem; color: var(--color-grey);">⏰ ${ev.time}</span>
                    </td>
                    <td data-label="Judul" class="cms-acc-cell">
                        <strong style="color: var(--cms-dark); font-size: 0.95rem;">${ev.title}</strong>
                        ${ev.description ? `<div style="font-size: 0.8rem; color: var(--color-grey); margin-top: 2px;">${ev.description.slice(0, 75)}...</div>` : ''}
                    </td>
                    <td data-label="Kategori" class="cms-acc-cell">
                        <span class="pixel-badge ${typeBadgeClass}" style="font-size: 0.65rem;">${ev.typeName || ev.type}</span>
                    </td>
                    <td data-label="Lokasi" class="cms-acc-cell">
                        <strong>${ev.venue}</strong><br>
                        <small style="color: var(--color-grey);">📍 ${ev.city}</small>
                    </td>
                    <td data-label="Status" class="cms-acc-cell">${statusBadge}</td>
                    <td data-label="Aksi" class="cms-acc-cell">
                        <div class="cms-btn-group" style="justify-content: center;">
                            <button type="button" class="cms-btn-action cms-btn-action--edit" data-edit-event="${ev.id}">
                                ✏️ EDIT
                            </button>
                            <button type="button" class="cms-btn-action cms-btn-action--delete" data-delete-event="${ev.id}">
                                🗑️ HAPUS
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        const lazyLoadHtml = hasMore ? `
            <tr class="cms-lazyload-row" id="lazyload-events-trigger">
                <td colspan="6">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;">
                        <span class="cms-lazyload-info">Menampilkan <strong>${visibleList.length}</strong> dari <strong>${totalCount}</strong> jadwal</span>
                        <button type="button" class="btn btn-primary btn-sm cms-btn-load-more" id="btn-load-more-events">
                            ⬇ MUAT LEBIH BANYAK (+10)
                        </button>
                        <button type="button" class="btn btn-outline btn-sm cms-btn-load-all" id="btn-load-all-events" style="border-color: var(--cms-dark);">
                            ⚡ TAMPILKAN SEMUA
                        </button>
                    </div>
                </td>
            </tr>
        ` : '';

        eventsTableBody.innerHTML = rowsHtml + lazyLoadHtml;

        if (hasMore) {
            const btnMore = document.getElementById('btn-load-more-events');
            if (btnMore) {
                btnMore.addEventListener('click', () => {
                    eventsVisibleLimit += 10;
                    renderEventsTable();
                });
            }
            const btnAll = document.getElementById('btn-load-all-events');
            if (btnAll) {
                btnAll.addEventListener('click', () => {
                    eventsVisibleLimit = totalCount;
                    renderEventsTable();
                });
            }
            setupLazyLoadObserver('lazyload-events-trigger', () => {
                eventsVisibleLimit += 10;
                renderEventsTable();
            });
        }

        document.querySelectorAll('[data-edit-event]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-edit-event');
                openEditEvent(id);
            });
        });

        document.querySelectorAll('[data-delete-event]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-delete-event');
                const ev = BBC_STORE.getEventById(id);
                if (ev) {
                    promptDelete(`Jadwal: ${ev.title}`, () => {
                        BBC_STORE.deleteEvent(id);
                        renderEventsTable();
                        updateTabCounts();
                        showToast(`Jadwal "${ev.title}" berhasil dihapus.`);
                    });
                }
            });
        });
    }

    function openEditEvent(id) {
        const ev = BBC_STORE.getEventById(id);
        if (!ev) return;

        eventTitleHeader.textContent = `EDIT JADWAL: ${ev.title.toUpperCase()}`;
        document.getElementById('event-id').value = ev.id;
        document.getElementById('event-title').value = ev.title || '';
        document.getElementById('event-type').value = ev.type || 'training';
        document.getElementById('event-status').value = ev.status || 'upcoming';
        document.getElementById('event-date').value = ev.date || '';
        document.getElementById('event-day').value = ev.dayName || '';
        document.getElementById('event-time').value = ev.time || '';
        document.getElementById('event-venue').value = ev.venue || '';
        document.getElementById('event-city').value = ev.city || '';
        document.getElementById('event-location-url').value = ev.locationUrl || '';
        document.getElementById('event-description').value = ev.description || '';

        openModal('modal-event');
    }

    const inputEventDate = document.getElementById('event-date');
    const inputEventDay = document.getElementById('event-day');
    if (inputEventDate && inputEventDay) {
        inputEventDate.addEventListener('change', () => {
            const val = inputEventDate.value;
            if (!val) return;
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            try {
                const parts = val.split('-');
                if (parts.length === 3) {
                    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                    if (!isNaN(d.getDay())) {
                        inputEventDay.value = days[d.getDay()];
                    }
                }
            } catch (e) { /* ignore */ }
        });
    }

    if (btnAddEvent) {
        btnAddEvent.addEventListener('click', () => {
            eventTitleHeader.textContent = 'TAMBAH JADWAL KEGIATAN BARU';
            formEvent.reset();
            document.getElementById('event-id').value = '';
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            document.getElementById('event-date').value = todayStr;
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            document.getElementById('event-day').value = days[today.getDay()] || 'Selasa';
            openModal('modal-event');
        });
    }

    if (formEvent) {
        formEvent.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('event-id').value;
            const title = document.getElementById('event-title').value.trim();
            const type = document.getElementById('event-type').value;
            const status = document.getElementById('event-status').value;
            const date = document.getElementById('event-date').value;
            let dayName = document.getElementById('event-day').value.trim();
            const time = document.getElementById('event-time').value.trim();
            const venue = document.getElementById('event-venue').value.trim();
            const city = document.getElementById('event-city').value.trim();
            const locationUrl = document.getElementById('event-location-url').value.trim();
            const description = document.getElementById('event-description').value.trim();

            // Auto derive dayName jika kosong
            if (!dayName && date) {
                const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                try {
                    const parts = date.split('-');
                    if (parts.length === 3) {
                        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                        if (!isNaN(d.getDay())) dayName = days[d.getDay()];
                    }
                } catch (err) { /* ignore */ }
            }
            if (!dayName) dayName = 'Jadwal';

            const eventData = {
                id: id || undefined,
                title,
                type,
                status,
                date,
                dayName,
                time,
                venue,
                city,
                locationUrl,
                description
            };

            BBC_STORE.saveEvent(eventData);
            closeModal('modal-event');
            renderEventsTable();
            updateTabCounts();
            showToast(id ? 'Jadwal berhasil diperbarui!' : 'Jadwal baru berhasil ditambahkan!');
        });
    }

    // ========================================================
    // 8. MODULE: GALLERY MOMENTS CRUD
    // ========================================================
    const galleryGridBody = document.getElementById('grid-gallery-body');
    const btnAddGallery = document.getElementById('btn-add-gallery');
    const formGallery = document.getElementById('form-gallery');
    const galleryTitleHeader = document.getElementById('modal-gallery-title');

    function renderGalleryGrid() {
        if (!galleryGridBody) return;
        const list = BBC_STORE.getGallery();

        if (list.length === 0) {
            galleryGridBody.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 36px; color: var(--color-grey);">
                    Belum ada foto kegiatan di galeri. Klik "+ TAMBAH FOTO BARU".
                </div>
            `;
            return;
        }

        galleryGridBody.innerHTML = list.map(item => {
            const badgeClass = `pixel-sticker--${item.badgeColor || 'coral'}`;
            return `
                <div class="cms-gallery-card cms-gallery-accordion-card">
                    <div class="cms-gallery-accordion-header">
                        <div style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
                            <img src="${item.image}" alt="${item.alt || item.tag}" class="cms-accordion-thumb" style="width:38px; height:38px; border-radius:4px; object-fit:cover; flex-shrink:0;">
                            <div style="min-width:0; flex:1;">
                                <span class="pixel-sticker ${badgeClass}" style="font-size: 0.62rem; padding: 2px 6px;">${item.tag}</span>
                                <div style="font-size: 0.8rem; font-weight: 700; color: var(--cms-dark); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    ${item.alt || 'Dokumentasi Lapangan BBC'}
                                </div>
                            </div>
                        </div>
                        <div class="cms-accordion-toggle">
                            <span class="cms-accordion-toggle-lbl">FOTO</span>
                            <span class="cms-accordion-arrow">▼</span>
                        </div>
                    </div>
                    <div class="cms-gallery-accordion-body">
                        <div class="cms-gallery-card__img-box">
                            <img src="${item.image}" alt="${item.alt || item.tag}" class="cms-gallery-card__img">
                            <span class="pixel-sticker ${badgeClass} cms-gallery-card__sticker" style="font-size: 0.72rem;">${item.tag}</span>
                        </div>
                        <div class="cms-gallery-card__body">
                            <div>
                                ${item.alt ? `<div style="font-size: 0.88rem; font-weight: 700; color: var(--cms-dark);">${item.alt}</div>` : `<div style="font-size: 0.85rem; color: var(--color-grey);">Dokumentasi Lapangan BBC</div>`}
                            </div>
                            <div class="cms-btn-group" style="margin-top: 10px;">
                                <button type="button" class="cms-btn-action cms-btn-action--edit" data-edit-gallery="${item.id}" style="flex: 1; justify-content: center;">
                                    ✏️ EDIT
                                </button>
                                <button type="button" class="cms-btn-action cms-btn-action--delete" data-delete-gallery="${item.id}" style="flex: 1; justify-content: center;">
                                    🗑️ HAPUS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('[data-edit-gallery]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-edit-gallery');
                openEditGallery(id);
            });
        });

        document.querySelectorAll('[data-delete-gallery]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-delete-gallery');
                const g = BBC_STORE.getGalleryById(id);
                if (g) {
                    promptDelete(`Foto Galeri: "${g.tag}"`, () => {
                        BBC_STORE.deleteGalleryItem(id);
                        renderGalleryGrid();
                        updateTabCounts();
                        showToast('Foto galeri berhasil dihapus.');
                    });
                }
            });
        });
    }

    function openEditGallery(id) {
        const item = BBC_STORE.getGalleryById(id);
        if (!item) return;

        galleryTitleHeader.textContent = `EDIT FOTO KEGIATAN: ${item.tag}`;
        document.getElementById('gallery-id').value = item.id;
        document.getElementById('gallery-tag').value = item.tag || '';
        document.getElementById('gallery-badge-color').value = item.badgeColor || 'coral';
        document.getElementById('gallery-alt').value = item.alt || '';

        const imgInput = document.getElementById('gallery-image');
        imgInput.value = item.image || '';
        document.getElementById('gallery-preview').innerHTML = item.image
            ? `<img src="${item.image}" alt="Preview">`
            : `<span>Preview</span>`;

        openModal('modal-gallery');
    }

    if (btnAddGallery) {
        btnAddGallery.addEventListener('click', () => {
            galleryTitleHeader.textContent = 'TAMBAH FOTO KEGIATAN BARU';
            formGallery.reset();
            document.getElementById('gallery-id').value = '';
            document.getElementById('gallery-preview').innerHTML = `<span>Preview</span>`;
            openModal('modal-gallery');
        });
    }

    if (formGallery) {
        formGallery.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('gallery-id').value;
            const tag = document.getElementById('gallery-tag').value.trim();
            const badgeColor = document.getElementById('gallery-badge-color').value;
            const alt = document.getElementById('gallery-alt').value.trim();
            const image = document.getElementById('gallery-image').value.trim();

            if (!image) {
                showToast('Harap masukkan URL foto atau pilih file gambar.', 'error');
                return;
            }

            const itemData = {
                id: id || undefined,
                tag,
                badgeColor,
                alt: alt || tag,
                image
            };

            BBC_STORE.saveGalleryItem(itemData);
            closeModal('modal-gallery');
            renderGalleryGrid();
            updateTabCounts();
            showToast(id ? 'Foto galeri diperbarui!' : 'Foto baru ditambahkan ke galeri!');
        });
    }

    // ========================================================
    // 9. MODULE: ARTICLES CRUD
    // ========================================================
    const articlesTableBody = document.getElementById('table-articles-body');
    const btnAddArticle = document.getElementById('btn-add-article');
    const formArticle = document.getElementById('form-article');
    const articleTitleHeader = document.getElementById('modal-article-title');

    function renderArticlesTable() {
        if (!articlesTableBody) return;
        const list = BBC_STORE.getArticles();

        if (list.length === 0) {
            articlesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 32px; color: var(--color-grey);">
                        Belum ada berita atau artikel. Klik "+ TAMBAH ARTIKEL BARU".
                    </td>
                </tr>
            `;
            return;
        }

        const totalCount = list.length;
        const hasMore = totalCount > articlesVisibleLimit;
        const visibleList = hasMore ? list.slice(0, articlesVisibleLimit) : list;

        const rowsHtml = visibleList.map(art => {
            return `
                <tr class="cms-article-row cms-accordion-row">
                    <td class="cms-accordion-summary" colspan="6">
                        <div class="cms-accordion-summary__inner">
                            <div class="cms-accordion-summary__info">
                                <img src="${art.image || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=200'}" alt="${art.title}" class="cms-accordion-thumb" style="aspect-ratio: 4/3; border-radius: 4px;">
                                <div class="cms-accordion-summary__text">
                                    <div class="cms-accordion-title">
                                        <strong>${art.title}</strong>
                                    </div>
                                    <div class="cms-accordion-meta">
                                        <span class="pixel-badge pixel-badge--blue" style="font-size: 0.58rem;">${art.category}</span>
                                        <span class="cms-accordion-subtext">📅 ${art.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="cms-accordion-toggle">
                                <span class="cms-accordion-toggle-lbl">DETAIL</span>
                                <span class="cms-accordion-arrow">▼</span>
                            </div>
                        </div>
                    </td>
                    <td data-label="Cover" class="cms-acc-cell">
                        <img src="${art.image || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=200'}" alt="${art.title}" class="cms-thumb">
                    </td>
                    <td data-label="Judul" class="cms-acc-cell">
                        <strong style="color: var(--cms-dark); font-size: 0.95rem;">${art.title}</strong>
                        <div style="font-size: 0.8rem; color: var(--color-grey); margin-top: 2px;">
                            ${art.excerpt ? art.excerpt.slice(0, 80) + '...' : ''}
                        </div>
                    </td>
                    <td data-label="Kategori" class="cms-acc-cell">
                        <span class="pixel-badge pixel-badge--blue" style="font-size: 0.65rem;">${art.category}</span>
                    </td>
                    <td data-label="Tanggal" class="cms-acc-cell">
                        <span style="font-family: var(--font-pixel); font-size: 0.68rem; color: var(--color-grey);">📅 ${art.date}</span>
                    </td>
                    <td data-label="Waktu Baca" class="cms-acc-cell">
                        <span class="cms-read-time-pill">⏱️ ${art.readTime || '-'}</span>
                    </td>
                    <td data-label="Aksi" class="cms-acc-cell">
                        <div class="cms-btn-group" style="justify-content: center;">
                            <button type="button" class="cms-btn-action cms-btn-action--edit" data-edit-article="${art.id}">
                                ✏️ EDIT
                            </button>
                            <button type="button" class="cms-btn-action cms-btn-action--delete" data-delete-article="${art.id}">
                                🗑️ HAPUS
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        const lazyLoadHtml = hasMore ? `
            <tr class="cms-lazyload-row" id="lazyload-articles-trigger">
                <td colspan="6">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;">
                        <span class="cms-lazyload-info">Menampilkan <strong>${visibleList.length}</strong> dari <strong>${totalCount}</strong> artikel</span>
                        <button type="button" class="btn btn-primary btn-sm cms-btn-load-more" id="btn-load-more-articles">
                            ⬇ MUAT LEBIH BANYAK (+10)
                        </button>
                        <button type="button" class="btn btn-outline btn-sm cms-btn-load-all" id="btn-load-all-articles" style="border-color: var(--cms-dark);">
                            ⚡ TAMPILKAN SEMUA
                        </button>
                    </div>
                </td>
            </tr>
        ` : '';

        articlesTableBody.innerHTML = rowsHtml + lazyLoadHtml;

        if (hasMore) {
            const btnMore = document.getElementById('btn-load-more-articles');
            if (btnMore) {
                btnMore.addEventListener('click', () => {
                    articlesVisibleLimit += 10;
                    renderArticlesTable();
                });
            }
            const btnAll = document.getElementById('btn-load-all-articles');
            if (btnAll) {
                btnAll.addEventListener('click', () => {
                    articlesVisibleLimit = totalCount;
                    renderArticlesTable();
                });
            }
            setupLazyLoadObserver('lazyload-articles-trigger', () => {
                articlesVisibleLimit += 10;
                renderArticlesTable();
            });
        }

        document.querySelectorAll('[data-edit-article]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-edit-article');
                openEditArticle(id);
            });
        });

        document.querySelectorAll('[data-delete-article]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-delete-article');
                const art = BBC_STORE.getArticleById(id);
                if (art) {
                    promptDelete(`Artikel: "${art.title}"`, () => {
                        BBC_STORE.deleteArticle(id);
                        renderArticlesTable();
                        updateTabCounts();
                        showToast(`Artikel "${art.title}" berhasil dihapus.`);
                    });
                }
            });
        });
    }

    function openEditArticle(id) {
        const art = BBC_STORE.getArticleById(id);
        if (!art) return;

        articleTitleHeader.textContent = `EDIT ARTIKEL: ${art.title.toUpperCase()}`;
        document.getElementById('article-id').value = art.id;
        document.getElementById('article-title').value = art.title || '';
        document.getElementById('article-category').value = art.category || '';
        document.getElementById('article-date').value = art.date || '';
        document.getElementById('article-read-time').value = art.readTime || '';
        document.getElementById('article-excerpt').value = art.excerpt || '';

        // Strip basic <p> tags for cleaner textarea editing if wanted
        const rawContent = art.content || '';
        const cleanContent = rawContent.replace(/<\/p>\s*<p>/gi, '\n\n').replace(/<p>|<\/p>/gi, '').trim();
        document.getElementById('article-content').value = cleanContent;

        const imgInput = document.getElementById('article-image');
        imgInput.value = art.image || '';
        document.getElementById('article-preview').innerHTML = art.image
            ? `<img src="${art.image}" alt="Preview">`
            : `<span>Preview</span>`;

        openModal('modal-article');
    }

    if (btnAddArticle) {
        btnAddArticle.addEventListener('click', () => {
            articleTitleHeader.textContent = 'TAMBAH BERITA & ARTIKEL BARU';
            formArticle.reset();
            document.getElementById('article-id').value = '';
            document.getElementById('article-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('article-read-time').value = '3 Menit Baca';
            document.getElementById('article-preview').innerHTML = `<span>Preview</span>`;
            openModal('modal-article');
        });
    }

    if (formArticle) {
        formArticle.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('article-id').value;
            const title = document.getElementById('article-title').value.trim();
            const category = document.getElementById('article-category').value.trim();
            const date = document.getElementById('article-date').value;
            const readTime = document.getElementById('article-read-time').value.trim();
            const excerpt = document.getElementById('article-excerpt').value.trim();
            const rawContent = document.getElementById('article-content').value.trim();
            let image = document.getElementById('article-image').value.trim();

            if (!image) {
                image = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800';
            }

            // Wrap paragraphs in <p> tags if not already HTML
            const content = rawContent.includes('<p>')
                ? rawContent
                : rawContent.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('\n');

            const articleData = {
                id: id || undefined,
                title,
                category,
                date,
                readTime,
                excerpt,
                content,
                image
            };

            BBC_STORE.saveArticle(articleData);
            closeModal('modal-article');
            renderArticlesTable();
            updateTabCounts();
            showToast(id ? 'Artikel berhasil diperbarui!' : 'Artikel baru berhasil dipublikasikan!');
        });
    }

    // ========================================================
    // 10. BACKUP, IMPORT, & FACTORY RESET
    // ========================================================
    const btnExportBackup = document.getElementById('btn-export-backup');
    const inputImportBackup = document.getElementById('input-import-backup');
    const btnResetDefaults = document.getElementById('btn-reset-defaults');

    if (btnExportBackup) {
        btnExportBackup.addEventListener('click', () => {
            const jsonStr = BBC_STORE.exportDatabase();
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const dateStr = new Date().toISOString().split('T')[0];
            a.href = url;
            a.download = `bbc-database-backup-${dateStr}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Cadangan data berhasil diunduh!');
        });
    }

    if (inputImportBackup) {
        inputImportBackup.addEventListener('change', () => {
            const file = inputImportBackup.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const result = BBC_STORE.importDatabase(e.target.result);
                if (result.success) {
                    renderAll();
                    showToast('Database berhasil dipulihkan dari file backup!');
                } else {
                    showToast(`Gagal mengimpor database: ${result.error}`, 'error');
                }
                inputImportBackup.value = '';
            };
            reader.readAsText(file);
        });
    }

    if (btnResetDefaults) {
        btnResetDefaults.addEventListener('click', () => {
            promptDelete('SELURUH DATABASE & RESET KE DATA BAWAAN', () => {
                BBC_STORE.resetToDefaults();
                renderAll();
                showToast('Database berhasil dikembalikan ke data default bawaan.');
            });
        });
    }

    // Tombol Export JSON Files untuk Deploy ke Vercel
    const btnExportJsonFiles = document.getElementById('btn-export-json-files');
    if (btnExportJsonFiles) {
        btnExportJsonFiles.addEventListener('click', () => {
            try {
                const files = BBC_STORE.exportToJsonFiles();
                showToast(`✅ ${files.length} file JSON berhasil diunduh! Letakkan ke folder data/ di GitHub lalu push.`);
            } catch (e) {
                showToast(`Gagal export JSON: ${e.message}`, 'error');
            }
        });
    }

    // ========================================================
    // 10. MODULE: PENGURUS BBC (OFFICIALS) CRUD
    // ========================================================
    const officialsTableBody = document.getElementById('table-officials-body');
    const btnAddOfficial = document.getElementById('btn-add-official');
    const formOfficial = document.getElementById('form-official');
    const officialTitleHeader = document.getElementById('modal-official-title');

    function renderOfficialsTable() {
        if (!officialsTableBody) return;
        const list = BBC_STORE.getOfficials();

        if (list.length === 0) {
            officialsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 32px; color: var(--color-grey);">
                        Belum ada data pengurus. Klik "+ TAMBAH PENGURUS".
                    </td>
                </tr>
            `;
            return;
        }

        officialsTableBody.innerHTML = list.map(o => {
            const isFemale = (o.gender === 'female') || /siti|nur|fatimah|rahma|putri|dewi|ayu|ani/i.test(o.name || '');
            const dummyPhoto = isFemale ? '../assets/images/players/dummy-female.jpg' : '../assets/images/players/dummy-male.jpg';
            const photoSrc = (o.image && o.image.trim()) ? o.image : dummyPhoto;

            return `
            <tr class="cms-official-row cms-accordion-row">
                <td class="cms-accordion-summary" colspan="5">
                    <div class="cms-accordion-summary__inner">
                        <div class="cms-accordion-summary__info">
                            <img src="${photoSrc}" alt="${o.name}" class="cms-accordion-thumb" style="border-radius: 50%;" onerror="this.onerror=null; this.src='${dummyPhoto}';">
                            <div class="cms-accordion-summary__text">
                                <div class="cms-accordion-title">
                                    <strong>${o.name}</strong>
                                </div>
                                <div class="cms-accordion-meta">
                                    <span class="pixel-badge pixel-badge--green" style="font-size: 0.58rem;">${o.role || '-'}</span>
                                    <span class="cms-accordion-subtext">${o.period || ''}</span>
                                </div>
                            </div>
                        </div>
                        <div class="cms-accordion-toggle">
                            <span class="cms-accordion-toggle-lbl">DETAIL</span>
                            <span class="cms-accordion-arrow">▼</span>
                        </div>
                    </div>
                </td>
                <td data-label="Foto" class="cms-acc-cell">
                    <img src="${photoSrc}" alt="${o.name}" style="width: 44px; height: 44px; object-fit: cover; border: 2px solid var(--cms-dark); border-radius: 8px;" onerror="this.onerror=null; this.src='${dummyPhoto}';">
                </td>
                <td data-label="Nama" class="cms-acc-cell">
                    <div style="font-weight: 800; color: var(--cms-dark);">${o.name}</div>
                </td>
                <td data-label="Jabatan" class="cms-acc-cell" style="font-size: 0.86rem; font-weight: 700;">${o.role || '-'}</td>
                <td data-label="Periode" class="cms-acc-cell"><span class="pixel-badge pixel-badge--green" style="font-size: 0.62rem;">${o.period || '-'}</span></td>
                <td data-label="Aksi" class="cms-acc-cell">
                    <div class="cms-btn-group" style="justify-content: center;">
                        <button type="button" class="cms-btn-action cms-btn-action--edit" data-edit-official="${o.id}">✏️ EDIT</button>
                        <button type="button" class="cms-btn-action cms-btn-action--delete" data-delete-official="${o.id}">🗑️ HAPUS</button>
                    </div>
                </td>
            </tr>
        `;
        }).join('');

        document.querySelectorAll('[data-edit-official]').forEach(btn => {
            btn.addEventListener('click', () => openEditOfficial(btn.getAttribute('data-edit-official')));
        });

        document.querySelectorAll('[data-delete-official]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-delete-official');
                const o = BBC_STORE.getOfficialById(id);
                if (o) {
                    promptDelete(`Pengurus: ${o.name} (${o.role})`, () => {
                        BBC_STORE.deleteOfficial(id);
                        renderOfficialsTable();
                        updateTabCounts();
                        showToast('Data pengurus berhasil dihapus.');
                    });
                }
            });
        });
    }

    function openEditOfficial(id) {
        const o = BBC_STORE.getOfficialById(id);
        if (!o) return;

        officialTitleHeader.textContent = `EDIT PENGURUS: ${o.name}`;
        document.getElementById('official-id').value = o.id;
        document.getElementById('official-name').value = o.name || '';
        document.getElementById('official-role').value = o.role || '';
        document.getElementById('official-period').value = o.period || '';
        document.getElementById('official-image').value = o.image || '';
        const genderEl = document.getElementById('official-gender');
        const isFemale = (o.gender === 'female') || (o.gender !== 'male' && /siti|nur|fatimah|rahma|putri|dewi|ayu|ani/i.test(o.name || ''));
        if (genderEl) genderEl.value = isFemale ? 'female' : 'male';

        const dummyPhoto = isFemale ? '../assets/images/players/dummy-female.jpg' : '../assets/images/players/dummy-male.jpg';
        const photoSrc = (o.image && o.image.trim()) ? o.image : dummyPhoto;
        document.getElementById('official-preview').innerHTML = `<img src="${photoSrc}" alt="Preview" onerror="this.onerror=null; this.src='${dummyPhoto}';">`;

        openModal('modal-official');
    }

    if (btnAddOfficial) {
        btnAddOfficial.addEventListener('click', () => {
            officialTitleHeader.textContent = 'TAMBAH PENGURUS BBC';
            formOfficial.reset();
            document.getElementById('official-id').value = '';
            const existing = BBC_STORE.getOfficials();
            const lastPeriod = existing.length > 0 ? (existing[existing.length - 1].period || '') : '';
            document.getElementById('official-period').value = lastPeriod;
            const genderEl = document.getElementById('official-gender');
            if (genderEl) genderEl.value = 'male';
            document.getElementById('official-preview').innerHTML = `<img src="../assets/images/players/dummy-male.jpg" alt="Preview" onerror="this.onerror=null;">`;
            openModal('modal-official');
        });
    }

    // Dynamic official image / gender preview updater
    const officialImageInput = document.getElementById('official-image');
    const officialFileInput = document.getElementById('official-file');
    const officialGenderInput = document.getElementById('official-gender');

    function updateOfficialPreview() {
        const previewEl = document.getElementById('official-preview');
        if (!previewEl) return;
        const isFemale = officialGenderInput && officialGenderInput.value === 'female';
        const dummyPhoto = isFemale ? '../assets/images/players/dummy-female.jpg' : '../assets/images/players/dummy-male.jpg';
        const customUrl = officialImageInput ? officialImageInput.value.trim() : '';

        if (customUrl) {
            previewEl.innerHTML = `<img src="${customUrl}" alt="Preview" onerror="this.onerror=null; this.src='${dummyPhoto}';">`;
        } else {
            previewEl.innerHTML = `<img src="${dummyPhoto}" alt="Avatar Dummy ${isFemale ? 'Amilat' : 'Amilin'}">`;
        }
    }

    if (officialImageInput) {
        officialImageInput.addEventListener('input', updateOfficialPreview);
    }
    if (officialGenderInput) {
        officialGenderInput.addEventListener('change', updateOfficialPreview);
    }
    // File upload for official photo is wired via attachBlobAutoUpload() supporting Vercel Blob & base64 fallback.

    if (formOfficial) {
        formOfficial.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('official-id').value;
            const image = document.getElementById('official-image') ? document.getElementById('official-image').value.trim() : '';
            const gender = document.getElementById('official-gender') ? document.getElementById('official-gender').value : 'male';

            BBC_STORE.saveOfficial({
                id: id || undefined,
                name: document.getElementById('official-name').value.trim(),
                role: document.getElementById('official-role').value.trim(),
                period: document.getElementById('official-period').value.trim(),
                gender,
                image
            });

            closeModal('modal-official');
            renderOfficialsTable();
            updateTabCounts();
            showToast(id ? 'Data pengurus diperbarui!' : 'Pengurus baru ditambahkan!');
        });
    }

    // ========================================================
    // 9. HERO SECTION PHOTO / VIDEO SETTINGS
    // ========================================================
    // Helper: compress image file using canvas to keep base64 size under ~100-150KB
    function compressHeroImageFile(file, maxWidth = 960, maxHeight = 600, quality = 0.76) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth || height > maxHeight) {
                        if (width / height > maxWidth / maxHeight) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        } else {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
                };
                img.onerror = () => resolve(e.target.result);
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    let heroSettingsWired = false;
    let loadHeroFormFn = null;

    function initHeroSettings() {
        const formHero = document.getElementById('form-hero');
        const btnHeroReset = document.getElementById('btn-hero-reset');
        const btnHeroPreview = document.getElementById('btn-hero-preview');
        const btnHeroSave = document.getElementById('btn-hero-save');

        // Media type radio toggle refs
        const radioTypeImage = document.getElementById('hero-type-image');
        const radioTypeVideo = document.getElementById('hero-type-video');
        const imageFields = document.getElementById('hero-image-fields');
        const videoFields = document.getElementById('hero-video-fields');
        const fVideoUrl = document.getElementById('hero-main-video');
        const fVideoFile = document.getElementById('hero-video-file');

        // Field refs
        const fMainUrl = document.getElementById('hero-main-url');
        const fMainFile = document.getElementById('hero-main-file');
        const fMainAlt = document.getElementById('hero-main-alt');
        const fMainLabel = document.getElementById('hero-main-label');
        const fThumb1Url = document.getElementById('hero-thumb1-url');
        const fThumb1File = document.getElementById('hero-thumb1-file');
        const fThumb1Alt = document.getElementById('hero-thumb1-alt');
        const fThumb1Lbl = document.getElementById('hero-thumb1-label');
        const fThumb2Url = document.getElementById('hero-thumb2-url');
        const fThumb2File = document.getElementById('hero-thumb2-file');
        const fThumb2Alt = document.getElementById('hero-thumb2-alt');
        const fThumb2Lbl = document.getElementById('hero-thumb2-label');

        // Preview element refs
        const pvMainWrap = document.getElementById('hero-preview-main-wrap');
        const pvThumb1 = document.getElementById('hero-preview-thumb1');
        const pvThumb1Lb = document.getElementById('hero-preview-thumb1-label');
        const pvThumb2 = document.getElementById('hero-preview-thumb2');
        const pvThumb2Lb = document.getElementById('hero-preview-thumb2-label');

        // Action buttons & Toggles
        const btnToggleHeroImage = document.getElementById('btn-toggle-hero-image');
        const btnToggleHeroVideo = document.getElementById('btn-toggle-hero-video');
        const btnDeleteMainImg = document.getElementById('btn-delete-main-img');
        const btnDeleteMainVideo = document.getElementById('btn-delete-main-video');
        const btnDeleteThumb1 = document.getElementById('btn-delete-thumb1');
        const btnDeleteThumb2 = document.getElementById('btn-delete-thumb2');

        // Helper: get current media type
        function getMediaType() {
            return (radioTypeVideo && radioTypeVideo.checked) ? 'video' : 'image';
        }

        // Toggle image/video fields visibility and update toggle button states
        function applyMediaTypeToggle(type) {
            const isVideo = (type === 'video');
            if (imageFields) imageFields.style.display = isVideo ? 'none' : '';
            if (videoFields) videoFields.style.display = isVideo ? '' : 'none';
            if (radioTypeImage) radioTypeImage.checked = !isVideo;
            if (radioTypeVideo) radioTypeVideo.checked = isVideo;

            if (btnToggleHeroImage) {
                btnToggleHeroImage.style.background = isVideo ? '#FAF5FF' : '#7C3AED';
                btnToggleHeroImage.style.color = isVideo ? '#7C3AED' : '#ffffff';
                btnToggleHeroImage.style.border = '2px solid #7C3AED';
            }
            if (btnToggleHeroVideo) {
                btnToggleHeroVideo.style.background = isVideo ? '#7C3AED' : '#FAF5FF';
                btnToggleHeroVideo.style.color = isVideo ? '#ffffff' : '#7C3AED';
                btnToggleHeroVideo.style.border = '2px solid #7C3AED';
            }
        }

        // Expose globally for inline onclick fallbacks
        window.BBC_applyHeroToggle = applyMediaTypeToggle;

        // Update live preview (handles image, video MP4/WebM, YouTube, IndexedDB, and empty/deleted states)
        function updatePreview(videoBlobOrFile) {
            const mediaType = getMediaType();
            const t1Src = (fThumb1Url && fThumb1Url.value.trim()) || '';
            const t2Src = (fThumb2Url && fThumb2Url.value.trim()) || '';
            const mainLabelText = (fMainLabel && fMainLabel.value) ? fMainLabel.value.trim() : '';

            if (pvMainWrap) {
                if (mediaType === 'video') {
                    const videoSrc = (fVideoUrl && fVideoUrl.value.trim()) || '';
                    const isIdb = videoSrc.startsWith('indexeddb:');
                    const isYoutube = !isIdb && videoSrc && (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be'));
                    let mediaHtml = '';
                    if (videoBlobOrFile) {
                        const blobUrl = URL.createObjectURL(videoBlobOrFile);
                        mediaHtml = `<video src="${blobUrl}" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video>`;
                    } else if (isIdb) {
                        mediaHtml = `<video id="hero-preview-idb-video" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video>`;
                        const key = videoSrc.replace('indexeddb:', '') || 'hero_main_video';
                        if (typeof BBC_STORE !== 'undefined' && BBC_STORE.getMediaBlob) {
                            BBC_STORE.getMediaBlob(key).then(blob => {
                                const vEl = document.getElementById('hero-preview-idb-video');
                                if (vEl && blob) {
                                    vEl.src = (typeof blob === 'string') ? blob : URL.createObjectURL(blob);
                                    vEl.play().catch(() => {});
                                }
                            });
                        }
                    } else if (videoSrc) {
                        if (isYoutube) {
                            const match = videoSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
                            const ytid = match ? match[1] : '';
                            if (ytid) {
                                mediaHtml = `<iframe src="https://www.youtube.com/embed/${ytid}?autoplay=1&mute=1&loop=1&playlist=${ytid}&controls=0" style="width:100%;height:100%;border:none;pointer-events:none;" allow="autoplay; encrypted-media"></iframe>`;
                            } else {
                                mediaHtml = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1e1b4b;color:#C4B5FD;padding:16px;text-align:center;"><span style="font-size:2rem;margin-bottom:6px;">⚠️</span><span style="font-weight:700;font-size:0.85rem;">Format Link YouTube Tidak Valid</span></div>`;
                            }
                        } else {
                            mediaHtml = `<video src="${videoSrc}" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover;"></video>`;
                        }
                    } else {
                        mediaHtml = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1e1b4b;border:2px dashed #7C3AED;color:#C4B5FD;padding:16px;text-align:center;">
                            <span style="font-size:2rem;margin-bottom:6px;">🎬</span>
                            <span style="font-weight:700;font-size:0.85rem;">Video Utama Kosong</span>
                            <span style="font-size:0.72rem;color:#A78BFA;margin-top:2px;">Ketik URL video YouTube atau upload file video (hingga 10MB) di bawah</span>
                        </div>`;
                    }
                    pvMainWrap.innerHTML = mediaHtml + `<span class="cms-hero-preview__sticker" id="hero-preview-main-label" style="display:${mainLabelText ? '' : 'none'};">${mainLabelText}</span>`;
                } else {
                    const mainSrc = (fMainUrl && fMainUrl.value.trim()) || '';
                    if (mainSrc) {
                        pvMainWrap.innerHTML = `<img id="hero-preview-main" src="${mainSrc}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;">
                            <span class="cms-hero-preview__sticker" id="hero-preview-main-label" style="display:${mainLabelText ? '' : 'none'};">${mainLabelText}</span>`;
                    } else {
                        pvMainWrap.innerHTML = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#F8FAFC;border:2px dashed #CBD5E1;color:#64748B;padding:16px;text-align:center;">
                            <span style="font-size:2.2rem;margin-bottom:6px;">🖼️</span>
                            <span style="font-weight:700;font-size:0.88rem;color:#334155;">Foto Utama Dikosongkan</span>
                            <span style="font-size:0.72rem;color:#94A3B8;margin-top:2px;">Upload file foto baru atau masukkan URL foto di bawah</span>
                        </div>
                        <span class="cms-hero-preview__sticker" id="hero-preview-main-label" style="display:${mainLabelText ? '' : 'none'};">${mainLabelText}</span>`;
                    }
                }
            }

            if (pvThumb1) {
                if (t1Src) {
                    pvThumb1.src = t1Src;
                    pvThumb1.style.display = 'block';
                } else {
                    pvThumb1.style.display = 'none';
                }
            }
            if (pvThumb1Lb) {
                const t1lbl = (fThumb1Lbl && fThumb1Lbl.value) ? fThumb1Lbl.value.trim() : '';
                if (t1Src) {
                    pvThumb1Lb.textContent = t1lbl || 'MINI 1';
                    pvThumb1Lb.style.display = '';
                    pvThumb1Lb.style.opacity = '1';
                } else {
                    pvThumb1Lb.textContent = '❌ KOSONG';
                    pvThumb1Lb.style.display = '';
                    pvThumb1Lb.style.opacity = '0.7';
                }
            }

            if (pvThumb2) {
                if (t2Src) {
                    pvThumb2.src = t2Src;
                    pvThumb2.style.display = 'block';
                } else {
                    pvThumb2.style.display = 'none';
                }
            }
            if (pvThumb2Lb) {
                const t2lbl = (fThumb2Lbl && fThumb2Lbl.value) ? fThumb2Lbl.value.trim() : '';
                if (t2Src) {
                    pvThumb2Lb.textContent = t2lbl || 'MINI 2';
                    pvThumb2Lb.style.display = '';
                    pvThumb2Lb.style.opacity = '1';
                } else {
                    pvThumb2Lb.textContent = '❌ KOSONG';
                    pvThumb2Lb.style.display = '';
                    pvThumb2Lb.style.opacity = '0.7';
                }
            }
        }

        window.BBC_updateHeroPreview = updatePreview;

        // Load current hero settings into form
        loadHeroFormFn = function loadHeroForm() {
            const h = BBC_STORE.getHeroSettings();
            if (!h) return;

            if (fMainFile) fMainFile.value = '';
            if (fVideoFile) fVideoFile.value = '';
            if (fThumb1File) fThumb1File.value = '';
            if (fThumb2File) fThumb2File.value = '';

            // Set media type radio
            const storedType = h.mediaType || 'image';
            if (radioTypeImage) radioTypeImage.checked = (storedType === 'image');
            if (radioTypeVideo) radioTypeVideo.checked = (storedType === 'video');
            applyMediaTypeToggle(storedType);

            // Populate video URL
            if (fVideoUrl) fVideoUrl.value = h.mainVideo || '';

            // Populate image fields
            if (fMainUrl) fMainUrl.value = h.mainImage || '';
            if (fMainAlt) fMainAlt.value = h.mainImageAlt || '';
            if (fMainLabel) fMainLabel.value = h.mainLabel || '';
            if (fThumb1Url) fThumb1Url.value = h.thumb1Image || '';
            if (fThumb1Alt) fThumb1Alt.value = h.thumb1Alt || '';
            if (fThumb1Lbl) fThumb1Lbl.value = h.thumb1Label || '';
            if (fThumb2Url) fThumb2Url.value = h.thumb2Image || '';
            if (fThumb2Alt) fThumb2Alt.value = h.thumb2Alt || '';
            if (fThumb2Lbl) fThumb2Lbl.value = h.thumb2Label || '';

            updatePreview();
        };

        // Dedicated Hero Save Action
        let isSavingHero = false;
        async function saveHeroSettingsAction(e) {
            if (e) {
                if (typeof e.preventDefault === 'function') e.preventDefault();
                if (typeof e.stopPropagation === 'function') e.stopPropagation();
            }
            if (isSavingHero) return;
            isSavingHero = true;

            try {
                const mediaType = getMediaType();

                const mainImgVal = (fMainUrl && fMainUrl.value.trim()) || '';
                const mainVideoVal = (fVideoUrl && fVideoUrl.value.trim()) || '';
                const thumb1Val = (fThumb1Url && fThumb1Url.value.trim()) || '';
                const thumb2Val = (fThumb2Url && fThumb2Url.value.trim()) || '';

                const settings = {
                    mediaType: mediaType,
                    mainImage: mainImgVal,
                    mainVideo: mainVideoVal,
                    mainImageAlt: fMainAlt ? fMainAlt.value.trim() : '',
                    mainLabel: fMainLabel ? fMainLabel.value.trim() : '',
                    thumb1Image: thumb1Val,
                    thumb1Alt: fThumb1Alt ? fThumb1Alt.value.trim() : '',
                    thumb1Label: fThumb1Lbl ? fThumb1Lbl.value.trim() : '',
                    thumb2Image: thumb2Val,
                    thumb2Alt: fThumb2Alt ? fThumb2Alt.value.trim() : '',
                    thumb2Label: fThumb2Lbl ? fThumb2Lbl.value.trim() : ''
                };

                const saved = BBC_STORE.saveHeroSettings(settings);
                if (saved) {
                    const mediaMsg = mediaType === 'video' ? 'Video' : 'Foto';
                    showToast(`✅ Pengaturan media hero (${mediaMsg}) berhasil disimpan! Tampilan beranda langsung diperbarui.`);
                    if (loadHeroFormFn) loadHeroFormFn();
                } else {
                    showToast('❌ Gagal menyimpan! Pastikan link URL atau file foto/video tidak melebihi kapasitas memori.', 'error');
                }
            } finally {
                setTimeout(() => { isSavingHero = false; }, 800);
            }
        }

        window.BBC_saveHeroSettings = saveHeroSettingsAction;

        // Dedicated Delete & Reset Actions
        function deleteMainImgAction() {
            if (fMainUrl) fMainUrl.value = '';
            if (fMainFile) fMainFile.value = '';
            updatePreview();
            showToast('🗑️ Foto utama dikosongkan. Klik "SIMPAN MEDIA HERO" untuk menerapkan perubahan.');
        }

        function deleteMainVideoAction() {
            if (fVideoUrl) fVideoUrl.value = '';
            if (fVideoFile) fVideoFile.value = '';
            if (typeof BBC_STORE !== 'undefined' && BBC_STORE.deleteMediaBlob) {
                BBC_STORE.deleteMediaBlob('hero_main_video');
            }
            updatePreview();
            showToast('🗑️ Video utama dikosongkan. Klik "SIMPAN MEDIA HERO" untuk menerapkan perubahan.');
        }

        function deleteThumb1Action() {
            if (fThumb1Url) fThumb1Url.value = '';
            if (fThumb1File) fThumb1File.value = '';
            if (fThumb1Lbl) fThumb1Lbl.value = '';
            if (fThumb1Alt) fThumb1Alt.value = '';
            updatePreview();
            showToast('🗑️ Foto mini 1 dikosongkan. Klik "SIMPAN MEDIA HERO" untuk menerapkan perubahan.');
        }

        function deleteThumb2Action() {
            if (fThumb2Url) fThumb2Url.value = '';
            if (fThumb2File) fThumb2File.value = '';
            if (fThumb2Lbl) fThumb2Lbl.value = '';
            if (fThumb2Alt) fThumb2Alt.value = '';
            updatePreview();
            showToast('🗑️ Foto mini 2 dikosongkan. Klik "SIMPAN MEDIA HERO" untuk menerapkan perubahan.');
        }

        function resetHeroSettingsAction() {
            promptDelete('RESET MEDIA HERO KE DEFAULT BAWAAN', () => {
                BBC_STORE.resetHeroSettings();
                if (loadHeroFormFn) loadHeroFormFn();
                showToast('↩ Media hero berhasil direset ke foto default bawaan.');
            });
        }

        // Window global fallbacks
        window.BBC_deleteMainImg = deleteMainImgAction;
        window.BBC_deleteMainVideo = deleteMainVideoAction;
        window.BBC_deleteThumb1 = deleteThumb1Action;
        window.BBC_deleteThumb2 = deleteThumb2Action;
        window.BBC_resetHeroSettings = resetHeroSettingsAction;

        // Wire event listeners once
        if (!heroSettingsWired) {
            heroSettingsWired = true;

            // Wire media type toggle buttons
            if (btnToggleHeroImage) {
                btnToggleHeroImage.addEventListener('click', () => {
                    applyMediaTypeToggle('image');
                    updatePreview();
                });
            }
            if (btnToggleHeroVideo) {
                btnToggleHeroVideo.addEventListener('click', () => {
                    applyMediaTypeToggle('video');
                    updatePreview();
                });
            }

            // Wire media type radio buttons
            [radioTypeImage, radioTypeVideo].forEach(radio => {
                if (radio) {
                    radio.addEventListener('change', () => {
                        applyMediaTypeToggle(getMediaType());
                        updatePreview();
                    });
                }
            });

            // Auto-switch to video if user pastes a video link in fMainUrl or types in fVideoUrl
            if (fMainUrl) {
                fMainUrl.addEventListener('input', () => {
                    const val = fMainUrl.value.trim();
                    if (val && (val.includes('youtube.com') || val.includes('youtu.be') || val.endsWith('.mp4') || val.endsWith('.webm'))) {
                        if (fVideoUrl) fVideoUrl.value = val;
                        fMainUrl.value = '';
                        applyMediaTypeToggle('video');
                        updatePreview();
                        showToast('🎬 Terdeteksi link video! Beralih ke mode video otomatis.');
                    }
                });
            }

            if (fVideoUrl) {
                fVideoUrl.addEventListener('input', () => {
                    if (fVideoUrl.value.trim() && getMediaType() !== 'video') {
                        applyMediaTypeToggle('video');
                    }
                });
            }

            // Wire file inputs with automatic image compression (BBC_FS aware)
            if (fMainFile) {
                fMainFile.addEventListener('change', async () => {
                    const file = fMainFile.files[0];
                    if (!file) return;
                    applyMediaTypeToggle('image');

                    // Prioritas: simpan ke folder proyek jika BBC_FS tersedia
                    if (typeof BBC_FS !== 'undefined' && BBC_FS.isConfigured()) {
                        showToast('⏳ Menyimpan foto utama ke folder proyek...');
                        try {
                            const result = await BBC_FS.writeImageFile('assets/images/hero', file, 'hero-main');
                            if (result.success) {
                                if (fMainUrl) fMainUrl.value = result.relativePath;
                                updatePreview();
                                showToast(`✅ Foto utama tersimpan: ${result.relativePath}`);
                                return;
                            }
                        } catch (err) {
                            console.warn('[CMS] BBC_FS error, fallback ke base64:', err);
                        }
                    // Fallback: base64 dengan kompresi optimal
                    showToast('⏳ Mengompres foto utama...');
                    try {
                        const base64 = await compressHeroImageFile(file, 960, 600, 0.76);
                        if (fMainUrl) fMainUrl.value = base64;
                        updatePreview();
                        showToast('✅ Foto utama siap disimpan!');
                    } catch (err) {
                        showToast('❌ Gagal memproses file foto.', 'error');
                    }
                });
            }

            if (fThumb1File) {
                fThumb1File.addEventListener('change', async () => {
                    const file = fThumb1File.files[0];
                    if (!file) return;

                    if (typeof BBC_FS !== 'undefined' && BBC_FS.isConfigured()) {
                        showToast('⏳ Menyimpan foto mini 1 ke folder proyek...');
                        try {
                            const result = await BBC_FS.writeImageFile('assets/images/hero', file, 'hero-thumb1');
                            if (result.success) {
                                if (fThumb1Url) fThumb1Url.value = result.relativePath;
                                updatePreview();
                                showToast(`✅ Foto mini 1 tersimpan: ${result.relativePath}`);
                                return;
                            }
                        } catch (err) {
                            console.warn('[CMS] BBC_FS error, fallback ke base64:', err);
                        }
                    }

                    showToast('⏳ Mengompres foto mini 1...');
                    try {
                        const base64 = await compressHeroImageFile(file, 480, 300, 0.72);
                        if (fThumb1Url) fThumb1Url.value = base64;
                        updatePreview();
                        showToast('✅ Foto mini 1 siap disimpan!');
                    } catch (err) {
                        showToast('❌ Gagal memproses file foto.', 'error');
                    }
                });
            }

            if (fThumb2File) {
                fThumb2File.addEventListener('change', async () => {
                    const file = fThumb2File.files[0];
                    if (!file) return;

                    if (typeof BBC_FS !== 'undefined' && BBC_FS.isConfigured()) {
                        showToast('⏳ Menyimpan foto mini 2 ke folder proyek...');
                        try {
                            const result = await BBC_FS.writeImageFile('assets/images/hero', file, 'hero-thumb2');
                            if (result.success) {
                                if (fThumb2Url) fThumb2Url.value = result.relativePath;
                                updatePreview();
                                showToast(`✅ Foto mini 2 tersimpan: ${result.relativePath}`);
                                return;
                            }
                        } catch (err) {
                            console.warn('[CMS] BBC_FS error, fallback ke base64:', err);
                        }
                    }

                    showToast('⏳ Mengompres foto mini 2...');
                    try {
                        const base64 = await compressHeroImageFile(file, 480, 300, 0.72);
                        if (fThumb2Url) fThumb2Url.value = base64;
                        updatePreview();
                        showToast('✅ Foto mini 2 siap disimpan!');
                    } catch (err) {
                        showToast('❌ Gagal memproses file foto.', 'error');
                    }
                });
            }

            if (fVideoFile) {
                fVideoFile.addEventListener('change', async () => {
                    const file = fVideoFile.files[0];
                    if (!file) return;
                    if (file.size > 15 * 1024 * 1024) {
                        showToast('⚠️ File video terlalu besar (> 15MB). Disarankan gunakan link YouTube.', 'error');
                        fVideoFile.value = '';
                        return;
                    }
                    applyMediaTypeToggle('video');
                    showToast('⏳ Memproses file video...');

                    try {
                        // Jika ukuran <= 10MB, simpan sebagai Data URL agar kompatibel penuh dengan Vercel & pengunjung online!
                        if (file.size <= 10 * 1024 * 1024) {
                            const reader = new FileReader();
                            reader.onload = function (e) {
                                if (fVideoUrl) fVideoUrl.value = e.target.result;
                                updatePreview(file);
                                showToast('✅ File video siap disimpan (Base64 langsung kompatibel penuh untuk Vercel, maks 10MB)!');
                            };
                            reader.onerror = () => {
                                showToast('❌ Gagal membaca file video.', 'error');
                            };
                            reader.readAsDataURL(file);
                        } else {
                            // Video > 10MB (disimpan di IndexedDB browser lokal admin)
                            if (typeof BBC_STORE !== 'undefined' && BBC_STORE.setMediaBlob) {
                                await BBC_STORE.setMediaBlob('hero_main_video', file);
                                if (fVideoUrl) fVideoUrl.value = 'indexeddb:hero_main_video';
                            }
                            updatePreview(file);
                            showToast('✅ Video disimpan di browser lokal (> 10MB). Untuk tayang di Vercel publik, disarankan gunakan link YouTube!');
                        }
                    } catch (err) {
                        showToast('❌ Gagal memproses file video.', 'error');
                    }
                });
            }

            // Wire delete / clear buttons
            if (btnDeleteMainImg) {
                btnDeleteMainImg.addEventListener('click', deleteMainImgAction);
            }

            if (btnDeleteMainVideo) {
                btnDeleteMainVideo.addEventListener('click', deleteMainVideoAction);
            }

            if (btnDeleteThumb1) {
                btnDeleteThumb1.addEventListener('click', deleteThumb1Action);
            }

            if (btnDeleteThumb2) {
                btnDeleteThumb2.addEventListener('click', deleteThumb2Action);
            }

            // Wire URL and text inputs to live preview
            [fMainUrl, fVideoUrl, fMainAlt, fMainLabel, fThumb1Url, fThumb1Alt, fThumb1Lbl, fThumb2Url, fThumb2Alt, fThumb2Lbl].forEach(el => {
                if (el) el.addEventListener('input', updatePreview);
            });

            // Save form & button bindings
            if (formHero) {
                formHero.addEventListener('submit', saveHeroSettingsAction);
            }
            if (btnHeroSave) {
                btnHeroSave.addEventListener('click', saveHeroSettingsAction);
            }

            // Preview button
            if (btnHeroPreview) {
                btnHeroPreview.addEventListener('click', () => {
                    updatePreview();
                    showToast('👁️ Preview diperbarui! Lihat panel di atas.');
                });
            }

            // Reset button
            if (btnHeroReset) {
                btnHeroReset.addEventListener('click', resetHeroSettingsAction);
            }
        }

        // Always reload settings into fields and preview
        if (loadHeroFormFn) loadHeroFormFn();
    }

    // ========================================================
    // INITIALIZE & AUTH CHECK
    // ========================================================
    function renderAll() {
        renderPlayersTable();
        renderEventsTable();
        renderGalleryGrid();
        renderArticlesTable();
        renderOfficialsTable();
        updateTabCounts();
    }

    if (isAuthenticated()) {
        document.body.classList.remove('cms-auth-required');
        renderAll();
        initHeroSettings();
        initStorageUI();
        switchTab('dashboard');
    } else {
        document.body.classList.add('cms-auth-required');
        const userIn = document.getElementById('login-username');
        if (userIn) setTimeout(() => userIn.focus(), 150);
    }
});
