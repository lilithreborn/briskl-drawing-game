<?php
$game_status = json_decode(file_get_contents("../data/players.json"), true);
$name = json_decode(file_get_contents("php://input"), true);
$players[] = $name;
file_put_contents("../data/players.json", json_encode($players));
?>