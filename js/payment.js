const TRIP_KEY = "wayfarer_trip";
const GST_RATE = 0.05;
const COUPONS = { WAYFARER10: { rate: 0.1, label: "10% off" } };

const sampleTrip = {
  destination: "Jaipur",
  days: 5,
  travelers: 1,
  lines: [
    ["Accommodation", 22500],
    ["Food", 7500],
    ["Activities", 7500],
    ["Flights / transport", 25000]
  ],
  sample: true
};

function loadTrip() {
  try {
    const trip = JSON.parse(sessionStorage.getItem(TRIP_KEY));
    if (trip && Array.isArray(trip.lines) && trip.lines.length) return trip;
  } catch (err) {}
  return sampleTrip;
}

const trip = loadTrip();
const state = { method: "card", coupon: null };
const $ = id => document.getElementById(id);

function totals() {
  const subtotal = trip.lines.reduce((sum, [, amount]) => sum + amount, 0);
  const discount = state.coupon ? Math.round(subtotal * state.coupon.rate) : 0;
  const tax = Math.round((subtotal - discount) * GST_RATE);
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}

function renderSummary() {
  const t = totals();
  const people = `${trip.travelers} traveler${trip.travelers === 1 ? "" : "s"}`;
  const days = `${trip.days} day${trip.days === 1 ? "" : "s"}`;
  $("summary-trip").textContent = `${trip.destination} · ${days} · ${people}${trip.sample ? " (sample trip)" : ""}`;
  $("summary-lines").innerHTML = trip.lines.map(([label, amount]) =>
    `<li><span>${escapeHTML(label)}</span><span>${formatCurrency(amount)}</span></li>`
  ).join("");

  const rows = [`<li><span>Subtotal</span><span>${formatCurrency(t.subtotal)}</span></li>`];
  if (t.discount) rows.push(`<li class="discount"><span>Discount (${state.coupon.label})</span><span>−${formatCurrency(t.discount)}</span></li>`);
  rows.push(`<li><span>GST (5%)</span><span>${formatCurrency(t.tax)}</span></li>`);
  $("summary-totals").innerHTML = rows.join("");
  $("grand-total").textContent = formatCurrency(t.total);
  $("pay-btn").textContent = `Pay ${formatCurrency(t.total)}`;
}

$("coupon-form").addEventListener("submit", e => {
  e.preventDefault();
  const code = $("coupon-input").value.trim().toUpperCase();
  const msg = $("coupon-msg");
  if (!code) return;
  if (COUPONS[code]) {
    state.coupon = COUPONS[code];
    msg.textContent = `${code} applied — ${COUPONS[code].label}.`;
    msg.className = "coupon-msg ok";
  } else {
    state.coupon = null;
    msg.textContent = "That code isn't valid.";
    msg.className = "coupon-msg bad";
  }
  renderSummary();
});

const methodTabs = [...document.querySelectorAll("[data-method]")];

function selectMethod(method) {
  state.method = method;
  methodTabs.forEach((tab, i) => {
    const active = tab.dataset.method === method;
    tab.setAttribute("aria-selected", String(active));
    $(`panel-${tab.dataset.method}`).hidden = !active;
    if (active) $("method-thumb").style.transform = `translateX(${i * 100}%)`;
  });
  $("pay-alert").hidden = true;
}

methodTabs.forEach(tab => tab.addEventListener("click", () => selectMethod(tab.dataset.method)));

function cardBrand(digits) {
  if (/^4/.test(digits)) return "VISA";
  if (/^(5[1-5]|2(2[2-9]|[3-6]|7[01]|720))/.test(digits)) return "MASTERCARD";
  if (/^3[47]/.test(digits)) return "AMEX";
  if (/^(60|65|81|82|508)/.test(digits)) return "RUPAY";
  return "CARD";
}

function luhn(digits) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return digits.length > 0 && sum % 10 === 0;
}

function groupCard(digits) {
  if (/^3[47]/.test(digits)) return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(" ");
  return (digits.match(/.{1,4}/g) || []).join(" ");
}

const cardEls = {
  number: $("card-number"), name: $("card-name"), exp: $("card-exp"), cvv: $("card-cvv"),
  card: $("credit-card")
};

function maxDigits(digits) {
  return /^3[47]/.test(digits) ? 15 : 16;
}

cardEls.number.addEventListener("input", () => {
  let digits = cardEls.number.value.replace(/\D/g, "");
  digits = digits.slice(0, maxDigits(digits));
  cardEls.number.value = groupCard(digits);
  const shown = (digits + "••••••••••••••••").slice(0, maxDigits(digits));
  $("cc-number").textContent = groupCard(shown);
  $("cc-brand").textContent = cardBrand(digits);
});

cardEls.name.addEventListener("input", () => {
  $("cc-name").textContent = cardEls.name.value.trim().toUpperCase() || "YOUR NAME";
});

cardEls.exp.addEventListener("input", e => {
  let d = cardEls.exp.value.replace(/\D/g, "").slice(0, 4);
  if (d.length === 1 && Number(d) > 1) d = "0" + d;
  if (e.inputType !== "deleteContentBackward" && d.length >= 2) d = d.slice(0, 2) + "/" + d.slice(2);
  else if (d.length > 2) d = d.slice(0, 2) + "/" + d.slice(2);
  cardEls.exp.value = d;
  $("cc-exp").textContent = d || "MM/YY";
});

cardEls.cvv.addEventListener("input", () => {
  cardEls.cvv.value = cardEls.cvv.value.replace(/\D/g, "").slice(0, 4);
  $("cc-cvv").textContent = cardEls.cvv.value.replace(/./g, "•") || "•••";
});

