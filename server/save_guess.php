<?php
// get data from POST request
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['message']) || !isset($data['player'])) {
  http_response_code(400);
  exit("Invalid input data.");
}

$filename = "../data/chat.json";

$existing = file_exists($filename) ? json_decode(file_get_contents($filename), true) : [];

$existing[] = [
  'player' => $data['player'],
  'message' => $data['message'],
];

file_put_contents($filename, json_encode($existing));

echo "Message saved successfully!";
?>