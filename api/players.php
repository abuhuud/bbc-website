<?php
/**
 * BAZNAS Badminton Club (BBC) — Players API
 * Endpoint: /api/players.php
 * Method: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Helper to format a player row into standard frontend object structure
function formatPlayer(array $row): array {
    return [
        'id'                  => (int)$row['id'],
        'name'                => $row['name'],
        'slug'                => $row['slug'],
        'gender'              => $row['gender'],
        'role'                => $row['role'],
        'position'            => $row['position'],
        'image'               => $row['image'] ?: '',
        'isPlayerOfTheMonth'  => (bool)$row['is_player_of_the_month'],
        'stats'               => [
            'attendance' => (int)$row['attendance'],
            'matches'    => (int)$row['matches'],
            'wins'       => (int)$row['wins'],
            'losses'     => (int)$row['losses'],
        ],
        'bio'                 => $row['bio'] ?: '',
        'gallery'             => !empty($row['gallery_json']) ? json_decode($row['gallery_json'], true) : [],
        'createdAt'           => $row['created_at'] ?? null,
        'updatedAt'           => $row['updated_at'] ?? null
    ];
}

// -------------------------------------------------------------------------
// 1. GET: Ambil daftar pemain atau detail satu pemain
// -------------------------------------------------------------------------
if ($method === 'GET') {
    $id     = $_GET['id'] ?? null;
    $slug   = $_GET['slug'] ?? null;
    $gender = $_GET['gender'] ?? null;
    $potm   = isset($_GET['potm']) ? (int)$_GET['potm'] : null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM `bbc_players` WHERE `id` = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            Database::jsonResponse(['success' => false, 'error' => 'Pemain tidak ditemukan'], 404);
        }
        Database::jsonResponse(['success' => true, 'player' => formatPlayer($row)]);
    }

    if ($slug) {
        $stmt = $pdo->prepare("SELECT * FROM `bbc_players` WHERE `slug` = :slug LIMIT 1");
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch();
        if (!$row) {
            Database::jsonResponse(['success' => false, 'error' => 'Pemain tidak ditemukan'], 404);
        }
        Database::jsonResponse(['success' => true, 'player' => formatPlayer($row)]);
    }

    $where = [];
    $params = [];

    if ($gender) {
        $where[] = "`gender` = :gender";
        $params[':gender'] = $gender;
    }
    if ($potm !== null) {
        $where[] = "`is_player_of_the_month` = :potm";
        $params[':potm'] = $potm;
    }

    $sql = "SELECT * FROM `bbc_players`";
    if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }
    $sql .= " ORDER BY `id` ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $players = array_map('formatPlayer', $rows);
    Database::jsonResponse([
        'success' => true,
        'total'   => count($players),
        'players' => $players
    ]);
}

// -------------------------------------------------------------------------
// 2. POST: Tambah pemain baru
// -------------------------------------------------------------------------
if ($method === 'POST') {
    $input = Database::getJsonInput();
    $name = trim($input['name'] ?? '');

    if (empty($name)) {
        Database::jsonResponse(['success' => false, 'error' => 'Nama pemain wajib diisi'], 400);
    }

    $slug = trim($input['slug'] ?? '');
    if (empty($slug)) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
        $check = $pdo->prepare("SELECT COUNT(*) FROM `bbc_players` WHERE `slug` = :slug");
        $check->execute([':slug' => $slug]);
        if ($check->fetchColumn() > 0) {
            $slug .= '-' . time();
        }
    }

    $gender = ($input['gender'] ?? 'male') === 'female' ? 'female' : 'male';
    $isPotm = !empty($input['isPlayerOfTheMonth']) ? 1 : 0;

    // Jika di-set POTM, nonaktifkan POTM pemain lain dengan gender yang sama
    if ($isPotm === 1) {
        $unset = $pdo->prepare("UPDATE `bbc_players` SET `is_player_of_the_month` = 0 WHERE `gender` = :gender");
        $unset->execute([':gender' => $gender]);
    }

    $stats = $input['stats'] ?? [];
    $galleryJson = isset($input['gallery']) && is_array($input['gallery']) 
        ? json_encode($input['gallery'], JSON_UNESCAPED_UNICODE) 
        : null;

    $stmt = $pdo->prepare("
        INSERT INTO `bbc_players` 
            (`name`, `slug`, `gender`, `role`, `position`, `image`, `is_player_of_the_month`,
             `attendance`, `matches`, `wins`, `losses`, `bio`, `gallery_json`)
        VALUES 
            (:name, :slug, :gender, :role, :position, :image, :is_potm,
             :attendance, :matches, :wins, :losses, :bio, :gallery_json)
    ");

    $stmt->execute([
        ':name'         => $name,
        ':slug'         => $slug,
        ':gender'       => $gender,
        ':role'         => $input['role'] ?? 'Ganda Putra',
        ':position'     => $input['position'] ?? 'All-Round',
        ':image'        => $input['image'] ?? null,
        ':is_potm'      => $isPotm,
        ':attendance'   => (int)($stats['attendance'] ?? 0),
        ':matches'      => (int)($stats['matches'] ?? 0),
        ':wins'         => (int)($stats['wins'] ?? 0),
        ':losses'       => (int)($stats['losses'] ?? 0),
        ':bio'          => $input['bio'] ?? '',
        ':gallery_json' => $galleryJson
    ]);

    $newId = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM `bbc_players` WHERE `id` = :id");
    $stmt->execute([':id' => $newId]);
    $created = $stmt->fetch();

    Database::jsonResponse([
        'success' => true,
        'message' => 'Pemain berhasil ditambahkan',
        'player'  => formatPlayer($created)
    ], 201);
}

// -------------------------------------------------------------------------
// 3. PUT: Edit pemain atau toggle POTM
// -------------------------------------------------------------------------
if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    $input = Database::getJsonInput();
    if (!$id && isset($input['id'])) {
        $id = $input['id'];
    }

    if (!$id) {
        Database::jsonResponse(['success' => false, 'error' => 'Parameter ID pemain wajib diberikan'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM `bbc_players` WHERE `id` = :id LIMIT 1");
    $stmt->execute([':id' => $id]);
    $existing = $stmt->fetch();
    if (!$existing) {
        Database::jsonResponse(['success' => false, 'error' => 'Pemain tidak ditemukan'], 404);
    }

    // Handle POTM toggle only
    if (isset($input['isPlayerOfTheMonth']) && count($input) === 2 && isset($input['id'])) {
        $newPotm = !empty($input['isPlayerOfTheMonth']) ? 1 : 0;
        if ($newPotm === 1) {
            $unset = $pdo->prepare("UPDATE `bbc_players` SET `is_player_of_the_month` = 0 WHERE `gender` = :gender");
            $unset->execute([':gender' => $existing['gender']]);
        }
        $upd = $pdo->prepare("UPDATE `bbc_players` SET `is_player_of_the_month` = :potm WHERE `id` = :id");
        $upd->execute([':potm' => $newPotm, ':id' => $id]);

        Database::jsonResponse(['success' => true, 'message' => 'Status POTM pemain berhasil diperbarui']);
    }

    $name   = trim($input['name'] ?? $existing['name']);
    $slug   = trim($input['slug'] ?? $existing['slug']);
    $gender = ($input['gender'] ?? $existing['gender']) === 'female' ? 'female' : 'male';
    $role   = $input['role'] ?? $existing['role'];
    $pos    = $input['position'] ?? $existing['position'];
    $img    = array_key_exists('image', $input) ? $input['image'] : $existing['image'];
    $bio    = array_key_exists('bio', $input) ? $input['bio'] : $existing['bio'];
    $isPotm = isset($input['isPlayerOfTheMonth']) ? (!empty($input['isPlayerOfTheMonth']) ? 1 : 0) : (int)$existing['is_player_of_the_month'];

    if ($isPotm === 1 && $existing['is_player_of_the_month'] != 1) {
        $unset = $pdo->prepare("UPDATE `bbc_players` SET `is_player_of_the_month` = 0 WHERE `gender` = :gender");
        $unset->execute([':gender' => $gender]);
    }

    $stats = $input['stats'] ?? [
        'attendance' => $existing['attendance'],
        'matches'    => $existing['matches'],
        'wins'       => $existing['wins'],
        'losses'     => $existing['losses']
    ];

    $galleryJson = array_key_exists('gallery', $input)
        ? (is_array($input['gallery']) ? json_encode($input['gallery'], JSON_UNESCAPED_UNICODE) : null)
        : $existing['gallery_json'];

    $upd = $pdo->prepare("
        UPDATE `bbc_players` SET
            `name` = :name,
            `slug` = :slug,
            `gender` = :gender,
            `role` = :role,
            `position` = :position,
            `image` = :image,
            `is_player_of_the_month` = :is_potm,
            `attendance` = :attendance,
            `matches` = :matches,
            `wins` = :wins,
            `losses` = :losses,
            `bio` = :bio,
            `gallery_json` = :gallery_json
        WHERE `id` = :id
    ");

    $upd->execute([
        ':name'         => $name,
        ':slug'         => $slug,
        ':gender'       => $gender,
        ':role'         => $role,
        ':position'     => $pos,
        ':image'        => $img,
        ':is_potm'      => $isPotm,
        ':attendance'   => (int)($stats['attendance'] ?? 0),
        ':matches'      => (int)($stats['matches'] ?? 0),
        ':wins'         => (int)($stats['wins'] ?? 0),
        ':losses'       => (int)($stats['losses'] ?? 0),
        ':bio'          => $bio,
        ':gallery_json' => $galleryJson,
        ':id'           => $id
    ]);

    $stmt = $pdo->prepare("SELECT * FROM `bbc_players` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);
    $updated = $stmt->fetch();

    Database::jsonResponse([
        'success' => true,
        'message' => 'Data pemain berhasil diperbarui',
        'player'  => formatPlayer($updated)
    ]);
}

// -------------------------------------------------------------------------
// 4. DELETE: Hapus pemain
// -------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $input = Database::getJsonInput();
        $id = $input['id'] ?? null;
    }

    if (!$id) {
        Database::jsonResponse(['success' => false, 'error' => 'Parameter ID pemain wajib diberikan'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM `bbc_players` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        Database::jsonResponse(['success' => false, 'error' => 'Pemain tidak ditemukan atau sudah dihapus'], 404);
    }

    Database::jsonResponse([
        'success' => true,
        'message' => 'Pemain berhasil dihapus dari database'
    ]);
}

Database::jsonResponse(['success' => false, 'error' => 'Metode HTTP tidak didukung'], 405);
