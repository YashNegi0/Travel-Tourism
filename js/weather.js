const weatherCodes = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  56: "Freezing drizzle", 57: "Heavy freezing drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  66: "Freezing rain", 67: "Heavy freezing rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Light rain showers", 81: "Rain showers", 82: "Violent rain showers",
  85: "Snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Severe thunderstorm with hail"
};

async function requestJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Service unavailable");
  return res.json();
}

async function fetchWeather(city) {
  const geo = await requestJSON(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
  if (!geo.results || !geo.results.length) throw new Error("City not found");

  const { latitude, longitude, name, country } = geo.results[0];
  const data = await requestJSON(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`
  );
  const c = data.current;

  return {
    city: name,
    country,
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    wind: Math.round(c.wind_speed_10m),
    condition: weatherCodes[c.weather_code] || "Unknown"
  };
}

async function showWeatherFor(city) {
  const result = document.getElementById("weather-result");
  const input = document.getElementById("weather-city");
  const name = city.trim();
  if (!name) {
    result.innerHTML = `<p class="notice">Please enter a city name.</p>`;
    return;
  }

  input.value = name;
  result.innerHTML = `<p class="notice">Loading weather…</p>`;

  try {
    const w = await fetchWeather(name);
    result.innerHTML = `
      <span class="temp">${w.temp}°C</span>
      <div class="details">
        <p class="place">${escapeHTML(w.city)}, ${escapeHTML(w.country)}</p>
        <p>${escapeHTML(w.condition)} · feels like ${w.feelsLike}°C</p>
        <p>${w.humidity}% humidity · ${w.wind} km/h wind</p>
      </div>
    `;
  } catch (err) {
    const message = err.message === "City not found"
      ? "Couldn't find that city. Try another spelling."
      : "Weather service is unavailable right now. Check your connection and try again.";
    result.innerHTML = `<p class="notice error">${message}</p>`;
  }

  document.getElementById("weather").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("weather-form").addEventListener("submit", e => {
  e.preventDefault();
  showWeatherFor(document.getElementById("weather-city").value);
});
