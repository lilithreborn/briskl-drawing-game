<?php
// Reset players list
file_put_contents('data/players.json', json_encode([]));

// Set game started = true
file_put_contents('data/game_status.json', json_encode(["started" => true]));

echo "Game started and lobby reset.";
?>