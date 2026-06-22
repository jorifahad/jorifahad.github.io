const id = new URLSearchParams(location.search).get("id");

function formatBold(text = "") {
return String(text).replace(
new RegExp("\*\*(.*?)\*\*", "g"),
"<strong>$1</strong>"
);
}

function renderContent(text = "") {
const lines = String(text).split("\n");
let html = "";
let i = 0;

while (i < lines.length) {
const line = lines[i].trim();

```
if (!line) {
  i++;
  continue;
}

if (line.startsWith("* ") || line.startsWith("- ")) {
  html += "<ul>";

  while (
    i < lines.length &&
    (
      lines[i].trim().startsWith("* ") ||
      lines[i].trim().startsWith("- ")
    )
  ) {
    const item = lines[i].trim().slice(2);

    html += `<li>${formatBold(item)}</li>`;
    i++;
  }

  html += "</ul>";
  continue;
}

if (line.startsWith("|")) {
  const tableLines = [];

  while (
    i < lines.length &&
    lines[i].trim().startsWith("|")
  ) {
    tableLines.push(lines[i].trim());
    i++;
  }

  const rows = tableLines.map((row) =>
    row
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim())
  );

  const headers = rows[0] || [];
  const bodyRows = rows.slice(2);

  html += `
    <div class="table-wrapper">
      <table class="results-table">
        <thead>
          <tr>
            ${headers
              .map((header) => `<th>${formatBold(header)}</th>`)
              .join("")}
          </tr>
        </thead>

        <tbody>
          ${bodyRows
            .map(
              (row) => `
                <tr>
                  ${row
                    .map((cell) => `<td>${formatBold(cell)}</td>`)
                    .join("")}
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  continue;
}

html += `<p>${formatBold(line)}</p>`;
i++;
```

}

return html;
}

fetch("projects.json")
.then((response) => {
if (!response.ok) {
throw new Error("Could not load projects.json");
}

```
return response.json();
```

})
.then((items) => {
const p = items.find((item) => item.id === id) || items[0];

```
document.title = p.title + " | Jori Fahad Baaljahr";

const sections = [
  ["Short Description", p.short],
  ["Problem", p.problem],
  ["Solution", p.solution],
  ["Models & Technologies", p.models],
  ["Results", p.results]
];

const demoSection =
  p.demo && p.demo !== "#"
    ? `
      <section class="detail">
        <h3>Demo</h3>

        <div class="detail-content">
          <p>Explore the interactive ${p.title} demo.</p>

          <a
            class="button"
            href="${p.demo}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Live Demo
          </a>
        </div>
      </section>
    `
    : "";

const githubButton =
  p.github && p.github !== "#"
    ? `
      <a
        class="button"
        href="${p.github}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${
          p.id === "orbscope"
            ? "View Interactive Prototype"
            : "View Full Code"
        }
      </a>
    `
    : "";

const driveButton =
  p.drive && p.drive !== "#"
    ? `
      <a
        class="ghost"
        href="${p.drive}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Project Files
      </a>
    `
    : "";

document.getElementById("project").innerHTML = `
  <section class="projectHero">
    <p class="kicker">${p.year} · AI Project</p>

    <h1>${p.title}</h1>
    <h2>${p.subtitle}</h2>

    <div class="tags">
      ${(p.focus || [])
        .map((item) => `<span>${item}</span>`)
        .join("")}
    </div>
  </section>

  <div class="cover"></div>

  ${sections
    .map(
      ([title, content]) => `
        <section class="detail">
          <h3>${title}</h3>

          <div class="detail-content">
            ${renderContent(content)}
          </div>
        </section>
      `
    )
    .join("")}

  ${demoSection}

  <div class="actions">
    ${githubButton}
    ${driveButton}
  </div>
`;
```

})
.catch((error) => {
console.error(error);

```
document.getElementById("project").innerHTML = `
  <section class="detail">
    <h3>Error</h3>

    <div class="detail-content">
      <p>Unable to load the project information.</p>
    </div>
  </section>
`;
```

});
