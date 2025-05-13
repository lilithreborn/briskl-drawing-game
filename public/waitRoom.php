<?php

$name = $_GET['name'] ?? null;
if (!$name) {
  echo "Nom manquant.";
  exit;
}

$playersFile = "../data/players.json";
$gameStatusFile = "../data/game_status.json";

// Add player to players.json
$players = file_exists($playersFile) ? json_decode(file_get_contents($playersFile), true) : [];

if (!in_array($name, $players)) {
  $players[] = $name;
  file_put_contents($playersFile, json_encode($players));
}

// Also add player to game_status.json scores
$gameStatus = file_exists($gameStatusFile) ? json_decode(file_get_contents($gameStatusFile), true) : [];

if (!isset($gameStatus["scores"])) {
  $gameStatus["scores"] = [];
}

if (!isset($gameStatus["scores"][$name])) {
  $gameStatus["scores"][$name] = 0;
}

file_put_contents($gameStatusFile, json_encode($gameStatus, JSON_PRETTY_PRINT));



?>

<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <title>Salle d'attente</title>
  <link rel="stylesheet" type="text/css" media="screen" href="style/waitRoom.css">
  <script>
    const playerName = <?= json_encode($name); ?>;
  </script>
</head>

<body>
  <h2>Salle d'attente</h2>
  <p>Bienvenue, <?= htmlspecialchars($name); ?>. En attente d'autres joueurs...</p>
  <ul id="players"></ul>
  <button class="button" id="start-game" disabled>Commencer le jeu</button>

  <script src="js/waitRoom.js" defer></script>
</body>

</html>