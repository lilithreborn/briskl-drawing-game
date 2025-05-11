document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start");

  startBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("nom").value.trim();

    if (nameInput == "") {
      alert("Veuillez entrer un nom valide !");
      return;
    }

    window.location.href = `waitRoom.php?name=${encodeURIComponent(nameInput)}`;
  });
});
