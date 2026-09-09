<?php
/**
 * BAZNAS Badminton Club (BBC) — Officials / Pengurus API
 * Endpoint: /api/officials.php
 * Method: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

function formatOfficial(array $row): array {
    return [
        'id'        => (int)$row['id'],
        'name'      => $row['name'],
        'role'      => $row['role'],
        'category'  => $row['category'],
        'photo'     => $row['photo'] ?: '',
        'sortOrder' => (int)$row['sort_order'],
        'createdAt' => $row['created_at'] ?? null,
        'updatedAt' => $row['updated_at'] ?? null
    ];
}

// -------------------------------------------------------------------------
// 1. GET: Ambil struktur kepengurusan
// -------------------------------------------------------------------------
if ($method === 'GET') {
    $category = $_GET['category'] ?? null;
    $id       = $_GET['id'] ?? null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM `bbc_officials` WHERE `id` = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            Database::jsonResponse(['success' => false, 'error' => 'Pengurus tidak ditemukan'], 404);
        }
        Database::jsonResponse(['success' => true, 'official' => formatOfficial($row)]);
    }

    $sql = "SELECT * FROM `bbc_officials`";
    $params = [];
    if ($category && $category !== 'all') {
        $sql .= " WHERE `category` = :category";
        $params[':category'] = $category;
    }
    $sql .= " ORDER BY `sort_order` ASC, `id` ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $officials = array_map('formatOfficial', $rows);
    Database::jsonResponse([
        'success'   => true,
        'total'     => count($officials),
        'officials' => $officials
    ]);
}

// -------------------------------------------------------------------------
// 2. POST: Tambah pengurus baru
// -------------------------------------------------------------------------
if ($method === 'POST') {
    $input = Database::getJsonInput();
    $name = trim($input['name'] ?? '');
    $role = trim($input['role'] ?? '');

    if (empty($name) || empty($role)) {
        Database::jsonResponse(['success' => false, 'error' => 'Nama dan jabatan pengurus wajib diisi'], 400);
    }

    $sort = isset($input['sortOrder']) ? (int)$input['sortOrder'] : 0;
    if ($sort === 0) {
        $maxSort = $pdo->query("SELECT MAX(`sort_order`) FROM `bbc_officials`")->fetchColumn();
        $sort = ((int)$maxSort) + 1;
    }

    $stmt = $pdo->prepare("
        INSERT INTO `bbc_officials` (`name`, `role`, `category`, `photo`, `sort_order`)
        VALUES (:name, :role, :category, :photo, :sort_order)
    ");

    $stmt->execute([
        ':name'       => $name,
        ':role'       => $role,
        ':category'   => $input['category'] ?? 'Pengurus Harian',
        ':photo'      => $input['photo'] ?? null,
        ':sort_order' => $sort
    ]);

    $newId = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM `bbc_officials` WHERE `id` = :id");
    $stmt->execute([':id' => $newId]);
    $created = $stmt->fetch();

    Database::jsonResponse([
        'success'  => true,
        'message'  => 'Pengurus berhasil ditambahkan',
        'official' => formatOfficial($created)
    ], 201);
}

// -------------------------------------------------------------------------
// 3. PUT: Edit pengurus
// -------------------------------------------------------------------------
if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    $input = Database::getJsonInput();
    if (!$id && isset($input['id'])) {
        $id = $input['id'];
    }

    if (!$id) {
        Database::jsonResponse(['success' => false, 'error' => 'Parameter ID pengurus wajib diberikan'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM `bbc_officials` WHERE `id` = :id LIMIT 1");
    $stmt->execute([':id' => $id]);
    $existing = $stmt->fetch();
    if (!$existing) {
        Database::jsonResponse(['success' => false, 'error' => 'Pengurus tidak ditemukan'], 404);
    }

    $name     = trim($input['name'] ?? $existing['name']);
    $role     = trim($input['role'] ?? $existing['role']);
    $category = trim($input['category'] ?? $existing['category']);
    $photo    = array_key_exists('photo', $input) ? $input['photo'] : $existing['photo'];
    $sort     = isset($input['sortOrder']) ? (int)$input['sortOrder'] : (int)$existing['sort_order'];

    $upd = $pdo->prepare("
        UPDATE `bbc_officials` SET
            `name` = :name,
            `role` = :role,
            `category` = :category,
            `photo` = :photo,
            `sort_order` = :sort_order
        WHERE `id` = :id
    ");

    $upd->execute([
        ':name'       => $name,
        ':role'       => $role,
        ':category'   => $category,
        ':photo'      => $photo,
        ':sort_order' => $sort,
        ':id'         => $id
    ]);

    $stmt = $pdo->prepare("SELECT * FROM `bbc_officials` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);
    $updated = $stmt->fetch();

    Database::jsonResponse([
        'success'  => true,
        'message'  => 'Data pengurus berhasil diperbarui',
        'official' => formatOfficial($updated)
    ]);
}

// -------------------------------------------------------------------------
// 4. DELETE: Hapus pengurus
// -------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $input = Database::getJsonInput();
        $id = $input['id'] ?? null;
    }

    if (!$id) {
        Database::jsonResponse(['success' => false, 'error' => 'Parameter ID pengurus wajib diberikan'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM `bbc_officials` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        Database::jsonResponse(['success' => false, 'error' => 'Pengurus tidak ditemukan atau sudah dihapus'], 404);
    }

    Database::jsonResponse([
        'success' => true,
        'message' => 'Pengurus berhasil dihapus dari database'
    ]);
}

Database::jsonResponse(['success' => false, 'error' => 'Metode HTTP tidak didukung'], 405);
