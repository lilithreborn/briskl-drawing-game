let redirected = false;

async function checkGameStatus() {
  const res = await fetch('data/game_status.json');
  const status = await res.json();

  if (status.started && !redirected) {
    redirected = true;
    window.location.href = `game.html?name=${encodeURIComponent(playerName)}`;
  }
}

async function checkPlayers() {
  const res = await fetch('data/players.json');
  const players = await res.json();
  const list = document.getElementById('players');
  list.innerHTML = '';

  players.forEach(player => {
    const li = document.createElement('li');
    li.textContent = player;
    list.appendChild(li);
  });

  const startBtn = document.getElementById('start-game');

  if (players.length >= 2) {
    if (players[0] === playerName) {
      startBtn.disabled = false;
      startBtn.textContent = "Commencer le jeu (vous êtes l’hôte)";
    } else {
      startBtn.disabled = true;
      startBtn.textContent = "En attente que l’hôte commence le jeu...";
    }
  } else {
    startBtn.disabled = true;
    startBtn.textContent = "En attente d’un autre joueur...";
  }
}

async function startGame() {
  await fetch('reset.php');
  window.location.href = `game.html?name=${encodeURIComponent(playerName)}`;
}

document.getElementById("start-game").addEventListener("click", startGame);

setInterval(() => {
  checkPlayers();
  checkGameStatus();
}, 1000);

