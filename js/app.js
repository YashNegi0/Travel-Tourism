function renderPlaces() {
  document.getElementById("places-list").innerHTML = places.map(p => `
    <article class="place-item">
      <h3>${escapeHTML(p.name)}</h3>
      <p class="location">${escapeHTML(p.location)}</p>
      <p>${escapeHTML(p.note)}</p>
    </article>
  `).join("");
}

function renderHotels() {
  document.getElementById("hotel-grid").innerHTML = hotels.map(h => `
    <article class="hotel-card">
      <p class="tier">${escapeHTML(h.tier)}</p>
      <h3>${escapeHTML(h.name)}</h3>
      <p>${escapeHTML(h.desc)}</p>
      <p class="price">${escapeHTML(h.price)}</p>
    </article>
  `).join("");
}

function renderTips() {
  document.getElementById("tips-list").innerHTML = tips.map(t => `
    <div class="tip-item">
      <span class="mark" aria-hidden="true">—</span>
      <p>${escapeHTML(t)}</p>
    </div>
  `).join("");
}

function renderStats() {
  const countries = new Set(destinations.map(d => d.country)).size;
  const stats = [
    [destinations.length, "destinations"],
    [countries, "countries"],
    [categories.length - 1, "travel moods"]
  ];
  document.getElementById("hero-stats").innerHTML = stats.map(([n, label]) =>
    `<li><strong>${n}</strong> ${label}</li>`
  ).join("");
}

function setupNavigation() {
  const nav = document.getElementById("main-nav");
  const toggle = document.getElementById("nav-toggle");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  const links = [...nav.querySelectorAll("a")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle("current", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  links.forEach(a => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) observer.observe(target);
  });
}

function setupBackToTop() {
  const btn = document.getElementById("to-top");
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

renderStats();
renderCategories();
applyFilters();
renderGallery();
renderPlaces();
renderHotels();
renderTips();
setupNavigation();
setupBackToTop();
document.getElementById("year").textContent = new Date().getFullYear();
