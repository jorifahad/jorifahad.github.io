const grid = document.getElementById("projects-grid");
const count = document.getElementById("project-count");

const projectCardImages = {
  "mindwatch": "mindwatch-card.png",
  "logistics-rag": "logistics-rag-card.png",
  "enterprise-ai": "enterprise-ai-card.png",
  "arabic-news": "arabic-news-card.png",
  "ood-scene": "ood-card.png",
  "mersad": "mersad-card.png",
  "flight-delay": "flight-delay-card.png",
  "tunnel-robot": "tunnel-robot-card.png",
  "bilingual-ocr": "bilingual-ocr-card.png",
  "enhanced-mbrec": "mbrec-card.png",
  "orbscope": "orbscope-card.png"
};

let loadedProjects = [];

function renderProjects(projects) {
  if (count) count.textContent = projects.length;

  grid.innerHTML = projects.map((project) => {
    const cardImage = projectCardImages[project.id];

    return `
      <a class="card project-${project.id}" href="project.html?id=${encodeURIComponent(project.id)}">
        <div class="visual visual-image-card">
          <img src="${cardImage}" alt="${project.title} project preview">
        </div>

        <div class="pad">
          <p class="kicker">${project.year}</p>
          <h3>${project.title}</h3>
          <p>${project.subtitle}</p>
          <div class="tags">
            ${(project.focus || []).slice(0, 4).map((item) => `<span>${item}</span>`).join("")}
          </div>
        </div>
      </a>
    `;
  }).join("");
}

function sortProjects(order = "newest") {
  const sortedProjects = [...loadedProjects].sort((a, b) => {
    const yearA = Number(a.year) || 0;
    const yearB = Number(b.year) || 0;

    if (yearA === yearB) {
      return a.title.localeCompare(b.title);
    }

    return order === "oldest" ? yearA - yearB : yearB - yearA;
  });

  renderProjects(sortedProjects);
}

fetch("./projects.json")
  .then((response) => {
    if (!response.ok) throw new Error("Could not load projects.json");
    return response.json();
  })
  .then((projects) => {
    loadedProjects = projects;
    sortProjects("newest");

    const sortSelect = document.getElementById("project-sort");
    if (sortSelect) {
      sortSelect.addEventListener("change", (event) => {
        sortProjects(event.target.value);
      });
    }
  })
  .catch((error) => {
    console.error(error);
    grid.innerHTML = `<p class="error-message">${error.message}</p>`;
  });

const canvas = document.getElementById("ai-network");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let nodes = [];

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    nodes = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.8 + 1
    }));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x <= 0 || node.x >= width) node.vx *= -1;
      if (node.y <= 0 || node.y >= height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(139, 145, 255, 0.85)";
      ctx.fill();
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 140) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(120, 132, 255, ${0.24 * (1 - distance / 140)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animate();
}
