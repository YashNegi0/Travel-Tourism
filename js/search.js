let activeCategory = "All";

function renderDestinations(list) {
  const grid = document.getElementById("destination-grid");
  const count = document.getElementById("result-count");

  count.textContent = `${list.length} destination${list.length === 1 ? "" : "s"} found`;

  if (!list.length) {
    grid.innerHTML = `<p class="empty-state">No destinations match your search. Try another name or category.</p>`;
    return;
  }

  grid.innerHTML = list.map(d => `
    <article class="destination-card">
      <img src="${escapeHTML(d.img)}" alt="${escapeHTML(d.name)}, ${escapeHTML(d.country)}" loading="lazy">
      <div class="card-body">
        <p class="badge">${escapeHTML(d.category)}</p>
        <h3>${escapeHTML(d.name)}</h3>
        <p class="country">${escapeHTML(d.country)}</p>
        <p class="desc">${escapeHTML(d.desc)}</p>
        <button type="button" class="card-action" data-city="${escapeHTML(d.weatherCity || d.name)}">Check weather</button>
      </div>
    </article>
  `).join("");

  handleImageErrors(grid);
}

function applyFilters() {
  const q = document.getElementById("destination-search").value.trim().toLowerCase();
  const filtered = destinations.filter(d => {
    const matchesCategory = activeCategory === "All" || d.category === activeCategory;
    const matchesQuery = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
  renderDestinations(filtered);
}

function renderCategories() {
  const row = document.getElementById("category-row");
  row.innerHTML = categories.map(c =>
    `<button type="button" class="category-pill${c === activeCategory ? " active" : ""}" data-cat="${escapeHTML(c)}" aria-pressed="${c === activeCategory}">${escapeHTML(c)}</button>`
  ).join("");
}

document.getElementById("category-row").addEventListener("click", e => {
  const btn = e.target.closest(".category-pill");
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  renderCategories();
  applyFilters();
});

document.getElementById("destination-grid").addEventListener("click", e => {
  const btn = e.target.closest(".card-action");
  if (!btn) return;
  showWeatherFor(btn.dataset.city);
});

document.getElementById("hero-search-form").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
  applyFilters();
});

document.getElementById("destination-search").addEventListener("input", applyFilters);
