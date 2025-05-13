<?php
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['winner']) || !isset($data['artist']) || !isset($data['word'])) {
  http_response_code(400);
  exit("Invalid input data.");
}

$filename = "../data/game_status.json";
$gameStatus = json_decode(file_get_contents($filename), true);
file_put_contents("../data/strokes.json", "[]");
echo "Canvas reset.";

if (!isset($gameStatus['scores'][$data['winner']])) {
  $gameStatus['scores'][$data['winner']] = 0;
}
$gameStatus['scores'][$data['winner']] += 1;

$gameStatus['usedwords'][] = $data['word'];
$gameStatus['usedartists'][] = $data['artist'];

// pick next artist and word
$allPlayers = json_decode(file_get_contents("../data/players.json"), true);
$allWords = json_decode(file_get_contents("../data/words.json"), true);

$availablePlayers = array_values(array_diff($allPlayers, $gameStatus['usedartists']));
$availableWords = array_values(array_diff($allWords, $gameStatus['usedwords']));

// end game if no more players or words
$gameStatus['round'] += 1;
if (count($availablePlayers) == 0 || count($availableWords) == 0) {
  $gameStatus['over'] = true;

  $scores = $gameStatus['scores'];
  $highestScore = max($scores);
  $topPlayers = array_keys($scores, $highestScore);
  $gameStatus['winner'] = $topPlayers[0]; // just pick one winner
} else {
  $gameStatus['artist'] = $availablePlayers[array_rand($availablePlayers)];
  $gameStatus['word'] = $availableWords[array_rand($availableWords)];
}

file_put_contents($filename, json_encode($gameStatus));
