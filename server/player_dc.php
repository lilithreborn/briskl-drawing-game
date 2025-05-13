<?php
$dc = json_decode(file_get_contents("php://input"), true);
$players = json_decode(file_get_contents("../data/players.json"), true);

$i = 0;
foreach ($players as $p) {
  if ($p == $dc) {
    unset($players[$i]);
    break;
  }
  $i++;
}
file_put_contents("../data/players.json", json_encode($players));

if (!$players) {
  $gameStatus = [
    "started" => false,
    "artist" => null,
    "word" => null,
    "timer" => 60
  ];
  file_put_contents("../data/game_status.json", json_encode($gameStatus));
  //file_put_contents("../data/players.json", json_encode([]));

  echo "Jeu réinitialisé";
}
?>