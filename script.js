const grid = document.getElementById("projects-grid");
const count = document.getElementById("project-count");

fetch("projects.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Could not load projects.json");
    }
    return response.json();
  })
  .then((projects) => {
    count.textContent = projects.length;

    grid.innerHTML = projects
      .map(
        (project) => `
          <a class="card" href="project.html?id=${encodeURIComponent(project.id)}">
            <div class="visual"></div>
            <div class="pad">
              <p class="kicker">${project.year}</p>
              <h3>${project.title}</h3>
              <p>${project.subtitle}</p>
              <div class="tags">
                ${(project.focus || [])
                  .slice(0, 4)
                  .map((item) => `<span>${item}</span>`)
                  .join("")}
              </div>
            </div>
          </a>
        `
      )
      .join("");
  })
  .catch((error) => {
    console.error(error);
    grid.innerHTML = `<p class="error-message">${error.message}</p>`;
  });
