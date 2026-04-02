const state = {
  apiBaseUrl: "http://localhost:4000",
  lat: 11.7786,
  lng: 78.2097,
  nearbyType: "hotel",
  selectedSpot: null
};

const dom = {
  title: document.getElementById("guideTitle"),
  subtitle: document.getElementById("guideSubtitle"),
  userWelcome: document.getElementById("userWelcome"),
  currentLocationDisplay: document.getElementById("currentLocationDisplay"),
  apiBaseUrl: document.getElementById("apiBaseUrl"),
  radius: document.getElementById("radius"),
  refreshBtn: document.getElementById("refreshBtn"),
  changeLocationBtn: document.getElementById("changeLocationBtn"),
  statusText: document.getElementById("statusText"),
  locationText: document.getElementById("locationText"),
  siteCards: document.getElementById("siteCards"),
  recommendationList: document.getElementById("recommendationList"),
  nearbyList: document.getElementById("nearbyList"),
  chips: Array.from(document.querySelectorAll(".chip"))
};

function setStatus(message) {
  dom.statusText.textContent = message;
}

function getApiUrl(path) {
  const base = state.apiBaseUrl.replace(/\/$/, "");
  return `${base}${path}`;
}

function formatCrowd(occupancyRatio) {
  if (occupancyRatio >= 0.85) return "very_busy";
  if (occupancyRatio >= 0.6) return "busy";
  if (occupancyRatio >= 0.35) return "moderate";
  return "light";
}

function readSession() {
  const userRaw = sessionStorage.getItem("tourist_user");
  const spotRaw = sessionStorage.getItem("tourist_selected_spot");

  if (!userRaw) {
    window.location.href = "index.html";
    return false;
  }

  if (!spotRaw) {
    window.location.href = "location.html";
    return false;
  }

  const user = JSON.parse(userRaw);
  state.selectedSpot = JSON.parse(spotRaw);
  state.lat = state.selectedSpot.lat;
  state.lng = state.selectedSpot.lng;

  dom.userWelcome.textContent = `Tourist: ${user.name}`;
  dom.title.textContent = `${state.selectedSpot.name} Tour Guide`;
  dom.subtitle.textContent = `Live crowd, low-crowd recommendations, hotels, hospitals, and restaurants around ${state.selectedSpot.name}, Yercaud.`;
  dom.locationText.textContent = `Selected location: ${state.selectedSpot.name} (${state.lat}, ${state.lng})`;
  return true;
}

async function loadCurrentLocation() {
  if (!navigator.geolocation) {
    dom.currentLocationDisplay.textContent = "Current location: Geolocation not supported";
    return;
  }

  dom.currentLocationDisplay.textContent = "Current location: Detecting...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = Number(position.coords.latitude.toFixed(6));
      const lng = Number(position.coords.longitude.toFixed(6));

      try {
        const geo = await getJson(getApiUrl(`/api/geocode?lat=${lat}&lng=${lng}`));
        dom.currentLocationDisplay.textContent = `Current location: ${geo.formattedAddress}`;
      } catch (_error) {
        dom.currentLocationDisplay.textContent = `Current location: ${lat}, ${lng}`;
      }
    },
    () => {
      dom.currentLocationDisplay.textContent = "Current location: Permission denied";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function renderSites(sites) {
  dom.siteCards.innerHTML = "";
  if (!sites.length) {
    dom.siteCards.innerHTML = '<p class="meta">No sites found.</p>';
    return;
  }

  sites.forEach((site) => {
    const crowd = formatCrowd(site.occupancyRatio);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${site.name}</h3>
      <p class="meta">Count: ${site.currentCount} / ${site.capacity}</p>
      <p class="meta">Updated: ${new Date(site.updatedAt).toLocaleTimeString()}</p>
      <span class="tag ${crowd}">${crowd.replace("_", " ")}</span>
    `;
    dom.siteCards.appendChild(card);
  });
}

function renderRecommendations(items) {
  dom.recommendationList.innerHTML = "";

  if (!items.length) {
    dom.recommendationList.innerHTML = '<p class="meta">No recommendations found.</p>';
    return;
  }

  items.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "list-item";
    row.innerHTML = `
      <h3>#${index + 1} ${item.name}</h3>
      <p class="meta">Crowd: ${item.crowdLevel.replace("_", " ")} (${Math.round(item.occupancyRatio * 100)}%)</p>
      <p class="meta">Distance: ${item.distanceKm} km</p>
    `;
    dom.recommendationList.appendChild(row);
  });
}

function renderNearby(places) {
  dom.nearbyList.innerHTML = "";

  if (!places.length) {
    dom.nearbyList.innerHTML = '<p class="meta">No nearby places found in this radius.</p>';
    return;
  }

  places.forEach((place) => {
    const item = document.createElement("article");
    item.className = "list-item";
    item.innerHTML = `
      <h3>${place.name}</h3>
      <p class="meta">Category: ${place.category}</p>
      <p class="meta">Address: ${place.address || "Not available"}</p>
    `;
    dom.nearbyList.appendChild(item);
  });
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`API ${response.status}: ${details}`);
  }
  return response.json();
}

async function loadSites() {
  const data = await getJson(getApiUrl("/api/sites"));
  renderSites(data.sites || []);
}

async function loadRecommendations() {
  const query = `?lat=${state.lat}&lng=${state.lng}&limit=5`;
  const data = await getJson(getApiUrl(`/api/recommendations${query}`));
  renderRecommendations(data.recommendations || []);
}

async function loadNearby() {
  const radius = Number(dom.radius.value || 3500);
  const query = `?lat=${state.lat}&lng=${state.lng}&type=${state.nearbyType}&radius=${radius}&limit=10`;
  const data = await getJson(getApiUrl(`/api/nearby${query}`));
  renderNearby(data.places || []);
}

async function refreshAll() {
  try {
    setStatus("Loading Yercaud travel data...");
    await loadSites();
    await loadRecommendations();
    await loadNearby();
    setStatus("Guide updated successfully.");
  } catch (error) {
    setStatus(`Error: ${error.message}`);
  }
}

function bindEvents() {
  dom.apiBaseUrl.addEventListener("change", () => {
    state.apiBaseUrl = dom.apiBaseUrl.value.trim() || "http://localhost:4000";
  });

  dom.refreshBtn.addEventListener("click", refreshAll);

  dom.changeLocationBtn.addEventListener("click", () => {
    window.location.href = "location.html";
  });

  dom.chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      dom.chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.nearbyType = chip.dataset.type;
      loadNearby().catch((error) => setStatus(`Error: ${error.message}`));
    });
  });
}

if (readSession()) {
  bindEvents();
  loadCurrentLocation();
  refreshAll();
}
