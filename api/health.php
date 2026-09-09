<?php
require_once __DIR__ . '/config/database.php';

try {
    $pdo = Database::getConnection();
    $stmt = $pdo->query("SELECT VERSION() as db_version, NOW() as current_time");
    $info = $stmt->fetch();

    $rawVersion = $info['db_version'] ?? '';
    $isMariaDb = stripos($rawVersion, 'MariaDB') !== false;
    $engine = $isMariaDb ? 'MariaDB' : 'MySQL';

    Database::jsonResponse([
        'success'       => true,
        'status'        => 'healthy',
        'app'           => 'BAZNAS Badminton Club API',
        'version'       => '3.1.0',
        'database'      => 'connected',
        'engine'        => $engine,
        'db_version'    => $rawVersion,
        'mysql_version' => $rawVersion,
        'is_mariadb'    => $isMariaDb,
        'db_host'       => getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? '127.0.0.1'),
        'db_name'       => getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'bbc_database'),
        'server_time'   => $info['current_time'],
        'php_version'   => PHP_VERSION
    ]);
} catch (Exception $e) {
    Database::jsonResponse([
        'success'  => false,
        'status'   => 'unhealthy',
        'database' => 'disconnected',
        'error'    => $e->getMessage()
    ], 500);
}
