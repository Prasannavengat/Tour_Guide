import { seedSites } from "../data/seedSites.js";

class SiteStore {
  constructor() {
    this.sites = new Map();

    seedSites.forEach((site) => {
      this.sites.set(site.id, {
        ...site,
        currentCount: Math.floor(site.capacity * 0.35),
        updatedAt: new Date().toISOString(),
        gates: {}
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
