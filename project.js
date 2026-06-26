const sawtaiProjectStyles = document.createElement("style");
sawtaiProjectStyles.textContent = `
  .project-media-gallery { margin: 2rem 0 3rem; }
  .project-media-stage { position: relative; width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border: 1px solid rgba(139,145,255,.24); border-radius: 24px; background: #080c18; }
  .project-media-slide { position: absolute; inset: 0; display: none; }
  .project-media-slide.active { display: block; }
  .project-media-slide img, .project-media-slide video { width: 100%; height: 100%; display: block; object-fit: contain; background: #080c18; }
  .project-media-arrow { position: absolute; top: 50%; z-index: 3; width: 44px; height: 44px; border: 1px solid rgba(255,255,255,.25); border-radius: 50%; transform: translateY(-50%); background: rgba(6,10,22,.82); color: white; font-size: 28px; cursor: pointer; }
  .project-media-prev { left: 14px; } .project-media-next { right: 14px; }
  .project-media-tabs { display: flex; flex-wrap: wrap; gap: .65rem; margin-top: 1rem; }
  .project-media-tab { padding: .6rem .95rem; border: 1px solid rgba(139,145,255,.3); border-radius: 999px; background: rgba(13,19,38,.84); color: #d7dafa; cursor: pointer; }
  .project-media-tab.active { background: #8174ff; border-color: #8174ff; color: white; }
`;
document.head.appendChild(sawtaiProjectStyles);

const projectContainer = document.getElementById("project");
const projectId = new URLSearchParams(window.location.search).get("id");

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatBold(value = "") {
  const parts = escapeHtml(value).split("**");
  let result = "";

  parts.forEach((part, index) => {
    result += index % 2 === 1 ? `<strong>${part}</strong>` : part;
  });

  return result;
}

