<?php
// 1. Securely include your config
if (!file_exists('config.php')) {
    header('Content-Type: application/json');
    echo json_encode(["error" => "config.php missing"]);
    exit;
}
require_once 'config.php';

// 2. Setup variables
$apiKey = defined('API_KEY') ? API_KEY : '';
$type = isset($_GET['type']) ? $_GET['type'] : 'team'; 
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "No ID provided"]);
    exit;
}

// 3. Determine URL
$url = "";
if ($type === 'standings') {
    $url = "https://api.football-data.org/v4/competitions/$id/standings";
} elseif ($type === 'matches_finished') {
    $url = "https://api.football-data.org/v4/teams/$id/matches?status=FINISHED";
} elseif ($type === 'matches_scheduled') {
    $url = "https://api.football-data.org/v4/teams/$id/matches?status=SCHEDULED";
} else {
    $url = "https://api.football-data.org/v4/teams/$id";
}

// 4. Use cURL instead of file_get_contents
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-Auth-Token: $apiKey"
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(["error" => "cURL Error: " . curl_error($ch)]);
} else {
    header('Content-Type: application/json');
    http_response_code($httpCode);
    echo $response;
}

curl_close($ch);
?>