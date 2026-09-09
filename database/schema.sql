-- ==========================================================
-- BAZNAS Badminton Club (BBC) — Database Schema (MySQL)
-- Versi: 3.0.0
-- Karakter Set: utf8mb4 (dukungan penuh emoji & multibyte)
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. TABEL: bbc_users (Autentikasi Pengelola CMS)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbc_users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin credential: user 'admin', pass 'bbc2026' (bcrypt hash)
INSERT INTO `bbc_users` (`username`, `password_hash`, `role`)
VALUES ('admin', '$2y$10$Q7eYc4zX2Uo5L2xL7N9pUeE0Y6jB2.b1qgJ7e3VvH8aQ2W9fX6sLe', 'admin')
ON DUPLICATE KEY UPDATE `username` = `username`;

-- ----------------------------------------------------------
-- 2. TABEL: bbc_players (Data Pemain)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbc_players` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `gender` ENUM('male', 'female') NOT NULL DEFAULT 'male',
  `role` VARCHAR(50) NOT NULL DEFAULT 'Ganda Putra',
  `position` VARCHAR(50) NOT NULL DEFAULT 'All-Round',
  `image` MEDIUMTEXT DEFAULT NULL,
  `is_player_of_the_month` TINYINT(1) NOT NULL DEFAULT 0,
  `attendance` INT UNSIGNED NOT NULL DEFAULT 0,
  `matches` INT UNSIGNED NOT NULL DEFAULT 0,
  `wins` INT UNSIGNED NOT NULL DEFAULT 0,
  `losses` INT UNSIGNED NOT NULL DEFAULT 0,
  `bio` TEXT DEFAULT NULL,
  `gallery_json` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_gender` (`gender`),
  INDEX `idx_potm` (`is_player_of_the_month`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. TABEL: bbc_events (Jadwal & Agenda Latihan/Turnamen)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbc_events` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(50) NOT NULL DEFAULT '19:00 - 22:00 WIB',
  `location` VARCHAR(150) NOT NULL DEFAULT 'Lapangan BAZNAS',
  `category` VARCHAR(50) NOT NULL DEFAULT 'Latihan Rutin',
  `description` TEXT DEFAULT NULL,
  `day_name` VARCHAR(20) DEFAULT NULL,
  `is_past` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_date` (`date`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. TABEL: bbc_articles (Berita & Artikel)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbc_articles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Berita',
  `author` VARCHAR(100) NOT NULL DEFAULT 'Humas BBC',
  `date` DATE NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `cover_image` MEDIUMTEXT DEFAULT NULL,
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `tags_json` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_date` (`date`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. TABEL: bbc_gallery (Galeri Momen Kegiatan)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbc_gallery` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `caption` TEXT DEFAULT NULL,
  `image_url` MEDIUMTEXT NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Latihan',
  `date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. TABEL: bbc_officials (Struktur Pengurus Organisasi)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbc_officials` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Pengurus Harian',
  `photo` MEDIUMTEXT DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 7. TABEL: bbc_hero (Pengaturan Banner Hero Beranda)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbc_hero` (
  `id` INT UNSIGNED PRIMARY KEY DEFAULT 1,
  `media_type` ENUM('image', 'video') NOT NULL DEFAULT 'image',
  `main_image` MEDIUMTEXT DEFAULT NULL,
  `main_video` LONGTEXT DEFAULT NULL,
  `main_image_alt` VARCHAR(255) DEFAULT NULL,
  `main_label` VARCHAR(100) DEFAULT NULL,
  `thumb1_image` MEDIUMTEXT DEFAULT NULL,
  `thumb1_alt` VARCHAR(255) DEFAULT NULL,
  `thumb1_label` VARCHAR(100) DEFAULT NULL,
  `thumb2_image` MEDIUMTEXT DEFAULT NULL,
  `thumb2_alt` VARCHAR(255) DEFAULT NULL,
  `thumb2_label` VARCHAR(100) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default row untuk hero
INSERT INTO `bbc_hero` (`id`, `media_type`, `main_image`, `main_image_alt`, `main_label`, `thumb1_alt`, `thumb1_label`, `thumb2_alt`, `thumb2_label`)
VALUES (1, 'image', 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=900', 'Pembagian Piala dan Medali Perak Juara 2 Fun Sport HFI 2026', '🔥 JUARA 2 !', 'Medali Emas Juara 1 Ganda Putri Fun Sport HFI 2026', '🔥 JUARA 1 !', 'Juara 2 Fun Sport HFI 2026', 'Fun Sport HFI 2026')
ON DUPLICATE KEY UPDATE `id` = 1;

SET FOREIGN_KEY_CHECKS = 1;
