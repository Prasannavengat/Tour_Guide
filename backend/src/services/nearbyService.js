import axios from "axios";
import { config } from "../config.js";

const typeMap = {
  hospital: ["amenity=hospital", "amenity=clinic"],
  police: ["amenity=police"],
  essentials: [
    "shop=supermarket",
    "amenity=pharmacy",
    "amenity=atm",
    "amenity=fuel"
  ],
  hotel: ["tourism=hotel", "tourism=guest_house", "tourism=hostel"],
  restaurant: ["amenity=restaurant", "amenity=cafe", "amenity=fast_food"],
  fuel: ["amenity=fuel"]
};

function buildOverpassQuery(lat, lng, radius, filters) {
  const filterNodes = filters
    .map((f) => `node[${f}](around:${radius},${lat},${lng});\nway[${f}](around:${radius},${lat},${lng});\nrelation[${f}](around:${radius},${lat},${lng});`)
    .join("\n");

  return `
[out:json][timeout:25];
(
${filterNodes}
);
out center body;
`.trim();
}

function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const deltaLat = toRad(lat2 - lat1);
  const deltaLng = toRad(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function resolveCoordinates(item) {
  return {
    lat: item.lat ?? item.center?.lat ?? null,
    lng: item.lon ?? item.center?.lon ?? null
  };
}

export async function getNearbyPlaces({ lat, lng, type, radius = 3000, limit = 10 }) {
  const filters = typeMap[type];
  if (!filters) {
    throw new Error("Unsupported nearby type");
  }

  const query = buildOverpassQuery(lat, lng, radius, filters);

  const endpoints = [config.overpassUrl, config.overpassBackupUrl];
  let response = null;
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      response = await axios.post(endpoint, query, {
        headers: {
          "Content-Type": "text/plain"
        },
        timeout: 15000
      });
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!response) {
    throw lastError || new Error("Nearby service request failed");
  }

  const elements = response.data?.elements || [];

  return elements
    .map((item) => {
      const coords = resolveCoordinates(item);
      const distanceKm =
        coords.lat != null && coords.lng != null
          ? Number(haversineDistanceKm(lat, lng, coords.lat, coords.lng).toFixed(2))
          : null;

      return {
        id: item.id,
        lat: coords.lat,
        lng: coords.lng,
        name: item.tags?.name || item.tags?.["addr:housename"] || "Unnamed place",
        category:
          item.tags?.amenity ||
          item.tags?.shop ||
          item.tags?.tourism ||
          item.tags?.healthcare ||
          "unknown",
        address: [
          item.tags?.["addr:street"],
          item.tags?.["addr:city"],
          item.tags?.["addr:postcode"]
        ]
          .filter(Boolean)
          .join(", "),
        distanceKm,
        distanceMeters: distanceKm != null ? Math.round(distanceKm * 1000) : null
      };
    })
    .filter((item) => item.lat != null && item.lng != null)
    .sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY))
    .slice(0, limit);
}
