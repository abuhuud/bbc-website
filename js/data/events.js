/**
 * BAZNAS BADMINTON CLUB (BBC)
 * Events and Schedules Data
 * Dates are generated dynamically relative to current running date (tanggal berjalan)
 */
function _bbcDate(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const _BBC_DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
function _bbcDay(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return _BBC_DAYS[d.getDay()];
}

const events = [
    {
        id: "event-001",
        type: "training",
        typeName: "Latihan Rutin",
        title: "Sesi Latihan Internal BBC: Ganda Campuran",
        date: _bbcDate(2),
        dayName: _bbcDay(2),
        time: "07:00 - 09:30 WIB",
        venue: "GOR Bulutangkis Kebayoran Court 1 & 2",
        city: "Jakarta Selatan",
        locationUrl: "https://maps.google.com/?q=GOR+Badminton+Jakarta",
        status: "upcoming",
        description: "Latihan intensif persiapan sparring silaturahmi dengan simulasi pertandingan ganda campuran."
    },
    {
        id: "event-002",
        type: "training",
        typeName: "Latihan Rutin",
        title: "Latihan Rutin BBC: Teknik Defense & Footwork",
        date: _bbcDate(5),
        dayName: _bbcDay(5),
        time: "19:00 - 21:30 WIB",
        venue: "GOR Bulutangkis Kebayoran Court 2 & 3",
        city: "Jakarta Selatan",
        locationUrl: "https://maps.google.com/?q=GOR+Badminton+Jakarta",
        status: "upcoming",
        description: "Sesi latihan mingguan difokuskan pada rotasi ganda dan drill pertahanan smash untuk seluruh anggota BBC."
    },
    {
        id: "event-003",
        type: "friendly",
        typeName: "Friendly Match",
        title: "Sparing Silaturahmi: BBC vs BAZNAS DKI",
        date: _bbcDate(12),
        dayName: _bbcDay(12),
        time: "18:30 - 22:00 WIB",
        venue: "GOR Gelora Bung Karno Hall Badminton",
        city: "Jakarta Pusat",
        locationUrl: "https://maps.google.com/?q=GBK+Arena+Jakarta",
        status: "upcoming",
        description: "Laga persahabatan antar lembaga untuk mempererat silaturahmi amil zakat dengan 5 partai pertandingan (MS, WS, MD, WD, XD)."
    },
    {
        id: "event-004",
        type: "tournament",
        typeName: "Turnamen",
        title: "BAZNAS Super Smash Cup 2026 - Babak Penyisihan",
        date: _bbcDate(20),
        dayName: _bbcDay(20),
        time: "08:00 - 17:00 WIB",
        venue: "Hall Sport Center BAZNAS RI",
        city: "Jakarta Timur",
        locationUrl: "https://maps.google.com/?q=BAZNAS+RI",
        status: "upcoming",
        description: "Kompetisi tahunan internal BAZNAS RI mempertemukan tim ganda antar divisi untuk memperebutkan Piala Bergilir BBC."
    },
    {
        id: "event-005",
        type: "activity",
        typeName: "Gathering",
        title: "BBC Weekend Fun Match & Morning Jogging",
        date: _bbcDate(28),
        dayName: _bbcDay(28),
        time: "06:30 - 11:00 WIB",
        venue: "Kawasan Monas & GOR Kemenpora",
        city: "Jakarta Pusat",
        locationUrl: "https://maps.google.com/?q=Monas+Jakarta",
        status: "upcoming",
        description: "Aktivitas santai di akhir pekan bersama rekan-rekan BBC untuk menjaga kebugaran jasmani dan silaturahmi."
    },
    {
        id: "event-006",
        type: "friendly",
        typeName: "Friendly Match",
        title: "Sparing Pembuka Musim: BBC vs Mitra Zakat",
        date: _bbcDate(-4),
        dayName: _bbcDay(-4),
        time: "19:00 - 22:00 WIB",
        venue: "GOR Kebayoran Court 1",
        city: "Jakarta Selatan",
        locationUrl: "https://maps.google.com/?q=GOR+Badminton+Jakarta",
        status: "completed",
        description: "Pertandingan pembuka musim persahabatan awal tahun. Dokumentasi foto & skor resmi telah diarsipkan."
    },
    {
        id: "event-007",
        type: "training",
        typeName: "Latihan Rutin",
        title: "Latihan Rutin BBC: Drilling Smash & Rotasi Ganda",
        date: "2026-09-14",
        dayName: "Senin",
        time: "19:00 - 21:30 WIB",
        venue: "GOR Bulutangkis Kebayoran Court 1 & 2",
        city: "Jakarta Selatan",
        locationUrl: "https://maps.google.com/?q=GOR+Badminton+Jakarta",
        status: "upcoming",
        description: "Sesi latihan rutin dengan fokus drilling smash, rotasi posisi ganda, dan simulasi rally panjang."
    }
];