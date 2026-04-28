import { yercaudSpots } from "../../../app/locationData.js";

// Construct districts structure from yercaudSpots for Yercaud-focused app
const yercaudDistricts = [
  {
    name: "Yercaud",
    spots: yercaudSpots
  }
];

function buildSeedSites() {
  return yercaudDistricts.flatMap((district) =>
    district.spots.map((spot, index) => ({
      ...spot,
      district: district.name,
      capacity: spot.capacity || 260 + ((district.name.length + index * 17) % 180)
    }))
  );
}

class SiteStore {
  constructor() {
    this.sites = new Map();

    buildSeedSites().forEach((site) => {
      // Vary the initial currentCount between 10% and 75% of capacity
      const minPct = 0.1;
      const maxPct = 0.75;
      const pct = minPct + Math.random() * (maxPct - minPct);
      const currentCount = Math.max(0, Math.floor(site.capacity * pct));

      // Generate simple onsite facilities (static fallback when external nearby fails)
      const makeFacility = (name, latOffset, lngOffset, category) => ({
        id: `${site.id}-${category}-${name.replace(/\s+/g, '-').toLowerCase()}`,
        name,
        lat: (site.lat || 0) + (latOffset || 0),
        lng: (site.lng || 0) + (lngOffset || 0),
        category,
        address: `${name} near ${site.name}`
      });

      const facilities = {
        hospital: [
          makeFacility('Community Hospital', 0.002, 0.002, 'hospital'),
          makeFacility('Mediclinic', -0.0015, 0.001, 'hospital')
        ],
        hotel: [
          makeFacility('Hillview Hotel', 0.001, -0.002, 'hotel'),
          makeFacility('Traveller Inn', -0.002, -0.001, 'hotel')
        ],
        essentials: [
          makeFacility('Town Grocery', 0.0008, -0.0006, 'essentials'),
          makeFacility('Petrol Pump', -0.0009, 0.0009, 'essentials'),
          makeFacility('Public Toilet', 0.0005, 0.0003, 'essentials')
        ]
      };

      this.sites.set(site.id, {
        ...site,
        currentCount,
        updatedAt: new Date().toISOString(),
        gates: {},
        isOpen: true,
        facilities
      });
    });
  }

  allSites() {
    return Array.from(this.sites.values());
  }

  getSite(id) {
    return this.sites.get(id) || null;
  }

  applyCrossingEvent({ siteId, gateId, direction, timestamp }) {
    const site = this.sites.get(siteId);
    if (!site) return null;

    const delta = direction === "in" ? 1 : -1;
    site.currentCount = Math.max(0, site.currentCount + delta);
    site.updatedAt = timestamp || new Date().toISOString();

    if (!site.gates[gateId]) {
      site.gates[gateId] = { in: 0, out: 0 };
    }

    site.gates[gateId][direction] += 1;
    return site;
  }
}

export const siteStore = new SiteStore();
