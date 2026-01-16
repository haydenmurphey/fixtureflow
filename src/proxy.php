<?php
// 1. Check if config.php actually exists in the same folder
if (!file_exists('config.php')) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        "error" => "Configuration file missing",
        "details" => "Ensure 'config.php' is uploaded to your htdocs folder."
    ]);
    exit;
}

require_once 'config.php';

// 2. Verify API Key is defined
if (!defined('API_KEY') || empty(API_KEY)) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["error" => "API_KEY not defined in config.php"]);
    exit;
}

$type = isset($_GET['type']) ? $_GET['type'] : 'team'; 
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing ID"]);
    exit;
}

// 3. Construct API URL
$url = ($type === 'standings') ? "https://api.football-data.org/v4/competitions/$id/standings" :
       (($type === 'matches_finished') ? "https://api.football-data.org/v4/teams/$id/matches?status=FINISHED" :
       (($type === 'matches_scheduled') ? "https://api.football-data.org/v4/teams/$id/matches?status=SCHEDULED" :
       "https://api.football-data.org/v4/teams/$id"));

// 4. Execute Fetch with cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-Auth-Token: " . API_KEY]);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo json_encode(["error" => "cURL Error: " . curl_error($ch)]);
} else {
    header('Content-Type: application/json');
    http_response_code($httpCode);
    echo $response;
}
curl_close($ch);