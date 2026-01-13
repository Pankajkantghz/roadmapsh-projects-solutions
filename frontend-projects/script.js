const API_KEY = "f058f7b1038afc5bc6c03782472746ca";

/******** DOM ********/
const locationInput = document.querySelector(".location-input");
const searchButton = document.querySelector(".search-button");
const refreshButton = document.querySelector(".refresh-button");

const suggestionsEl = document.querySelector("#suggestions");
const weatherSection = document.querySelector(".current-weather");
const loadingText = document.querySelector(".loading-text");

const locationEl = document.querySelector(".weather-location");
const tempEl = document.querySelector(".weather-temperature");
const conditionEl = document.querySelector(".weather-condition");
const windEl = document.querySelector(".wind-speed");
const rainEl = document.querySelector(".rain-chance");
const airEl = document.querySelector(".air-quality");

const hourlyListEl = document.querySelector(".hourly-list");

/******** STATE ********/
let currentCity = null;
let lastCoords = null;

/******** HELPERS ********/
const showLoading = () => {
  weatherSection.classList.remove("hidden");
  loadingText.style.display = "block";
};

const showWeather = () => {
  loadingText.style.display = "none";
  weatherSection.classList.remove("hidden");
};

const fetchJSON = async url => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

const formatHour = dt => dt.split(" ")[1].slice(0, 5);

/******** API ********/
const fetchWeatherByCity = city =>
  fetchJSON(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
  );

const fetchWeatherByCoords = (lat, lon) =>
  fetchJSON(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

const fetchForecast = (lat, lon) =>
  fetchJSON(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

const fetchAQI = (lat, lon) =>
  fetchJSON(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );

const fetchCities = q =>
  fetchJSON(
    `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${API_KEY}`
  );

/******** UI UPDATE ********/
const updateWeather = data => {
  locationEl.textContent = data.name;
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  conditionEl.textContent = data.weather[0].description;
  windEl.textContent = `Wind: ${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  rainEl.textContent = `Rain: ${data.rain?.["1h"] ?? 0} mm`;
};

const updateHourly = data => {
  hourlyListEl.innerHTML = "";
  data.list.slice(0, 8).forEach(h => {
    hourlyListEl.innerHTML += `
      <div class="hour-card">
        <div>${formatHour(h.dt_txt)}</div>
        <strong>${Math.round(h.main.temp)}°</strong>
      </div>`;
  });
};

const updateAQI = pm25 => {
  airEl.textContent = `AQI (PM2.5): ${pm25}`;
};

/******** LOADERS ********/
async function loadByCity(city) {
  try {
    showLoading();
    const weather = await fetchWeatherByCity(city);
    const { lat, lon } = weather.coord;

    currentCity = city;
    lastCoords = { lat, lon };

    updateWeather(weather);

    const [forecast, pollution] = await Promise.all([
      fetchForecast(lat, lon),
      fetchAQI(lat, lon)
    ]);

    updateHourly(forecast);
    updateAQI(pollution.list[0].components.pm2_5);
    showWeather();
  } catch (e) {
    alert(e.message);
  }
}

async function loadByCoords(lat, lon) {
  try {
    showLoading();
    const weather = await fetchWeatherByCoords(lat, lon);
    currentCity = weather.name;
    lastCoords = { lat, lon };

    updateWeather(weather);

    const [forecast, pollution] = await Promise.all([
      fetchForecast(lat, lon),
      fetchAQI(lat, lon)
    ]);

    updateHourly(forecast);
    updateAQI(pollution.list[0].components.pm2_5);
    showWeather();
  } catch (e) {
    alert(e.message);
  }
}

/******** EVENTS ********/
searchButton.onclick = () => {
  const city = locationInput.value.trim();
  if (city) loadByCity(city);
};

locationInput.oninput = async () => {
  const q = locationInput.value.trim();
  if (q.length < 2) return (suggestionsEl.innerHTML = "");
  const cities = await fetchCities(q);
  suggestionsEl.innerHTML = cities
    .map(c => `<div class="suggestion-item">${c.name}, ${c.country}</div>`)
    .join("");
};

suggestionsEl.onclick = e => {
  if (e.target.classList.contains("suggestion-item")) {
    const city = e.target.textContent.split(",")[0];
    locationInput.value = city;
    suggestionsEl.innerHTML = "";
    loadByCity(city);
  }
};

refreshButton.onclick = () => {
  if (currentCity) loadByCity(currentCity);
  else if (lastCoords) loadByCoords(lastCoords.lat, lastCoords.lon);
};

/******** INIT ********/
showLoading();

navigator.geolocation.getCurrentPosition(
  pos => loadByCoords(pos.coords.latitude, pos.coords.longitude),
  () => loadByCity("Delhi")
);