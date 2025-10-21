// Recupera o HTML salvo do preview e injeta em tela cheia
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("axiom_final_html");
  const container = document.getElementById("finalContent");

  if (saved && container) {
    container.innerHTML = saved;
  } else {
    container.innerHTML = "<h2>Nenhum resultado encontrado.</h2>";
  }

  /* Fundo com partículas de estrelas */
  const canvas = document.getElementById("launchParticles");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      s: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    for (const star of stars) {
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
      star.y += star.s;
      if (star.y > canvas.height) star.y = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
});
