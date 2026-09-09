<?php
/**
 * BAZNAS Badminton Club (BBC) — Hero Banner Settings API
 * Endpoint: /api/hero.php
 * Method: GET, POST, PUT
 */

require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

function formatHero(array $row): array {
    return [
        'mediaType'    => $row['media_type'] ?: 'image',
        'mainImage'    => $row['main_image'] ?: '',
        'mainVideo'    => $row['main_video'] ?: '',
        'mainImageAlt' => $row['main_image_alt'] ?: '',
        'mainLabel'    => $row['main_label'] ?: '',
        'thumb1Image'  => $row['thumb1_image'] ?: '',
        'thumb1Alt'    => $row['thumb1_alt'] ?: '',
        'thumb1Label'  => $row['thumb1_label'] ?: '',
        'thumb2Image'  => $row['thumb2_image'] ?: '',
        'thumb2Alt'    => $row['thumb2_alt'] ?: '',
        'thumb2Label'  => $row['thumb2_label'] ?: '',
        'updatedAt'    => $row['updated_at'] ?? null
    ];
}

// -------------------------------------------------------------------------
// 1. GET: Ambil pengaturan hero banner
// -------------------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM `bbc_hero` WHERE `id` = 1 LIMIT 1");
    $row = $stmt->fetch();

    if (!$row) {
        $defaultHero = [
            'mediaType'    => 'image',
            'mainImage'    => 'https://images.unsplash.com/photo-1521537634581-0dced2efa2a3?auto=format&fit=crop&q=80&w=900',
            'mainVideo'    => '',
            'mainImageAlt' => 'Insan BAZNAS Badminton Club berlatih di lapangan',
            'mainLabel'    => '🔥 JUARA 2 !',
            'thumb1Image'  => '',
            'thumb1Alt'    => '',
            'thumb1Label'  => '',
            'thumb2Image'  => '',
            'thumb2Alt'    => '',
            'thumb2Label'  => ''
        ];
        Database::jsonResponse(['success' => true, 'hero' => $defaultHero]);
    }

    Database::jsonResponse(['success' => true, 'hero' => formatHero($row)]);
}

// -------------------------------------------------------------------------
// 2. POST / PUT: Update pengaturan hero banner
// -------------------------------------------------------------------------
if ($method === 'POST' || $method === 'PUT') {
    $input = Database::getJsonInput();

    // Fetch existing data for merge
    $stmt = $pdo->query("SELECT * FROM `bbc_hero` WHERE `id` = 1 LIMIT 1");
    $existing = $stmt->fetch() ?: [];

    $mediaType    = ($input['mediaType'] ?? ($existing['media_type'] ?? 'image')) === 'video' ? 'video' : 'image';
    $mainImage    = array_key_exists('mainImage', $input) ? $input['mainImage'] : ($existing['main_image'] ?? null);
    $mainVideo    = array_key_exists('mainVideo', $input) ? $input['mainVideo'] : ($existing['main_video'] ?? null);
    $mainImageAlt = array_key_exists('mainImageAlt', $input) ? $input['mainImageAlt'] : ($existing['main_image_alt'] ?? null);
    $mainLabel    = array_key_exists('mainLabel', $input) ? $input['mainLabel'] : ($existing['main_label'] ?? null);
    $thumb1Image  = array_key_exists('thumb1Image', $input) ? $input['thumb1Image'] : ($existing['thumb1_image'] ?? null);
    $thumb1Alt    = array_key_exists('thumb1Alt', $input) ? $input['thumb1Alt'] : ($existing['thumb1_alt'] ?? null);
    $thumb1Label  = array_key_exists('thumb1Label', $input) ? $input['thumb1Label'] : ($existing['thumb1_label'] ?? null);
    $thumb2Image  = array_key_exists('thumb2Image', $input) ? $input['thumb2Image'] : ($existing['thumb2_image'] ?? null);
    $thumb2Alt    = array_key_exists('thumb2Alt', $input) ? $input['thumb2Alt'] : ($existing['thumb2_alt'] ?? null);
    $thumb2Label  = array_key_exists('thumb2Label', $input) ? $input['thumb2Label'] : ($existing['thumb2_label'] ?? null);

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
        ':media_type'     => $mediaType,
        ':main_image'     => $mainImage,
        ':main_video'     => $mainVideo,
        ':main_image_alt' => $mainImageAlt,
        ':main_label'     => $mainLabel,
        ':thumb1_image'   => $thumb1Image,
        ':thumb1_alt'     => $thumb1Alt,
        ':thumb1_label'   => $thumb1Label,
        ':thumb2_image'   => $thumb2Image,
        ':thumb2_alt'     => $thumb2Alt,
        ':thumb2_label'   => $thumb2Label
    ]);

    $stmt = $pdo->query("SELECT * FROM `bbc_hero` WHERE `id` = 1 LIMIT 1");
    $updated = $stmt->fetch();

    Database::jsonResponse([
        'success' => true,
        'message' => 'Pengaturan hero berhasil disimpan ke database',
        'hero'    => formatHero($updated)
    ]);
}

Database::jsonResponse(['success' => false, 'error' => 'Metode HTTP tidak didukung'], 405);
