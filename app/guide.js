const state = {
  apiBaseUrl: "http://localhost:4000",
  nearbyType: "hotel",
  selectedSpot: null,
  selectedDistrict: null
};

const dom = {
  title: document.getElementById("guideTitle"),
  subtitle: document.getElementById("guideSubtitle"),
  userWelcome: document.getElementById("userWelcome"),
  currentLocationDisplay: document.getElementById("currentLocationDisplay"),
  locationDetailsContainer: document.getElementById("locationDetailsContainer"),
  siteCards: document.getElementById("siteCards"),
  recommendationList: document.getElementById("recommendationList"),
  nearbyList: document.getElementById("nearbyList"),
  chips: Array.from(document.querySelectorAll(".chip"))
};

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

function renderLocationDetails() {
  if (!state.selectedSpot) return;

  const spot = state.selectedSpot;
  const html = `
    <article class="location-detail-card">
      <h3>${spot.name}</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">District:</span>
          <span class="detail-value">${state.selectedDistrict}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Description:</span>
          <span class="detail-value">${spot.note}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Latitude:</span>
          <span class="detail-value">${spot.lat.toFixed(4)}°</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Longitude:</span>
          <span class="detail-value">${spot.lng.toFixed(4)}°</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Category:</span>
          <span class="detail-value">Tourist Attraction</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <span class="detail-value" style="color: #4CAF50; font-weight: bold;">Active & Open</span>
        </div>
      </div>
    </article>
  `;
  
  dom.locationDetailsContainer.innerHTML = html;
}

function renderCrowdCard(site) {
  const crowd = formatCrowd(site.occupancyRatio);
  dom.siteCards.innerHTML = `
    <article class="card crowd-highlight-card">
      <h3>${site.name}</h3>
      <p class="meta">District: ${site.district || state.selectedDistrict}</p>
      <p class="meta">Count: ${site.currentCount} / ${site.capacity}</p>
      <p class="meta">Updated: ${new Date(site.updatedAt).toLocaleTimeString()}</p>
      <span class="tag ${crowd}">${crowd.replace("_", " ")}</span>
    </article>
  `;
}

function readSession() {
  const userRaw = sessionStorage.getItem("tourist_user");
  const spotRaw = sessionStorage.getItem("tourist_selected_spot");
  const districtRaw = sessionStorage.getItem("tourist_selected_district");

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
  state.selectedDistrict = districtRaw || "Tamil Nadu";

  dom.userWelcome.textContent = `Tourist: ${user.name}`;
  dom.title.textContent = `${state.selectedSpot.name} Tour Guide`;
  dom.subtitle.textContent = `Live crowd, low-crowd recommendations, hotels, hospitals, and restaurants around ${state.selectedSpot.name}, ${state.selectedDistrict}.`;
  
  // Render location details
  renderLocationDetails();
  
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
  const siteId = state.selectedSpot?.id || "";
  const query = siteId ? `?siteId=${encodeURIComponent(siteId)}` : "";
  const data = await getJson(getApiUrl(`/api/sites${query}`));
  const sites = data.sites || [];

  if (sites.length) {
    renderCrowdCard(sites[0]);
  } else {
    dom.siteCards.innerHTML = '<p class="meta">No crowd data available for this location.</p>';
  }
}

async function loadRecommendations() {
  const query = `?lat=${state.selectedSpot.lat}&lng=${state.selectedSpot.lng}&limit=5`;
  const data = await getJson(getApiUrl(`/api/recommendations${query}`));
  renderRecommendations(data.recommendations || []);
}

async function loadNearby() {
  const radius = 3500;
  const query = `?lat=${state.selectedSpot.lat}&lng=${state.selectedSpot.lng}&type=${state.nearbyType}&radius=${radius}&limit=10`;
  const data = await getJson(getApiUrl(`/api/nearby${query}`));
  renderNearby(data.places || []);
}

async function refreshAll() {
  try {
    await loadSites();
    await loadRecommendations();
    await loadNearby();
  } catch (error) {
    console.error("Error loading guide data:", error.message);
  }
}

function bindEvents() {
  dom.chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      dom.chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.nearbyType = chip.dataset.type;
      loadNearby().catch((error) => console.error("Error loading nearby:", error.message));
    });
  });
}

if (readSession()) {
  bindEvents();
  loadCurrentLocation();
  refreshAll();
}
