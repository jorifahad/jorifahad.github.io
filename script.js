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
    <div class="an-visual">
      <div class="an-panel">
        <div class="an-header">
          <span class="an-title">أخبار</span>
          <span class="an-dot"></span>
        </div>

        <div class="an-lines">
          <i></i><i></i><i></i><i></i>
        </div>

        <div class="an-tags">
          <span>تصنيف</span>
          <span>تلخيص</span>
          <span>5W</span>
        </div>
      </div>

      <div class="an-orbit">
        <b>Who</b>
        <b>What</b>
        <b>When</b>
        <b>Where</b>
        <b>Why</b>
      </div>
    </div>
  `,
  "ood-scene": `
    <div class="ood-visual">
      <div class="ood-panel ood-in">
        <span class="ood-badge">IN-DISTRIBUTION</span>
        <div class="ood-sample normal-shape"></div>
        <div class="ood-meter"><i></i></div>
      </div>

      <div class="ood-divider">
        <span></span>
      </div>

      <div class="ood-panel ood-out">
        <span class="ood-badge">OOD</span>
        <div class="ood-sample anomaly-shape"></div>
        <div class="ood-meter"><i></i></div>
      </div>
    </div>
  `,
  "mersad": `
    <div class="mersad-visual">
      <div class="mersad-worker">
        <div class="mersad-head"></div>
        <div class="mersad-helmet"></div>
        <div class="mersad-vest"></div>
      </div>

      <div class="mersad-box">
        <span class="corner c1"></span>
        <span class="corner c2"></span>
        <span class="corner c3"></span>
        <span class="corner c4"></span>
      </div>

      <div class="mersad-status">
        <span>HELMET</span><b>DETECTED</b>
        <span>VEST</span><b>COMPLIANT</b>
      </div>

      <div class="mersad-scan"></div>
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
    <div class="tunnel-visual">
      <div class="tunnel-wall left-wall"></div>
      <div class="tunnel-wall right-wall"></div>

      <div class="tunnel-rings">
        <i></i><i></i><i></i>
      </div>

      <div class="tunnel-robot">
        <div class="robot-sensor"></div>
        <div class="robot-body"></div>
        <div class="robot-wheel rw1"></div>
        <div class="robot-wheel rw2"></div>
        <div class="robot-wheel rw3"></div>
        <div class="robot-wheel rw4"></div>
      </div>

      <div class="robot-beam"></div>
      <div class="robot-radar"></div>
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
    <div class="mbrec-visual">
      <div class="mb-user">
        <span></span>
        <b>USER</b>
      </div>

      <div class="mb-actions">
        <span class="pv">PV</span>
        <span class="fav">FAV</span>
        <span class="cart">CART</span>
        <span class="buy">BUY</span>
      </div>

      <div class="mb-core">
        <div class="mb-core-ring"></div>
        <strong>GNN</strong>
      </div>

      <div class="mb-recs">
        <i></i><i></i><i></i>
      </div>

      <div class="mb-lines"></div>
    </div>
  `
};


const animatedProjectVisualStyles = document.createElement("style");
animatedProjectVisualStyles.textContent = `
/* Animated semantic visuals — selected cards only */
.visual-arabic-news,
.visual-ood-scene,
.visual-mersad,
.visual-tunnel-robot,
.visual-enhanced-mbrec {
  background:
    radial-gradient(circle at 18% 16%, rgba(92,109,255,.18), transparent 32%),
    radial-gradient(circle at 82% 78%, rgba(145,88,255,.16), transparent 34%),
    linear-gradient(135deg,#08101f,#10172d);
}

.visual-arabic-news .visual-grid,
.visual-ood-scene .visual-grid,
.visual-mersad .visual-grid,
.visual-tunnel-robot .visual-grid,
.visual-enhanced-mbrec .visual-grid {
  opacity:.12;
}

/* Arabic News */
.an-visual{position:relative;width:100%;height:100%}
.an-panel{
  position:absolute;left:4%;top:8%;width:68%;height:78%;
  padding:13px 14px;border:1px solid rgba(255,166,88,.28);
  border-radius:16px;background:rgba(30,16,24,.72);
  box-shadow:0 16px 36px rgba(0,0,0,.28)
}
.an-header{display:flex;align-items:center;justify-content:space-between}
.an-title{font-size:1.1rem;font-weight:900;color:#ffc172}
.an-dot{width:8px;height:8px;border-radius:50%;background:#ff9c65;box-shadow:0 0 12px #ff9c65}
.an-lines{margin-top:12px}
.an-lines i{
  display:block;height:6px;margin:8px 0;border-radius:999px;
  background:linear-gradient(90deg,#e99b61,#b46da7);
  transform-origin:right center;
  animation:newsLine 2.7s ease-in-out infinite
}
.an-lines i:nth-child(2){width:82%;animation-delay:-.4s}
.an-lines i:nth-child(3){width:66%;animation-delay:-.8s}
.an-lines i:nth-child(4){width:90%;animation-delay:-1.2s}
.an-tags{display:flex;gap:5px;margin-top:10px}
.an-tags span{
  padding:4px 6px;border-radius:999px;background:rgba(255,255,255,.06);
  color:#f1d6e7;font-size:.38rem;font-weight:900
}
.an-orbit{
  position:absolute;right:0;top:10%;width:32%;height:78%;
  border-left:1px dashed rgba(191,129,255,.3)
}
.an-orbit b{
  position:absolute;right:0;padding:5px 7px;border-radius:8px;
  background:rgba(113,76,155,.25);color:#d9c7ff;font-size:.38rem
}
.an-orbit b:nth-child(1){top:4%}
.an-orbit b:nth-child(2){top:24%}
.an-orbit b:nth-child(3){top:44%}
.an-orbit b:nth-child(4){top:64%}
.an-orbit b:nth-child(5){top:84%}
@keyframes newsLine{50%{transform:scaleX(.76);filter:brightness(1.35)}}

/* OOD */
.ood-visual{position:relative;width:100%;height:100%;display:grid;grid-template-columns:1fr 42px 1fr;gap:8px;align-items:center}
.ood-panel{
  position:relative;height:78%;border-radius:16px;display:grid;place-items:center;
  border:1px solid;background:rgba(10,18,34,.62);overflow:hidden
}
.ood-in{border-color:#52d9f5}
.ood-out{border-color:#ff6b8d}
.ood-badge{position:absolute;top:9px;font-size:.42rem;font-weight:900;letter-spacing:.08em}
.ood-in .ood-badge{color:#8decff}
.ood-out .ood-badge{color:#ff9eb4}
.ood-sample{width:58%;height:44%;border-radius:13px;position:relative}
.normal-shape{
  background:
    radial-gradient(circle at 30% 35%,#67d9ff 0 10%,transparent 11%),
    linear-gradient(145deg,#173d57,#0e2438)
}
.normal-shape::after{
  content:"";position:absolute;left:17%;right:17%;bottom:20%;height:28%;
  border-radius:50% 50% 12px 12px;background:#58b9e8
}
.anomaly-shape{
  background:
    radial-gradient(circle at 48% 42%,#ff6186 0 9%,transparent 10%),
    repeating-linear-gradient(25deg,#401a31 0 6px,#241429 6px 12px);
  animation:oodGlitch 1.8s steps(2,end) infinite
}
.ood-meter{position:absolute;left:12%;right:12%;bottom:10px;height:5px;border-radius:99px;background:rgba(255,255,255,.08)}
.ood-meter i{display:block;height:100%;border-radius:99px;animation:meterPulse 2s ease-in-out infinite}
.ood-in .ood-meter i{width:68%;background:#55d7f3}
.ood-out .ood-meter i{width:92%;background:#ff6488}
.ood-divider{position:relative;height:70%;display:grid;place-items:center}
.ood-divider::before{content:"";width:1px;height:100%;background:linear-gradient(transparent,#887bff,transparent)}
.ood-divider span{position:absolute;width:14px;height:14px;border-radius:50%;background:#8b7dff;box-shadow:0 0 16px #8b7dff}
@keyframes oodGlitch{50%{transform:translateX(3px);filter:hue-rotate(18deg)}}
@keyframes meterPulse{50%{filter:brightness(1.5)}}

/* MERSAD */
.mersad-visual{position:relative;width:100%;height:100%}
.mersad-worker{position:absolute;left:18%;top:15%;width:42%;height:72%}
.mersad-head{position:absolute;left:37%;top:9%;width:28%;height:24%;border-radius:50%;background:#8c6049}
.mersad-helmet{position:absolute;left:28%;top:2%;width:47%;height:17%;border-radius:50% 50% 8px 8px;background:#d1dcf9}
.mersad-vest{position:absolute;left:22%;bottom:0;width:58%;height:61%;border-radius:18px 18px 8px 8px;background:linear-gradient(90deg,#33573e,#55784f)}
.mersad-vest::after{content:"";position:absolute;left:44%;top:0;width:11%;height:100%;background:#a3c0ff;opacity:.8}
.mersad-box{position:absolute;left:11%;top:8%;width:56%;height:80%;border:2px solid #5be8bd;border-radius:10px;animation:detectPulse 2.2s ease-in-out infinite}
.corner{position:absolute;width:15px;height:15px;border-color:#9fffdc;border-style:solid}
.c1{left:-2px;top:-2px;border-width:3px 0 0 3px}.c2{right:-2px;top:-2px;border-width:3px 3px 0 0}
.c3{left:-2px;bottom:-2px;border-width:0 0 3px 3px}.c4{right:-2px;bottom:-2px;border-width:0 3px 3px 0}
.mersad-status{
  position:absolute;right:0;top:18%;width:34%;padding:10px;border:1px solid rgba(102,239,199,.22);
  border-radius:13px;background:rgba(8,18,31,.78);display:grid;grid-template-columns:1fr auto;gap:9px 7px;
  font-size:.37rem
}
.mersad-status span{color:#cbd6ea}
.mersad-status b{color:#66efc7}
.mersad-scan{position:absolute;left:11%;width:56%;height:2px;background:#66efc7;box-shadow:0 0 12px #66efc7;animation:mersadScan 2.8s linear infinite}
@keyframes detectPulse{50%{box-shadow:0 0 22px rgba(91,232,189,.35)}}
@keyframes mersadScan{0%{top:10%}100%{top:87%}}

/* Tunnel Robot */
.tunnel-visual{position:relative;width:100%;height:100%;overflow:hidden}
.tunnel-wall{position:absolute;top:0;bottom:0;width:42%;background:linear-gradient(145deg,#27301e,#11180f)}
.left-wall{left:0;clip-path:polygon(0 0,100% 14%,70% 100%,0 100%)}
.right-wall{right:0;clip-path:polygon(0 14%,100% 0,100% 100%,30% 100%)}
.tunnel-rings{position:absolute;left:50%;top:49%;width:140px;height:100px;transform:translate(-50%,-50%)}
.tunnel-rings i{position:absolute;inset:0;border:1px solid rgba(98,217,255,.28);border-radius:50%;animation:ringPulse 2.8s ease-in-out infinite}
.tunnel-rings i:nth-child(2){inset:15%;animation-delay:-.9s}
.tunnel-rings i:nth-child(3){inset:30%;animation-delay:-1.8s}
.tunnel-robot{position:absolute;left:50%;bottom:16%;width:84px;height:50px;transform:translateX(-50%)}
.robot-body{position:absolute;left:8%;right:8%;top:8%;bottom:8%;border-radius:14px;background:#718653;border:2px solid #a7c778}
.robot-sensor{position:absolute;left:38%;top:-14px;width:24%;height:18px;border-radius:8px;background:#9bdcff;box-shadow:0 0 14px #76d6ff}
.robot-wheel{position:absolute;width:20px;height:20px;border-radius:50%;background:#111;bottom:-6px}
.rw1{left:0}.rw2{left:22px}.rw3{right:22px}.rw4{right:0}
.robot-beam{position:absolute;left:50%;bottom:37%;width:2px;height:92px;background:linear-gradient(#7de8ff,transparent);transform:translateX(-50%);transform-origin:bottom;animation:beamSweep 3s ease-in-out infinite}
.robot-radar{position:absolute;left:50%;bottom:5%;width:105px;height:32px;border:1px solid rgba(125,232,255,.35);border-radius:50%;transform:translateX(-50%);animation:radarPulse 2s ease-out infinite}
@keyframes beamSweep{50%{transform:translateX(-50%) rotate(24deg)}}
@keyframes radarPulse{50%{transform:translateX(-50%) scale(1.18);opacity:.35}}
@keyframes ringPulse{50%{transform:scale(1.08);opacity:.3}}

/* MBRec */
.mbrec-visual{position:relative;width:100%;height:100%}
.mb-user{position:absolute;left:0;top:28%;width:54px;height:74px;border:1px solid rgba(86,145,255,.35);border-radius:16px;background:rgba(24,52,94,.72);display:grid;place-items:center}
.mb-user span{width:26px;height:26px;border-radius:50%;background:linear-gradient(#6ed5ff,#5b78ff)}
.mb-user b{font-size:.38rem;color:#d9e8ff}
.mb-actions{position:absolute;left:28%;top:7%;bottom:7%;width:70px}
.mb-actions span{position:absolute;padding:6px 9px;border-radius:999px;font-size:.36rem;font-weight:900;color:#fff}
.mb-actions .pv{top:0;background:#4f78d8}.mb-actions .fav{top:28%;background:#43ad98}.mb-actions .cart{top:56%;background:#d58e35}.mb-actions .buy{bottom:0;background:#935de0}
.mb-core{position:absolute;left:53%;top:50%;width:86px;height:86px;transform:translate(-50%,-50%);display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle,#31476f,#111a31);box-shadow:0 0 30px rgba(97,121,255,.28)}
.mb-core-ring{position:absolute;inset:-10px;border:1px dashed rgba(122,219,255,.45);border-radius:50%;animation:spinSlow 8s linear infinite}
.mb-core strong{font-size:1.2rem;color:#e8efff}
.mb-recs{position:absolute;right:0;top:18%;width:90px;height:66%}
.mb-recs i{display:block;height:25%;margin:6px 0;border:1px solid rgba(160,120,255,.28);border-radius:10px;background:linear-gradient(90deg,rgba(95,82,185,.55),rgba(48,41,95,.35));animation:recGlow 2.5s ease-in-out infinite}
.mb-recs i:nth-child(2){animation-delay:-.8s}.mb-recs i:nth-child(3){animation-delay:-1.6s}
.mb-lines{position:absolute;inset:0;background:
linear-gradient(22deg,transparent 48%,rgba(104,151,255,.22) 49% 51%,transparent 52%),
linear-gradient(-18deg,transparent 48%,rgba(158,104,255,.20) 49% 51%,transparent 52%);opacity:.6}
@keyframes recGlow{50%{filter:brightness(1.5);transform:translateX(4px)}}
`;
document.head.appendChild(animatedProjectVisualStyles);

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
