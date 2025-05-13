document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../data/game_status.json?" + Date.now());
    if (!res.ok) throw new Error("Fetch failed");

    const status = await res.json();

    document.getElementById("winner-name").textContent = status.winner;

    const list = document.getElementById("score-list");
    for (const [name, score] of Object.entries(status.scores)) {
      const li = document.createElement("li");
      li.textContent = `${name}: ${score}`;
      list.appendChild(li);
    }

  } catch (err) {
    console.error("Error loading scores:", err);
    document.body.innerHTML = "<p>Failed to load game results.</p>";
  }
});
