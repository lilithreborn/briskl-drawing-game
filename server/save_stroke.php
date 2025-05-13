<?php
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['points'])) {
  http_response_code(400);
  exit("Invalid stroke data");
}

$filename = "../data/strokes.json";

// Acquire lock-safe file write
$fp = fopen($filename, "c+"); // open for reading and writing, create if not exists
if (flock($fp, LOCK_EX)) { // acquire exclusive lock
  $existing = stream_get_contents($fp);
  $strokes = $existing ? json_decode($existing, true) : [];

  if (!is_array($strokes)) {
    $strokes = [];
  }

  $strokes[] = $data;

  // Reset file and write clean
  ftruncate($fp, 0);
  rewind($fp);
  fwrite($fp, json_encode($strokes));
  fflush($fp); // flush output before releasing lock
  flock($fp, LOCK_UN); // release lock
}
fclose($fp);
