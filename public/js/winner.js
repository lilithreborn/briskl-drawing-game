document.addEventListener("DOMContentLoaded", () => {
  const scores = JSON.parse(localStorage.getItem("scores"));
  const winner = localStorage.getItem("winner");

  document.getElementById("winner-name").textContent = winner;

  const list = document.getElementById("score-list");
  for (const [name, score] of Object.entries(scores)) {
    const li = document.createElement("li");
    li.textContent = `${name}: ${score}`;
    list.appendChild(li);
  }
});
