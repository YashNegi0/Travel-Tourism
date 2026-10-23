let currentPhoto = 0;
let lastFocused = null;

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = galleryImages.map((img, i) => `
    <button type="button" class="gallery-item" data-index="${i}" aria-label="Open photo: ${escapeHTML(img.caption)}">
      <img src="${escapeHTML(img.src)}" alt="${escapeHTML(img.caption)}" loading="lazy">
    </button>
  `).join("");

  handleImageErrors(grid);

  grid.addEventListener("click", e => {
    const item = e.target.closest(".gallery-item");
    if (item) openLightbox(Number(item.dataset.index));
  });
}

function showPhoto(index) {
  const total = galleryImages.length;
  currentPhoto = (index + total) % total;
  const item = galleryImages[currentPhoto];
  const img = document.getElementById("lightbox-img");
  img.src = item.src.replace("w=500", "w=1200");
  img.alt = item.caption;
  document.getElementById("lightbox-caption").textContent = `${item.caption} (${currentPhoto + 1} / ${total})`;
}

function openLightbox(index) {
  lastFocused = document.activeElement;
  showPhoto(index);
  document.getElementById("lightbox").classList.add("active");
  document.getElementById("lightbox-close").focus();
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.classList.remove("no-scroll");
  if (lastFocused) lastFocused.focus();
}

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-prev").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.getElementById("lightbox-next").addEventListener("click", () => showPhoto(currentPhoto + 1));

document.getElementById("lightbox").addEventListener("click", e => {
  if (e.target.id === "lightbox") closeLightbox();
});

document.addEventListener("keydown", e => {
  if (!document.getElementById("lightbox").classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  if (e.key === "ArrowRight") showPhoto(currentPhoto + 1);
});
