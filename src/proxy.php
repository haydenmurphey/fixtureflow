<?php
// Include the configuration file securely
require_once 'config.php';

// Access the key from the constant defined in config.php
$apiKey = API_KEY;
$url = 'https://api.football-data.org/v4/competitions/PL/teams';

// Set up the HTTP request headers
$options = [
    'http' => [
        'header' => "X-Auth-Token: " . $apiKey,
        'method' => 'GET',
    ],
];

// Create the stream context
$context = stream_context_create($options);

// Make the API call
$response = file_get_contents($url, false, $context);

// Set the content type header to tell the browser it's receiving JSON
header('Content-Type: application/json');

// Echo the response back to the front-end
echo $response;
?>