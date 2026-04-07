import axios from "axios";
import { config } from "../config.js";

let cachedVerifyServiceSid = "";

function buildMessage(otp) {
  return `Your Tour Pulse verification code is ${otp}. It expires in 5 minutes.`;
}

function formatPhoneForTwilio(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";

  // Default to India country code for 10-digit local mobile numbers.
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  return `+${digits}`;
}

function hasTwilioConfig() {
  return Boolean(
    config.smsProvider === "twilio" &&
    config.twilioAccountSid &&
    config.twilioAuthToken
  );
}

function buildTwilioAuthHeader() {
  const auth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString("base64");
  return `Basic ${auth}`;
}

async function resolveTwilioVerifyServiceSid() {
  if (!hasTwilioConfig()) return "";

  if (config.twilioVerifyServiceSid) {
    cachedVerifyServiceSid = config.twilioVerifyServiceSid;
    return config.twilioVerifyServiceSid;
  }

  if (cachedVerifyServiceSid) {
    return cachedVerifyServiceSid;
  }

  try {
    const response = await axios.get("https://verify.twilio.com/v2/Services?PageSize=1", {
      headers: { Authorization: buildTwilioAuthHeader() },
      timeout: 10000
    });

    const discoveredSid = response?.data?.services?.[0]?.sid || "";
    cachedVerifyServiceSid = discoveredSid;
    return discoveredSid;
  } catch (_error) {
    return "";
  }
}

export async function canUseTwilioVerify() {
  const sid = await resolveTwilioVerifyServiceSid();
  return Boolean(sid);
}

export async function sendVerificationViaTwilioVerify(phone, verifyServiceSid) {
  const toPhone = formatPhoneForTwilio(phone);
  if (!toPhone) {
    throw new Error("Invalid destination phone number");
  }

  const params = new URLSearchParams();
  params.set("To", toPhone);
  params.set("Channel", "sms");

  try {
    const response = await axios.post(
      `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: buildTwilioAuthHeader()
        },
        timeout: 10000
      }
    );

    return {
      sent: true,
      providerResponse: response.data,
      toPhone
    };
  } catch (error) {
    const providerMessage = error?.response?.data?.message;
    const providerCode = error?.response?.data?.code;
    if (providerMessage) {
      throw new Error(`Twilio Verify error ${providerCode || ""}: ${providerMessage}`.trim());
    }
    throw error;
  }
}

export async function checkVerificationViaTwilioVerify(phone, otp) {
  const verifyServiceSid = await resolveTwilioVerifyServiceSid();
  if (!verifyServiceSid) {
    throw new Error("Twilio Verify service not configured");
  }

  const toPhone = formatPhoneForTwilio(phone);
  if (!toPhone) {
    throw new Error("Invalid destination phone number");
  }

  const params = new URLSearchParams();
  params.set("To", toPhone);
  params.set("Code", String(otp || "").trim());

  try {
    const response = await axios.post(
      `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: buildTwilioAuthHeader()
        },
        timeout: 10000
      }
    );

    const status = response?.data?.status;
    return {
      ok: status === "approved",
      phone: toPhone,
      status
    };
  } catch (error) {
    const providerMessage = error?.response?.data?.message;
    const providerCode = error?.response?.data?.code;
    if (providerMessage) {
      throw new Error(`Twilio Verify error ${providerCode || ""}: ${providerMessage}`.trim());
    }
    throw error;
  }
}

export async function sendVerificationCode(phone, otp) {
  if (!hasTwilioConfig()) {
    return { sent: false, reason: "Twilio SMS provider not configured" };
  }

  const verifyServiceSid = await resolveTwilioVerifyServiceSid();
  if (verifyServiceSid) {
    return sendVerificationViaTwilioVerify(phone, verifyServiceSid);
  }

  if (!config.twilioFromNumber) {
    return { sent: false, reason: "Twilio sender number not configured" };
  }

  const toPhone = formatPhoneForTwilio(phone);
  if (!toPhone) {
    throw new Error("Invalid destination phone number");
  }

  const params = new URLSearchParams();
  params.set("To", toPhone);
  params.set("From", config.twilioFromNumber);
  params.set("Body", buildMessage(otp));

  let response;
  try {
    response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: buildTwilioAuthHeader()
        },
        timeout: 10000
      }
    );
  } catch (error) {
    const providerMessage = error?.response?.data?.message;
    const providerCode = error?.response?.data?.code;
    if (providerMessage) {
      throw new Error(`Twilio error ${providerCode || ""}: ${providerMessage}`.trim());
    }
    throw error;
  }

  return {
    sent: true,
    providerResponse: response.data
  };
}