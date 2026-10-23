const PLACEHOLDER_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#EEE4D2"/><text x="50%" y="50%" fill="#A8702F" font-family="sans-serif" font-size="22" text-anchor="middle">Image unavailable</text></svg>'
);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

function formatCurrency(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function handleImageErrors(root) {
  root.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      if (img.src !== PLACEHOLDER_IMG) img.src = PLACEHOLDER_IMG;
    }, { once: true });
  });
}
