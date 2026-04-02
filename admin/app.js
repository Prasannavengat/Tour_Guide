const state = {
  apiBaseUrl: "http://localhost:4000",
  token: "",
  sites: [],
  trends: []
};

const dom = {
  loginCard: document.getElementById("loginCard"),
  dashboard: document.getElementById("dashboard"),
  apiBaseUrl: document.getElementById("apiBaseUrl"),
  username: document.getElementById("username"),
  password: document.getElementById("password"),
  loginBtn: document.getElementById("loginBtn"),
  loginStatus: document.getElementById("loginStatus"),
  logoutBtn: document.getElementById("logoutBtn"),
  siteSelect: document.getElementById("siteSelect"),
  hoursInput: document.getElementById("hoursInput"),
  refreshBtn: document.getElementById("refreshBtn"),
  statsCards: document.getElementById("statsCards"),
  trendChart: document.getElementById("trendChart")
};

function setStatus(message) {
  dom.loginStatus.textContent = message;
}

function api(path) {
  return `${state.apiBaseUrl.replace(/\/$/, "")}${path}`;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Request failed: ${response.status}`);
  }

  return response.json();
}

async function getAdminJson(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${state.token}`
    }
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Request failed: ${response.status}`);
  }

  return response.json();
}

function renderStats(selectedSite) {
  const entries = state.trends.reduce((sum, t) => sum + t.entries, 0);
  const exits = state.trends.reduce((sum, t) => sum + t.exits, 0);
  const net = entries - exits;

  dom.statsCards.innerHTML = `
    <article class="stat"><h4>Current Occupancy</h4><p>${selectedSite.currentCount}</p></article>
    <article class="stat"><h4>Capacity</h4><p>${selectedSite.capacity}</p></article>
    <article class="stat"><h4>Total Entries</h4><p>${entries}</p></article>
    <article class="stat"><h4>Total Exits</h4><p>${exits}</p></article>
    <article class="stat"><h4>Net Flow</h4><p>${net}</p></article>
  `;
}

function drawTrendChart() {
  const canvas = dom.trendChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (!state.trends.length) {
    ctx.fillStyle = "#4a5470";
    ctx.font = "16px Manrope";
    ctx.fillText("No trend data available yet.", 24, 42);
    return;
  }

  const values = state.trends.map((t) => t.netFlow);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, -1);
  const padding = 36;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const scaleY = (v) => {
    const normalized = (v - min) / (max - min || 1);
    return height - padding - normalized * chartH;
  };

  ctx.strokeStyle = "#ccd5e6";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, scaleY(0));
  ctx.lineTo(width - padding, scaleY(0));
  ctx.stroke();

  ctx.strokeStyle = "#1f5ccc";
  ctx.lineWidth = 2;
  ctx.beginPath();

  state.trends.forEach((point, index) => {
    const x = padding + (index / Math.max(state.trends.length - 1, 1)) * chartW;
    const y = scaleY(point.netFlow);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  ctx.fillStyle = "#137a6e";
  state.trends.forEach((point, index) => {
    const x = padding + (index / Math.max(state.trends.length - 1, 1)) * chartW;
    const y = scaleY(point.netFlow);
    ctx.beginPath();
    ctx.arc(x, y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

async function loadSites() {
  const data = await getAdminJson(api("/api/admin/sites"));
  state.sites = data.sites || [];
  dom.siteSelect.innerHTML = "";

  state.sites.forEach((site) => {
    const option = document.createElement("option");
    option.value = site.id;
    option.textContent = site.name;
    dom.siteSelect.appendChild(option);
  });
}

async function loadTrends() {
  const siteId = dom.siteSelect.value;
  const hours = Number(dom.hoursInput.value || 24);

  const trendData = await getAdminJson(api(`/api/admin/trends/${siteId}?hours=${hours}`));
  state.trends = trendData.trends || [];

  const selectedSite = state.sites.find((s) => s.id === siteId);
  if (selectedSite) renderStats(selectedSite);
  drawTrendChart();
}

async function login() {
  try {
    state.apiBaseUrl = dom.apiBaseUrl.value.trim() || "http://localhost:4000";
    setStatus("Authenticating...");

    const data = await postJson(api("/api/admin/login"), {
      username: dom.username.value.trim(),
      password: dom.password.value
    });

    state.token = data.token;
    localStorage.setItem("admin_token", state.token);
    localStorage.setItem("admin_api", state.apiBaseUrl);

    dom.loginCard.classList.add("hidden");
    dom.dashboard.classList.remove("hidden");

    await loadSites();
    await loadTrends();
    setStatus("Login successful.");
  } catch (error) {
    setStatus(`Login failed: ${error.message}`);
  }
}

function logout() {
  state.token = "";
  localStorage.removeItem("admin_token");
  dom.dashboard.classList.add("hidden");
  dom.loginCard.classList.remove("hidden");
  setStatus("Logged out.");
}

function bindEvents() {
  dom.loginBtn.addEventListener("click", login);
  dom.logoutBtn.addEventListener("click", logout);
  dom.refreshBtn.addEventListener("click", () => {
    loadTrends().catch((error) => setStatus(`Load failed: ${error.message}`));
  });
}

async function trySessionRestore() {
  const savedToken = localStorage.getItem("admin_token");
  const savedApi = localStorage.getItem("admin_api");
  if (!savedToken) return;

  state.token = savedToken;
  state.apiBaseUrl = savedApi || state.apiBaseUrl;
  dom.apiBaseUrl.value = state.apiBaseUrl;

  try {
    dom.loginCard.classList.add("hidden");
    dom.dashboard.classList.remove("hidden");
    await loadSites();
    await loadTrends();
  } catch (_error) {
    logout();
  }
}

bindEvents();
trySessionRestore();
