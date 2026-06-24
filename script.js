const grid = document.getElementById("projects-grid");
const sortSelect = document.getElementById("project-sort");

let loadedProjects = [];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderProjects(projects) {
  if (!grid) return;

  grid.innerHTML = projects.map((project) => `
    <a
      class="card project-${escapeHtml(project.id)}"
      href="project.html?id=${encodeURIComponent(project.id)}"
    >
      <div class="visual visual-${escapeHtml(project.id)}">
        <div class="visual-grid"></div>

        <div class="visual-art">
          <div class="default-visual">AI</div>
        </div>

        <div class="visual-label">${escapeHtml(project.title)}</div>
      </div>

      <div class="pad">
        <p class="section-kicker">${escapeHtml(project.year)}</p>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.subtitle)}</p>

        <div class="tags">
          ${(project.focus || [])
            .slice(0, 4)
            .map((item) => `<span>${escapeHtml(item)}</span>`)
            .join("")}
        </div>
      </div>
    </a>
  `).join("");
}

function sortProjects(order = "newest") {
  const sorted = [...loadedProjects].sort((a, b) => {
    const yearA = Number(a.year) || 0;
    const yearB = Number(b.year) || 0;

    if (yearA === yearB) {
      return a.title.localeCompare(b.title);
    }

    return order === "oldest"
      ? yearA - yearB
      : yearB - yearA;
  });

  renderProjects(sorted);
}

fetch("./projects.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Could not load projects.json");
    }

    return response.json();
  })
  .then((projects) => {
    loadedProjects = projects;
    sortProjects("newest");
  })
  .catch((error) => {
    console.error(error);

    if (grid) {
      grid.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
    }
  });

if (sortSelect) {
  sortSelect.addEventListener("change", (event) => {
    sortProjects(event.target.value);
  });
}

/* Animated network background */
const canvas = document.getElementById("ai-network");
const context = canvas?.getContext("2d");

const pointer = {
  x: null,
  y: null,
  active: false,
};

let particles = [];
let animationFrame = null;
let width = 0;
let height = 0;
let pixelRatio = 1;

const SETTINGS = {
  desktopParticleCount: 92,
  mobileParticleCount: 48,
  connectionDistance: 145,
  pointerDistance: 175,
  speed: 0.28,
};

function resizeCanvas() {
  if (!canvas || !context) return;

  const bounds = canvas.getBoundingClientRect();

  width = bounds.width;
  height = bounds.height;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  createParticles();
}

function createParticles() {
  const isMobile = width < 760;
  const count = isMobile
    ? SETTINGS.mobileParticleCount
    : SETTINGS.desktopParticleCount;

  particles = Array.from({ length: count }, () => ({
    x: width * (0.34 + Math.random() * 0.66),
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * SETTINGS.speed,
    vy: (Math.random() - 0.5) * SETTINGS.speed,
    radius: 1.2 + Math.random() * 2.1,
    alpha: 0.45 + Math.random() * 0.5,
    pulse: Math.random() * Math.PI * 2,
  }));
}

function drawParticle(particle, time) {
  const pulse = 0.72 + Math.sin(time * 0.0018 + particle.pulse) * 0.22;
  const glowRadius = particle.radius * 5.2;

  const glow = context.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    glowRadius
  );

  glow.addColorStop(0, `rgba(145, 137, 255, ${particle.alpha * 0.86})`);
  glow.addColorStop(1, "rgba(145, 137, 255, 0)");

  context.beginPath();
  context.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
  context.fillStyle = glow;
  context.fill();

  context.beginPath();
  context.arc(
    particle.x,
    particle.y,
    particle.radius * pulse,
    0,
    Math.PI * 2
  );
  context.fillStyle = `rgba(154, 143, 255, ${particle.alpha})`;
  context.fill();
}

function drawConnections() {
  for (let index = 0; index < particles.length; index += 1) {
    const first = particles[index];

    for (
      let comparisonIndex = index + 1;
      comparisonIndex < particles.length;
      comparisonIndex += 1
    ) {
      const second = particles[comparisonIndex];
      const dx = first.x - second.x;
      const dy = first.y - second.y;
      const distance = Math.hypot(dx, dy);

      if (distance > SETTINGS.connectionDistance) continue;

      const opacity =
        (1 - distance / SETTINGS.connectionDistance) * 0.26;

      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(second.x, second.y);
      context.strokeStyle = `rgba(107, 113, 220, ${opacity})`;
      context.lineWidth = 0.8;
      context.stroke();
    }
  }
}

function drawPointerConnections() {
  if (!pointer.active || pointer.x === null || pointer.y === null) {
    return;
  }

  particles.forEach((particle) => {
    const distance = Math.hypot(
      pointer.x - particle.x,
      pointer.y - particle.y
    );

    if (distance > SETTINGS.pointerDistance) return;

    const opacity =
      (1 - distance / SETTINGS.pointerDistance) * 0.42;

    context.beginPath();
    context.moveTo(pointer.x, pointer.y);
    context.lineTo(particle.x, particle.y);
    context.strokeStyle = `rgba(145, 132, 255, ${opacity})`;
    context.lineWidth = 1;
    context.stroke();
  });
}

function updateParticle(particle) {
  particle.x += particle.vx;
  particle.y += particle.vy;

  const leftLimit = width * 0.31;

  if (particle.x < leftLimit) {
    particle.x = leftLimit;
    particle.vx *= -1;
  }

  if (particle.x > width) {
    particle.x = width;
    particle.vx *= -1;
  }

  if (particle.y < 0 || particle.y > height) {
    particle.vy *= -1;
  }
}

function animate(time = 0) {
  if (!context) return;

  context.clearRect(0, 0, width, height);

  particles.forEach(updateParticle);
  drawConnections();
  drawPointerConnections();
  particles.forEach((particle) => drawParticle(particle, time));

  animationFrame = requestAnimationFrame(animate);
}

function updatePointer(event) {
  if (!canvas) return;

  const bounds = canvas.getBoundingClientRect();

  pointer.x = event.clientX - bounds.left;
  pointer.y = event.clientY - bounds.top;
  pointer.active = true;
}

function deactivatePointer() {
  pointer.active = false;
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", updatePointer);
window.addEventListener("pointerleave", deactivatePointer);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else {
    animationFrame = requestAnimationFrame(animate);
  }
});

resizeCanvas();
animate();
