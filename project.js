const projectContainer = document.getElementById("project");
const projectId = new URLSearchParams(window.location.search).get("id");

function formatBold(text = "") {
const boldPattern = new RegExp("\*\*(.*?)\*\*", "g");
return String(text).replace(boldPattern, "<strong>$1</strong>");
}

function renderText(content = "") {
const lines = String(content).split("\n");
let html = "";
let index = 0;

while (index < lines.length) {
const line = lines[index].trim();

```
if (line === "") {
  index++;
  continue;
}

if (line.startsWith("* ") || line.startsWith("- ")) {
  html += "<ul>";

  while (
    index < lines.length &&
    (
      lines[index].trim().startsWith("* ") ||
      lines[index].trim().startsWith("- ")
    )
  ) {
    const item = lines[index].trim().substring(2);
    html += `<li>${formatBold(item)}</li>`;
    index++;
  }

  html += "</ul>";
  continue;
}

if (line.startsWith("|")) {
  const tableLines = [];

  while (
    index < lines.length &&
    lines[index].trim().startsWith("|")
  ) {
    tableLines.push(lines[index].trim());
    index++;
  }

  const rows = tableLines.map((row) => {
    return row
      .substring(1, row.length - 1)
      .split("|")
      .map((cell) => cell.trim());
  });

  const headers = rows[0] || [];
  const bodyRows = rows.slice(2);

  html += '<div class="table-wrapper">';
  html += '<table class="results-table">';
  html += "<thead><tr>";

  headers.forEach((header) => {
    html += `<th>${formatBold(header)}</th>`;
  });

  html += "</tr></thead>";
  html += "<tbody>";

  bodyRows.forEach((row) => {
    html += "<tr>";

    row.forEach((cell) => {
      html += `<td>${formatBold(cell)}</td>`;
    });

    html += "</tr>";
  });

  html += "</tbody></table></div>";
  continue;
}

html += `<p>${formatBold(line)}</p>`;
index++;
```

}

return html;
}

function createSection(title, content) {
if (!content) {
return "";
}

return `     <section class="detail">       <h3>${title}</h3>       <div class="detail-content">
        ${renderText(content)}       </div>     </section>
  `;
}

function createDemo(project) {
if (!project.demo || project.demo === "#") {
return "";
}

return `     <section class="detail">       <h3>Demo</h3>       <div class="detail-content">         <p>Explore the interactive ${project.title} demo.</p>         <a
          class="button"
          href="${project.demo}"
          target="_blank"
          rel="noopener noreferrer"         >
          Open Live Demo         </a>       </div>     </section>
  `;
}

function createActions(project) {
let actions = "";

if (project.github && project.github !== "#") {
const label =
project.id === "orbscope"
? "View Interactive Prototype"
: "View Full Code";

```
actions += `
  <a
    class="button"
    href="${project.github}"
    target="_blank"
    rel="noopener noreferrer"
  >
    ${label}
  </a>
`;
```

}

if (project.paper && project.paper !== "#") {
actions += `       <a
        class="ghost"
        href="${project.paper}"
        target="_blank"
        rel="noopener noreferrer"       >
        View Research Paper       </a>
    `;
}

if (project.drive && project.drive !== "#") {
actions += `       <a
        class="ghost"
        href="${project.drive}"
        target="_blank"
        rel="noopener noreferrer"       >
        View Project Files       </a>
    `;
}

return actions;
}

if (!projectContainer) {
console.error('Element with id="project" was not found.');
} else {
projectContainer.innerHTML = "<p>Loading project...</p>";

fetch("./projects.json")
.then((response) => {
if (!response.ok) {
throw new Error(
`projects.json could not be loaded: ${response.status}`
);
}

```
  return response.json();
})
.then((projects) => {
  if (!Array.isArray(projects) || projects.length === 0) {
    throw new Error("projects.json does not contain projects.");
  }

  const project =
    projects.find((item) => item.id === projectId) ||
    projects[0];

  document.title =
    `${project.title} | Jori Fahad Baaljahr`;

  const tags = Array.isArray(project.focus)
    ? project.focus
        .map((item) => `<span>${item}</span>`)
        .join("")
    : "";

  projectContainer.innerHTML = `
    <section class="projectHero">
      <p class="kicker">${project.year} · AI Project</p>
      <h1>${project.title}</h1>
      <h2>${project.subtitle}</h2>

      <div class="tags">
        ${tags}
      </div>
    </section>

    <div class="cover"></div>

    ${createSection("Short Description", project.short)}
    ${createSection("Problem", project.problem)}
    ${createSection("Solution", project.solution)}
    ${createSection("Models & Technologies", project.models)}
    ${createDemo(project)}
    ${createSection("Results", project.results)}

    <div class="actions">
      ${createActions(project)}
    </div>
  `;
})
.catch((error) => {
  console.error(error);

  projectContainer.innerHTML = `
    <section class="detail">
      <h3>Error</h3>
      <div class="detail-content">
        <p>${error.message}</p>
      </div>
    </section>
  `;
});
```

}
