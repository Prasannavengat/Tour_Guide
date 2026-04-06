import crypto from "crypto";

const otpStore = new Map();

const OTP_EXPIRY_MS = 5 * 60 * 1000;

function nowMs() {
  return Date.now();
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function generateOtp() {
  return String(crypto.randomInt(100000, 1000000));
}

export function createOtpForPhone(phone) {
  const normalized = normalizePhone(phone);
  if (normalized.length < 10 || normalized.length > 15) {
    throw new Error("Invalid phone number");
  }

  const otp = generateOtp();
  otpStore.set(normalized, {
    otp,
    expiresAt: nowMs() + OTP_EXPIRY_MS,
    verified: false
  });

  return { normalizedPhone: normalized, otp };
}

export function verifyOtpForPhone(phone, otp) {
  const normalized = normalizePhone(phone);
  const otpEntry = otpStore.get(normalized);

  if (!otpEntry) {
    return { ok: false, reason: "OTP not requested" };
  }

  if (nowMs() > otpEntry.expiresAt) {
    otpStore.delete(normalized);
    return { ok: false, reason: "OTP expired" };
  }

  if (String(otp || "") !== otpEntry.otp) {
    return { ok: false, reason: "Invalid OTP" };
  }

  otpEntry.verified = true;
  otpStore.set(normalized, otpEntry);
  return { ok: true, phone: normalized };
}
