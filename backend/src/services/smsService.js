import axios from "axios";
import { config } from "../config.js";

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

function hasTwilioVerifyConfig() {
  return Boolean(hasTwilioConfig() && config.twilioVerifyServiceSid);
}

function buildTwilioAuthHeader() {
  const auth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString("base64");
  return `Basic ${auth}`;
}

export async function sendVerificationViaTwilioVerify(phone) {
  const toPhone = formatPhoneForTwilio(phone);
  if (!toPhone) {
    throw new Error("Invalid destination phone number");
  }

  const params = new URLSearchParams();
  params.set("To", toPhone);
  params.set("Channel", "sms");

  try {
    const response = await axios.post(
      `https://verify.twilio.com/v2/Services/${config.twilioVerifyServiceSid}/Verifications`,
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
  const toPhone = formatPhoneForTwilio(phone);
  if (!toPhone) {
    throw new Error("Invalid destination phone number");
  }

  const params = new URLSearchParams();
  params.set("To", toPhone);
  params.set("Code", String(otp || "").trim());

  try {
    const response = await axios.post(
      `https://verify.twilio.com/v2/Services/${config.twilioVerifyServiceSid}/VerificationCheck`,
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

  if (hasTwilioVerifyConfig()) {
    return sendVerificationViaTwilioVerify(phone);
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