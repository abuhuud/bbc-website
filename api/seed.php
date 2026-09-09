<?php
/**
 * BAZNAS Badminton Club (BBC) — Auto Database Migration & Seeder
 * Mengeksekusi schema.sql dan mengimpor seluruh data dari file data/*.json ke database MySQL.
 */

require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();

$results = [
    'schema'    => false,
    'players'   => 0,
    'events'    => 0,
    'articles'  => 0,
    'gallery'   => 0,
    'officials' => 0,
    'hero'      => false,
    'errors'    => []
];

try {
    // 1. Eksekusi Schema DDL jika tabel belum ada
    $schemaFile = __DIR__ . '/../database/schema.sql';
    if (file_exists($schemaFile)) {
        $sql = file_get_contents($schemaFile);
        $pdo->exec($sql);
        $results['schema'] = true;
    }

    $baseDataDir = __DIR__ . '/../data';

    // 2. Seed Players
    $playersFile = $baseDataDir . '/players.json';
    if (file_exists($playersFile)) {
        $data = json_decode(file_get_contents($playersFile), true);
        $list = $data['players'] ?? (is_array($data) ? $data : []);
        
        $stmt = $pdo->prepare("
            INSERT INTO `bbc_players` 
                (`name`, `slug`, `gender`, `role`, `position`, `image`, `is_player_of_the_month`, 
                 `attendance`, `matches`, `wins`, `losses`, `bio`, `gallery_json`)
            VALUES 
                (:name, :slug, :gender, :role, :position, :image, :is_potm, 
                 :attendance, :matches, :wins, :losses, :bio, :gallery_json)
            ON DUPLICATE KEY UPDATE
                `name` = VALUES(`name`),
                `gender` = VALUES(`gender`),
                `role` = VALUES(`role`),
                `position` = VALUES(`position`),
                `image` = VALUES(`image`),
                `is_player_of_the_month` = VALUES(`is_player_of_the_month`),
                `attendance` = VALUES(`attendance`),
                `matches` = VALUES(`matches`),
                `wins` = VALUES(`wins`),
                `losses` = VALUES(`losses`),
                `bio` = VALUES(`bio`),
                `gallery_json` = VALUES(`gallery_json`)
        ");

        foreach ($list as $p) {
            $stats = $p['stats'] ?? [];
            $galleryJson = isset($p['gallery']) ? json_encode($p['gallery'], JSON_UNESCAPED_UNICODE) : null;
            $slug = !empty($p['slug']) ? $p['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $p['name'])));

            $stmt->execute([
                ':name'         => $p['name'] ?? '',
                ':slug'         => $slug,
                ':gender'       => ($p['gender'] ?? 'male') === 'female' ? 'female' : 'male',
                ':role'         => $p['role'] ?? 'Ganda Putra',
                ':position'     => $p['position'] ?? 'All-Round',
                ':image'        => $p['image'] ?? null,
                ':is_potm'      => !empty($p['isPlayerOfTheMonth']) ? 1 : 0,
                ':attendance'   => (int)($stats['attendance'] ?? 0),
                ':matches'      => (int)($stats['matches'] ?? 0),
                ':wins'         => (int)($stats['wins'] ?? 0),
                ':losses'       => (int)($stats['losses'] ?? 0),
                ':bio'          => $p['bio'] ?? null,
                ':gallery_json' => $galleryJson
            ]);
            $results['players']++;
        }
    }

    // 3. Seed Events
    $eventsFile = $baseDataDir . '/events.json';
    if (file_exists($eventsFile)) {
        $data = json_decode(file_get_contents($eventsFile), true);
        $list = $data['events'] ?? (is_array($data) ? $data : []);

        $stmt = $pdo->prepare("
            INSERT INTO `bbc_events` (`title`, `date`, `time`, `location`, `category`, `description`, `day_name`, `is_past`)
            VALUES (:title, :date, :time, :location, :category, :description, :day_name, :is_past)
        ");

        foreach ($list as $ev) {
            $stmt->execute([
                ':title'       => $ev['title'] ?? 'Latihan Bulutangkis',
                ':date'        => $ev['date'] ?? date('Y-m-d'),
                ':time'        => $ev['time'] ?? '19:00 - 22:00 WIB',
                ':location'    => $ev['location'] ?? 'Lapangan BAZNAS',
                ':category'    => $ev['category'] ?? 'Latihan Rutin',
                ':description' => $ev['description'] ?? null,
                ':day_name'    => $ev['dayName'] ?? null,
                ':is_past'     => !empty($ev['isPast']) ? 1 : 0
            ]);
            $results['events']++;
        }
    }

    // 4. Seed Articles
    $articlesFile = $baseDataDir . '/articles.json';
    if (file_exists($articlesFile)) {
        $data = json_decode(file_get_contents($articlesFile), true);
        $list = $data['articles'] ?? (is_array($data) ? $data : []);

        $stmt = $pdo->prepare("
            INSERT INTO `bbc_articles` 
                (`title`, `slug`, `category`, `author`, `date`, `excerpt`, `content`, `cover_image`, `views`, `tags_json`)
            VALUES 
                (:title, :slug, :category, :author, :date, :excerpt, :content, :cover_image, :views, :tags_json)
            ON DUPLICATE KEY UPDATE
                `title` = VALUES(`title`),
                `category` = VALUES(`category`),
                `author` = VALUES(`author`),
                `date` = VALUES(`date`),
                `excerpt` = VALUES(`excerpt`),
                `content` = VALUES(`content`),
                `cover_image` = VALUES(`cover_image`),
                `views` = VALUES(`views`),
                `tags_json` = VALUES(`tags_json`)
        ");

        foreach ($list as $art) {
            $slug = !empty($art['slug']) ? $art['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $art['title'])));
            $tagsJson = isset($art['tags']) ? json_encode($art['tags'], JSON_UNESCAPED_UNICODE) : null;

            $stmt->execute([
                ':title'       => $art['title'] ?? '',
                ':slug'        => $slug,
                ':category'    => $art['category'] ?? 'Berita',
                ':author'      => $art['author'] ?? 'Humas BBC',
                ':date'        => $art['date'] ?? date('Y-m-d'),
                ':excerpt'     => $art['excerpt'] ?? '',
                ':content'     => $art['content'] ?? '',
                ':cover_image' => $art['coverImage'] ?? null,
                ':views'       => (int)($art['views'] ?? 0),
                ':tags_json'   => $tagsJson
            ]);
            $results['articles']++;
        }
    }

    // 5. Seed Gallery
    $galleryFile = $baseDataDir . '/gallery.json';
    if (file_exists($galleryFile)) {
        $data = json_decode(file_get_contents($galleryFile), true);
        $list = $data['gallery'] ?? (is_array($data) ? $data : []);

        $stmt = $pdo->prepare("
            INSERT INTO `bbc_gallery` (`title`, `caption`, `image_url`, `category`, `date`)
            VALUES (:title, :caption, :image_url, :category, :date)
        ");

        foreach ($list as $g) {
            $stmt->execute([
                ':title'     => $g['title'] ?? 'Momen BBC',
                ':caption'   => $g['caption'] ?? '',
                ':image_url' => $g['imageUrl'] ?? ($g['image'] ?? ''),
                ':category'  => $g['category'] ?? 'Latihan',
                ':date'      => $g['date'] ?? date('Y-m-d')
            ]);
            $results['gallery']++;
        }
    }

    // 6. Seed Officials
    $officialsFile = $baseDataDir . '/officials.json';
    if (file_exists($officialsFile)) {
        $data = json_decode(file_get_contents($officialsFile), true);
        $list = $data['officials'] ?? (is_array($data) ? $data : []);

        $stmt = $pdo->prepare("
            INSERT INTO `bbc_officials` (`name`, `role`, `category`, `photo`, `sort_order`)
            VALUES (:name, :role, :category, :photo, :sort_order)
        ");

        $sort = 1;
        foreach ($list as $off) {
            $stmt->execute([
                ':name'       => $off['name'] ?? '',
                ':role'       => $off['role'] ?? '',
                ':category'   => $off['category'] ?? 'Pengurus Harian',
                ':photo'      => $off['photo'] ?? null,
                ':sort_order' => (int)($off['sortOrder'] ?? $sort++)
            ]);
            $results['officials']++;
        }
    }

    // 7. Seed Hero
    $heroFile = $baseDataDir . '/hero.json';
    if (file_exists($heroFile)) {
        $data = json_decode(file_get_contents($heroFile), true);
        $h = $data['hero'] ?? $data;

        $stmt = $pdo->prepare("
            INSERT INTO `bbc_hero` (
                `id`, `media_type`, `main_image`, `main_video`, `main_image_alt`, `main_label`,
                `thumb1_image`, `thumb1_alt`, `thumb1_label`,
                `thumb2_image`, `thumb2_alt`, `thumb2_label`
            ) VALUES (
                1, :media_type, :main_image, :main_video, :main_image_alt, :main_label,
                :thumb1_image, :thumb1_alt, :thumb1_label,
                :thumb2_image, :thumb2_alt, :thumb2_label
            ) ON DUPLICATE KEY UPDATE
                `media_type`     = VALUES(`media_type`),
                `main_image`     = VALUES(`main_image`),
                `main_video`     = VALUES(`main_video`),
                `main_image_alt` = VALUES(`main_image_alt`),
                `main_label`     = VALUES(`main_label`),
                `thumb1_image`   = VALUES(`thumb1_image`),
                `thumb1_alt`     = VALUES(`thumb1_alt`),
                `thumb1_label`   = VALUES(`thumb1_label`),
                `thumb2_image`   = VALUES(`thumb2_image`),
                `thumb2_alt`     = VALUES(`thumb2_alt`),
                `thumb2_label`   = VALUES(`thumb2_label`)
        ");

        $stmt->execute([
            ':media_type'     => ($h['mediaType'] ?? 'image') === 'video' ? 'video' : 'image',
            ':main_image'     => $h['mainImage'] ?? null,
            ':main_video'     => $h['mainVideo'] ?? null,
            ':main_image_alt' => $h['mainImageAlt'] ?? null,
            ':main_label'     => $h['mainLabel'] ?? null,
            ':thumb1_image'   => $h['thumb1Image'] ?? null,
            ':thumb1_alt'     => $h['thumb1Alt'] ?? null,
            ':thumb1_label'   => $h['thumb1Label'] ?? null,
            ':thumb2_image'   => $h['thumb2Image'] ?? null,
            ':thumb2_alt'     => $h['thumb2Alt'] ?? null,
            ':thumb2_label'   => $h['thumb2Label'] ?? null
        ]);
        $results['hero'] = true;
    }

    Database::jsonResponse([
        'success' => true,
        'message' => 'Database seeding & migration completed successfully.',
        'data'    => $results
    ]);

} catch (Exception $e) {
    Database::jsonResponse([
        'success' => false,
        'error'   => $e->getMessage(),
        'data'    => $results
    ], 500);
}
