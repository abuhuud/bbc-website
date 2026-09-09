<?php
/**
 * BAZNAS Badminton Club (BBC) — Gallery API
 * Endpoint: /api/gallery.php
 * Method: GET, POST, DELETE
 */

require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

function formatGallery(array $row): array {
    return [
        'id'        => (int)$row['id'],
        'title'     => $row['title'],
        'caption'   => $row['caption'] ?: '',
        'imageUrl'  => $row['image_url'],
        'category'  => $row['category'],
        'date'      => $row['date'],
        'createdAt' => $row['created_at'] ?? null
    ];
}

// -------------------------------------------------------------------------
// 1. GET: Ambil foto galeri
// -------------------------------------------------------------------------
if ($method === 'GET') {
    $category = $_GET['category'] ?? null;
    $id       = $_GET['id'] ?? null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM `bbc_gallery` WHERE `id` = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            Database::jsonResponse(['success' => false, 'error' => 'Foto galeri tidak ditemukan'], 404);
        }
        Database::jsonResponse(['success' => true, 'gallery' => formatGallery($row)]);
    }

    $sql = "SELECT * FROM `bbc_gallery`";
    $params = [];
    if ($category && $category !== 'all') {
        $sql .= " WHERE `category` = :category";
        $params[':category'] = $category;
    }
    $sql .= " ORDER BY `date` DESC, `id` DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $gallery = array_map('formatGallery', $rows);
    Database::jsonResponse([
        'success' => true,
        'total'   => count($gallery),
        'gallery' => $gallery
    ]);
}

// -------------------------------------------------------------------------
// 2. POST: Tambah foto galeri baru
// -------------------------------------------------------------------------
if ($method === 'POST') {
    $input = Database::getJsonInput();
    $imgUrl = trim($input['imageUrl'] ?? ($input['image'] ?? ''));

    if (empty($imgUrl)) {
        Database::jsonResponse(['success' => false, 'error' => 'URL foto galeri wajib diisi'], 400);
    }

    $stmt = $pdo->prepare("
        INSERT INTO `bbc_gallery` (`title`, `caption`, `image_url`, `category`, `date`)
        VALUES (:title, :caption, :image_url, :category, :date)
    ");

    $stmt->execute([
        ':title'     => trim($input['title'] ?? 'Momen BBC'),
        ':caption'   => trim($input['caption'] ?? ''),
        ':image_url' => $imgUrl,
        ':category'  => trim($input['category'] ?? 'Latihan'),
        ':date'      => $input['date'] ?? date('Y-m-d')
    ]);

    $newId = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM `bbc_gallery` WHERE `id` = :id");
    $stmt->execute([':id' => $newId]);
    $created = $stmt->fetch();

    Database::jsonResponse([
        'success' => true,
        'message' => 'Foto galeri berhasil ditambahkan',
        'item'    => formatGallery($created)
    ], 201);
}

// -------------------------------------------------------------------------
// 3. DELETE: Hapus foto galeri
// -------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $input = Database::getJsonInput();
        $id = $input['id'] ?? null;
    }

    if (!$id) {
        Database::jsonResponse(['success' => false, 'error' => 'Parameter ID galeri wajib diberikan'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM `bbc_gallery` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        Database::jsonResponse(['success' => false, 'error' => 'Item galeri tidak ditemukan atau sudah dihapus'], 404);
    }

    Database::jsonResponse([
        'success' => true,
        'message' => 'Foto galeri berhasil dihapus dari database'
    ]);
}

Database::jsonResponse(['success' => false, 'error' => 'Metode HTTP tidak didukung'], 405);
