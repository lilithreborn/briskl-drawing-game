<?php
// Get data from POST request
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['message']) || !isset($data['player'])) {
  http_response_code(400);
  exit("Invalid input data.");
}

// Path to store guesses (make sure this is writable)
$filename = "../data/chat.json";

// Read the current chat messages
$existing = file_exists($filename) ? json_decode(file_get_contents($filename), true) : [];

// Add the new message to the array
$existing[] = [
  'player' => $data['player'],
  'message' => $data['message'],
];

// Write the updated array back to the file
file_put_contents($filename, json_encode($existing));

echo "Message saved successfully!";
?>