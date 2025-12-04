<?php
// Include the configuration file securely
require_once 'config.php';

// Access the key from the constant defined in config.php
$apiKey = API_KEY;

// Initialize URL
$url = "";

// Check for the 'type' of request
$type = isset($_GET['type']) ? $_GET['type'] : 'team'; 
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    if ($type === 'standings') {
        // Fetch Standings
        $url = "https://api.football-data.org/v4/competitions/$id/standings";
    } else {
        // Fetch Team Details
        $url = "https://api.football-data.org/v4/teams/$id";
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "No ID provided"]);
    exit;
}

// Set up the HTTP request headers
$options = [
    'http' => [
        'header' => "X-Auth-Token: " . $apiKey,
        'method' => 'GET',
        'ignore_errors' => true // <--- IMPORTANT: Prevents crash on 404/403/500
    ],
];

// Create the stream context
$context = stream_context_create($options);

// Make the API call
$response = @file_get_contents($url, false, $context);

if ($response === FALSE) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch data from API"]);
    exit;
}

// Set content type
header('Content-Type: application/json');

// Echo the response
echo $response;
?>
