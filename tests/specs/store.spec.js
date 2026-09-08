/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Store & Data Layer Unit Tests
 */
(function () {
    'use strict';

    describe('1. Utility: slugify()', () => {
        it('mengubah nama biasa menjadi slug huruf kecil dengan pemisah tanda hubung', () => {
            const slug = BBC_STORE.slugify('Ikrom');
            expect(slug).toBe('ikrom');
        });

        it('mengubah nama dengan spasi ganda dan huruf besar', () => {
            const slug = BBC_STORE.slugify('Farhan   Maulana');
            expect(slug).toBe('farhan-maulana');
        });

        it('membersihkan karakter khusus dan tanda baca', () => {
            const slug = BBC_STORE.slugify('Siti Rahmawati, S.Kom! (Amilat)');
            expect(slug).toBe('siti-rahmawati-skom-amilat');
        });

        it('menghapus tanda hubung di awal dan akhir string', () => {
            const slug = BBC_STORE.slugify('---Dimas Anggoro---');
            expect(slug).toBe('dimas-anggoro');
        });

        it('menangani string kosong secara aman', () => {
            const slug = BBC_STORE.slugify('');
            expect(slug).toBe('');
        });
    });

    describe('2. Media Fallback: Anime Dummy Photo Resolution', () => {
        it('mengembalikan foto dummy anime laki-laki untuk amilin tanpa foto', () => {
            const photo = BBC_STORE.getDummyPhoto('male');
            expect(photo).toContain('dummy-male.jpg');
        });

        it('mengembalikan foto dummy anime perempuan berhijab untuk amilat tanpa foto', () => {
            const photo = BBC_STORE.getDummyPhoto('female');
            expect(photo).toContain('dummy-female.jpg');
        });

        it('getPlayerPhoto() mempertahankan URL foto kustom jika tersedia', () => {
            const customPlayer = {
                id: 'test-1',
                name: 'Pemain Kustom',
                gender: 'male',
                image: 'https://images.unsplash.com/custom-photo.jpg'
            };
            const photo = BBC_STORE.getPlayerPhoto(customPlayer);
            expect(photo).toBe('https://images.unsplash.com/custom-photo.jpg');
        });

        it('getPlayerPhoto() fallback ke anime laki-laki jika image kosong/null', () => {
            const emptyMale = { id: 'test-male', name: 'Budi', gender: 'male', image: '' };
            const photo = BBC_STORE.getPlayerPhoto(emptyMale);
            expect(photo).toContain('dummy-male.jpg');
        });

        it('getPlayerPhoto() fallback ke anime perempuan berhijab jika image kosong/null', () => {
            const emptyFemale = { id: 'test-female', name: 'Aisyah', gender: 'female', image: '   ' };
            const photo = BBC_STORE.getPlayerPhoto(emptyFemale);
            expect(photo).toContain('dummy-female.jpg');
        });
    });

    describe('3. BBC_STORE: Players Retrieval & Normalization', () => {
        it('getPlayers() mengembalikan array pemain dengan data valid', () => {
            const playersList = BBC_STORE.getPlayers();
            expect(Array.isArray(playersList)).toBe(true);
            expect(playersList.length).toBeGreaterThan(0);
        });

        it('setiap pemain memiliki properti id, name, gender, dan slug yang otomatis terisi', () => {
            const playersList = BBC_STORE.getPlayers();
            const first = playersList[0];
            expect(typeof first.id).toBe('string');
            expect(typeof first.name).toBe('string');
            expect(typeof first.gender).toBe('string');
            expect(typeof first.slug).toBe('string');
            expect(first.slug.length).toBeGreaterThan(0);
        });

        it('atribut nickname dan nomor punggung telah dibersihkan dari objek pemain', () => {
            const playersList = BBC_STORE.getPlayers();
            playersList.forEach(p => {
                expect(typeof p.number).toBe('undefined');
                expect(typeof p.nickname).toBe('undefined');
            });
        });

        it('getPlayerById() dapat menemukan pemain berdasarkan id', () => {
            const found = BBC_STORE.getPlayerById('ikrom');
            expect(found !== null).toBe(true);
            expect(found.name).toBe('Ikrom');
        });

        it('getPlayerById() dapat menemukan pemain berdasarkan slug nama', () => {
            const found = BBC_STORE.getPlayerById('farhan-maulana');
            expect(found !== null).toBe(true);
            expect(found.name).toBe('Farhan Maulana');
        });

        it('getPlayerById() mengembalikan null untuk id yang tidak ada', () => {
            const found = BBC_STORE.getPlayerById('pemain-fiktif-999');
            expect(found).toBe(null);
        });
    });

    describe('4. BBC_STORE: Strict Single POTM Rules', () => {
        it('getPlayersOfTheMonth() mengembalikan tepat 1 Amilin dan 1 Amilat', () => {
            const potm = BBC_STORE.getPlayersOfTheMonth();
            expect(potm !== null).toBe(true);
            expect(potm.amilin !== null).toBe(true);
            expect(potm.amilin.gender).toBe('male');
            expect(potm.amilat !== null).toBe(true);
            expect(potm.amilat.gender).toBe('female');
        });

        it('mengaktifkan POTM putra baru menonaktifkan POTM putra sebelumnya', () => {
            const playersList = BBC_STORE.getPlayers();
            const malePlayers = playersList.filter(p => p.gender === 'male');
            if (malePlayers.length >= 2) {
                const p1 = malePlayers[0];
                const p2 = malePlayers[1];

                BBC_STORE.setPlayerOfTheMonth(p1.id, true);
                let current = BBC_STORE.getPlayersOfTheMonth();
                expect(current.amilin.id).toBe(p1.id);

                BBC_STORE.setPlayerOfTheMonth(p2.id, true);
                current = BBC_STORE.getPlayersOfTheMonth();
                expect(current.amilin.id).toBe(p2.id);

                // Pastikan p1 tidak lagi POTM
                const p1Fresh = BBC_STORE.getPlayerById(p1.id);
                expect(p1Fresh.isPlayerOfTheMonth).toBe(false);
            }
        });
    });

    describe('5. BBC_STORE: Player Persistence (CRUD)', () => {
        const testId = 'player-test-unit-123';

        it('savePlayer() mampu menambah pemain baru dengan slug otomatis', () => {
            const newPlayer = {
                id: testId,
                name: 'Bambang Sudirman',
                gender: 'male',
                stats: { attendance: 12, matches: 15, wins: 10, losses: 5 },
                achievements: ['Juara Turnamen Mini 2026']
            };
            BBC_STORE.savePlayer(newPlayer);

            const saved = BBC_STORE.getPlayerById(testId);
            expect(saved !== null).toBe(true);
            expect(saved.name).toBe('Bambang Sudirman');
            expect(saved.slug).toBe('bambang-sudirman');
        });

        it('savePlayer() mampu memperbarui nama dan sinkronisasi slug baru', () => {
            const player = BBC_STORE.getPlayerById(testId);
            player.name = 'Bambang Prakoso';
            BBC_STORE.savePlayer(player);

            const updated = BBC_STORE.getPlayerById(testId);
            expect(updated.name).toBe('Bambang Prakoso');
            expect(updated.slug).toBe('bambang-prakoso');
        });

        it('deletePlayer() mampu menghapus pemain dari penyimpanan', () => {
            BBC_STORE.deletePlayer(testId);
            const deleted = BBC_STORE.getPlayerById(testId);
            expect(deleted).toBe(null);
        });
    });

    describe('6. BBC_STORE: Agenda & Event Schedule', () => {
        it('getEvents() mengembalikan daftar agenda terjadwal', () => {
            const events = BBC_STORE.getEvents();
            expect(Array.isArray(events)).toBe(true);
            expect(events.length).toBeGreaterThan(0);
        });

        it('setiap event memiliki properti id, title, date, time, dan location', () => {
            const events = BBC_STORE.getEvents();
            const first = events[0];
            expect(typeof first.id).toBe('string');
            expect(typeof first.title).toBe('string');
            expect(typeof first.date).toBe('string');
            expect(typeof first.time).toBe('string');
            expect(typeof first.location).toBe('string');
        });
    });
})();