function renderContent(content = "") {
  const lines = String(content).split("\n");
  let html = "";
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index++;
      continue;
    }

    if (line.startsWith("* ") || line.startsWith("- ")) {
      html += "<ul>";

      while (
        index < lines.length &&
        (lines[index].trim().startsWith("* ") ||
         lines[index].trim().startsWith("- "))
      ) {
        html += `<li>${formatBold(lines[index].trim().slice(2))}</li>`;
        index++;
      }

      html += "</ul>";
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines = [];

      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim());
        index++;
      }

      const rows = tableLines.map((row) =>
        row.slice(1, -1).split("|").map((cell) => cell.trim())
      );

      const headers = rows[0] || [];
      const bodyRows = rows.slice(2);

      html += `
        <div class="table-wrapper">
          <table class="results-table">
            <thead>
              <tr>${headers.map((header) => `<th>${formatBold(header)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${bodyRows.map((row) =>
                `<tr>${row.map((cell) => `<td>${formatBold(cell)}</td>`).join("")}</tr>`
              ).join("")}
            </tbody>
          </table>
        </div>
      `;
      continue;
    }

    html += `<p>${formatBold(line)}</p>`;
    index++;
  }

  return html;
}

function createSection(title, content) {
  if (!content) return "";

  return `
    <section class="detail">
      <h3>${escapeHtml(title)}</h3>
      <div class="detail-content">${renderContent(content)}</div>
    </section>
  `;
}

function createButton(url, label, className) {
  if (!url || url === "#") return "";

  return `
    <a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
      ${escapeHtml(label)}
    </a>
  `;
}

function createProjectMedia(project) {
  if (project.hideMedia === true) return "";
  const mediaItems = Array.isArray(project.media) && project.media.length
    ? project.media
    : project.video && project.video !== "#"
      ? [{ type: "video", src: project.video, label: project.title }]
      : project.image && project.image !== "#"
        ? [{ type: "image", src: project.image, label: project.title }]
        : [];
  if (!mediaItems.length) return `<div class="cover"></div>`;
  const slides = mediaItems.map((item, index) => {
    const active = index === 0 ? " active" : "";
    const src = escapeHtml(item.src || "");
    const label = escapeHtml(item.label || `${project.title} preview`);
    if (item.type === "video") {
      return `<div class="project-media-slide${active}"><video controls playsinline preload="metadata" aria-label="${label}"><source src="${src}" type="video/mp4">Your browser does not support video playback.</video></div>`;
    }
    return `<div class="project-media-slide${active}"><img src="${src}" alt="${label}"></div>`;
  }).join("");
  const tabs = mediaItems.map((item, index) => `<button class="project-media-tab${index === 0 ? " active" : ""}" type="button" data-media-index="${index}">${escapeHtml(item.label || `${index + 1}`)}</button>`).join("");
  return `<section class="project-media-gallery"><div class="project-media-stage">${slides}${mediaItems.length > 1 ? `<button class="project-media-arrow project-media-prev" type="button" aria-label="Previous media">‹</button><button class="project-media-arrow project-media-next" type="button" aria-label="Next media">›</button>` : ""}</div>${mediaItems.length > 1 ? `<div class="project-media-tabs">${tabs}</div>` : ""}</section>`;
}

function initialiseProjectMedia() {
  const gallery = document.querySelector(".project-media-gallery");
  if (!gallery) return;
  const slides = [...gallery.querySelectorAll(".project-media-slide")];
  const tabs = [...gallery.querySelectorAll(".project-media-tab")];
  const prev = gallery.querySelector(".project-media-prev");
  const next = gallery.querySelector(".project-media-next");
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { const active = i === current; slide.classList.toggle("active", active); if (!active) slide.querySelector("video")?.pause(); });
    tabs.forEach((tab, i) => tab.classList.toggle("active", i === current));
  }
  tabs.forEach((tab) => tab.addEventListener("click", () => show(Number(tab.dataset.mediaIndex))));
  prev?.addEventListener("click", () => show(current - 1));
  next?.addEventListener("click", () => show(current + 1));
}

function createResultImage(project) {
  if (!project.resultImage || project.resultImage === "#") {
    return "";
  }

  return `
    <div class="result-image-wrapper">
      <img
        src="${escapeHtml(project.resultImage)}"
        alt="${escapeHtml(project.title)} result example"
      >
    </div>
  `;
}

fetch("./projects.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Could not load projects.json: " + response.status);
    }
    return response.json();
  })
  .then((projects) => {
    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error("No projects were found.");
    }

    const project = projects.find((item) => item.id === projectId) || projects[0];
    document.title = project.title + " | Jori Fahad Baaljahr";

    const demoSection =
      project.demo && project.demo !== "#"
        ? `
          <section class="detail">
            <h3>Demo</h3>
            <div class="detail-content">
              <p>Explore the interactive ${escapeHtml(project.title)} demo.</p>
              ${createButton(project.demo, "Open Live Demo", "button")}
            </div>
          </section>
        `
        : "";

    const githubLabel =
      project.id === "orbscope"
        ? "View Interactive Prototype"
        : "View Full Code";

    projectContainer.innerHTML = `
      <section class="projectHero">
        <p class="kicker">${escapeHtml(project.year)} · AI Project</p>
        <h1>${escapeHtml(project.title)}</h1>
        <h2>${escapeHtml(project.subtitle)}</h2>
        <div class="tags">
          ${(project.focus || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
      </section>

      ${createProjectMedia(project)}

      ${
        project.id === "sawtai"
          ? `
              ${createSection("Overview", project.overview)}
              ${createSection("Core Capabilities", project.capabilities)}
              ${createSection("How It Works", project.workflow)}
              ${createSection("Technologies", project.technologies)}
              ${demoSection}
              ${createSection("Key Outcome", project.outcome)}
            `
          : `
              ${createSection("Short Description", project.short)}
              ${createSection("Problem", project.problem)}
              ${createSection("Solution", project.solution)}
              ${createSection("Models & Technologies", project.models)}
              ${demoSection}
              ${createSection("Results", project.results)}
            `
      }
      ${createResultImage(project)}

      <div class="actions">
        ${createButton(project.github, githubLabel, "button")}
        ${createButton(project.paper, "View Research Paper", "ghost")}
        ${createButton(project.drive, "View Project Files", "ghost")}
      </div>
    `;

    initialiseProjectMedia();
  })
  .catch((error) => {
    console.error(error);
    projectContainer.innerHTML = `
      <section class="detail">
        <h3>Error</h3>
        <div class="detail-content">
          <p>${escapeHtml(error.message)}</p>
        </div>
      </section>
    `;
  });
