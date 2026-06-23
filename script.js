const grid = document.getElementById("projects-grid");
const count = document.getElementById("project-count");

const projectVisuals = {
  "mindwatch": `
    <div class="mw-monitor">
      <div class="mw-title">MULTIMODAL SIGNAL MONITOR</div>
      <div class="mw-row"><span>EEG</span><i class="wave eeg"></i></div>
      <div class="mw-row"><span>ECG</span><i class="wave ecg"></i></div>
      <div class="mw-row"><span>EMG</span><i class="wave emg"></i></div>
      <div class="mw-row"><span>MOTION</span><i class="wave motion"></i></div>
      <div class="mw-risk">PRE-ICTAL PREDICTION · 15 MIN</div>
    </div>
  `,
  "logistics-rag": `
    <div class="rag-chat">
      <div class="rag-chat-header">
        <span class="rag-status"></span>
        <div>
          <strong>Logistics RAG Assistant</strong>
          <small>Grounded answers from trusted documents</small>
        </div>
      </div>

      <div class="rag-message rag-user-message">
        Where is shipment 2048?
      </div>

      <div class="rag-message rag-ai-message">
        <span class="rag-avatar">RAG</span>
        <p>Retrieved from trusted logistics documents. Shipment is in transit to Jeddah Port.</p>
      </div>

      <div class="rag-sources">
        <span>Source: Logistics Report</span>
        <span>Page 12</span>
      </div>
    </div>
  `,
  "enterprise-ai": `
    <div class="enterprise-chat">
      <div class="enterprise-chat-header">
        <span class="enterprise-status"></span>
        <div>
          <strong>Enterprise Assistant</strong>
          <small>Secure internal AI</small>
        </div>
      </div>

      <div class="enterprise-message user-message">
        I need annual leave next week.
      </div>

      <div class="enterprise-message ai-message">
        <span class="assistant-avatar">AI</span>
        <p>Leave request prepared and the relevant policy was checked.</p>
      </div>

      <div class="enterprise-actions">
        <span>IT Ticket</span>
        <span>Leave Request</span>
        <span>Policy Search</span>
      </div>
    </div>
  `,
  "arabic-news": `
    <div class="news-scene">
      <div class="news-ar">أخبار</div>
      <div class="news-lines">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="news-tags">تصنيف · تلخيص · 5W</div>
    </div>
  `,
  "ood-scene": `
    <div class="ood-scene-art">
      <div class="ood-frame normal">IN-DISTRIBUTION</div>
      <div class="ood-frame anomaly">OOD</div>
      <div class="ood-scan"></div>
    </div>
  `,
  "mersad": `
    <div class="mersad-logo-scene">
      <img src="Mersad.png" alt="MERSAD logo">
    </div>
  `,
  "flight-delay": `
    <div class="flight-scene">
      <div class="flight-path"></div>
      <div class="plane">✈</div>
      <div class="airport a">JED</div>
      <div class="airport b">RUH</div>
      <div class="delay-badge">DELAY RISK 18%</div>
    </div>
  `,
  "tunnel-robot": `
    <div class="robot-scene">
      <div class="tunnel tunnel-left"></div>
      <div class="tunnel tunnel-right"></div>
      <div class="robot">
        <div class="robot-eye"></div>
        <div class="robot-body"></div>
        <div class="wheel w1"></div>
        <div class="wheel w2"></div>
      </div>
      <div class="sensor-beam"></div>
    </div>
  `,
  "bilingual-ocr": `
    <div class="ocr-scene">
      <div class="ocr-doc">
        <div class="ocr-ar">تقرير طبي</div>
        <div class="ocr-en">Medical Report</div>
        <span></span><span></span><span></span>
      </div>
      <div class="ocr-scanline"></div>
      <div class="ocr-result">AR + EN · LAYOUT PRESERVED</div>
    </div>
  `,
  "enhanced-mbrec": `
    <div class="mbrec-scene">
      <div class="mbrec-user">USER</div>
      <div class="mbrec-graph">
        <span class="mbrec-node n1">PV</span>
        <span class="mbrec-node n2">FAV</span>
        <span class="mbrec-node n3">CART</span>
        <span class="mbrec-node n4">BUY</span>
        <span class="mbrec-core">GNN</span>
      </div>
      <div class="mbrec-items">TOP-10 RECOMMENDATIONS</div>
    </div>
  `,
  "orbscope": `
    <div class="space-scene">
      <div class="earth"></div>
      <div class="orbit"></div>
      <div class="satellite">◆</div>
      <div class="space-label">EARTH OBSERVATION</div>
    </div>
  `
};

let loadedProjects = [];

function renderProjects(projects) {
  count.textContent = projects.length;

  grid.innerHTML = projects.map((project) => `
    <a class="card project-${project.id}" href="project.html?id=${encodeURIComponent(project.id)}">
      <div class="visual visual-${project.id}">
        <div class="visual-grid"></div>
        <div class="visual-art">
          ${projectVisuals[project.id] || `<div class="default-visual">AI</div>`}
        </div>
        <div class="visual-label">${project.title}</div>
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
  `).join("");
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
