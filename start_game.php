<?php

$players = json_decode(file_get_contents("data/players.json"), true);
$words = json_decode(file_get_contents("data/words.json"), true);


$artist = array_rand($players, 1);
$word = array_rand($words, 1);

$gameStatus = [
  "started" => true,
  "artist" => $artist,
  "word" => $word,
  "chosen" => false,
  "timer" => 60
];
file_put_contents("data/game_status.json", json_encode($gameStatus));

file_put_contents("data/players.json", json_encode([]));
?>