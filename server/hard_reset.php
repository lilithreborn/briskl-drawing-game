<?php 
sleep(5);//Sleep 5 sec before resetting game data

$gameStatus = [
    "started" => false,
    "artist" => null,
    "word" => null,
    "usedwords" => [],
    "usedartists" => [],
    "round" => 0,
    "scores" => [],
    "winner" => null,
    "over" => false
  ];
  file_put_contents("../data/game_status.json", json_encode($gameStatus)); //reset game status
  file_put_contents("../data/chat.json", json_encode([])); //reset chat
  file_put_contents("../data/strokes.json", json_encode([])); //reset canvas
  file_put_contents("../data/players.json", json_encode([])); //reset playerlist
  ?>