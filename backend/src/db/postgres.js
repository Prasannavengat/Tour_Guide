import { Pool } from "pg";
import { config } from "../config.js";

const hasDatabase = Boolean(config.databaseUrl);
const pool = hasDatabase
  ? new Pool({
      connectionString: config.databaseUrl
    })
  : null;

const schemaSql = `
CREATE TABLE IF NOT EXISTS sensor_events (
  id BIGSERIAL PRIMARY KEY,
  site_id TEXT NOT NULL,
  gate_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  event_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sensor_events_site_time
  ON sensor_events (site_id, event_time DESC);
`;

export async function initDatabase() {
  if (!pool) return;
  await pool.query(schemaSql);
}

export async function insertSensorEvent({ siteId, gateId, direction, timestamp }) {
  if (!pool) return;

  await pool.query(
    `
    INSERT INTO sensor_events (site_id, gate_id, direction, event_time)
    VALUES ($1, $2, $3, COALESCE($4::timestamptz, NOW()))
    `,
    [siteId, gateId, direction, timestamp || null]
  );
}

export async function getHourlyTrends(siteId, hours = 24) {
  if (!pool) return [];

  const query = `
    SELECT
      date_trunc('hour', event_time) AS bucket,
      SUM(CASE WHEN direction = 'in' THEN 1 ELSE 0 END) AS entries,
      SUM(CASE WHEN direction = 'out' THEN 1 ELSE 0 END) AS exits,
      SUM(CASE WHEN direction = 'in' THEN 1 ELSE -1 END) AS net_flow
    FROM sensor_events
    WHERE site_id = $1
      AND event_time >= NOW() - ($2 || ' hours')::interval
    GROUP BY bucket
    ORDER BY bucket ASC;
  `;

  const result = await pool.query(query, [siteId, String(hours)]);
  return result.rows.map((row) => ({
    bucket: row.bucket,
    entries: Number(row.entries),
    exits: Number(row.exits),
    netFlow: Number(row.net_flow)
  }));
}

export function isDatabaseEnabled() {
  return hasDatabase;
}
