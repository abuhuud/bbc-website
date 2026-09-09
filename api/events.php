<?php
/**
 * BAZNAS Badminton Club (BBC) — Events / Schedule API
 * Endpoint: /api/events.php
 * Method: GET, POST, PUT, DELETE
 */

require_once __DIR__ . '/config/database.php';

$pdo = Database::getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Helper to format event row
function formatEvent(array $row): array {
    return [
        'id'          => (int)$row['id'],
        'title'       => $row['title'],
        'date'        => $row['date'],
        'time'        => $row['time'],
        'location'    => $row['location'],
        'category'    => $row['category'],
        'description' => $row['description'] ?: '',
        'dayName'     => $row['day_name'] ?: getIndonesianDayName($row['date']),
        'isPast'      => (bool)$row['is_past'],
        'createdAt'   => $row['created_at'] ?? null,
        'updatedAt'   => $row['updated_at'] ?? null
    ];
}

function getIndonesianDayName(string $dateStr): string {
    $days = [
        'Sunday'    => 'Minggu',
        'Monday'    => 'Senin',
        'Tuesday'   => 'Selasa',
        'Wednesday' => 'Rabu',
        'Thursday'  => 'Kamis',
        'Friday'    => 'Jumat',
        'Saturday'  => 'Sabtu'
    ];
    $ts = strtotime($dateStr);
    if (!$ts) return 'Senin';
    $englishDay = date('l', $ts);
    return $days[$englishDay] ?? 'Senin';
}

// -------------------------------------------------------------------------
// 1. GET: Ambil daftar jadwal atau satu jadwal
// -------------------------------------------------------------------------
if ($method === 'GET') {
    $id       = $_GET['id'] ?? null;
    $category = $_GET['category'] ?? null;
    $future   = isset($_GET['future']) ? (int)$_GET['future'] : null;
    $month    = $_GET['month'] ?? null; // YYYY-MM

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM `bbc_events` WHERE `id` = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            Database::jsonResponse(['success' => false, 'error' => 'Jadwal tidak ditemukan'], 404);
        }
        Database::jsonResponse(['success' => true, 'event' => formatEvent($row)]);
    }

    $where = [];
    $params = [];

    if ($category) {
        $where[] = "`category` = :category";
        $params[':category'] = $category;
    }
    if ($future === 1) {
        $where[] = "`date` >= CURDATE()";
    } elseif ($future === 0) {
        $where[] = "`date` < CURDATE()";
    }
    if ($month) {
        $where[] = "`date` LIKE :month";
        $params[':month'] = $month . '%';
    }

    $sql = "SELECT * FROM `bbc_events`";
    if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }
    $sql .= " ORDER BY `date` ASC, `time` ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $events = array_map('formatEvent', $rows);
    Database::jsonResponse([
        'success' => true,
        'total'   => count($events),
        'events'  => $events
    ]);
}

// -------------------------------------------------------------------------
// 2. POST: Tambah jadwal baru
// -------------------------------------------------------------------------
if ($method === 'POST') {
    $input = Database::getJsonInput();
    $title = trim($input['title'] ?? '');
    $date  = trim($input['date'] ?? '');

    if (empty($title) || empty($date)) {
        Database::jsonResponse(['success' => false, 'error' => 'Judul dan tanggal jadwal wajib diisi'], 400);
    }

    $dayName = !empty($input['dayName']) ? trim($input['dayName']) : getIndonesianDayName($date);
    $isPast  = isset($input['isPast']) ? (!empty($input['isPast']) ? 1 : 0) : (strtotime($date) < strtotime(date('Y-m-d')) ? 1 : 0);

    $stmt = $pdo->prepare("
        INSERT INTO `bbc_events` (`title`, `date`, `time`, `location`, `category`, `description`, `day_name`, `is_past`)
        VALUES (:title, :date, :time, :location, :category, :description, :day_name, :is_past)
    ");

    $stmt->execute([
        ':title'       => $title,
        ':date'        => $date,
        ':time'        => $input['time'] ?? '19:00 - 22:00 WIB',
        ':location'    => $input['location'] ?? 'Lapangan BAZNAS',
        ':category'    => $input['category'] ?? 'Latihan Rutin',
        ':description' => $input['description'] ?? '',
        ':day_name'    => $dayName,
        ':is_past'     => $isPast
    ]);

    $newId = (int)$pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM `bbc_events` WHERE `id` = :id");
    $stmt->execute([':id' => $newId]);
    $created = $stmt->fetch();

    Database::jsonResponse([
        'success' => true,
        'message' => 'Jadwal berhasil ditambahkan',
        'event'   => formatEvent($created)
    ], 201);
}

// -------------------------------------------------------------------------
// 3. PUT: Edit jadwal
// -------------------------------------------------------------------------
if ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    $input = Database::getJsonInput();
    if (!$id && isset($input['id'])) {
        $id = $input['id'];
    }

    if (!$id) {
        Database::jsonResponse(['success' => false, 'error' => 'Parameter ID jadwal wajib diberikan'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM `bbc_events` WHERE `id` = :id LIMIT 1");
    $stmt->execute([':id' => $id]);
    $existing = $stmt->fetch();
    if (!$existing) {
        Database::jsonResponse(['success' => false, 'error' => 'Jadwal tidak ditemukan'], 404);
    }

    $title   = trim($input['title'] ?? $existing['title']);
    $date    = trim($input['date'] ?? $existing['date']);
    $time    = trim($input['time'] ?? $existing['time']);
    $loc     = trim($input['location'] ?? $existing['location']);
    $cat     = trim($input['category'] ?? $existing['category']);
    $desc    = array_key_exists('description', $input) ? $input['description'] : $existing['description'];
    $dayName = !empty($input['dayName']) ? trim($input['dayName']) : getIndonesianDayName($date);
    $isPast  = isset($input['isPast']) ? (!empty($input['isPast']) ? 1 : 0) : (int)$existing['is_past'];

    $upd = $pdo->prepare("
        UPDATE `bbc_events` SET
            `title` = :title,
            `date` = :date,
            `time` = :time,
            `location` = :location,
            `category` = :category,
            `description` = :description,
            `day_name` = :day_name,
            `is_past` = :is_past
        WHERE `id` = :id
    ");

    $upd->execute([
        ':title'       => $title,
        ':date'        => $date,
        ':time'        => $time,
        ':location'    => $loc,
        ':category'    => $cat,
        ':description' => $desc,
        ':day_name'    => $dayName,
        ':is_past'     => $isPast,
        ':id'          => $id
    ]);

    $stmt = $pdo->prepare("SELECT * FROM `bbc_events` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);
    $updated = $stmt->fetch();

    Database::jsonResponse([
        'success' => true,
        'message' => 'Jadwal berhasil diperbarui',
        'event'   => formatEvent($updated)
    ]);
}

// -------------------------------------------------------------------------
// 4. DELETE: Hapus jadwal
// -------------------------------------------------------------------------
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        $input = Database::getJsonInput();
        $id = $input['id'] ?? null;
    }

    if (!$id) {
        Database::jsonResponse(['success' => false, 'error' => 'Parameter ID jadwal wajib diberikan'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM `bbc_events` WHERE `id` = :id");
    $stmt->execute([':id' => $id]);

    if ($stmt->rowCount() === 0) {
        Database::jsonResponse(['success' => false, 'error' => 'Jadwal tidak ditemukan atau sudah dihapus'], 404);
    }

    Database::jsonResponse([
        'success' => true,
        'message' => 'Jadwal berhasil dihapus dari database'
    ]);
}

Database::jsonResponse(['success' => false, 'error' => 'Metode HTTP tidak didukung'], 405);