cardEls.cvv.addEventListener("focus", () => cardEls.card.classList.add("flipped"));
cardEls.cvv.addEventListener("blur", () => cardEls.card.classList.remove("flipped"));

const rules = {
  "card-number": v => {
    const digits = v.replace(/\D/g, "");
    if (!digits) return "Enter your card number.";
    if (digits.length < maxDigits(digits) || !luhn(digits)) return "That card number doesn't look right.";
    return "";
  },
  "card-name": v => /^[A-Za-z][A-Za-z .'-]{1,}$/.test(v.trim()) ? "" : "Enter the name on your card.",
  "card-exp": v => {
    const m = /^(\d{2})\/(\d{2})$/.exec(v);
    if (!m) return "Use MM/YY.";
    const month = Number(m[1]);
    if (month < 1 || month > 12) return "Month must be 01–12.";
    const end = new Date(2000 + Number(m[2]), month, 1);
    return end <= new Date() ? "This card has expired." : "";
  },
  "card-cvv": v => {
    const need = /^3[47]/.test(cardEls.number.value.replace(/\D/g, "")) ? 4 : 3;
    return v.length === need ? "" : `Enter the ${need}-digit CVV.`;
  },
  "upi-id": v => /^[a-z0-9.\-_]{2,256}@[a-z]{2,64}$/i.test(v.trim()) ? "" : "Enter a valid UPI ID, like name@bank.",
  "bank": v => v ? "" : "Select your bank."
};

const fieldsByMethod = {
  card: ["card-number", "card-name", "card-exp", "card-cvv"],
  upi: ["upi-id"],
  netbanking: ["bank"]
};

function validate(id) {
  const el = $(id);
  const message = rules[id](el.value);
  $(`${id}-err`).textContent = message;
  el.classList.toggle("invalid", Boolean(message));
  el.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

Object.keys(rules).forEach(id => {
  const el = $(id);
  el.addEventListener("blur", () => { if (el.value) validate(id); });
  el.addEventListener("input", () => { if (el.classList.contains("invalid")) validate(id); });
  el.addEventListener("change", () => { if (el.tagName === "SELECT") validate(id); });
});

$("fill-demo").addEventListener("click", () => {
  const set = (el, value) => { el.value = value; el.dispatchEvent(new Event("input")); };
  const user = getSession();
  set(cardEls.number, "4111111111111111");
  set(cardEls.name, user ? user.name : "Test Traveler");
  const year = String((new Date().getFullYear() + 3) % 100).padStart(2, "0");
  set(cardEls.exp, `12${year}`);
  set(cardEls.cvv, "123");
  Object.keys(rules).filter(id => id.startsWith("card-")).forEach(validate);
});

$("agree").addEventListener("change", () => { $("agree-err").textContent = ""; });

function bookingId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "WYF-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function methodLabel() {
  if (state.method === "card") {
    const digits = cardEls.number.value.replace(/\D/g, "");
    return `${cardBrand(digits)} ending ${digits.slice(-4)}`;
  }
  if (state.method === "upi") return `UPI · ${$("upi-id").value.trim()}`;
  return `Net banking · ${$("bank").value}`;
}

function showSuccess(id, total, method) {
  const user = getSession();
  const days = `${trip.days} day${trip.days === 1 ? "" : "s"}`;
  $("pay-grid").hidden = true;
  $("success").hidden = false;
  $("success-sub").textContent = `Thanks${user ? ", " + user.name.split(" ")[0] : ""}! A confirmation has been saved to your account.`;
  $("receipt").innerHTML = [
    ["Booking ID", id],
    ["Trip", `${trip.destination} · ${days}`],
    ["Travelers", String(trip.travelers)],
    ["Paid with", method],
    ["Amount paid", formatCurrency(total)]
  ].map(([k, v]) => `<div><dt>${escapeHTML(k)}</dt><dd>${escapeHTML(v)}</dd></div>`).join("");
  window.scrollTo({ top: 0 });
  $("success").querySelector("h1").setAttribute("tabindex", "-1");
  $("success").querySelector("h1").focus({ preventScroll: true });
}

$("pay-form").addEventListener("submit", e => {
  e.preventDefault();
  const alertBox = $("pay-alert");
  alertBox.hidden = true;

  const fieldsOk = fieldsByMethod[state.method].map(validate).every(Boolean);
  const agreed = $("agree").checked;
  $("agree-err").textContent = agreed ? "" : "Please accept the terms to continue.";
  if (!fieldsOk || !agreed) {
    const firstBad = document.querySelector(".invalid") || $("agree");
    firstBad.focus();
    return;
  }

  const btn = $("pay-btn");
  btn.disabled = true;
  btn.classList.add("busy");
  btn.textContent = "Processing…";

  setTimeout(() => {
    const t = totals();
    const id = bookingId();
    const method = methodLabel();
    const user = getSession();
    const bookings = readStore(AUTH_KEYS.bookings, []);
    bookings.push({
      id, email: user ? user.email : "", date: new Date().toISOString(),
      destination: trip.destination, days: trip.days, travelers: trip.travelers,
      total: t.total, method
    });
    writeStore(AUTH_KEYS.bookings, bookings);
    try { sessionStorage.removeItem(TRIP_KEY); } catch (err) {}
    showSuccess(id, t.total, method);
  }, 1600);
});

if (requireLogin("payment.html")) {
  $("paying-as").textContent = `Paying as ${getSession().email}`;
  renderSummary();
}
