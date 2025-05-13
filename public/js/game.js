document.addEventListener("DOMContentLoaded", () => {

  //////// global variables for the users ///////
  const chatinput = document.getElementById("chat-input");
  const sndbtn = document.getElementById("send");
  const eraser = document.getElementById("erase-button");
  const resetbtn = document.getElementById("reset-button");
  const wordHtml = document.getElementById("word");
  const colorBtns = Array.from(document.getElementsByClassName("bouton-couleur"));
  let isArtist = false;


  //////// global variables for he drawing ////////
  const canvas = document.getElementById("drawingCanvas");
  const ctx = canvas.getContext("2d");
  let drawing = false;
  let currentColor = "#000000"; // Default brush color is black
  let isEraser = false;
  let currentStroke = []; // saving strokes as clouds of points to draw continuous lines
  // make canvas white for eraser to work (? might fix later)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 600, 450);

  ////// polling for artist update and saving strokes /////
  setInterval(() => {
    checkPlayers();
    //checkStatus();
  }, 500);

  let fetchInterval = setInterval(() => {
    fetchStrokes();
  }, 300);
  //////////



  ///////// functions for users ////////

  async function checkPlayers() {
    let res = await fetch("../data/game_status.json?" + Date.now())
    let status = await res.json();

    if (playerName == status.artist) {
      isArtist = true;
      sndbtn.disabled = true;
      wordHtml.innerHTML = "Vous êtes l'artiste ! Vous devez dessiner le mot : " + status.word;
      eraser.disabled = false;
      resetbtn.disabled = false;
      colorBtns.forEach(col => {
        col.disabled = false;
      });
    }
    else {
      isArtist = false;
      sndbtn.disabled = false;
      wordHtml.innerHTML = status.artist + " est l'artiste ! Vous devez deviner le mot qu'il/elle dessine.";
      eraser.disabled = true;
      resetbtn.disabled = true;
      colorBtns.forEach(col => {
        col.disabled = true;
      });
    }

    // fetching strokes : setting interval only for non-artists
    if (!isArtist && !fetchInterval) {
      // Start interval ONLY for non-artists, and only once
      fetchInterval = setInterval(() => {
        fetchStrokes();
      }, 200);
    }

    if (isArtist && fetchInterval) {
      // Stop interval if player becomes artist
      clearInterval(fetchInterval);
      fetchInterval = null;
    }
  }

  async function checkAnswers(ans) {
    let res = await fetch("../data/game_status.json?" + Date.now())
    let status = await res.json();

    let word = status.word.toLowerCase();

    if (ans == word) {
      window.location.href = `won.html?name=${encodeURIComponent(playerName)}`;
    }
  }

  sndbtn.addEventListener("click", () => {
    let ans = chatinput.value.toLowerCase();
    checkAnswers(ans);
  })

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


  // eraser button (unselects color and switches to eraser mode)
  document.getElementById("erase-button").addEventListener("click", () => {
    isEraser = true;
    document.querySelectorAll(".bouton-couleur").forEach(b => b.classList.remove("selected"));
  });

  // reset button (erases everything)
  document.getElementById("reset-button").addEventListener("click", async () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 600, 450);
    await fetch("../server/reset_canvas.php"); // empties saved strokes 
    fetchStrokes();
  });

  //// drawing event listeners /////
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
    if (currentStroke.length > 0) {
      sendStroke(currentStroke, currentColor, ctx.lineWidth);
      currentStroke = [];  // Reset the current stroke
    }
  }
  //////////

  // drawing function : uses currentColor if drawing or white if eraser (eraser width is wider than pen)
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

    // store the point in the current stroke
    currentStroke.push({ x, y });

    // simulating real-time save for every point (not ideal for performance, but works for now)
    //sendStroke(currentStroke, currentColor, ctx.lineWidth);  // send accumulated points
  }

  // saving drawn strokes (artist side) => simulating real-time
  async function sendStroke(points, color, width) {
    // send the entire stroke to the server
    await fetch("../server/save_stroke.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points, color, width })
    });
  }

  // fetching saved strokes (non-artist side)
  let lastStrokeCount = 0;

  async function fetchStrokes() {
    try {
      const res = await fetch("../data/strokes.json?" + Date.now());
      const strokes = await res.json();

      if (strokes.length == 0) {
        // in case of canvas reset
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lastStrokeCount = 0;
      }
      if (strokes.length > lastStrokeCount) {
        const newStrokes = strokes.slice(lastStrokeCount);
        newStrokes.forEach(s => drawStroke(s));
        lastStrokeCount = strokes.length;
      }
    } catch (err) {
      console.error("Failed to fetch strokes:", err);
    }
  }

  function drawStroke(stroke) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";

    ctx.beginPath();
    const points = stroke.points;

    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y); // Move to the first point

      // Draw lines connecting each point in the stroke
      points.forEach((point, index) => {
        if (index > 0) {
          ctx.lineTo(point.x, point.y);
          ctx.stroke(); // Draw the line
        }
      });
    }
  }


});


window.addEventListener("beforeunload", () =>{
  fetch("../server/player_dc.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(playerName)
  })
});