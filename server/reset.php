<?php

$gameStatus = [
  "started" => false,
  "artist" => null,
  "word" => null,
  "timer" => 60
];
file_put_contents("../data/game_status.json", json_encode($gameStatus));


//file_put_contents("../data/players.json", json_encode([]));
?>