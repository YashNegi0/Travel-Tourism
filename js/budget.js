const budgetFields = {
  days: "b-days",
  hotel: "b-hotel",
  food: "b-food",
  activities: "b-activities",
  transport: "b-transport",
  travelers: "b-travelers"
};

const budgetDefaults = { days: 5, hotel: 4500, food: 1500, activities: 1500, transport: 25000, travelers: 1 };

function readValue(key) {
  const value = Number(document.getElementById(budgetFields[key]).value);
  const min = key === "days" || key === "travelers" ? 1 : 0;
  return Number.isFinite(value) ? Math.max(min, value) : min;
}

function calculateBudget() {
  const days = readValue("days");
  const travelers = readValue("travelers");
  const rooms = Math.ceil(travelers / 2);

  const lines = [
    ["Accommodation", readValue("hotel") * days * rooms],
    ["Food", readValue("food") * days * travelers],
    ["Activities", readValue("activities") * days * travelers],
    ["Flights / transport", readValue("transport") * travelers]
  ];
  const total = lines.reduce((sum, [, amount]) => sum + amount, 0);

  document.getElementById("budget-total").textContent = formatCurrency(total);
  document.getElementById("budget-perday").textContent =
    `${formatCurrency(total / days)} per day · ${formatCurrency(total / travelers)} per person`;
  document.getElementById("budget-breakdown").innerHTML = lines.map(([label, amount]) =>
    `<li><span>${label}</span><span>${formatCurrency(amount)}</span></li>`
  ).join("");
}

function resetBudget() {
  Object.keys(budgetFields).forEach(key => {
    document.getElementById(budgetFields[key]).value = budgetDefaults[key];
  });
  calculateBudget();
}

Object.values(budgetFields).forEach(id => {
  document.getElementById(id).addEventListener("input", calculateBudget);
});

document.getElementById("budget-form").addEventListener("submit", e => e.preventDefault());
document.getElementById("budget-reset").addEventListener("click", resetBudget);

calculateBudget();
