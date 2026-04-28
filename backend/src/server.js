import express from "express";
import cors from "cors";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import { config } from "./config.js";
import { siteStore } from "./store/siteStore.js";
import { getRecommendations } from "./services/recommendationService.js";
import { getNearbyPlaces } from "./services/nearbyService.js";
import { validateAdminCredentials, issueAdminToken } from "./services/authService.js";
import { createOtpForPhone, verifyOtpForPhone } from "./services/touristAuthService.js";
import {
  sendVerificationCode,
  checkVerificationViaTwilioVerify,
  canUseTwilioVerify
} from "./services/smsService.js";
import { requireAdmin } from "./middleware/authMiddleware.js";
import {
  initDatabase,
  insertSensorEvent,
  getHourlyTrends,
  isDatabaseEnabled
} from "./db/postgres.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, "../../app");
const adminPath = path.resolve(__dirname, "../../admin");
let currentCount = 0;

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));
app.use("/admin", express.static(adminPath));

// Endpoint for ESP device to push the latest crowd count.
app.post("/update-count", (req, res) => {
  const count = Number(req.body?.count);

  if (!Number.isFinite(count) || count < 0) {
    return res.status(400).json({ error: "count must be a non-negative number" });
  }

  currentCount = Math.floor(count);
  console.log("Current Crowd Count:", currentCount);
  return res.status(200).send("Count Received");
});

// Endpoint for web app to read the latest crowd count.
app.get("/get-count", (_req, res) => {
  res.json({ count: currentCount });
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "smart-tour-crowd-backend",
    databaseEnabled: isDatabaseEnabled()
  });
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const valid = await validateAdminCredentials(username, password);

  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.json({ token: issueAdminToken() });
});

