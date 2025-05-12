<?php
$data = json_decode(file_get_contents("php://input"), true);

if (!$data)
  exit;

$filename = "../data/strokes.json";
$existing = file_exists($filename) ? json_decode(file_get_contents($filename), true) : [];

$existing[] = $data;

file_put_contents($filename, json_encode($existing));
