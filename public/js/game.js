document.addEventListener("DOMContentLoaded", () => {

  //////// global variables for the users ///////
  const sndbtn = document.getElementById("send");
  const eraser = document.getElementById("erase-button");
  const resetbtn = document.getElementById("reset-button");
  const word = document.getElementById("word");
  const colorBtns = Array.from(document.getElementsByClassName("bouton-couleur"));
  let isArtist = false;



  //////// global variables for the drawing part ////////
  const canvas = document.getElementById("drawingCanvas");
  const ctx = canvas.getContext("2d");
  let drawing = false;
  let currentColor = "#000000"; // Default brush color
  let isEraser = false;
  // make canvas white for eraser to work (? might fix later)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 600, 450);




  ///////// functions for users ////////

  async function checkPlayers() {
    let res = await fetch("../data/game_status.json?" + Date.now())
    let status = await res.json();

    if (playerName == status.artist) {
      isArtist = true;
      sndbtn.disabled = true;
      word.innerHTML = "Vous êtes l'artiste ! Vous devez dessiner le mot : " + status.word;
      eraser.disabled = false;
      resetbtn.disabled = false;
      colorBtns.forEach(col => {
        col.disabled = false;
      });
    }
    else {
      isArtist = false;
      sndbtn.disabled = false;
      word.innerHTML = status.artist + " est l'artiste ! Vous devez deviner le mot qu'il/elle dessine.";
      eraser.disabled = true;
      resetbtn.disabled = true;
      colorBtns.forEach(col => {
        col.disabled = true;
      });
    }
  }



  //////// functions for drawing ////////

  // conversion to make it easier to manipulate colors
  function rgbToHex(col) {
    if (col.charAt(0) == 'r') {
      col = col.replace('rgb(', '').replace(')', '').split(',');
      var r = parseInt(col[0], 10).toString(16);
      var g = parseInt(col[1], 10).toString(16);
      var b = parseInt(col[2], 10).toString(16);
      r = r.length == 1 ? '0' + r : r; g = g.length == 1 ? '0' + g : g; b = b.length == 1 ? '0' + b : b;
      var colHex = '#' + r + g + b;
      return colHex;
    }
  }

  // color selection
  document.querySelectorAll(".bouton-couleur").forEach(btn => {
    btn.addEventListener("click", () => {
      const style = getComputedStyle(btn);
      currentColor = rgbToHex(style.backgroundColor);
      isEraser = false

      // highlight selected color
      document.querySelectorAll(".bouton-couleur").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });


  // eraser button
  document.getElementById("erase-button").addEventListener("click", () => {
    isEraser = true;
    document.querySelectorAll(".bouton-couleur").forEach(b => b.classList.remove("selected"));
  });

  // reset button (erase everything)
  document.getElementById("reset-button").addEventListener("click", () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 600, 450);
  });


  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);
  canvas.addEventListener("mousemove", draw);

  function startDrawing(e) {
    drawing = true;
    draw(e);
  }

  function stopDrawing() {
    drawing = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!drawing || !isArtist) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = isEraser ? 8 : 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = isEraser ? "#ffffff" : currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  setInterval(() => {
    checkPlayers();
    //checkGameStatus();
  }, 500);

});