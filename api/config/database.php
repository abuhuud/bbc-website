<?php
/**
 * BAZNAS Badminton Club (BBC) — Database & API Configuration
 * Mendukung koneksi PDO MySQL lokal (XAMPP/Docker) dan cloud (Vercel, TiDB, PlanetScale, Railway, Supabase).
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private static ?PDO $pdo = null;

    /**
     * Dapatkan koneksi PDO singleton ke MySQL
     * @return PDO
     */
    public static function getConnection(): PDO {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        // Baca dari environment variables (Vercel / Cloud) dengan fallback lokal
        $host     = getenv('DB_HOST')     ?: ($_ENV['DB_HOST']     ?? '127.0.0.1');
        $port     = getenv('DB_PORT')     ?: ($_ENV['DB_PORT']     ?? '3306');
        $dbName   = getenv('DB_NAME')     ?: ($_ENV['DB_NAME']     ?? 'bbc_database');
        $username = getenv('DB_USER')     ?: ($_ENV['DB_USER']     ?? 'root');
        $password = getenv('DB_PASS')     ?: ($_ENV['DB_PASS']     ?? '');
        $useSsl   = getenv('DB_SSL')      ?: ($_ENV['DB_SSL']      ?? 'false');

        $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        // Opsi SSL untuk cloud MySQL (misal TiDB / PlanetScale / Aiven)
        if ($useSsl === 'true' || $useSsl === '1') {
            $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
        }

        try {
            self::$pdo = new PDO($dsn, $username, $password, $options);
            return self::$pdo;
        } catch (PDOException $e) {
            self::jsonResponse([
                'success' => false,
                'error'   => 'Database connection failed: ' . $e->getMessage()
            ], 500);
            exit();
        }
    }

    /**
     * Kirim respons JSON terstandarisasi dan hentikan eksekusi
     * @param mixed $data
     * @param int $statusCode
     */
    public static function jsonResponse($data, int $statusCode = 200): void {
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit();
    }

    /**
     * Ambil data JSON dari request body (POST / PUT)
     * @return array
     */
    public static function getJsonInput(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return [];
        }
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : [];
    }
}