app.post("/api/auth/request-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (await canUseTwilioVerify()) {
      const smsResult = await sendVerificationCode(phone);
      return res.json({
        ok: true,
        phone: smsResult.toPhone || phone,
        message: "Verification code sent to mobile number",
        smsSent: true
      });
    }

    const { normalizedPhone, otp } = createOtpForPhone(phone);
    const smsResult = await sendVerificationCode(normalizedPhone, otp);

    if (!smsResult.sent && process.env.NODE_ENV === "production") {
      return res.status(502).json({
        error: smsResult.reason || "OTP could not be delivered to the mobile number"
      });
    }

    return res.json({
      ok: true,
      phone: normalizedPhone,
      message: smsResult.sent
        ? "Verification code sent to mobile number"
        : "Verification code generated for development",
      devOtp: process.env.NODE_ENV === "production" ? undefined : otp,
      smsSent: smsResult.sent
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  if (await canUseTwilioVerify()) {
    try {
      const { phone, otp } = req.body;
      const result = await checkVerificationViaTwilioVerify(phone, otp);
      if (!result.ok) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
      return res.json({ ok: true, phone: result.phone, message: "Phone verified" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  const { phone, otp } = req.body;
  const result = verifyOtpForPhone(phone, otp);

  if (!result.ok) {
    return res.status(400).json({ error: result.reason });
  }

  return res.json({ ok: true, phone: result.phone, message: "Phone verified" });
});

app.get("/api/geocode", async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: "lat and lng are required" });
  }

  if (!config.googleMapsApiKey) {
    return res.status(503).json({ error: "Google Maps API key is not configured" });
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${lat},${lng}`,
          key: config.googleMapsApiKey
        },
        timeout: 10000
      }
    );

    const results = response.data?.results || [];
    const formattedAddress = results[0]?.formatted_address || "Address not found";
    return res.json({ ok: true, formattedAddress });
  } catch (error) {
    return res.status(502).json({ error: "Failed to reverse geocode", details: error.message });
  }
});

app.get("/api/sites", (req, res) => {
  const siteId = String(req.query.siteId || "").trim();
  const sitesSource = siteId ? [siteStore.getSite(siteId)].filter(Boolean) : siteStore.allSites();

  const sites = sitesSource.map((site) => ({
    ...site,
    occupancyRatio: Number((site.currentCount / site.capacity).toFixed(2))
  }));

  res.json({ count: sites.length, sites });
});

app.post("/api/sensor/events", (req, res) => {
  const { siteId, gateId, direction, timestamp } = req.body;

  if (!siteId || !gateId || !["in", "out"].includes(direction)) {
    return res.status(400).json({
      error: "Invalid payload. Required: siteId, gateId, direction (in|out)."
    });
  }

  const eventPayload = {
    siteId,
    gateId,
    direction,
    timestamp: timestamp || new Date().toISOString()
  };

  const updatedSite = siteStore.applyCrossingEvent(eventPayload);

  if (!updatedSite) {
    return res.status(404).json({ error: "Unknown siteId" });
  }

  insertSensorEvent(eventPayload).catch((error) => {
    console.error("Failed to persist sensor event:", error.message);
  });

  return res.status(201).json({
    message: "Event accepted",
    site: {
      id: updatedSite.id,
      currentCount: updatedSite.currentCount,
      updatedAt: updatedSite.updatedAt,
      gates: updatedSite.gates
    }
  });
});

app.get("/api/admin/sites", requireAdmin, (_req, res) => {
  const sites = siteStore.allSites().map((site) => ({
    ...site,
    occupancyRatio: Number((site.currentCount / site.capacity).toFixed(2))
  }));

  res.json({ count: sites.length, sites });
});

// Admin: update site properties (open/closed, set count)
app.post("/api/admin/site/:siteId", requireAdmin, (req, res) => {
  const { siteId } = req.params;
  const { isOpen, currentCount } = req.body;

  const site = siteStore.getSite(siteId);
  if (!site) return res.status(404).json({ error: "Unknown siteId" });

  if (typeof isOpen === 'boolean') site.isOpen = isOpen;
  if (Number.isFinite(currentCount)) {
    const newCount = Math.max(0, Math.floor(Number(currentCount)));
    site.currentCount = Math.min(site.capacity, newCount);
    site.updatedAt = new Date().toISOString();
  }

  return res.json({ ok: true, site });
});

app.get("/api/admin/trends/:siteId", requireAdmin, async (req, res) => {
  const { siteId } = req.params;
  const hours = Math.min(168, Math.max(1, Number(req.query.hours || 24)));

  const site = siteStore.getSite(siteId);
  if (!site) {
    return res.status(404).json({ error: "Unknown siteId" });
  }

  try {
    const trends = await getHourlyTrends(siteId, hours);
    return res.json({ siteId, hours, trends });
  } catch (error) {
    return res.status(502).json({
      error: "Failed to fetch trends",
      details: error.message
    });
  }
});

app.get("/api/recommendations", (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const limit = Number(req.query.limit || 3);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: "lat and lng query params are required." });
  }

  const recommendations = getRecommendations(siteStore.allSites(), lat, lng, limit);
  return res.json({ count: recommendations.length, recommendations });
});

app.get("/api/nearby", async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const type = String(req.query.type || "");
  const radius = Number(req.query.radius || 3000);
  const limit = Number(req.query.limit || 10);

  if (Number.isNaN(lat) || Number.isNaN(lng) || !type) {
    return res.status(400).json({
      error: "lat, lng and type query params are required. type: hospital|police|essentials|hotel|restaurant"
    });
  }

  try {
    const places = await getNearbyPlaces({ lat, lng, type, radius, limit });
    return res.json({ count: places.length, type, places });
  } catch (error) {
    return res.status(502).json({
      error: "Failed to fetch nearby places",
      details: error.message
    });
  }
});

async function startServer() {
  try {
    await initDatabase();
  } catch (error) {
    // Keep service alive even if DB is unreachable; DB-backed features will be degraded.
    console.error("Database initialization failed:", error.message);
  }

  app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
    console.log(`Admin dashboard: http://localhost:${config.port}/admin`);
  });
}

startServer();
