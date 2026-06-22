const id = new URLSearchParams(location.search).get("id");

function formatInline(text = "") {
return text.replace(/**(.*?)**/g, "<strong>$1</strong>");
}

function renderContent(text = "") {
const lines = text.split("\n");
let html = "";
let listItems = [];

function closeList() {
if (listItems.length > 0) {
html += `        <ul>
          ${listItems
            .map((item) =>`<li>${formatInline(item)}</li>`)
            .join("")}         </ul>
      `;

```
  listItems = [];
}
```

}

for (let i = 0; i < lines.length; i++) {
const line = lines[i].trim();

```
if (!line) {
  closeList();
  continue;
}

if (line.startsWith("* ")) {
  listItems.push(line.slice(2));
  continue;
}

if (line.startsWith("|")) {
  closeList();

  const tableLines = [];

  while (i < lines.length && lines[i].trim().startsWith("|")) {
    tableLines.push(lines[i].trim());
    i++;
  }

  i--;

  const rows = tableLines.map((row) =>
    row
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim())
  );

  const headers = rows[0];
  const bodyRows = rows.slice(2);

  html += `
    <div class="table-wrapper">
      <table class="results-table">
        <thead>
          <tr>
            ${headers
              .map((header) => `<th>${formatInline(header)}</th>`)
              .join("")}
          </tr>
        </thead>

        <tbody>
          ${bodyRows
            .map(
              (row) => `
                <tr>
                  ${row
                    .map(
                      (cell) =>
                        `<td>${formatInline(cell)}</td>`
                    )
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

closeList();
html += `<p>${formatInline(line)}</p>`;
```

}

closeList();

return html;
}

fetch("projects.json")
.then((response) => {
if (!response.ok) {
throw new Error("Unable to load projects.json");
}

```
return response.json();
```

})
.then((items) => {
const p = items.find((project) => project.id === id) || items[0];

```
document.title = `${p.title} | Jori Fahad Baaljahr`;

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

        <p>
          Explore the interactive ${p.title} project demo.
        </p>

        <a
          class="button"
          href="${p.demo}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Live Demo
        </a>
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
      ${p.focus
        .map((focusItem) => `<span>${focusItem}</span>`)
        .join("")}
    </div>
  </section>

  <div class="cover"></div>

  ${sections
    .map(
      ([title, content]) => `
        <section class="detail">
          <h3>${title}</h3>
          ${renderContent(content)}
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
    <h3>Unable to load project</h3>
    <p>
      Check that projects.json is valid and located in the correct folder.
    </p>
  </section>
`;
```

});
