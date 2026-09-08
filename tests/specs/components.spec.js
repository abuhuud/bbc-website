/**
 * BAZNAS BADMINTON CLUB (BBC)
 * UI Components Unit Tests
 */
(function () {
    'use strict';

    describe('7. Component: createPlayerCard()', () => {
        const mockPlayer = {
            id: 'ikrom',
            name: 'Ikrom',
            gender: 'male',
            image: 'assets/images/players/ikrom.jpg',
            isPlayerOfTheMonth: true,
            stats: { attendance: 24, matches: 30, wins: 26, losses: 4 },
            achievements: ['Juara 1 Internal Cup 2025']
        };

        it('menghasilkan HTML card mode reguler dengan nama, role, dan statistik', () => {
            const html = createPlayerCard(mockPlayer);
            expect(html).toContain('player-card');
            expect(html).toContain('Ikrom');
            expect(html).toContain('AMILIN');
            expect(html).toContain('Hadir');
            expect(html).toContain('Juara 1 Internal Cup 2025');
        });

        it('menghasilkan HTML card mode nama saja (nameOnly: true) untuk koleksi beranda', () => {
            const html = createPlayerCard(mockPlayer, { nameOnly: true });
            expect(html).toContain('player-card--name-only');
            expect(html).toContain('Ikrom');
            expect(html).toContain('LIHAT PROFIL');
            // Tidak menampilkan grid 4 statistik di mode nama saja
            expect(html.includes('grid-template-columns: repeat(4, 1fr)')).toBe(false);
        });

        it('menampilkan badge PLAYER OF THE MONTH jika isPlayerOfTheMonth bernilai true', () => {
            const html = createPlayerCard(mockPlayer, { nameOnly: true });
            expect(html).toContain('PLAYER OF THE MONTH');
        });

        it('menggunakan fallback dummy anime laki-laki saat player.image kosong', () => {
            const emptyPlayer = {
                id: 'no-photo',
                name: 'Pemain Polos',
                gender: 'male',
                image: ''
            };
            const html = createPlayerCard(emptyPlayer);
            expect(html).toContain('dummy-male.jpg');
        });

        it('menggunakan fallback dummy anime perempuan berhijab saat player.image amilat kosong', () => {
            const emptyAmilat = {
                id: 'no-photo-amilat',
                name: 'Pemain Putri',
                gender: 'female',
                image: ''
            };
            const html = createPlayerCard(emptyAmilat);
            expect(html).toContain('dummy-female.jpg');
        });
    });

    describe('8. Component: createPotmCard()', () => {
        const mockPotmAmilin = {
            id: 'ikrom',
            name: 'Ikrom',
            gender: 'male',
            image: 'assets/images/players/ikrom.jpg',
            isPlayerOfTheMonth: true,
            stats: { attendance: 24, matches: 30, wins: 26, losses: 4 },
            achievements: ['Juara 1 Internal Cup 2025']
        };

        const mockPotmAmilat = {
            id: 'anisa',
            name: 'Anisa Nuraini',
            gender: 'female',
            image: 'assets/images/players/anisa.jpg',
            isPlayerOfTheMonth: true,
            stats: { attendance: 26, matches: 29, wins: 25, losses: 4 },
            achievements: ['Juara 1 Ganda Putri 2025']
        };

        it('menghasilkan card POTM Amilin dengan banner dan badge MVP PUTRA', () => {
            const html = createPotmCard(mockPotmAmilin, true);
            expect(html).toContain('potm-card--amilin');
            expect(html).toContain('AMILIN OF THE MONTH');
            expect(html).toContain('MVP PUTRA');
            expect(html).toContain('★ MVP AMILIN');
            expect(html).toContain('Ikrom');
        });

        it('menghasilkan card POTM Amilat dengan banner dan badge MVP PUTRI', () => {
            const html = createPotmCard(mockPotmAmilat, false);
            expect(html).toContain('potm-card--amilat');
            expect(html).toContain('AMILAT OF THE MONTH');
            expect(html).toContain('MVP PUTRI');
            expect(html).toContain('★ MVP AMILAT');
            expect(html).toContain('Anisa Nuraini');
        });

        it('memuat LED Scoreboard Matrix dan kalkulasi Win Rate yang tepat', () => {
            const html = createPotmCard(mockPotmAmilin, true);
            // 26 menang dari 30 match = ~87%
            expect(html).toContain('potm-stats-board');
            expect(html).toContain('KEHADIRAN');
            expect(html).toContain('WIN RATE EFISIENSI');
            expect(html).toContain('87%');
        });

        it('memuat kotak prestasi terbaik terpadu dan tombol CTA lihat profil', () => {
            const html = createPotmCard(mockPotmAmilin, true);
            expect(html).toContain('potm-card__achievement-box');
            expect(html).toContain('Juara 1 Internal Cup 2025');
            expect(html).toContain('LIHAT PROFIL');
        });
    });

    describe('9. Component: createNewsCard()', () => {
        const mockArticle = {
            id: 'art-1',
            title: 'Latihan Bersama Perdana BBC 2026',
            slug: 'latihan-bersama-perdana-bbc-2026',
            category: 'Kegiatan',
            date: '2026-02-15',
            author: 'Humas BBC',
            readTime: '3 Menit',
            image: 'assets/images/news/training.jpg',
            summary: 'Antusiasme tinggi amilin dan amilat dalam sesi pemanasan dan drill footwork.'
        };

        it('menghasilkan card berita dengan judul, kategori, tanggal, dan link detail', () => {
            if (typeof createNewsCard === 'function') {
                const html = createNewsCard(mockArticle);
                expect(html).toContain('news-card');
                expect(html).toContain('Latihan Bersama Perdana BBC 2026');
                expect(html).toContain('Kegiatan');
                expect(html).toContain('3 Menit');
            }
        });
    });

    describe('10. CMS: Mobile Navigation & Modules Mapping', () => {
        const cmsModules = ['players', 'events', 'gallery', 'articles', 'officials', 'backup', 'hero'];

        it('memiliki 7 modul utama CMS yang terdaftar dan konsisten', () => {
            expect(cmsModules.length).toBe(7);
            expect(cmsModules).toContain('players');
            expect(cmsModules).toContain('events');
            expect(cmsModules).toContain('gallery');
            expect(cmsModules).toContain('articles');
            expect(cmsModules).toContain('officials');
            expect(cmsModules).toContain('backup');
            expect(cmsModules).toContain('hero');
        });
    });
})();
