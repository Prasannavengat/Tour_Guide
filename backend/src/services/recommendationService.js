import { haversineKm } from "../utils/geo.js";

function occupancyRatio(site) {
  if (!site.capacity) return 1;
  return Math.min(1, site.currentCount / site.capacity);
}

function crowdLabel(ratio) {
  if (ratio >= 0.85) return "very_busy";
  if (ratio >= 0.6) return "busy";
  if (ratio >= 0.35) return "moderate";
  return "light";
}

export function getRecommendations(sites, userLat, userLng, limit = 3) {
  return sites
    .map((site) => {
      const distanceKm = haversineKm(userLat, userLng, site.lat, site.lng);
      const ratio = occupancyRatio(site);

      // Lower score is better. We prioritize low crowd, then distance.
      const score = ratio * 0.7 + Math.min(distanceKm / 10, 1) * 0.3;

      return {
        siteId: site.id,
        name: site.name,
        distanceKm: Number(distanceKm.toFixed(2)),
        currentCount: site.currentCount,
        capacity: site.capacity,
        occupancyRatio: Number(ratio.toFixed(2)),
        crowdLevel: crowdLabel(ratio),
        score: Number(score.toFixed(3))
      };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}
