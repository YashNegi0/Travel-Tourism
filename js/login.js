const nextPage = safeNext(new URLSearchParams(location.search).get("next"));

const tabs = {
  signin: { tab: document.getElementById("tab-signin"), form: document.getElementById("form-signin"), title: "Welcome back", sub: "Sign in to plan, book and pay for your trip." },
  signup: { tab: document.getElementById("tab-signup"), form: document.getElementById("form-signup"), title: "Create your account", sub: "Join Wayfarer to save trips and pay securely." }
};

const alertBox = document.getElementById("form-alert");

function showAlert(message, kind = "error") {
  alertBox.textContent = message;
  alertBox.className = `form-alert ${kind}`;
  alertBox.hidden = false;
}

function clearAlert() {
  alertBox.hidden = true;
}

function selectTab(name) {
  Object.entries(tabs).forEach(([key, t]) => {
    const active = key === name;
    t.tab.setAttribute("aria-selected", String(active));
    t.form.hidden = !active;
  });
  document.getElementById("auth-title").textContent = tabs[name].title;
  document.getElementById("auth-sub").textContent = tabs[name].sub;
  document.getElementById("seg-thumb").style.transform = name === "signup" ? "translateX(100%)" : "translateX(0)";
  clearAlert();
  const first = tabs[name].form.querySelector("input");
  if (first) first.focus({ preventScroll: true });
}

tabs.signin.tab.addEventListener("click", () => selectTab("signin"));
tabs.signup.tab.addEventListener("click", () => selectTab("signup"));

document.querySelector(".segmented").addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { selectTab("signup"); tabs.signup.tab.focus(); }
  if (e.key === "ArrowLeft") { selectTab("signin"); tabs.signin.tab.focus(); }
});

document.querySelectorAll(".reveal").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.textContent = show ? "Hide" : "Show";
    btn.setAttribute("aria-pressed", String(show));
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validators = {
  "si-email": v => !v ? "Enter your email." : !EMAIL_RE.test(v) ? "Enter a valid email address." : "",
  "si-password": v => !v ? "Enter your password." : "",
  "su-name": v => v.trim().length < 2 ? "Enter your full name." : "",
  "su-email": v => !v ? "Enter your email." : !EMAIL_RE.test(v) ? "Enter a valid email address." : "",
  "su-password": v => v.length < 8 ? "Use at least 8 characters." : !/[A-Za-z]/.test(v) || !/\d/.test(v) ? "Include both letters and numbers." : "",
  "su-confirm": v => v !== document.getElementById("su-password").value ? "Passwords don't match." : ""
};

function validateField(id) {
  const input = document.getElementById(id);
  const message = validators[id](input.value);
  document.getElementById(`${id}-err`).textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

Object.keys(validators).forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener("blur", () => { if (input.value) validateField(id); });
  input.addEventListener("input", () => {
    if (input.classList.contains("invalid")) validateField(id);
    clearAlert();
  });
});

document.getElementById("su-password").addEventListener("input", e => {
  const v = e.target.value;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Za-z]/.test(v) && /\d/.test(v)) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) score++;
  if (!v) score = 0;
  const bar = document.getElementById("strength");
  bar.dataset.score = score;
  document.getElementById("strength-label").textContent =
    ["Use 8+ characters with letters and numbers.", "Weak", "Fair", "Good", "Strong"][score];
  if (document.getElementById("su-confirm").value) validateField("su-confirm");
});

function setBusy(button, busy, label) {
  button.disabled = busy;
  button.classList.toggle("busy", busy);
  button.textContent = busy ? "Please wait…" : label;
}

function finish() {
  showAlert("Success! Taking you back…", "success");
  setTimeout(() => location.replace(nextPage), 500);
}

tabs.signin.form.addEventListener("submit", async e => {
  e.preventDefault();
  const ok = ["si-email", "si-password"].map(validateField).every(Boolean);
  if (!ok) return;
  const btn = document.getElementById("si-submit");
  setBusy(btn, true, "Sign in");
  try {
    await loginUser(document.getElementById("si-email").value, document.getElementById("si-password").value);
    finish();
  } catch (err) {
    showAlert("Email or password is incorrect. If you're new here, create an account.");
    setBusy(btn, false, "Sign in");
  }
});

tabs.signup.form.addEventListener("submit", async e => {
  e.preventDefault();
  const ok = ["su-name", "su-email", "su-password", "su-confirm"].map(validateField).every(Boolean);
  if (!ok) return;
  const btn = document.getElementById("su-submit");
  setBusy(btn, true, "Create account");
  try {
    await registerUser({
      name: document.getElementById("su-name").value,
      email: document.getElementById("su-email").value,
      password: document.getElementById("su-password").value
    });
    finish();
  } catch (err) {
    showAlert(err.message === "exists"
      ? "An account with this email already exists. Try signing in."
      : "Couldn't save your account. Check that your browser allows local storage.");
    setBusy(btn, false, "Create account");
  }
});

if (getSession()) {
  showAlert(`You're signed in as ${getSession().email}.`, "success");
}

if (new URLSearchParams(location.search).get("tab") === "signup") selectTab("signup");
