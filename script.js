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
    <div class="cg-news">
      <div class="cg-news-network">
        <span>س</span><span>ر</span><span>ع</span><span>ق</span><span>ن</span>
      </div>

      <div class="cg-news-tools">
        <div><b></b><span>TOKENIZATION</span></div>
        <div><b></b><span>NER</span></div>
        <div><b></b><span>TOPIC MODELING</span></div>
        <div><b></b><span>SENTIMENT</span></div>
        <div><b></b><span>SUMMARIZATION</span></div>
      </div>

      <div class="cg-news-panel">
        <div class="cg-news-headline">
          استثمارات تقنية جديدة لتعزيز التحول الرقمي
        </div>

        <div class="cg-news-body">
          <i></i><i></i><i></i><i></i><i></i>
        </div>

        <div class="cg-news-topics">
          <span>تقنية</span><span>اقتصاد</span><span>استثمار</span>
        </div>

        <div class="cg-news-fivew">
          <b>من</b><b>ماذا</b><b>متى</b><b>أين</b><b>لماذا</b>
        </div>

        <div class="cg-news-confidence">
          <span></span><strong>92%</strong>
        </div>
      </div>
    </div>
  `,
  "ood-scene": `
    <div class="cg-ood">
      <div class="cg-ood-left">
        <h4>IN-DISTRIBUTION</h4>
        <div class="cg-ood-thumb t1"></div>
        <div class="cg-ood-thumb t2"></div>
        <div class="cg-ood-thumb t3"></div>
        <div class="cg-ood-thumb t4"></div>
        <span class="cg-ood-check">✓</span>
      </div>

      <div class="cg-ood-center">
        <div class="cg-ood-brain"></div>
        <span class="cg-ood-beam blue"></span>
        <span class="cg-ood-beam pink"></span>
      </div>

      <div class="cg-ood-right">
        <h4>OUT-OF-DISTRIBUTION</h4>
        <div class="cg-ood-thumb a1"></div>
        <div class="cg-ood-thumb a2"></div>
        <div class="cg-ood-thumb a3"></div>
        <span class="cg-ood-alert">!</span>
      </div>

      <div class="cg-ood-particles"></div>
    </div>
  `,
  "mersad": `
    <div class="cg-mersad">
      <div class="cg-ms-grid"></div>

      <div class="cg-ms-worker">
        <div class="cg-ms-helmet"></div>
        <div class="cg-ms-head"></div>
        <div class="cg-ms-body"></div>
        <div class="cg-ms-vest"></div>
      </div>

      <div class="cg-ms-detect">
        <span class="tl"></span><span class="tr"></span>
        <span class="bl"></span><span class="br"></span>
        <b>ID: 87421</b>
      </div>

      <div class="cg-ms-panel">
        <div><span>HELMET</span><b class="ok">DETECTED</b></div>
        <div><span>SAFETY VEST</span><b class="ok">COMPLIANT</b></div>
        <div><span>GLOVES</span><b class="warn">NOT DETECTED</b></div>
        <div><span>SAFETY SHOES</span><b class="ok">COMPLIANT</b></div>
        <div class="cg-ms-score"><span>COMPLIANCE SCORE</span><strong>75%</strong></div>
      </div>

      <div class="cg-ms-radar">
        <i></i><i></i><i></i>
      </div>

      <div class="cg-ms-chart">
        <i></i><i></i><i></i><i></i><i></i><i></i>
      </div>

      <div class="cg-ms-scan"></div>
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
    <div class="cg-tunnel">
      <div class="cg-tunnel-depth">
        <span></span><span></span><span></span><span></span>
      </div>

      <div class="cg-tunnel-map">
        <i></i><i></i><i></i>
      </div>

      <div class="cg-tunnel-robot">
        <div class="cg-tr-antenna"></div>
        <div class="cg-tr-lidar"></div>
        <div class="cg-tr-body">
          <span class="cg-tr-light"></span>
        </div>
        <div class="cg-tr-wheel w1"></div>
        <div class="cg-tr-wheel w2"></div>
        <div class="cg-tr-wheel w3"></div>
        <div class="cg-tr-wheel w4"></div>
      </div>

      <div class="cg-tr-beam"></div>

      <div class="cg-tr-radar">
        <span></span><span></span><span></span>
      </div>

      <div class="cg-tr-stats">
        <i></i><i></i><i></i><i></i><i></i>
      </div>
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
  "orbscope": `
    <div class="space-scene">
      <div class="earth"></div>
      <div class="orbit"></div>
      <div class="satellite">◆</div>
      <div class="space-label">EARTH OBSERVATION</div>
    </div>
  `,
  "enhanced-mbrec": `
    <div class="cg-mbrec">
      <div class="cg-mb-user">
        <div class="cg-user-avatar"></div>
        <span>USER</span>
      </div>

      <div class="cg-mb-actions">
        <div class="pv"><b>◉</b><span>PV</span></div>
        <div class="fav"><b>♥</b><span>FAV</span></div>
        <div class="cart"><b>▰</b><span>CART</span></div>
        <div class="buy"><b>▣</b><span>BUY</span></div>
      </div>

      <div class="cg-mb-core">
        <div class="cg-core-ring ring1"></div>
        <div class="cg-core-ring ring2"></div>
        <div class="cg-core-ring ring3"></div>
        <strong>GNN</strong>
        <small>RECOMMENDATION ENGINE</small>
      </div>

      <div class="cg-mb-recommendations">
        <h4>TOP-10<br>RECOMMENDATIONS</h4>
        <div><span class="item i1"></span><i></i><i></i></div>
        <div><span class="item i2"></span><i></i><i></i></div>
        <div><span class="item i3"></span><i></i><i></i></div>
        <div><span class="item i4"></span><i></i><i></i></div>
      </div>

      <div class="cg-mb-connections"></div>
    </div>
  `
};

fetch("./projects.json")
  .then((response) => {
    if (!response.ok) throw new Error("Could not load projects.json");
    return response.json();
  })
  .then((projects) => {
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
