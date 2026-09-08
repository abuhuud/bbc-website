# BAZNAS Badminton Club (BBC) Website

> **Creative Concept**: "PIXEL SMASH CLUB" — Wild, Fun, Colorful & High-Energy Sports Collectibles Edition  
> **Dominant Color**: BAZNAS Green (`#009B63`) & Court Forest Green (`#025335`) with Cyber Neon Lime (`#00FF87`)  
> **Target Audience**: Internal Amilin & Amilat BAZNAS RI (Strictly Internal Sports Community)

---

## 🏸 Overview & Core Philosophy

BAZNAS Badminton Club (BBC) adalah komunitas olahraga bulutangkis internal resmi Badan Amil Zakat Nasional (BAZNAS) RI. Website ini didesain secara profesional dengan identitas visual yang khas, energetik, dan berani ("liar" namun tetap fungsional dan terstruktur rapi).

> **PENTING / STRICT BUSINESS RULE**:
> Website ini **BUKAN** platform recruitment terbuka untuk umum. Tidak ada tombol "Gabung BBC", form registrasi, atau pendaftaran publik. Seluruh call-to-action (CTA) sosial dan community diarahkan ke **Instagram resmi BBC**.

---

## 🎨 Visual System & "Wild" Features

1. **Dominasi Hijau BAZNAS**:
   - Signature Green (`#009B63`) & Deep Court Green (`#025335`)
   - Cyber Neon Lime Highlight (`#00FF87`)
   - Pixel Sunshine Yellow (`#FFD83D`) & Sport Orange (`#FF7324`)
   - Neo-Brutalist 3px solid black outlines with chunky solid offset drop-shadows (`6px 6px 0 var(--color-dark)`).
2. **Infinite Marquee Tickers**:
   - Running sports ticker banner dengan micro-copy dinamis (`🏸 BAZNAS BADMINTON CLUB ✦ MAIN BARENG SEHAT BARENG ✦ SMASH! PLAY! REPEAT! ✦ 100% INTERNAL BAZNAS RI`).
3. **Sports Collectible Trading Cards & RPG Power Meters**:
   - Kartu pemain dilengkapi bilah statistik: **Smash Power**, **Court Defense**, **Agility & Speed**, serta **Match Stamina**.
   - Badge keahlian khusus (*"Net Kill & Flick Serve"*, *"Steep Jump Smash (380 km/h)"*, dsb).
4. **Perforated Match Tickets**:
   - Tiket pertandingan bulutangkis dengan efek lubang sobekan tiket nyata (`.ticket-notch-top`, `.ticket-notch-bottom`), status live court, dan petunjuk lokasi Google Maps.
5. **Retro LED Pixel Scoreboard**:
   - Papan skor vintage LED dengan CRT scanline micro-effects dan angka pixel bercahaya.

---

## ⚙️ Centralized Configuration (`js/config.js`)

Semua tautan sosial dan informasi klub dikelola secara terpusat pada satu file:

```javascript
const SITE_CONFIG = {
    clubName: "BAZNAS Badminton Club",
    clubShortName: "BBC",
    organization: "BAZNAS RI",
    tagline: "Main Bareng. Sehat Bareng.",
    instagramUrl: "https://www.instagram.com/baznas_badmintonclub/",
    instagramUsername: "@baznas_badmintonclub",
    currentYear: 2026
};
```

---

## 📁 Struktur Direktori Bersih

```
bbc-website/
├── index.html            # Beranda lengkap (12 section terpadu + marquee ticker)
├── profile.html          # Profil BBC, Sejarah, Visi Misi & Pengurus
├── players.html          # Direktori Skuad Pemain & Filter Kategori
├── player-detail.html    # Player Select UI Detail + RPG Power Meters
├── schedule.html         # Kalender Jadwal Latihan, Sparing & Turnamen
├── news.html             # Berita & Editorial Bulutangkis
├── article-detail.html   # Pembaca Artikel Lengkap
├── README.md             # Dokumentasi arsitektur & panduan
│
├── assets/
│   ├── images/
│   │   ├── brand/       # Logo resmi BBC (.svg)
│   │   ├── hero/        # Kolase foto pertandingan
│   │   ├── players/
│   │   │   ├── male/    # Skuad putra
│   │   │   └── female/  # Skuad putri
│   │   ├── activities/  # Dokumentasi aktivitas latihan & sparing
│   │   ├── gallery/     # Foto momen lapangan
│   │   └── news/        # Gambar editorial berita
│   ├── icons/           # Shuttlecock vector (.svg)
│   └── fonts/           # Webfonts
│
├── css/
│   ├── reset.css         # CSS Reset modern
│   ├── variables.css     # Design Tokens (Dominan Hijau BAZNAS)
│   ├── typography.css    # Barlow Condensed, Plus Jakarta Sans, Silkscreen
│   ├── layout.css        # Responsive Container & Grid
│   ├── pixel-system.css  # Marquee, Scoreboard LED, Power Meters, Badges
│   ├── components.css    # Trading Cards, Perforated Tickets, Buttons, Navbar
│   ├── animations.css    # Ticker Scroll, Pulse Neon, Hover Pop
│   ├── responsive.css    # Mobile Breakpoints (360px - 1920px)
│   └── main.css          # Master Stylesheet Importer
│
└── js/
    ├── config.js         # Konfigurasi Instagram & Identitas Terpusat
    ├── data/
    │   ├── players.js    # Data Skuad & Power Stats
    │   ├── events.js     # Data Jadwal Latihan & Turnamen
    │   └── news.js       # Data Artikel & Berita Lapangan
    ├── utils/
    │   ├── date.js       # Helper Format Tanggal Indonesia
    │   ├── filters.js    # Helper Filter Skuad & Kategori
    │   └── dom.js        # Helper DOM & Scroll Reveal
    ├── components/
    │   ├── navbar.js     # Reusable Sticky Header & Drawer
    │   ├── footer.js     # Reusable Semantic Footer
    │   ├── player-card.js# Sports Trading Card Renderer (Power Meters)
    │   ├── event-card.js # Event Ticket (Perforated Stub) Renderer
    │   └── news-card.js  # Editorial News Card Renderer
    ├── pages/
    │   ├── home.js       # Interaktivitas Beranda & Filter Instan
    │   ├── players.js    # Filter Direktori Pemain
    │   ├── player-detail.js # Player Select & Collectible Specs
    │   ├── schedule.js   # Filter Agenda & Kalender
    │   ├── news.js       # Filter Berita & Artikel
    │   └── article-detail.js # Artikel Lengkap Renderer
    └── main.js           # Global Orchestrator
```

---

## 🚀 Cara Menjalankan

Cukup buka `index.html` langsung di browser Anda atau jalankan melalui live server lokal favorit Anda. Seluruh tautan navigasi, filter skuad pemain, dynamic ticket renderer, dan routing berbasis query parameter telah teruji tanpa broken link.
