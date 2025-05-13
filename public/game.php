<?php $currentPlayer = $_GET['name'] ?? 'Anonymous';
$game = json_decode(
  file_get_contents("../data/game_status.json"),
  true
); ?>

<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <title>Jeu</title>
  <link rel="stylesheet" type="text/css" media="screen" href="style/game.css">
</head>

<body>
  <script>
    const playerName = <?= json_encode($currentPlayer); ?>;
  </script>
  <div id="gif"><img id="briskl" src="../media/briskl.gif"> <img id="crayon" src="../media/crayon.gif"></div>
  <h2>A vos crayons !</h2>
  <p id="word"></p>

  <div class="game-container">
    <div class="panel-gauche">
      <div id="info">
        <p id="wlcm">Bienvenue <?= htmlspecialchars($currentPlayer); ?> !</p>
        <p id="artist">Dessinateur : <?= htmlspecialchars($game['artist']); ?></p>
        <p id="round">Round : </p>
        <p id="timer">Temps restant : </p>
        <p id="score">Ton score : </p>
      </div>

      <div id="chat">
        <div id="messages"></div>
        <input type="text" id="chat-input" placeholder="Propose un mot...">
        <button id="send">Envoyer</button>
      </div>
    </div>

    <canvas id="drawingCanvas" width="600" height="450"></canvas>

    <div class="panel-droit">
      <div class="palette">
        <button class="bouton-couleur" id="rouge"></button>
        <button class="bouton-couleur" id="orange"></button>
        <button class="bouton-couleur" id="jaune"></button>
        <button class="bouton-couleur" id="vert"></button>
        <button class="bouton-couleur" id="bleu"></button>
        <button class="bouton-couleur" id="noir"></button>
        <button class="bouton-couleur" id="marron"></button>
      </div>
      <div id="erasers">
        <button id="erase-button"><img class="eraser-img" src="../media/eraser.png" height="40" width="40"></button>
        <button id="reset-button"><img class="eraser-img" src="../media/reset.png" height="40" width="40"></button>
      </div>
    </div>

    <script src="js/game.js"></script>
</body>

</html>