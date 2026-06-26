const projectMediaStyle = document.createElement("style");
projectMediaStyle.textContent = `
  .project-media-gallery { margin: 2rem 0 3rem; }
  .project-media-stage { position: relative; overflow: hidden; width: 100%; aspect-ratio: 16 / 9; border: 1px solid rgba(139,145,255,.24); border-radius: 24px; background: #080c18; }
  .project-media-slide { position: absolute; inset: 0; display: none; }
  .project-media-slide.active { display: block; }
  .project-media-slide img, .project-media-slide video { width: 100%; height: 100%; display: block; object-fit: contain; background: #080c18; }
  .project-media-arrow { position: absolute; top: 50%; z-index: 4; width: 46px; height: 46px; border: 1px solid rgba(255,255,255,.24); border-radius: 50%; transform: translateY(-50%); background: rgba(7,11,24,.82); color: #fff; font-size: 30px; line-height: 1; cursor: pointer; backdrop-filter: blur(10px); }
  .project-media-prev { left: 18px; }
  .project-media-next { right: 18px; }
  .project-media-tabs { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1rem; }
  .project-media-tab { padding: .65rem 1rem; border: 1px solid rgba(139,145,255,.28); border-radius: 999px; background: rgba(13,19,38,.84); color: #cdd3e9; cursor: pointer; }
  .project-media-tab.active { border-color: #8174ff; background: #8174ff; color: #fff; }
  @media (max-width: 700px) { .project-media-stage { aspect-ratio: 4 / 3; border-radius: 18px; } .project-media-arrow { width: 40px; height: 40px; } }
`;
document.head.appendChild(projectMediaStyle);

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

  if (Array.isArray(project.media) && project.media.length > 0) {
    const slides = project.media.map((item, index) => {
      const activeClass = index === 0 ? " active" : "";
      const label = escapeHtml(item.label || `${project.title} preview`);
      const source = escapeHtml(item.src || "");

      if (item.type === "video") {
        return `
          <div class="project-media-slide${activeClass}" data-slide="${index}">
            <video controls playsinline preload="metadata" aria-label="${label}">
              <source src="${source}" type="video/mp4">
              Your browser does not support video playback.
            </video>
          </div>
        `;
      }

      return `
        <div class="project-media-slide${activeClass}" data-slide="${index}">
          <img src="${source}" alt="${label}">
        </div>
      `;
    }).join("");

    const tabs = project.media.map((item, index) => `
      <button
        class="project-media-tab${index === 0 ? " active" : ""}"
        type="button"
        data-media-index="${index}"
      >
        ${escapeHtml(item.label || `${index + 1}`)}
      </button>
    `).join("");

    return `
      <section class="project-media-gallery">
        <div class="project-media-stage">
          ${slides}
          <button class="project-media-arrow project-media-prev" type="button" aria-label="Previous media">‹</button>
          <button class="project-media-arrow project-media-next" type="button" aria-label="Next media">›</button>
        </div>
        <div class="project-media-tabs">${tabs}</div>
      </section>
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

function initialiseProjectMedia() {
  const gallery = document.querySelector(".project-media-gallery");
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll(".project-media-slide"));
  const tabs = Array.from(gallery.querySelectorAll(".project-media-tab"));
  const previousButton = gallery.querySelector(".project-media-prev");
  const nextButton = gallery.querySelector(".project-media-next");
  let currentIndex = 0;

  function showMedia(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle("active", isActive);
      if (!isActive) {
        const video = slide.querySelector("video");
        if (video) video.pause();
      }
    });
    tabs.forEach((tab, tabIndex) => tab.classList.toggle("active", tabIndex === currentIndex));
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => showMedia(Number(tab.dataset.mediaIndex)));
  });
  previousButton?.addEventListener("click", () => showMedia(currentIndex - 1));
  nextButton?.addEventListener("click", () => showMedia(currentIndex + 1));
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
