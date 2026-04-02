import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  overpassUrl: process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter",
  overpassBackupUrl:
    process.env.OVERPASS_BACKUP_URL || "https://overpass.kumi.systems/api/interpreter",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  databaseUrl: process.env.DATABASE_URL || "",
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
};
