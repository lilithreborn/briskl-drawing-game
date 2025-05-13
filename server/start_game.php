<?php

$players = json_decode(file_get_contents("../data/players.json"), true);
$words = json_decode(file_get_contents("../data/words.json"), true);


$artist = $players[array_rand($players, 1)];
$word = $words[array_rand($words, 1)];
$scores = [];
foreach ($players as $player) {
  $scores[$player] = 0;
}

$gameStatus = [
  "started" => true,
  "artist" => $artist,
  "word" => $word,
  "usedwords" => [],
  "usedartists" => [],
  "round" => 1,
  "scores" => $scores,
  "winner" => null,
  "over" => false
];

file_put_contents("../data/game_status.json", json_encode($gameStatus));

#file_put_contents("../data/players.json", json_encode([]));
file_put_contents("../data/strokes.json", "[]");

?>