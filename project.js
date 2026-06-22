const projectContainer = document.getElementById("project");
const projectId = new URLSearchParams(window.location.search).get("id");

function escapeHtml(value = "") {
return String(value)
.replaceAll("&", "&")
.replaceAll("<", "<")
.replaceAll(">", ">")
.replaceAll('"', """)
.replaceAll("'", "'");
}

function formatBold(value = "") {
const escaped = escapeHtml(value);
const boldPattern = new RegExp("\*\*(.*?)\*\*", "g");

return escaped.replace(
boldPattern,
"<strong>$1</strong>"
);
}

function renderContent(content = "") {
const lines = String(content).split("\n");

let html = "";
let index = 0;

while (index < lines.length) {
const line = lines[index].trim();

```
if (!line) {
  index += 1;
  continue;
}

/*
  Bullet points
*/
if (
  line.startsWith("* ") ||
  line.startsWith("- ")
) {
  html += "<ul>";

  while (
    index < lines.length &&
    (
      lines[index].trim().startsWith("* ") ||
      lines[index].trim().startsWith("- ")
    )
  ) {
    const item = lines[index]
      .trim()
      .slice(2);

    html += `<li>${formatBold(item)}</li>`;

    index += 1;
  }

  html += "</ul>";

  continue;
}

/*
  Markdown-style table
*/
if (line.startsWith("|")) {
  const tableLines = [];

  while (
    index < lines.length &&
    lines[index].trim().startsWith("|")
  ) {
    tableLines.push(
      lines[index].trim()
    );

    index += 1;
  }

  const rows = tableLines.map((row) =>
    row
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim())
  );

  const headers = rows[0] || [];

  /*
    Skip the Markdown separator row:
    |---|---|---|
  */
  const bodyRows = rows.slice(2);

  html += `
    <div class="table-wrapper">
      <table class="results-table">
        <thead>
          <tr>
            ${headers
              .map(
                (header) =>
                  `<th>${formatBold(header)}</th>`
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
                        `<td>${formatBold(cell)}</td>`
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

/*
  Normal paragraph
*/
html += `<p>${formatBold(line)}</p>`;

index += 1;
```

}

return html;
}

function createSection(title, content) {
if (!content) {
return "";
}

return ` <section class="detail"> <h3>${escapeHtml(title)}</h3>

```
  <div class="detail-content">
    ${renderContent(content)}
  </div>
</section>
```

`;
}

function createButton(url, label, className) {
if (!url || url === "#") {
return "";
}

return `     <a
      class="${className}"
      href="${escapeHtml(url)}"
      target="_blank"
      rel="noopener noreferrer"     >
      ${escapeHtml(label)}     </a>
  `;
}

function createProjectMedia(project) {
/*
Show the video inside the large cover box
when the project has a video property.
*/
if (
project.video &&
project.video !== "#"
) {
return ` <div class="cover video-cover"> <video
       controls
       playsinline
       preload="metadata"
     > <source
         src="${escapeHtml(project.video)}"
         type="video/mp4"
       >

```
      Your browser does not support video playback.
    </video>
  </div>
`;
```

}

/*
Keep the normal gradient cover
for projects without a video.
*/
return `<div class="cover"></div>`;
}

fetch("projects.json")
.then((response) => {
if (!response.ok) {
throw new Error(
`Could not load projects.json (${response.status})`
);
}

```
return response.json();
```

})
.then((projects) => {
if (
!Array.isArray(projects) ||
projects.length === 0
) {
throw new Error(
"No projects were found."
);
}

```
const project =
  projects.find(
    (item) => item.id === projectId
  ) || projects[0];

document.title =
  `${project.title} | Jori Fahad Baaljahr`;

const demoSection =
  project.demo &&
  project.demo !== "#"
    ? `
      <section class="detail">
        <h3>Demo</h3>

        <div class="detail-content">
          <p>
            Explore the interactive
            ${escapeHtml(project.title)}
            demo.
          </p>

          ${createButton(
            project.demo,
            "Open Live Demo",
            "button"
          )}
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
    <p class="kicker">
      ${escapeHtml(project.year)} · AI Project
    </p>

    <h1>${escapeHtml(project.title)}</h1>

    <h2>
      ${escapeHtml(project.subtitle)}
    </h2>

    <div class="tags">
      ${(project.focus || [])
        .map(
          (item) =>
            `<span>${escapeHtml(item)}</span>`
        )
        .join("")}
    </div>
  </section>

  ${createProjectMedia(project)}

  ${createSection(
    "Short Description",
    project.short
  )}

  ${createSection(
    "Problem",
    project.problem
  )}

  ${createSection(
    "Solution",
    project.solution
  )}

  ${createSection(
    "Models & Technologies",
    project.models
  )}

  ${demoSection}

  ${createSection(
    "Results",
    project.results
  )}

  <div class="actions">
    ${createButton(
      project.github,
      githubLabel,
      "button"
    )}

    ${createButton(
      project.paper,
      "View Research Paper",
      "ghost"
    )}

    ${createButton(
      project.drive,
      "View Project Files",
      "ghost"
    )}
  </div>
`;
```

})
.catch((error) => {
console.error(error);

```
projectContainer.innerHTML = `
  <section class="detail">
    <h3>Error</h3>

    <div class="detail-content">
      <p>
        ${escapeHtml(error.message)}
      </p>
    </div>
  </section>
`;
```

});
