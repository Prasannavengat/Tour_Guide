import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

let cachedAdminHash = null;

async function getAdminPasswordHash() {
  if (cachedAdminHash) return cachedAdminHash;
  cachedAdminHash = await bcrypt.hash(config.adminPassword, 10);
  return cachedAdminHash;
}

export async function validateAdminCredentials(username, password) {
  if (!username || !password) return false;
  if (username !== config.adminUsername) return false;

  const hash = await getAdminPasswordHash();
  return bcrypt.compare(password, hash);
}

export function issueAdminToken() {
  return jwt.sign(
    {
      role: "admin",
      username: config.adminUsername
    },
    config.jwtSecret,
    { expiresIn: "8h" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}
