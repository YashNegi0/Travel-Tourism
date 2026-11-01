const AUTH_KEYS = { users: "wayfarer_users", session: "wayfarer_session", bookings: "wayfarer_bookings" };

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    return false;
  }
}

async function hashPassword(password, salt) {
  const bytes = new TextEncoder().encode(salt + password);
  if (window.crypto && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 5381;
  bytes.forEach(b => { h = ((h << 5) + h + b) >>> 0; });
  return "x" + h.toString(16);
}

async function registerUser({ name, email, password }) {
  const users = readStore(AUTH_KEYS.users, []);
  const key = email.trim().toLowerCase();
  if (users.some(u => u.email === key)) throw new Error("exists");
  const salt = Math.random().toString(36).slice(2);
  const user = { name: name.trim(), email: key, salt, hash: await hashPassword(password, salt) };
  users.push(user);
  if (!writeStore(AUTH_KEYS.users, users)) throw new Error("storage");
  setSession(user);
}

async function loginUser(email, password) {
  const users = readStore(AUTH_KEYS.users, []);
  const user = users.find(u => u.email === email.trim().toLowerCase());
  if (!user || user.hash !== await hashPassword(password, user.salt)) throw new Error("invalid");
  setSession(user);
}

function setSession(user) {
  writeStore(AUTH_KEYS.session, { name: user.name, email: user.email });
}

function getSession() {
  return readStore(AUTH_KEYS.session, null);
}

function logout() {
  try { localStorage.removeItem(AUTH_KEYS.session); } catch (err) {}
}

function safeNext(value) {
  return /^[a-z0-9_-]+\.html$/i.test(value || "") ? value : "index.html";
}

function requireLogin(page) {
  if (getSession()) return true;
  location.replace(`login.html?next=${encodeURIComponent(page)}`);
  return false;
}

function renderAuthSlot() {
  const slot = document.getElementById("auth-slot");
  if (!slot) return;
  const user = getSession();
  if (!user) {
    slot.innerHTML = `<a class="auth-link" href="login.html">Log in</a>`;
    return;
  }
  const first = escapeHTML(user.name.split(" ")[0]);
  slot.innerHTML = `<span class="auth-name">Hi, ${first}</span><button type="button" class="auth-link" id="logout-btn">Log out</button>`;
  document.getElementById("logout-btn").addEventListener("click", () => {
    logout();
    location.reload();
  });
}

renderAuthSlot();
