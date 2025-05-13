<?php

$name = $_GET['name'] ?? null;
if (!$name) {
  echo "Nom manquant.";
  exit;
}

$filename = "../data/players.json";
$players = [];

if (file_exists($filename)) {
  $players = json_decode(file_get_contents($filename), true);
}

if (!in_array($name, $players)) {
  $players[] = $name;
  file_put_contents($filename, json_encode($players));
}


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