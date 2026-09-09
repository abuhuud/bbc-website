<?php
/**
 * BAZNAS Badminton Club (BBC) — Articles / News API
 * Endpoint: /api/articles.php
 * Method: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Helper to format article row
function formatArticle(array $row): array {
    return [
        'id'         => (int)$row['id'],
        'title'      => $row['title'],
        'slug'       => $row['slug'],
        'category'   => $row['category'],
        'author'     => $row['author'],
        'date'       => $row['date'],
        'excerpt'    => $row['excerpt'],
        'content'    => $row['content'],
        'coverImage' => $row['cover_image'] ?: '',
        'views'      => (int)$row['views'],
        'tags'       => !empty($row['tags_json']) ? json_decode($row['tags_json'], true) : [],
        'createdAt'  => $row['created_at'] ?? null,
        'updatedAt'  => $row['updated_at'] ?? null
    ];
}

// -------------------------------------------------------------------------
// 1. GET: Ambil daftar artikel atau detail satu artikel
// -------------------------------------------------------------------------
if ($method === 'GET') {
    $id       = $_GET['id'] ?? null;
    $slug     = $_GET['slug'] ?? null;
    $category = $_GET['category'] ?? null;
    $limit    = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM `bbc_articles` WHERE `id` = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            Database::jsonResponse(['success' => false, 'error' => 'Artikel tidak ditemukan'], 404);
        }
        // Increment views
        $pdo->prepare("UPDATE `bbc_articles` SET `views` = `views` + 1 WHERE `id` = :id")->execute([':id' => $id]);
        $row['views']++;
        Database::jsonResponse(['success' => true, 'article' => formatArticle($row)]);
    }

    if ($slug) {
        $stmt = $pdo->prepare("SELECT * FROM `bbc_articles` WHERE `slug` = :slug LIMIT 1");
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        if (!$row) {
            Database::jsonResponse(['success' => false, 'error' => 'Artikel tidak ditemukan'], 404);
        }
        // Increment views
        $pdo->prepare("UPDATE `bbc_articles` SET `views` = `views` + 1 WHERE `id` = :id")->execute([':id' => $row['id']]);
        $row['views']++;
        Database::jsonResponse(['success' => true, 'article' => formatArticle($row)]);
    }

    $where = [];
    $params = [];

    if ($category) {
        $where[] = "`category` = :category";
        $params[':category'] = $category;
    }

    $sql = "SELECT * FROM `bbc_articles`";
    if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }
    $sql .= " ORDER BY `date` DESC, `id` DESC LIMIT " . max(1, min(100, $limit));

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $articles = array_map('formatArticle', $rows);
    Database::jsonResponse([
        'success'  => true,
        'total'    => count($articles),
        'articles' => $articles
    ]);
}

// -------------------------------------------------------------------------
// 2. POST: Tambah artikel baru
// -------------------------------------------------------------------------
if ($method === 'POST') {
    $input = Database::getJsonInput();
    $title = trim($input['title'] ?? '');

    if (empty($title)) {
        Database::jsonResponse(['success' => false, 'error' => 'Judul artikel wajib diisi'], 400);
    }

    $slug = trim($input['slug'] ?? '');
    if (empty($slug)) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $check = $pdo->prepare("SELECT COUNT(*) FROM `bbc_articles` WHERE `slug` = :slug");
        $check->execute([':slug' => $slug]);
        if ($check->fetchColumn() > 0) {
            $slug .= '-' . time();
        }
    }

    $tagsJson = isset($input['tags']) && is_array($input['tags'])
        ? json_encode($input['tags'], JSON_UNESCAPED_UNICODE)
        : null;

    $excerpt = trim($input['excerpt'] ?? '');
    $content = trim($input['content'] ?? '');
    if (empty($excerpt) && !empty($content)) {
        $excerpt = mb_substr(strip_tags($content), 0, 150) . '...';
    }

    $stmt = $pdo->prepare("
        INSERT INTO `bbc_articles` 
            (`title`, `slug`, `category`, `author`, `date`, `excerpt`, `content`, `cover_image`, `views`, `tags_json`)
        VALUES 
            (:title, :slug, :category, :author, :date, :excerpt, :content, :cover_image, :views, :tags_json)
    ");

    $stmt->execute([
        ':title'       => $title,
        ':slug'        => $slug,
        ':category'    => $input['category'] ?? 'Berita',
        ':author'      => $input['author'] ?? 'Humas BBC',
        ':date'        => $input['date'] ?? date('Y-m-d'),
        ':excerpt'     => $excerpt,
        ':content'     => $content,
        ':cover_image' => $input['coverImage'] ?? ($input['image'] ?? null),
        ':views'       => (int)($input['views'] ?? 0),
        ':tags_json'   => $tagsJson
    ]);

    $newId = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM `bbc_articles` WHERE `id` = :id");
    $stmt->execute([':id' => $newId]);
    $created = $stmt->fetch();

    Database::jsonResponse([
        'success' => true,
        'message' => 'Artikel berhasil diterbitkan',
        'article' => formatArticle($created)
    ], 201);
}

// -------------------------------------------------------------------------
// 3. PUT: Edit artikel
// -------------------------------------------------------------------------
if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    $input = Database::getJsonInput();
    if (!$id && isset($input['id'])) {
        $id = $input['id'];
    }

    if (!$id) {
        Database::jsonResponse(['success' => false, 'error' => 'Parameter ID artikel wajib diberikan'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM `bbc_articles` WHERE `id` = :id LIMIT 1");
    $stmt->execute([':id' => $id]);
    $existing = $stmt->fetch();
    if (!$existing) {
        Database::jsonResponse(['success' => false, 'error' => 'Artikel tidak ditemukan'], 404);
    }

    $title   = trim($input['title'] ?? $existing['title']);
    $slug    = trim($input['slug'] ?? $existing['slug']);
    $cat     = trim($input['category'] ?? $existing['category']);
    $author  = trim($input['author'] ?? $existing['author']);
    $date    = trim($input['date'] ?? $existing['date']);
    $excerpt = array_key_exists('excerpt', $input) ? trim($input['excerpt']) : $existing['excerpt'];
    $content = array_key_exists('content', $input) ? trim($input['content']) : $existing['content'];
    $cover   = array_key_exists('coverImage', $input) ? $input['coverImage'] : (array_key_exists('image', $input) ? $input['image'] : $existing['cover_image']);
    $views   = isset($input['views']) ? (int)$input['views'] : (int)$existing['views'];

    $tagsJson = array_key_exists('tags', $input)
        ? (is_array($input['tags']) ? json_encode($input['tags'], JSON_UNESCAPED_UNICODE) : null)
        : $existing['tags_json'];

    $upd = $pdo->prepare("
        UPDATE `bbc_articles` SET
            `title` = :title,
            `slug` = :slug,
            `category` = :category,
            `author` = :author,
            `date` = :date,
            `excerpt` = :excerpt,
            `content` = :content,
            `cover_image` = :cover_image,
            `views` = :views,
            `tags_json` = :tags_json
        WHERE `id` = :id
    ");

    $upd->execute([
        ':title'       => $title,
        ':slug'        => $slug,
        ':category'    => $cat,
        ':author'      => $author,
        ':date'        => $date,
        ':excerpt'     => $excerpt,
        ':content'     => $content,
        ':cover_image' => $cover,
        ':views'       => $views,
        ':tags_json'   => $tagsJson,
        ':id'          => $id
    ]);

    $stmt = $pdo->prepare("SELECT * FROM `bbc_articles` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);
    $updated = $stmt->fetch();

    Database::jsonResponse([
        'success' => true,
        'message' => 'Artikel berhasil diperbarui',
        'article' => formatArticle($updated)
    ]);
}

// -------------------------------------------------------------------------
// 4. DELETE: Hapus artikel
// -------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $input = Database::getJsonInput();
        $id = $input['id'] ?? null;
    }

    if (!$id) {
        Database::jsonResponse(['success' => false, 'error' => 'Parameter ID artikel wajib diberikan'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM `bbc_articles` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        Database::jsonResponse(['success' => false, 'error' => 'Artikel tidak ditemukan atau sudah dihapus'], 404);
    }

    Database::jsonResponse([
        'success' => true,
        'message' => 'Artikel berhasil dihapus dari database'
    ]);
}

Database::jsonResponse(['success' => false, 'error' => 'Metode HTTP tidak didukung'], 405);
