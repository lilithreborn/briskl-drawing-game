<?php
$players = json_decode(file_get_contents("../data/players.json"), true);
$name = json_decode(file_get_contents("php://input"), true);
$players[] = $name;

$gameStatus = json_decode(file_get_contents("../data/game_status.json"), true);
$gameStatus['scores'][$name] = 0;

file_put_contents("../data/players.json", json_encode($players));
file_put_contents("../data/game_status.json", json_encode($gameStatus));
?>