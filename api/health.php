<?php
require_once __DIR__ . '/config/database.php';

try {
    $pdo = Database::getConnection();
    $stmt = $pdo->query("SELECT VERSION() as mysql_version, NOW() as current_time");
    $info = $stmt->fetch();

    Database::jsonResponse([
        'success'       => true,
        'status'        => 'healthy',
        'app'           => 'BAZNAS Badminton Club API',
        'version'       => '3.0.0',
        'database'      => 'connected',
        'mysql_version' => $info['mysql_version'],
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
