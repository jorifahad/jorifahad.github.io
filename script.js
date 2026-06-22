fetch("projects.json")
  .then((response) => response.json())
  .then((items) => {
    const grid = document.getElementById("grid");

    items.forEach((project) => {
      const card = document.createElement("a");

      card.className = "card";
      card.href = `project.html?id=${project.id}`;

      card.innerHTML = `
        <div class="visual"></div>

        <div class="pad">
          <h3>${project.title}</h3>
          <p>${project.subtitle}</p>

          <div class="tags">
            ${project.focus
              .map((focusArea) => `<span>${focusArea}</span>`)
              .join("")}
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Unable to load projects:", error);
  });


const canvas = document.getElementById("ai-network");

if (canvas) {
  const context = canvas.getContext("2d");

  let canvasWidth = 0;
  let canvasHeight = 0;
  let particles = [];
  let animationFrame;

  function createParticles() {
    const particleCount =
      window.innerWidth < 600
        ? 28
        : window.innerWidth < 1000
          ? 42
          : 60;

    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,

      velocityX: (Math.random() - 0.5) * 0.35,
      velocityY: (Math.random() - 0.5) * 0.35,

      radius: Math.random() * 1.7 + 1
    }));
  }

  function resizeCanvas() {
    const canvasBox = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = canvasBox.width;
    canvasHeight = canvasBox.height;

    canvas.width = Math.floor(canvasWidth * pixelRatio);
    canvas.height = Math.floor(canvasHeight * pixelRatio);

    context.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

    createParticles();
  }

  function drawParticles() {
    context.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    particles.forEach((particle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      if (
        particle.x <= 0 ||
        particle.x >= canvasWidth
      ) {
        particle.velocityX *= -1;
      }

      if (
        particle.y <= 0 ||
        particle.y >= canvasHeight
      ) {
        particle.velocityY *= -1;
      }

      context.beginPath();

      context.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      context.fillStyle =
        "rgba(132, 145, 255, 0.78)";

      context.fill();
    });
  }

  function drawConnections() {
    const connectionDistance = 150;

    for (let first = 0; first < particles.length; first++) {
      for (
        let second = first + 1;
        second < particles.length;
        second++
      ) {
        const horizontalDistance =
          particles[first].x - particles[second].x;

        const verticalDistance =
          particles[first].y - particles[second].y;

        const distance = Math.sqrt(
          horizontalDistance * horizontalDistance +
          verticalDistance * verticalDistance
        );

        if (distance < connectionDistance) {
          const opacity =
            0.22 * (1 - distance / connectionDistance);

          context.beginPath();

          context.moveTo(
            particles[first].x,
            particles[first].y
          );

          context.lineTo(
            particles[second].x,
            particles[second].y
          );

          context.strokeStyle =
            `rgba(123, 134, 255, ${opacity})`;

          context.lineWidth = 1;
          context.stroke();
        }
      }
    }
  }

  function animateNetwork() {
    drawParticles();
    drawConnections();

    animationFrame =
      requestAnimationFrame(animateNetwork);
  }

  resizeCanvas();
  animateNetwork();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resizeCanvas();
    animateNetwork();
  });
}
