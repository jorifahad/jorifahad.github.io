
const sawtaiMediaStyles = document.createElement("style");
sawtaiMediaStyles.textContent = `
  .sawtai-media-stage { position: relative; background: #080d19; }
  .sawtai-media-slide { position: absolute; inset: 0; display: none; }
  .sawtai-media-slide.active { display: block; }
  .sawtai-media-slide img,
  .sawtai-media-slide video {
    width: 100%; height: 100%; display: block; object-fit: contain; background: #080d19;
  }
  .sawtai-media-tabs { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
  .sawtai-media-tab {
    padding: 9px 13px; border: 1px solid #2d3856; border-radius: 999px;
    background: #11182b; color: #f7f8fc; cursor: pointer;
  }
  .sawtai-media-tab.active { background: linear-gradient(135deg,#7384ff,#9a89ff); border-color: transparent; }
`;
document.head.appendChild(sawtaiMediaStyles);

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
  if (project.hideMedia === true) {
    return "";
  }

  if (Array.isArray(project.media) && project.media.length) {
    const slides = project.media.map((item, index) => {
      const activeClass = index === 0 ? " active" : "";
      const label = escapeHtml(item.label || `${project.title} preview`);
      const source = escapeHtml(item.src || "");

      if (item.type === "video") {
        return `
          <div class="sawtai-media-slide${activeClass}" data-index="${index}">
            <video controls playsinline preload="metadata" aria-label="${label}">
              <source src="${source}" type="video/mp4">
              Your browser does not support video playback.
            </video>
          </div>
        `;
      }

      return `
        <div class="sawtai-media-slide${activeClass}" data-index="${index}">
          <img src="${source}" alt="${label}">
        </div>
      `;
    }).join("");

    const tabs = project.media.map((item, index) => `
      <button class="sawtai-media-tab${index === 0 ? " active" : ""}" type="button" data-index="${index}">
        ${escapeHtml(item.label || `${index + 1}`)}
      </button>
    `).join("");

    return `
      <div class="sawtai-media-gallery">
        <div class="cover sawtai-media-stage">${slides}</div>
        <div class="sawtai-media-tabs">${tabs}</div>
      </div>
    `;
  }

  if (project.video && project.video !== "#") {
    return `
      <div class="cover video-cover">
        <video controls playsinline preload="metadata">
          <source src="${escapeHtml(project.video)}" type="video/mp4">
          Your browser does not support video playback.
        </video>
      </div>
    `;
  }

  if (project.image && project.image !== "#") {
    return `
      <div class="cover image-cover">
        <img
          src="${escapeHtml(project.image)}"
          alt="${escapeHtml(project.title)} project preview"
        >
      </div>
    `;
  }

  return `<div class="cover"></div>`;
}

function initialiseSawtAIMedia() {
  const gallery = document.querySelector(".sawtai-media-gallery");
  if (!gallery) return;

  const slides = [...gallery.querySelectorAll(".sawtai-media-slide")];
  const tabs = [...gallery.querySelectorAll(".sawtai-media-tab")];

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = Number(tab.dataset.index);
      slides.forEach((slide, index) => {
        const active = index === selected;
        slide.classList.toggle("active", active);
        if (!active) slide.querySelector("video")?.pause();
      });
      tabs.forEach((item, index) => item.classList.toggle("active", index === selected));
    });
  });
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
        project.id === "shadow-strike"
          ? `
            ${createSection("About the Project", project.short)}
            ${createSection("Why I Built It", project.why)}
            ${createSection("Key Features", project.features)}
            ${createSection("Technical Implementation", project.technical)}
            ${createSection("Controls", project.controls)}
            ${createSection("Project Outcome", project.outcome)}
            ${demoSection}
          `
          : project.id === "sawtai"
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
              ${createResultImage(project)}
            `
      }

      <div class="actions">
        ${createButton(project.github, githubLabel, "button")}
        ${createButton(project.paper, "View Research Paper", "ghost")}
        ${createButton(project.drive, "View Project Files", "ghost")}
      </div>
    `;

    initialiseSawtAIMedia();
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
