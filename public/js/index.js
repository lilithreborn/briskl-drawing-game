document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start");

  startBtn.addEventListener("click", async () => {
    const nameInput = document.getElementById("nom").value.trim();

    if (nameInput == "") {
      alert("Veuillez entrer un nom valide !");
      return;
    }
    const res = await fetch("../data/game_status.json?" + Date.now());
    const status = await res.json();

    if (status.started) {
      fetch("../server/player_connect.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameInput)
      })
      window.location.href = `game.php?name=${encodeURIComponent(nameInput)}`;
    }else{
    window.location.href = `waitRoom.php?name=${encodeURIComponent(nameInput)}`;
    }
  });
});
