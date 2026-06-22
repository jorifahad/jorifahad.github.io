const id = new URLSearchParams(window.location.search).get("id");

function inlineMarkdown(text = "") {
return String(text).replace(
/**(.*?)**/g,
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

// Bullet list
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

    html += `
      <li>
        ${inlineMarkdown(item)}
      </li>
    `;

    i++;
  }

  html += "</ul>";
  continue;
}

// Markdown table
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
              .map(
                (header) =>
                  `<th>${inlineMarkdown(header)}</th>`
              )
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
                        `<td>${inlineMarkdown(cell)}</td>`
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

// Normal paragraph
html += `
  <p>
    ${inlineMarkdown(line)}
  </p>
`;

i++;
```

}

return html;
}

function createProjectSection(title, content) {
if (!content) {
return "";
}

return ` <section class="detail"> <h3>${title}</h3>

```
  <div class="detail-content">
    ${renderContent(content)}
  </div>
</section>
```

`;
}

function createDemoSection(project) {
if (!project.demo || project.demo === "#") {
return "";
}

return ` <section class="detail"> <h3>Demo</h3>

```
  <div class="detail-content">
    <p>
      Explore the interactive ${project.title} demo.
    </p>

    <a
      class="button"
      href="${project.demo}"
      target="_blank"
      rel="noopener noreferrer"
    >
      Open Live Demo
    </a>
  </div>
</section>
```

`;
}

function createGitHubButton(project) {
if (!project.github || project.github === "#") {
return "";
}

const buttonText =
project.id === "orbscope"
? "View Interactive Prototype"
: "View Full Code";

return `     <a
      class="button"
      href="${project.github}"
      target="_blank"
      rel="noopener noreferrer"     >
      ${buttonText}     </a>
  `;
}

function createDriveButton(project) {
if (!project.drive || project.drive === "#") {
return "";
}

return `     <a
      class="ghost"
      href="${project.drive}"
      target="_blank"
      rel="noopener noreferrer"     >
      View Project Files     </a>
  `;
}

function createPaperButton(project) {
if (!project.paper || project.paper === "#") {
return "";
}

return `     <a
      class="ghost"
      href="${project.paper}"
      target="_blank"
      rel="noopener noreferrer"     >
      View Research Paper     </a>
  `;
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
if (!Array.isArray(items) || items.length === 0) {
throw new Error("No projects were found");
}

```
const project =
  items.find((item) => item.id === id) || items[0];

document.title =
  `${project.title} | Jori Fahad Baaljahr`;

const shortSection = createProjectSection(
  "Short Description",
  project.short
);

const problemSection = createProjectSection(
  "Problem",
  project.problem
);

const solutionSection = createProjectSection(
  "Solution",
  project.solution
);

const modelsSection = createProjectSection(
  "Models & Technologies",
  project.models
);

const resultsSection = createProjectSection(
  "Results",
  project.results
);

const demoSection = createDemoSection(project);
const githubButton = createGitHubButton(project);
const driveButton = createDriveButton(project);
const paperButton = createPaperButton(project);

const projectContainer =
  document.getElementById("project");

if (!projectContainer) {
  throw new Error(
    'Element with id="project" was not found'
  );
}

projectContainer.innerHTML = `
  <section class="projectHero">
    <p class="kicker">
      ${project.year} · AI Project
    </p>

    <h1>${project.title}</h1>

    <h2>${project.subtitle}</h2>

    <div class="tags">
      ${(project.focus || [])
        .map((item) => `<span>${item}</span>`)
        .join("")}
    </div>
  </section>

  <div class="cover"></div>

  ${shortSection}
  ${problemSection}
  ${solutionSection}
  ${modelsSection}
  ${demoSection}
  ${resultsSection}

  <div class="actions">
    ${githubButton}
    ${paperButton}
    ${driveButton}
  </div>
`;
```

})
.catch((error) => {
console.error(error);

```
const projectContainer =
  document.getElementById("project");

if (projectContainer) {
  projectContainer.innerHTML = `
    <section class="detail">
      <h3>Error</h3>

      <div class="detail-content">
        <p>
          Unable to load the project information.
        </p>
      </div>
    </section>
  `;
}
```

});
