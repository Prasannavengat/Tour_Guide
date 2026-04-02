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
  restaurant: ["amenity=restaurant", "amenity=cafe", "amenity=fast_food"]
};

function buildOverpassQuery(lat, lng, radius, filters) {
  const filterNodes = filters
    .map((f) => `node[${f}](around:${radius},${lat},${lng});`)
    .join("\n");

  return `
[out:json][timeout:25];
(
${filterNodes}
);
out body;
`.trim();
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

  return elements.slice(0, limit).map((item) => ({
    id: item.id,
    lat: item.lat,
    lng: item.lon,
    name: item.tags?.name || "Unnamed place",
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
      .join(", ")
  }));
}
